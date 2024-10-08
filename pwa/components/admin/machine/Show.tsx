import React from 'react'

import {
    Show as ReactAdminShow,
    SimpleShowLayout,
    TextField,
    ReferenceField
} from 'react-admin'

const Show = () => (
    <ReactAdminShow title='Show Machine' >
        <SimpleShowLayout>
            <TextField source='name' />
            <TextField source='category' />
            <TextField source='brand' />
            <ReferenceField reference='api/islets' source='islet' />
        </SimpleShowLayout>
    </ReactAdminShow>
)

export default Show
