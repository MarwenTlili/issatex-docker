import React from 'react'
import { ArticleImage } from '../../types/ArticleImage'
import useSWR from 'swr'
import Image from 'next/image'
import { BACKEND_URL, IMAGE_404 } from '../../config/entrypoint'
import { fetch } from '../../utils/dataAccess';

const articleImageFetcher = (id: string | undefined) =>
    id ? fetch<ArticleImage>(`${id}`).then((res) => res?.data) : Promise.resolve(undefined)

const ImageElement = ({ id }: { id: string | undefined }) => {
    const { data: image } = useSWR(id, articleImageFetcher)
    if (!image?.["@id"] || !image.contentUrl) {
        return (
            <div className='border rounded-t-lg flex justify-center items-center w-full'
                style={{backgroundColor: '#F6F6F6' }}
            >
                <Image src={IMAGE_404}
                    alt='no image'
                    width={230}
                    height={230}
                    className='rounded-t-lg'
                    style={{
                        width: 120,
                        height: 120
                    }}
                />
            </div>
        )
    }

    return (
        <Image src={BACKEND_URL + image.contentUrl}
            alt={image.contentUrl}
            width={500}
            height={200}
            className='border rounded-t-lg'
            style={{
                maxHeight: 200,
                minHeight: 200,
                width: 'auto'
            }}
        />
    )
}

export default ImageElement
