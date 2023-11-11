import React, { ChangeEvent, Dispatch, SetStateAction } from 'react'
import { PagedCollection } from '../../types/collection'
import { Article } from '../../types/Article'
import { ManufacturingOrder } from '../../types/ManufacturingOrder'
import { FormikErrors, FormikTouched } from 'formik'

interface SelectProps {
    clientArticles: PagedCollection<Article> | undefined,
    manufacturingOrder: ManufacturingOrder,
    selectedArticle: string | undefined,
    setSelectedArticle: Dispatch<SetStateAction<string | undefined>>,
    errors?: FormikErrors<ManufacturingOrder>,
    touched?: FormikTouched<ManufacturingOrder>
}

function Select({ clientArticles, manufacturingOrder, selectedArticle, setSelectedArticle, errors, touched }: SelectProps) {

    const handleSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
        manufacturingOrder.article = event.target.value
        setSelectedArticle(event.target.value)
    }

    return (
        <select
            name="article"
            id="manufacturingorder_article"
            className={`w-full rounded-md border border-gray-300 focus:ring focus:ring-blue-200 
                ${errors!.article && touched!.article ? "border-red-500" : ""}`
            }
            value={selectedArticle}
            onChange={handleSelectChange}
        >
            <option value="" className="text-gray">
                Select an Article ...
            </option>
            {clientArticles && clientArticles["hydra:member"] && (
                clientArticles["hydra:member"].map((article) => (
                    <option key={article["@id"]} value={article["@id"]}>
                        {article.designation}
                    </option>
                ))
            )}
        </select>
    );
}

export default Select