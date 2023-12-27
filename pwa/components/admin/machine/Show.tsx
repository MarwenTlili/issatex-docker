import React from 'react'

import {
    Show as ReactAdminShow,
    SimpleShowLayout,
    TextField
} from 'react-admin'

const Show = () => (
    <ReactAdminShow title='Show Machine' >
        <SimpleShowLayout>
            <TextField source='name' />
            <TextField source='category' />
            <TextField source='brand' />
        </SimpleShowLayout>
    </ReactAdminShow>
)

export default Show
