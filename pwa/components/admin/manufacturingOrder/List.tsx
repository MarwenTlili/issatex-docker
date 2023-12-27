import React from 'react'
import {
    BooleanInput,
    DatagridConfigurable,
    DateField,
    DateInput,
    ExportButton,
    FilterButton,
    NumberField,
    InfiniteList as ReactAdminList,
    ReferenceField,
    SelectColumnsButton,
    ShowButton,
    TextField,
    TopToolbar,
    WrapperField,
    useInfinitePaginationContext,
} from 'react-admin'
import SwitchToggle from '../SwitchToggle'
import { Box, Button } from '@mui/material'

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

const ListActions = () => (
    <TopToolbar>
        <SelectColumnsButton />
        <FilterButton />
        <ExportButton />
    </TopToolbar>
)

const filters = [
    <DateInput source='createdAt[before]' key='createdAt[before]' />,
    <DateInput source='createdAt[after]' key='createdAt[after]' />,
    <BooleanInput source='urgent' />,
    <BooleanInput source='launched' />,
    <BooleanInput source='denied' />,
]

const List = () => {

    return (
        <ReactAdminList
            hasCreate={false}
            filters={filters}
            actions={<ListActions />}
            pagination={<LoadMore />}
        >
            <DatagridConfigurable>
                <DateField source='createdAt' showTime />
                <ReferenceField
                    label='Client'
                    source='client'
                    reference='clients'
                    sortable={false}
                    link={(record: { id: string | number }, reference: string) => {
                        return `/api/${reference}/${encodeURIComponent(record.id)}/show`
                    }}
                >
                    <TextField source='name' />
                </ReferenceField>
                <ReferenceField
                    label='Article'
                    source='article'
                    reference='articles'
                    sortable={false}
                    link={(record: { id: string | number }, reference: string) => {
                        return `/api/${reference}/${encodeURIComponent(record.id)}/show`
                    }}
                >
                    <TextField source='designation' />
                </ReferenceField>
                <NumberField source='totalQuantity' />
                <NumberField source='unitPrice' />
                <NumberField source='totalPrice' />
                <SwitchToggle resource='api/manufacturing_orders' source='urgent' />
                <SwitchToggle resource='api/manufacturing_orders' source='launched' />
                <SwitchToggle resource='api/manufacturing_orders' source='denied' />
                <WrapperField label='Actions'>
                    <ShowButton />
                </WrapperField>
            </DatagridConfigurable>
        </ReactAdminList>
    )
}

export default List
