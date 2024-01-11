import React from 'react'
import {
    DateField,
    Show as ReactAdminShow,
    ReferenceArrayField,
    SimpleShowLayout,
    TextField,
} from 'react-admin'

const Show = () => {

    return (
        <ReactAdminShow title='Show Ilot' >
            <SimpleShowLayout>
                <TextField source='name' />
                <DateField source='createdAt' />
                <ReferenceArrayField
                    reference='api/machines'
                    source='machines'
                />
                <ReferenceArrayField
                    reference='api/employees'
                    source='employees'
                />
            </SimpleShowLayout>
        </ReactAdminShow>
    )
}

export default Show
