import { SetStateAction } from 'react'
import {
    fetchHydra as baseFetchHydra,
    hydraDataProvider as baseHydraDataProvider,
    ApiPlatformAdminDataProvider,
    ApiPlatformAdminCreateParams,
    ApiPlatformAdminUpdateParams,
} from '@api-platform/admin'
import { parseHydraDocumentation } from '@api-platform/api-doc-parser'
import { ENTRYPOINT, MEDIA_OBJECTS_URL } from '../config/entrypoint'
import { User } from '../types/User'

export const getHeaders = () =>
    localStorage.getItem('token')
        ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
        : {}

const fetchHydra = (url: URL, options = {}) => baseFetchHydra(
    url,
    {
        ...options,
        // @ts-ignore
        headers: getHeaders
    }
)

export const apiDocumentationParser = (setRedirectToLogin: (arg0: boolean) => void) => async () => {
    try {
        setRedirectToLogin(false)

        // @ts-ignore
        return await parseHydraDocumentation(ENTRYPOINT, { headers: getHeaders })
    } catch (result) {
        // @ts-ignore
        const { api, response, status } = result
        if (status !== 401 || !response) {
            // throw result
            console.error(result)
        }

        // Prevent infinite loop if the token is expired
        localStorage.removeItem('token')

        setRedirectToLogin(true)

        return {
            api,
            response,
            status,
        }
    }
}

const customDataProvider = (setRedirectToLogin: {
    (value: SetStateAction<boolean>): void
    (arg0: boolean): void
}): ApiPlatformAdminDataProvider => {
    const baseDataProvider = baseHydraDataProvider({
        useEmbedded: false,
        // @ts-ignore
        entrypoint: ENTRYPOINT, // Make sure to define ENTRYPOINT
        httpClient: fetchHydra,
        apiDocumentationParser: apiDocumentationParser(setRedirectToLogin),
    })

    return {
        ...baseDataProvider,
        create: async (resource: string, params: ApiPlatformAdminCreateParams) => {
            if (resource === 'api/users' && params.data.avatar) {
                // Custom logic for creating users
                const { avatar, ...userWithoutAvatar } = params.data

                const formData = new FormData()
                formData.append('file', avatar.rawFile)

                return fetchHydra(new URL(`${ENTRYPOINT}${MEDIA_OBJECTS_URL}`), {
                    method: 'POST',
                    body: formData
                })
                    .then(async ({ json: avatarJson }) => {
                        const updatedUser = {
                            ...userWithoutAvatar,
                            avatar: avatarJson['@id'], // Assuming the avatar ID is available in the response
                        }
                        try {
                            const { json: newUserJson } = await fetchHydra(new URL(`${ENTRYPOINT}/${resource}`), {
                                method: 'POST',
                                body: JSON.stringify(updatedUser),
                                headers: { 'Content-Type': 'application/json' }
                            })
                            return ({
                                data: newUserJson
                            })
                        } catch (error) {
                            console.error('Error creating user:', error)
                            throw error
                        }
                    })
                    .catch((error) => {
                        console.error('Error creating avatar:', error)
                        throw error
                    })
            } else {
                // Standard create request for other resources
                const newUser = await fetchHydra(
                    new URL(`${ENTRYPOINT}/${resource}`),
                    {
                        method: 'POST',
                        body: JSON.stringify(params.data),
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
                return {
                    data: newUser.json
                }
            }
        },
        update: async (resource: string, params: ApiPlatformAdminUpdateParams) => {
            const { id, data, previousData } = params
            const avatarType: string | object | undefined = typeof params.data.avatar

            // avatar image selected for resource 'api/users'
            if (resource === 'api/users' && (avatarType === 'object')) {
                const { avatar, ...userWithoutAvatar } = data

                const formData = new FormData()
                formData.append('file', avatar.rawFile)

                /**
                 * Uploading files won’t work in PUT or PATCH requests, you must use POST method to upload files.  
                 * 1 - POST new avatar  
                 * 2 - update user.avatar id  
                 * 3 - delete old avatar if exists  
                 */
                try {
                    const { status: avatarPostStatus, headers: avatarPostHeaders, json: avatarPostJson } = await fetchHydra(
                        new URL(`${ENTRYPOINT}${MEDIA_OBJECTS_URL}`),
                        { method: 'POST', body: formData }
                    )

                    if (avatarPostStatus === 201) {
                        const updatedUser: User = { ...userWithoutAvatar, avatar: avatarPostJson['@id'] }

                        const { status: userPutStatus, headers: userPutHeaders, json: userPutJson } = await fetchHydra(
                            new URL(`${ENTRYPOINT}${id}`),
                            { method: 'PUT', body: JSON.stringify(updatedUser) }
                        )

                        if (userPutStatus === 200) {
                            return { data: userPutJson }
                        } else {
                            // Handle other userPutStatus values if needed
                            console.error(`User PUT request failed with status ${userPutStatus}`)
                        }
                    } else {
                        // Handle other avatarPostStatus values if needed
                        console.error(`Avatar POST request failed with status ${avatarPostStatus}`)
                    }
                } catch (error) {
                    console.error('Error updating user:', error)
                }

                return { data: previousData }

            } else {
                const updatedUser = (await fetchHydra(
                    new URL(`${ENTRYPOINT}${params.id}`),
                    {
                        method: 'PUT',
                        body: JSON.stringify(params.data),
                        headers: { 'Content-Type': 'application/json' }
                    }
                ))

                return { data: updatedUser.json }
            }
        },
        // You can add other customizations or overrides for different methods here
    }
}

export default customDataProvider
