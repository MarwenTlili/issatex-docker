import React from 'react'

import {
    Edit as ReactAdminEdit,
    SimpleForm,
    TextInput,
    ReferenceInput
} from 'react-admin'

const Edit = () => (
    <ReactAdminEdit title='Edit Employee' >
        <SimpleForm>
            <TextInput source='firstName' />
            <TextInput source='lastName' />
            <TextInput source='registrationCode' />
            <TextInput source='category' />
            {/* <ReferenceInput reference='api/islets' source='islet' /> */}
            {/* <DateTimeInput source='recruitmentAt' /> */}
        </SimpleForm>
    </ReactAdminEdit>
)

export default Edit
