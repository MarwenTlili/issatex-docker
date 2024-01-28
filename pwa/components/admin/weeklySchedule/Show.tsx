import React from 'react'

import {
    DateField,
    Show as ReactAdminShow,
    ReferenceField,
    RichTextField,
    SimpleShowLayout,
    TextField
} from 'react-admin'

const Show = () => {
    return (
        <ReactAdminShow title='Show WeeklySchedule'>
            <SimpleShowLayout>
                <TextField source='originId' />
                <DateField source='startAt' />
                <DateField source='endAt' />
                <ReferenceField
                    reference='api/manufacturing_orders'
                    source='manufacturingOrder'
                    link={(
                        record: { id: string | number },
                        reference: string
                    ) => `/${reference}/${encodeURIComponent(record.id)}/show`}
                    sortable={false}
                >
                    <TextField source='originId' />
                </ReferenceField>
                <ReferenceField
                    reference='api/ilots'
                    source='ilot'
                    sortable={false}
                />
                <RichTextField source='observation' />
            </SimpleShowLayout>
        </ReactAdminShow>
    )
}

export default Show
