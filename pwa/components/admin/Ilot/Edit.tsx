import React, { useEffect, useState } from 'react'
import {
    EditProps,
    Edit as ReactAdminEdit,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    useEditContext,
    useGetList
} from 'react-admin'

const Edit = (props: EditProps) => {
    return (
        <ReactAdminEdit {...props} title='Edit Ilot'>
            <SimpleForm >
                <TextInput source='name' required />
                <OneToManySelect
                    source='machines'
                    reference='api/machines'
                    mappedBy='ilot'
                    inversedBy='machines'
                    optionText={(choice) => `${choice.name}`}
                />
            </SimpleForm>
        </ReactAdminEdit>
    )
}

export default Edit

/**
 * select only unassigned references for OneToMany
 * @param props - { source, reference, mappedBy, inversedBy, optionText }
 * @returns SelectArrayInput
 * @example
 * <OneToManySelect
 *      source='machines'
 *      reference='api/machines'
 *      mappedBy='ilot'
 *      inversedBy='machines'
 *      optionText={(choice) => `${choice.name}`}
 * />
 */
const OneToManySelect = (props: OneToManySelectProps) => {
    const { source, reference, mappedBy, inversedBy, optionText } = props
    const { record, isLoading } = useEditContext()
    const [filtred, setFiltred] = useState<any[]>([])
    const {
        data,
        total,
        isLoading: referenceIsLoading,
        error
    } = useGetList(reference, {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'id', order: 'DESC' }
    })

    useEffect(() => {
        if (record && data) {
            /**
             * filter employees where:
             *  (not assigned to Ilot) OR (exists in ilot.employees)
             */
            const filtered = data.filter(ref =>
                (ref[mappedBy] === undefined) || (record[inversedBy].some((x: any) => x === ref['@id']))
            )
            setFiltred(filtered)
        }
    }, [record, data])

    if (error) {
        return (
            <p style={{ color: 'red' }}>Error fetching references!</p>
        )
    }

    return (
        <SelectArrayInput
            source={source}
            optionText={optionText}
            choices={filtred}
            isLoading={referenceIsLoading && isLoading}
            translateChoice={false}
        />
    )
}

interface OneToManySelectProps {
    source: string
    reference: string
    mappedBy: string
    inversedBy: string
    optionText?: (choice: any) => string
}
