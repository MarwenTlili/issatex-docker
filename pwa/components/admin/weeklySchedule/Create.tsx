import React, { useEffect } from 'react'

import {
    DateTimeInput,
    Create as ReactAdminCreat,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    required,
    useCreate,
    useNotify,
    useRedirect,
} from 'react-admin'

import { WeeklySchedule } from '../../../types/WeeklySchedule'
import { RichTextInput } from 'ra-input-rich-text'
import { useController, useForm } from 'react-hook-form'
import { addWeek } from '../../../utils/tools'

const Create = () => {
    const [create, { isLoading, error }] = useCreate()
    const notify = useNotify()
    const redirect = useRedirect()

    const validateScheduleCreation = (values: WeeklySchedule) => {
        const errors: Partial<WeeklySchedule> = {}
        if (!values.manufacturingOrder) {
            errors.manufacturingOrder = 'Order is required!'
        }
        if (!values.ilot) {
            errors.ilot = 'Ilot is required!'
        }
        if (!values.startAt) {
            // @ts-ignore
            errors.startAt = 'startAt is required!'
        }
        return errors
    }

    const onSubmit = (weeklySchedule: WeeklySchedule) => {
        // automatically set endsAt if it's not specified
        if (weeklySchedule.startAt && !weeklySchedule.endAt) {
            weeklySchedule.endAt = addWeek(weeklySchedule.startAt)
        }

        create('api/weekly_schedules', {
            data: weeklySchedule
        }, {
            onError: (error) => {
                console.log('error: ', error)
                notify(
                    'WeeklySchedule.error',
                    { type: 'error', messageArgs: { _: 'Error saving new WeeklySchedule' } }
                )
            },
            onSettled: (data: WeeklySchedule, error) => {
                if (!error) {
                    notify(
                        'WeeklySchedule.success',
                        { type: 'success', messageArgs: { _: 'New WeeklySchedule saved.' } }
                    )
                    redirect('/api/weekly_schedules')
                } else {
                    notify(
                        'WeeklySchedule.error',
                        { type: 'error', messageArgs: { _: 'Error saving new WeeklySchedule' } }
                    )
                }
            }
        })
    }

    return (
        <ReactAdminCreat redirect='list'>
            <SimpleForm
                validate={validateScheduleCreation}
                onSubmit={onSubmit}
            >
                <StartToEndDateInput />
                <ReferenceInput
                    reference='api/manufacturing_orders'
                    source='manufacturingOrder'
                    filter={{ 'exists[weeklySchedule]': false }} // filter already scheduled MO
                >
                    <SelectInput
                        optionText='originId'
                        validate={required()}
                    />
                </ReferenceInput>
                <ReferenceInput
                    reference='api/ilots'
                    source='ilot'
                >
                    <SelectInput
                        optionText='name'
                        validate={required()}
                    />
                </ReferenceInput>
                <RichTextInput source='observation' />
            </SimpleForm>
        </ReactAdminCreat>
    )
}

export default Create

export const StartToEndDateInput = () => {
    // default startAt date time
    const defaultDateTime = new Date()
    defaultDateTime.setHours(8, 0, 0)

    const { field: startAtField } = useController({
        name: 'startAt',
        defaultValue: defaultDateTime,
        rules: { required: true }
    })

    const { field: endAtField } = useController({
        name: 'endAt',
        defaultValue: addWeek(defaultDateTime),  // default +7 days
        rules: { required: true }
    })

    useEffect(() => {
        // whenever startAt value change, then set endAt
        endAtField.onChange(addWeek(new Date(startAtField.value)))
    }, [startAtField.value])

    return (
        <>
            <DateTimeInput
                source='startAt'
                value={startAtField.value}
                onChange={startAtField.onChange}
                onBlur={startAtField.onBlur}
                validate={required()}
            />
            <DateTimeInput
                source='endAt'
                value={endAtField.value}
                onChange={endAtField.onChange}
                onBlur={endAtField.onBlur}
            />
        </>
    )
}
