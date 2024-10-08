import React from 'react'

import {
    DateInput,
    Create as ReactAdminCreate,
    SimpleForm,
    TextInput,
    ReferenceInput
} from 'react-admin'

const Create = () => (
    <ReactAdminCreate title={'Create Employee'} >
        <SimpleForm>
            <TextInput source='firstName' />
            <TextInput source='lastName' />
            <TextInput source='registrationCode' />
            <TextInput source='category' />
            <DateInput source='recruitmentAt' />
            {/* <ReferenceInput reference='api/islets' source='islet' /> */}
        </SimpleForm>
    </ReactAdminCreate>
)

export default Create
