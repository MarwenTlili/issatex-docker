import React, { useEffect, useState } from 'react'

import {
    Identifier,
    Edit as ReactAdminEdit,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    required,
    useEditContext,
    useGetList
} from 'react-admin'

import { WeeklySchedule } from '../../../types/WeeklySchedule'
import { ManufacturingOrder } from '../../../types/ManufacturingOrder'
import { RichTextInput } from 'ra-input-rich-text'
import { StartToEndDateInput } from './Create'

const Edit = () => {
    return (
        <ReactAdminEdit title='Edit WeeklySchedule' redirect='list'>
            <SimpleForm>
                <StartToEndDateInput />
                <ManufacturingOrdersSelect />
                <ReferenceInput
                    reference='api/islets'
                    source='islet'
                >
                    <SelectInput validate={required()} />
                </ReferenceInput>
                <RichTextInput source='observation' />
            </SimpleForm>
        </ReactAdminEdit>
    )
}

const ManufacturingOrdersSelect = () => {
    const { record: weeklySchedule, isLoading } = useEditContext<WeeklySchedule & { id: Identifier }>()

    const [ordersFiltered, setOrdersFiltered] = useState<(ManufacturingOrder & { id: Identifier })[]>([])

    const {
        data: ordersList,
        total: ordersTotal,
        isLoading: ordersIsLoading,
        error: ordersError
    } = useGetList<ManufacturingOrder & { id: Identifier }>('api/manufacturing_orders', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'createdAt', order: 'DESC' }
    })

    const {
        data: weeklySchedulesList,
        total: weeklySchedulesTotal,
        isLoading: weeklySchedulesIsLoading,
        error: weeklySchedulesError
    } = useGetList<WeeklySchedule & { id: Identifier }>('api/weekly_schedules', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'startAt', order: 'DESC' }
    })

    useEffect(() => {
        if (ordersList && weeklySchedulesList) {
            const filtered = ordersList.filter((order) =>
                !weeklySchedulesList?.some(schedule =>
                    // remove current weeklySchedule.manufacturingOrder from filter
                    (schedule.manufacturingOrder === order['@id']) && !(weeklySchedule?.manufacturingOrder === order['@id'])
                )
            )
            setOrdersFiltered(filtered)
        }
    }, [ordersList, weeklySchedulesList])

    return (
        <SelectInput
            source='manufacturingOrder'
            optionText='originId'
            choices={ordersFiltered}
            optionValue='@id'
            isLoading={ordersFiltered.length === 0}
            validate={required()}
        />
    )
}

export default Edit
