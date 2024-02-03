import React from 'react';
import { Ilot } from '../../types/Ilot';
import { Session } from 'next-auth';
import useSWR from 'swr';
import { fetch } from '../../utils/dataAccess';

const fetcher = (id: string | undefined) =>
    id ? fetch<Ilot>(`${id}`).then((res) => res?.data) : Promise.resolve(undefined)
    
const IlotName = ({ ilotId, session }: { ilotId: string | undefined, session: Session | null }) => {
    const { data: ilot, error } = useSWR(ilotId, fetcher)
    
    if (error) return <div>failed to load</div>
    
    if (!ilot) return <></>

    return (
        <>{ilot.name}</>
    )
};

export default IlotName;
