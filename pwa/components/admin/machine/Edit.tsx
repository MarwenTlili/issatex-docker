import React from 'react'
import {
    Edit as ReactAdminEdit,
    SimpleForm,
    TextInput
} from 'react-admin'

const Edit = () => (
    <ReactAdminEdit title='Edit Machine'>
        <SimpleForm>
            <TextInput source='name' />
            <TextInput source='category' />
            <TextInput source='brand' />
        </SimpleForm>
    </ReactAdminEdit>
)

export default Edit
