import React from 'react'

import {
    BooleanField,
    DateField,
    NumberField,
    Show as ReactAdminShow,
    ReferenceField,
    RichTextField,
    SimpleShowLayout,
    TextField,
    ReferenceArrayField,
    Datagrid,
} from 'react-admin'

import { FieldGuesser } from '@api-platform/admin'
import Document from '../technicalDocument/Document'

const Show = () => {
    return (
        <ReactAdminShow title='Show Order' >
            <SimpleShowLayout>
                <DateField source='createdAt' />
                <ReferenceField
                    label='Article'
                    source='article'
                    reference='articles'
                    link={(record: { id: string | number }, reference: string) => {
                        return `/api/${reference}/${encodeURIComponent(record.id)}/show`
                    }}
                >
                    <TextField source='designation' />
                </ReferenceField>
                <NumberField source='totalQuantity' />
                <NumberField source='unitTime' />
                <NumberField source='unitPrice' />
                <NumberField source='totalPrice' />
                <ReferenceField source='client' reference='clients' link='show'>
                    <TextField source='name' />
                </ReferenceField>
                <ReferenceArrayField
                    reference='api/manufacturing_order_size'
                    source='manufacturingOrderSizes'
                >
                    <Datagrid bulkActionButtons={false}>
                        <ReferenceField
                            reference='api/sizes'
                            source='size'
                        >
                            <TextField source='name' />
                        </ReferenceField>
                        <TextField source='quantity' />
                    </Datagrid>
                </ReferenceArrayField>
                <BooleanField source='urgent' />
                <BooleanField source='launched' />
                <BooleanField source='denied' />
                <RichTextField source='observation' />
                <Document />
                <ReferenceField source='weeklySchedule' reference='api/weekly_schedules' >
                    <TextField source='originId' />
                </ReferenceField>
                <FieldGuesser source='palettes' />
                <FieldGuesser source='invoice' />
            </SimpleShowLayout>
        </ReactAdminShow>
    )
}

export default Show
