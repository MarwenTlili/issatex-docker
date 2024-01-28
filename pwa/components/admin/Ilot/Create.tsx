import React from 'react'
import {
    Create as ReactAdminCreate,
    ReferenceArrayInput,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    useCreate,
    useNotify,
} from 'react-admin'
import { Ilot } from '../../../types/Ilot'
import { Employee } from '../../../types/Employee'

export const employeeFullName = (record: Employee) => `${record.firstName} ${record.lastName}`

const Create = () => {
    const [create] = useCreate<Ilot, Error>()
    const notify = useNotify()

    const handleSubmit = (data: Ilot) => {
        const ilot: Ilot = new Ilot(undefined, data.name, new Date(), data.machines)
        create('api/ilots', { data: ilot }, {
            onError: (error) => {
                notify('Error creating Ilot!', { type: 'error', messageArgs: { _: 'Error creating Ilot!' } })
            },
            onSettled: (newIlot: Ilot | undefined, error) => {
                if (error) {
                    console.log('error: ', error);
                    return
                }
                notify('new Ilot created', { type: 'success', messageArgs: { _: 'new Ilot created' } })
            }
        })
    }

    return (
        <ReactAdminCreate redirect='list'>
            <SimpleForm onSubmit={handleSubmit} >
                <TextInput source='name' required />
                <ReferenceArrayInput
                    reference='api/machines'
                    source='machines'
                    sort={{ field: 'name', order: 'ASC' }}
                    filter={{ 'exists[ilot]': false }} // show only unassigned machines 
                >
                    <SelectArrayInput />
                </ReferenceArrayInput>
                <ReferenceArrayInput
                    reference='api/employees'
                    source='employees'
                    sort={{ field: 'firstName', order: 'ASC' }}
                    filter={{ 'exists[ilot]': false }} // show only unassigned employees 
                >
                    <SelectArrayInput optionText={employeeFullName} />
                </ReferenceArrayInput>
            </SimpleForm>
        </ReactAdminCreate>
    )
}

export default Create
