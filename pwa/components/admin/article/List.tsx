import React from 'react'
import {
    List as ReactAdminList,
    ReferenceField,
    TextField,
    TopToolbar,
    SelectColumnsButton,
    FilterButton,
    ExportButton,
    TextInput,
    ShowButton,
    DatagridConfigurable,
    WrapperField,
} from 'react-admin'

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
        <ExportButton />
    </TopToolbar>
)

const filters = [
    <TextInput source='designation' key='designation' />,
    <TextInput source='model' key='model' />
]

const List = () => (
    <ReactAdminList
        hasCreate={false}
        actions={<ListActions />}
        filters={filters}
    >
        <DatagridConfigurable>
            <TextField source={'designation'} />
            <TextField source={'model'} />
            <ReferenceField
                source='client'
                reference='clients'
                link={(record: { id: string | number }, reference: string) => `/api/${reference}/${encodeURIComponent(record.id)}/show`}
                sortable={false}
            >
                <TextField source='name' />
            </ReferenceField>
            <WrapperField label='Actions'>
                <ShowButton />
            </WrapperField>
        </DatagridConfigurable>
    </ReactAdminList>
)

export default List
