import React from 'react'
import {
    Create as ReactAdminCreate,
    SimpleForm,
    TextInput,
    ReferenceInput
} from 'react-admin'

const Create = () => (
    <ReactAdminCreate title='Create Machine' >
        <SimpleForm>
            <TextInput source='name' />
            <TextInput source='category' />
            <TextInput source='brand' />
            <ReferenceInput reference='api/ilots' source='ilot' />
        </SimpleForm>
    </ReactAdminCreate>
)

export default Create
