import React from 'react'
import {
    Create as ReactAdminCreate,
    SimpleForm,
    TextInput
} from 'react-admin'

const Create = () => (
    <ReactAdminCreate title='Create Machine' >
        <SimpleForm>
            <TextInput source='name' />
            <TextInput source='category' />
            <TextInput source='brand' />
        </SimpleForm>
    </ReactAdminCreate>
)

export default Create
