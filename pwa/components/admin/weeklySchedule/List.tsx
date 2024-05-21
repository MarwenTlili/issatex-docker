import React from 'react'

import {
    CreateButton,
    DatagridConfigurable,
    DateField,
    EditButton,
    ExportButton,
    FilterButton,
    List as ReactAdminList,
    ReferenceField,
    SelectColumnsButton,
    ShowButton,
    TextField,
    TextInput,
    TopToolbar,
    WrapperField,
    useInfinitePaginationContext
} from 'react-admin'

import { Box, Button } from '@mui/material'

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
            filters={filters}
            actions={<ListActions />}
            pagination={<LoadMore />}
        >
            <DatagridConfigurable>
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
                    reference='api/islets'
                    source='islet'
                    sortable={false}
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

const LoadMore = () => {
    const {
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfinitePaginationContext()
    return hasNextPage ? (
        <Box mt={1} textAlign='center' >
            <Button disabled={isFetchingNextPage} onClick={() => fetchNextPage()} >
                Load more
            </Button>
        </Box>
    ) : null
}
