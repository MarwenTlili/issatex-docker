import React from 'react'

import {
    Edit as ReactAdminEdit,
    SimpleForm,
    TextInput,
    ReferenceInput
} from 'react-admin'

const Edit = () => (
    <ReactAdminEdit title='Edit Machine'>
        <SimpleForm>
            <TextInput source='name' />
            <TextInput source='category' />
            <TextInput source='brand' />
            <ReferenceInput reference='api/ilots' source='ilot' />
        </SimpleForm>
    </ReactAdminEdit>
)

export default Edit
