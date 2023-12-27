import React from 'react'
import {
    SimpleShowLayout,
    EmailField,
    Show as ReactAdminShow,
    TextField,
    DateField,
    BooleanField,
    ImageField,
    ReferenceField
} from 'react-admin'
import { RolesField } from './List'

const Show = () => {
    return (
        <ReactAdminShow title={'Show User'}>
            <SimpleShowLayout>
                <TextField source='originId' label='ID' />
                <ReferenceField label='Avatar' source='avatar' reference='api/media_objects'>
                    <ImageField source='contentUrl' />
                </ReferenceField>
                <EmailField source='email' />
                <TextField source='username' />
                <RolesField source='roles' />
                <DateField source='createdAt' showTime />
                <DateField source='lastLoginAt' showTime />
                <BooleanField source='isVerified' />
            </SimpleShowLayout>
        </ReactAdminShow>
    )
}

export default Show
