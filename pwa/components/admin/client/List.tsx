import React from 'react'
import {
    List as ReactAdminList,
    ReferenceField,
    TextField,
    ShowButton,
    DatagridConfigurable,
    EditButton,
    WrapperField,
    TextInput,
    BooleanInput,
    TopToolbar,
    SelectColumnsButton,
    FilterButton,
    ExportButton,
    CreateButton,
} from 'react-admin'
import SwitchToggle from '../SwitchToggle'

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
        <CreateButton />
        <ExportButton />
    </TopToolbar>
)

const filters = [
    <TextInput source='name' />,
    <TextInput source='phone' />,
    <BooleanInput source='isValid' />,
    <BooleanInput source='isPrivileged' />,
]

const List = () => (
    <ReactAdminList
        filters={filters}
        actions={<ListActions />}
    >
        <DatagridConfigurable>
            <TextField source='name' />
            <TextField source='phone' />
            <SwitchToggle resource='api/clients' source='isPrivileged' />
            <ReferenceField
                source='account'
                reference='users'
                sortable={false}
                link={(record: { id: string | number }, reference: string) => `/api/${reference}/${encodeURIComponent(record.id)}/show`}
            >
                <TextField source='username' />
            </ReferenceField>
            <WrapperField label='Actions'>
                <ShowButton />
                <EditButton />
            </WrapperField>
        </DatagridConfigurable>
    </ReactAdminList>
)

export default List
