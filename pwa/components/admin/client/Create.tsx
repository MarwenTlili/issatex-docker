import React, { useEffect, useState } from 'react'
import {
    BooleanInput,
    Create as ReactAdminCreate,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    TextInput,
    useGetList,
} from 'react-admin'
import AccountQuickCreateButton from './AccountQuickCreateButton'
import { User } from '../../../types/User'
import { Client } from '../../../types/Client'
import { useController } from 'react-hook-form'

interface UserInputProps {
    source: string
    reference: string
}

const UserInput = (props: UserInputProps) => {
    const { source, reference } = props

    const [unassignedUsers, setUnassignedUsers] = useState<User[]>([])
    const [createdUser, setCreatedUser] = useState<User>()

    const { field, fieldState, formState } = useController({
        name: source,
        defaultValue: (createdUser && createdUser['@id']) ? createdUser['@id'] : ''
    })

    // @ts-ignore
    const { data: users, isLoading: usersIsLoading, error: usersError } = useGetList<User>(
        'api/users'
    )

    // @ts-ignore
    const { data: clients, isLoading: clientsIsLoadin, error: clientsError } = useGetList<Client>(
        'api/clients'
    )

    useEffect(() => {
        if (users && clients) {
            const unassigned = users.filter(user => !clients.some(client => {
                return ((client.account === user['@id']) || user.roles.includes('ROLE_ADMIN'))
            }))
            // console.log('setUnassignedUsers ...')
            setUnassignedUsers(unassigned)
        }
    }, [users])

    useEffect(() => {
        if (createdUser && unassignedUsers.some(user => user['@id'] === createdUser['@id'])) {
            // console.log('setSelectedUser ...')
            field.onChange(createdUser['@id'])
        }
    }, [unassignedUsers])

    return (
        <>
            <p>Users: {unassignedUsers ? unassignedUsers.length : ''}</p>
            <div className='inline-block align-middle content-center'
                style={{ display: 'flex' }}
            >
                <ReferenceInput label='User' source={source} reference={reference} allowEmpty >
                    <SelectInput
                        label='Account'
                        optionText='username'
                        source={source}
                        choices={unassignedUsers}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        resettable
                        required
                    />
                </ReferenceInput>
                <AccountQuickCreateButton resource={reference} setCreatedUser={setCreatedUser} />
            </div>
        </>
    )
}

const Create = () => (
    <ReactAdminCreate title={'Create Client'} redirect={false}>
        <SimpleForm>
            <TextInput source='name' required={true} />
            <TextInput source='phone' />
            <BooleanInput source='isPrivileged' />
            <UserInput source='account' reference='api/users' />
        </SimpleForm>
    </ReactAdminCreate>
)

export default Create
