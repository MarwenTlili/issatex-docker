import React from 'react'
import {
    DateField,
    Show as ReactAdminShow,
    SimpleShowLayout,
    TextField,
    ReferenceField
} from 'react-admin'

const Show = () => (
    <ReactAdminShow title='Show Employee' >
        <SimpleShowLayout>
            <TextField source='firstName' />
            <TextField source='lastName' />
            <TextField source='registrationCode' />
            <TextField source='category' />
            <DateField source='recuruitmentAt' showTime={true} locales='en-EN' />
            <ReferenceField reference='api/ilots' source='ilot' />
        </SimpleShowLayout>
    </ReactAdminShow>
)

export default Show
