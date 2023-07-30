import React from 'react';
import Head from 'next/head';
import Template from '../../components/Template';
import { GetServerSidePropsContext } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { User } from '../../types/User';
import { Form } from "../../components/profile/Form";
import { fetch, FetchResponse } from "../../utils/dataAccess";
import DefaultErrorPage from "next/error";
import { useQuery } from 'react-query';

const getUser = async (id: string) =>
    await fetch<User>(`/api/users/${id}`);

const Page = ( {id}: {id: string} ) => {
    const {
        isLoading, error, data: { data: user } = {}
    } = useQuery<FetchResponse<User> | undefined>(
        ["user", id], () => getUser(id)
    );

    if (error) console.log("error: ", error);

    if (isLoading) return <div>is loading ...</div>

    if(!user) return <DefaultErrorPage statusCode={404} />;

    return (
    <>
        <Head>
            <title>Profile</title>
        </Head>
        <Template>
            <Form user={user}/>
        </Template>
    </>
    );
};

/**
 * getServerSideProps is required to use getServerSession (next-auth)
 */
export async function getServerSideProps(context: GetServerSidePropsContext) {
    const session = await getServerSession(context.req, context.res, authOptions);
    const id  = session?.user.id;

    return {
        props: {
            id: id
        }
    }
}

export default Page;
