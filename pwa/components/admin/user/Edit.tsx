import React, { useEffect, useState } from 'react'

import {
    BooleanInput,
    DateInput,
    ImageField,
    ImageInput,
    PasswordInput,
    Edit as ReactAdminEdit,
    ReferenceField,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    useEditController,
} from 'react-admin'
import {
    ROLES,
    equalToPlainPassword
} from './Create'
import { useParams } from 'react-router-dom'
import { User } from '../../../types/User'

const Edit = () => {
    const { id } = useParams()
    const { record, save, isLoading } = useEditController({ resource: 'api/users', id })
    const [oldAvatar, setOldAvatar] = useState<string | undefined>(undefined)

    const user = record as User

    useEffect(() => {
        if (user) {
            setOldAvatar(user.avatar)
        }
    }, [oldAvatar])

    return (
        <ReactAdminEdit title='Edit User' redirect={false}>
            <SimpleForm>
                <ReferenceField label='Avatar' source='avatar' reference='id'>
                    <ImageField source='contentUrl' />
                </ReferenceField>
                <ImageInput source='avatar'
                    label='Avatar'
                    accept='image/*'
                    maxSize={1000000}
                >
                    <ImageField source='contentUrl' title='title' />
                </ImageInput>
                <TextInput source='email' required />
                <TextInput source='username' required />
                <PasswordInput source='plainPassword' />
                <PasswordInput source='confirm_password'
                    validate={equalToPlainPassword} />
                <SelectArrayInput source='roles'
                    choices={ROLES.map(role => ({ id: role, name: role }))} />
                <BooleanInput source='isVerified' />
                <DateInput source='createdAt' defaultValue={new Date()}
                    style={{ display: 'none' }} />
                <DateInput source='lastLoginAt' defaultValue={new Date()}
                    style={{ display: 'none' }} />
            </SimpleForm>
        </ReactAdminEdit>
    )
}

export default Edit
