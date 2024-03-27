import React from 'react'
import {
    BooleanField,
    DateField,
    Show as ReactAdminShow,
    ReferenceArrayField,
    ReferenceField,
    SimpleShowLayout,
    SingleFieldList,
    TextField,
} from 'react-admin'

const Show = () => {
    return (
        <ReactAdminShow title='Show Client'>
            <SimpleShowLayout>
                <TextField source='name' />
                <TextField source='phone' />
                <BooleanField source='isPrivileged' />
                <ReferenceField
                    source='account'
                    reference='users'
                    link={(record: { id: string | number }, reference: string) => `/api/${reference}/${encodeURIComponent(record.id)}/show`}
                >
                    <TextField source='username' />
                </ReferenceField>

                <ReferenceArrayField
                    source='manufacturingOrders'
                    reference='api/manufacturing_orders'
                >
                    <SingleFieldList
                        linkType='show'
                        empty={<p>0</p>}
                    >
                        <div style={{
                            border: 'solid 1px grey',
                            borderRadius: '5px',
                            padding: '2px'
                        }}>
                            <DateField source='createdAt' showTime />
                            <TextField source='originId' />
                        </div>
                    </SingleFieldList>
                </ReferenceArrayField>

                <ReferenceArrayField
                    source='articles'
                    reference='api/articles'
                >
                    <SingleFieldList
                        linkType='show'
                        empty={<p>0</p>}
                    >
                        <TextField
                            source='designation'
                            sx={{
                                border: 'solid 1px grey',
                                borderRadius: '5px',
                                padding: '2px'
                            }}
                        />
                    </SingleFieldList>
                </ReferenceArrayField>

            </SimpleShowLayout>
        </ReactAdminShow>
    )
}

export default Show
