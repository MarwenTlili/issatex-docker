import React from 'react'
import {
    ImageField,
    Show as ReactAdminShow,
    ReferenceField,
    RichTextField,
    SimpleShowLayout,
    TextField,
} from 'react-admin'

const Show = () => (
    <ReactAdminShow title='Show Article' >
        <SimpleShowLayout>
            <ReferenceField label='Image' source='image' reference='id'>
                <ImageField source='contentUrl' />
            </ReferenceField>
            <TextField source='designation' />
            <TextField source='model' />
            <RichTextField source='composition' />
        </SimpleShowLayout>
    </ReactAdminShow>
)

export default Show
