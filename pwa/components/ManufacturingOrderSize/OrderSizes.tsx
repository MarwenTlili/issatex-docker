import { Dispatch, SetStateAction, useEffect } from 'react'
import { ManufacturingOrderSize } from '../../types/ManufacturingOrderSize'
import { Size } from '../../types/Size'

const getSizeName = (articleSizes: Size[], id: string | undefined) =>
    articleSizes.find(size => size['@id'] === id)?.name

type Props = {
    articleSizes?: Size[]
    onTotalQuantityChange: (newTotalQuantity: number) => void
    selectedSizes: ManufacturingOrderSize[] | undefined
    setSelectedSizes: Dispatch<SetStateAction<ManufacturingOrderSize[] | undefined>>
}

const OrderSizes = ({
    articleSizes,
    setSelectedSizes,
    selectedSizes,
    onTotalQuantityChange,
}: Props) => {

    const handleChange = (sizeId: string | undefined, newQuantity: number) => {
        setSelectedSizes((prev) => {
            return prev?.map((item) => {
                if (item.size === sizeId) {
                    return { ...item, quantity: newQuantity }
                }
                return item
            })
        })
    }

    const handleReset = (id: string | undefined) => {
        setSelectedSizes((prev) => {
            return prev?.map((item) => {
                if (item.size === id) {
                    return { ...item, quantity: 0 }
                }
                return item
            })
        })
    }

    useEffect(() => {
        if (selectedSizes) {
            const total = selectedSizes.reduce((total, manufacturingOrderSize) => total + (manufacturingOrderSize.quantity ?? 0), 0)
            onTotalQuantityChange(total)
            // console.log("selectedSizes: ", selectedSizes)
        }

    }, [selectedSizes])

    return (
        <div>
            {selectedSizes && (
                selectedSizes.map((manufacturingOrderSize) => {
                    const sizeId = manufacturingOrderSize.size
                    if (!sizeId) return <></>
                    return (
                        <div
                            key={manufacturingOrderSize.size}
                            className='grid ml-8'
                        >
                            <label htmlFor="">
                                {articleSizes ? getSizeName(articleSizes, manufacturingOrderSize.size) : ""}
                            </label>
                            <div className='flex items-center'>
                                <input type='number' min={0}
                                    value={manufacturingOrderSize.quantity || ''}
                                    onChange={(e) => handleChange(manufacturingOrderSize.size, Number(e.target.value))}
                                />
                                <button
                                    className='ml-2'
                                    type='button'
                                    onClick={() => handleReset(sizeId)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    )
                })
            )}
        </div>
    )
}

export default OrderSizes
