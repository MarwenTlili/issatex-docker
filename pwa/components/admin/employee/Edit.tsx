import React from 'react'

import {
    DateTimeInput,
    Edit as ReactAdminEdit,
    SimpleForm,
    TextInput
} from 'react-admin'

const Edit = () => (
    <ReactAdminEdit title='Edit Employee' >
        <SimpleForm>
            <TextInput source='firstName' />
            <TextInput source='lastName' />
            <TextInput source='registrationCode' />
            <TextInput source='category' />
            <DateTimeInput source='recuruitmentAt' />
        </SimpleForm>
    </ReactAdminEdit>
)

export default Edit
