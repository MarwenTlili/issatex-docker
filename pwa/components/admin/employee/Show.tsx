import React from 'react'
import {
    DateField,
    Show as ReactAdminShow,
    SimpleShowLayout,
    TextField,
} from 'react-admin'

const Show = () => (
    <ReactAdminShow title='Show Employee' >
        <SimpleShowLayout>
            <TextField source='firstName' />
            <TextField source='lastName' />
            <TextField source='registrationCode' />
            <TextField source='category' />
            <DateField source='recruitmentAt' showTime={false} />
        </SimpleShowLayout>
    </ReactAdminShow>
)

export default Show
