import React from 'react'
import {
    DatagridConfigurable,
    EditButton,
    ExportButton,
    FilterButton,
    List as ReactAdminList,
    SelectColumnsButton,
    ShowButton,
    TextField,
    TextInput,
    TopToolbar,
    WrapperField,
    CreateButton,
    ReferenceField
} from 'react-admin'

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
)

const filters = [
    <TextInput source='name' key='name' resettable />,
    <TextInput source='category' key='category' resettable />,
    <TextInput source='brand' key='brand' resettable />,
]

const List = () => (
    <ReactAdminList
        actions={<ListActions />}
        filters={filters}
    >
        <DatagridConfigurable>
            <TextField source='name' />
            <TextField source='category' />
            <TextField source='brand' />
            <ReferenceField reference='api/islets' source='islet' />
            <WrapperField label='Actions'>
                <ShowButton />
                <EditButton />
            </WrapperField>
        </DatagridConfigurable>
    </ReactAdminList>
)

export default List
