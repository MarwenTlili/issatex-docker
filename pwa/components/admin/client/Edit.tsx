import React from 'react'
import {
    BooleanInput,
    Edit as ReactAdminEdit,
    SimpleForm,
    TextField,
    TextInput,
    ReferenceField
} from 'react-admin'

const Edit = () => {
    return (
        <ReactAdminEdit title='Edit Client'>
            <SimpleForm>
                <div style={{ display: 'inline', marginTop: '8px' }}>
                    <label style={{ marginRight: '2px' }}>User: </label>
                    <ReferenceField
                        source='account'
                        reference='users'
                        link={(record: { id: string | number }, reference: string) => `/api/${reference}/${encodeURIComponent(record.id)}/show`}
                    >
                        <TextField source='username' />
                    </ReferenceField>
                </div>
                <TextInput source='name' />
                <TextInput source='phone' />
                <BooleanInput source='isPrivileged' />
            </SimpleForm>
        </ReactAdminEdit>
    )
}

export default Edit
