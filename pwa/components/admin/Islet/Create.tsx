import React from 'react'
import {
    Create as ReactAdminCreate,
    ReferenceArrayInput,
    SelectArrayInput,
    SimpleForm,
    TextInput,
    useCreate,
    useNotify,
    useRedirect,
} from 'react-admin'
import { Islet } from '../../../types/Islet'
import { Employee } from '../../../types/Employee'

export const employeeFullName = (record: Employee) => `${record.firstName} ${record.lastName}`

const Create = () => {
    const [create] = useCreate<Islet, Error>()
    const notify = useNotify()
    const redirect = useRedirect();

    const handleSubmit = (data: Islet) => {
        const islet: Islet = new Islet(undefined, data.name, new Date(), data.machines)

        create('api/islets', { data: islet }, {
            onError: (error) => {
                notify('Error creating Islet!', { type: 'error', messageArgs: { _: 'Error creating Islet!' } })
            },
            onSettled: (newIslet: Islet | undefined, error) => {
                if (error) {
                    console.log('error: ', error);
                    return
                }
                notify('new Islet created', { type: 'success', messageArgs: { _: 'new Islet created' } })
                redirect('/api/islets')
            }
        })
    }

    return (
        <ReactAdminCreate>
            <SimpleForm onSubmit={handleSubmit} >
                <TextInput source='name' required />
                <ReferenceArrayInput
                    reference='api/machines'
                    source='machines'
                    sort={{ field: 'name', order: 'ASC' }}
                    filter={{ 'exists[islet]': false }} // show only unassigned machines 
                >
                    <SelectArrayInput />
                </ReferenceArrayInput>
            </SimpleForm>
        </ReactAdminCreate>
    )
}

export default Create
