import React from 'react'
import {
    EditProps,
    Edit as ReactAdminEdit,
    ReferenceArrayInput,
    SelectArrayInput,
    SimpleForm,
    TextInput
} from 'react-admin'
import { employeeFullName } from './Create';

const Edit = (props: EditProps) => {
    return (
        <ReactAdminEdit {...props} title='Edit Ilot'>
            <SimpleForm >
                <TextInput source='name' required />
                <ReferenceArrayInput
                    reference='api/machines'
                    source='machines'
                    sort={{ field: 'name', order: 'ASC' }}
                    // filter={{
                    //     'exists[ilot]': false,
                    //     '@id': {ne: recordId}
                    // }}
                >
                    <SelectArrayInput optionText='name' />
                </ReferenceArrayInput>
                <ReferenceArrayInput
                    reference='api/employees'
                    source='employees'
                    sort={{ field: 'firstName', order: 'ASC' }}
                >
                    <SelectArrayInput optionText={employeeFullName} />
                </ReferenceArrayInput>
            </SimpleForm>
        </ReactAdminEdit>
    )
}

export default Edit
