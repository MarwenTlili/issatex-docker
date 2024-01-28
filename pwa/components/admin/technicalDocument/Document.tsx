import React from 'react'
import {
    useGetOne,
    useRecordContext,
    RaRecord
} from 'react-admin'
import { TechnicalDocument } from '../../../types/TechnicalDocument'
import {
    TECHNICAL_DOCUMENT_URL,
    ENTRYPOINT
} from '../../../config/entrypoint'
import Typography from '@mui/material/Typography'

interface ManufacturingOrderRecord extends RaRecord {
    technicalDocument?: string,
}

const Document = () => {
    const record: ManufacturingOrderRecord = useRecordContext()
    if (!record.technicalDocument) {
        return <>
            <TechnicalDocumentLabel />
            <div style={{ color: 'orange' }}>No technical document to display</div>
        </>
    }
    const doc: TechnicalDocument = useGetOne(TECHNICAL_DOCUMENT_URL, { id: record.technicalDocument }).data

    if (!doc || !doc.contentUrl) return null

    return (
        <>
            <TechnicalDocumentLabel />
            <a
                href={`${ENTRYPOINT}${doc.contentUrl}`}
                title='technical document'
                target='_blank'
            >
                {doc.contentUrl.split('/').pop()}
            </a>
        </>
    )
}

export default Document

const TechnicalDocumentLabel = () => {
    return <Typography
        variant='caption'
        display='block'
        gutterBottom
        sx={{ color: 'gray' }}
    >
        Technical Document
    </Typography>
}
