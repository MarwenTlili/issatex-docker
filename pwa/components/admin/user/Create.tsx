import React from 'react'
import {
    BooleanInput,
    DateInput,
    ImageField,
    ImageInput,
    PasswordInput,
    Create as ReactAdminCreate,
    SelectArrayInput,
    SimpleForm,
    TextInput,
} from 'react-admin'

export const ROLES = ['ROLE_CLIENT', 'ROLE_USER', 'ROLE_SECRETARY', 'ROLE_ADMIN']

export const equalToPlainPassword = (
    value: string,
    values: { plainPassword: string }
) => {
    if (value !== values.plainPassword) {
        return 'The two passwords must match'
    }
}

const Create = () => {
    return (
        <ReactAdminCreate title={'Create User'} redirect='list'>
            <SimpleForm>
                <ImageInput source='avatar'
                    label='Avatar'
                    accept='image/*'
                    maxSize={1000000}
                >
                    <ImageField source='contentUrl' title='title' />
                </ImageInput>
                <TextInput source='email' required />
                <TextInput source='username' required />
                <PasswordInput source='plainPassword' required />
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
        </ReactAdminCreate>
    )
}

export default Create
