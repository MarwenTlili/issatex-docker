import React from 'react'
import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    DateInput,
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
    <TextInput source='firstName' key='firstName' />,
    <TextInput source='lastName' key='lastName' />,
    <TextInput source='registrationCode' key='registrationCode' />,
    <TextInput source='category' key='category' />,
    <DateInput source='recuruitmentAt[before]' key='recuruitmentAt[before]' />,
    <DateInput source='recuruitmentAt[after]' key='recuruitmentAt[after]' />,
]

const List = () => (
    <ReactAdminList
        actions={<ListActions />}
        filters={filters}
    >
        <DatagridConfigurable>
            <TextField source='firstName' />
            <TextField source='lastName' />
            <TextField source='registrationCode' />
            <TextField source='category' />
            <DateField source='recuruitmentAt' />
            <WrapperField label='Actions'>
                <ShowButton />
                <EditButton />
            </WrapperField>
        </DatagridConfigurable>
    </ReactAdminList>
)

export default List
