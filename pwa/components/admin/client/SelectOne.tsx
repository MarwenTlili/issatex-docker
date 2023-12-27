import React, { ChangeEvent, useState } from 'react'
import { useGetList, useRecordContext } from 'react-admin'

interface Props {
    label?: string
    source: string
    reference: string
}

interface Option {
    label?: string
    value?: string
}

const SelectOne = (props: Props) => {
    const { label, source, reference } = props
    const { data: list, isLoading } = useGetList(reference)
    const record = useRecordContext()
    const [selected, setSelected] = useState<Option>()

    // const [options, setOptions] = useState<Option[]>()
    let options: Option[] = []

    console.log('list: ', list)
    console.log('record: ', record)

    if (list && list.length > 0) {
        // list.map(l => setOptions({label: l.name, value: l.id}))
        options = list.map((l) => ({
            label: l.username,
            value: l.id,
        }))
        setSelected(options[0])
    }

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        console.log('value: ', event.target.value)
        // setSelected(selectedOption)
    }

    return (
        <div>
            <label>Account:</label>
            <select onChange={handleChange}>
                <option value=''>Select Account(User) ...</option>
                {list && (
                    list.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.username}
                        </option>
                    ))
                )}
            </select>
        </div>
    )
}

export default SelectOne
