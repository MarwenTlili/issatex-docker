import React, { ChangeEvent, useState } from 'react'
import { useRecordContext, useUpdate } from 'react-admin'
import Switch from '@mui/material/Switch'

/**
 * 
 * @param resource API Path
 * @param source name of property (boolean) to switch
 * @returns MUI Switch 
 * @example 
 * import SwitchToggle from '../SwitchToggle'
 * <SwitchToggle resource='api/manufacturing_orders' source='denied' />
 */
const SwitchToggle = ({ resource, source }: { resource: string, source: string }) => {
    const record = useRecordContext()
    if (!record) return null

    const [checked, setChecked] = useState<boolean>(record[source])
    const [update, { data, isLoading, error }] = useUpdate()

    const handleClick = (event: ChangeEvent<HTMLInputElement>) => {
        /** if you want update data to be just the difference, without the rest of origin data */
        // const diff = { [source]: !checked }
        const updatedData = { ...record, [source]: !checked }

        update(
            resource,
            { id: record['@id'], data: updatedData, previousData: record }
        )
        setChecked(!checked)
    }

    if (error) { return <p>ERROR</p> }

    return <Switch checked={checked} disabled={isLoading} onChange={handleClick} />
}

export default SwitchToggle
