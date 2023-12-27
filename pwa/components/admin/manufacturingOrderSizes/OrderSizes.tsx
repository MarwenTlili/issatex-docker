import React from 'react'
import { RaRecord, useGetOne, useRecordContext } from 'react-admin'
import { ManufacturingOrder } from '../../../types/ManufacturingOrder'
import Typography from '@mui/material/Typography'

interface ManufacturingOrderSizeRecord extends RaRecord {
    quantity?: number
    manufacturingOrder?: string
    size?: string
}

interface SizeRecord extends RaRecord {
    name?: number
}

interface SizeProps {
    id: string
    reference: string
}

const Size = ({ id, reference }: SizeProps) => {
    const { data: size, isLoading, error } = useGetOne<SizeRecord>(
        reference,
        { id: id }
    )

    if (isLoading) return <span>...</span>

    if (error || !size || !size.name) { return <span>ERROR</span> }

    return <span>{size?.name}</span>
}

interface OrderSizeProps {
    id: string
    reference: string
    through: string
    using: string
}

const OrderSize = ({ id, reference, through, using }: OrderSizeProps) => {
    const {
        data: manufacturingOrderSize,
        isLoading,
        error
    } = useGetOne<ManufacturingOrderSizeRecord>(through, { id: id })

    if (isLoading) return <span>...</span>

    if (error || !manufacturingOrderSize || !manufacturingOrderSize.size) { return <span>ERROR</span> }

    return (
        <div>
            <Size
                id={manufacturingOrderSize.size}
                reference={reference}
                key={manufacturingOrderSize.size}
            />
            : {manufacturingOrderSize[using]}
        </div>
    )
}

interface OrderSizesProps {
    reference: string
    through: string
    using: string
}

const OrderSizes = (props: OrderSizesProps) => {
    const { reference, through, using } = props

    const manufacturingOrder: ManufacturingOrder = useRecordContext()
    if (!manufacturingOrder
        || !manufacturingOrder.manufacturingOrderSize
        || manufacturingOrder.manufacturingOrderSize?.length === 0
    ) return null

    return (
        <>
            <Typography
                variant='caption'
                display='block'
                gutterBottom
                sx={{ color: 'gray' }}
            >
                Manufacturing Order Sizes
            </Typography>
            {manufacturingOrder.manufacturingOrderSize.map((id) => {
                return (
                    <OrderSize
                        id={id}
                        reference={reference}
                        through={through}
                        using={using}
                        key={id}
                    />
                )
            })}
        </>
    )
}

export default OrderSizes
