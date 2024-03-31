import React from 'react'
import {
    CreateButton,
    DatagridConfigurable,
    EditButton,
    ExportButton,
    FilterButton,
    List as ReactAdminList,
    ReferenceArrayField,
    SelectColumnsButton,
    ShowButton,
    TextField,
    TextInput,
    TopToolbar,
    WrapperField
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
    <TextInput source='name' key='name' />,
]

const List = () => {
    return (
        <ReactAdminList
            actions={<ListActions />}
            filters={filters}
        >
            <DatagridConfigurable>
                <TextField source='name' />
                <ReferenceArrayField
                    reference='api/machines'
                    source='machines'
                />
                <WrapperField label='Actions'>
                    <ShowButton />
                    <EditButton />
                </WrapperField>
            </DatagridConfigurable>
        </ReactAdminList>
    )
}

export default List
