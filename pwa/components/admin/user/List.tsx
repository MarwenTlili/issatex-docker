import React from 'react'
import {
    ArrayField,
    ChipField,
    CreateButton,
    DatagridConfigurable,
    EditButton,
    EmailField,
    ExportButton,
    FilterButton,
    List as ReactAdminList,
    SelectColumnsButton,
    ShowButton, TextField,
    TextInput,
    TopToolbar,
    WrapperField,
    useRecordContext
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
    <TextInput source='email' />,
    <TextInput source='username' />
]

export const RolesField = ({ source, sortable }: { source: string, sortable?: boolean }) => {
    const record = useRecordContext()

    if (!record || !record.roles) {
        return null
    }

    return (
        <ArrayField source={source} sortable={sortable} >
            {record.roles.map((role: string, index: string | number) => (
                <ChipField key={index} record={{ role }} source='role' />
            ))}
        </ArrayField>
    )
}

const List = () => {
    return (
        <ReactAdminList
            filters={filters}
            actions={<ListActions />}
        >
            <DatagridConfigurable>
                <EmailField source='email' />
                <TextField source='username' />
                <RolesField source='roles' sortable={false} />
                <SwitchToggle source='isVerified' resource='api/users' />
                <WrapperField label='Actions'>
                    <ShowButton />
                    <EditButton />
                </WrapperField>
            </DatagridConfigurable>
        </ReactAdminList>
    )
}

export default List
