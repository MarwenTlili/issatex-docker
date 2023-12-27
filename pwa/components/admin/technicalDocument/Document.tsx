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
    const doc: TechnicalDocument = useGetOne(TECHNICAL_DOCUMENT_URL, { id: record.technicalDocument }).data

    if (!doc || !doc.contentUrl) return null

    return (
        <>
            <Typography
                variant='caption'
                display='block'
                gutterBottom
                sx={{ color: 'gray' }}
            >
                Technical Document
            </Typography>
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
