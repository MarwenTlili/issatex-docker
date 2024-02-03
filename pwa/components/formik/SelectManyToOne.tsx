import React, { useEffect } from 'react';
import { fetch } from "../../utils/dataAccess";
import useSWR from 'swr';
import { FieldProps } from 'formik';

/**
 * Formik Field component to select item from ManyToOne field
 * @param props 
 * @param - reference : string represent from where to fetch options
 * @param - optionValue
 * @returns 
 * 
 * @example
 * <Field name="ilot" as={Select} reference="/api/ilots" optionValue="name" />
 */
const SelectManyToOne: string | React.ComponentType<FieldProps['field'] & SelectProps> = (props) => {
    const { reference, optionText, name, value, onChange, onBlur } = props;

    const { data: options, error } = useSWR(`${reference}`, fetcher)

    if (error) {
        return <div style={{ color: 'red' }}> Error fetching Reference</div>
    }

    return (
        <div>
            <select
                id={value}
                name={name}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            >
                <option value={undefined} label="Select an option" />
                {options &&
                    // @ts-ignore
                    options['hydra:member']?.map((option) => (
                        <option key={option['@id']} value={option['@id']}>
                            {option[optionText]}
                        </option>
                    ))}
            </select>
        </div>
    );
};

export default SelectManyToOne;

interface SelectProps {
    reference: string;
    optionText: string
}

const fetcher = (id: string | undefined) =>
    id ? fetch(`${id}`).then((res) => res?.data) : Promise.resolve(undefined)
