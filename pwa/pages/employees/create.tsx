import { NextComponentType, NextPageContext } from "next";
import Head from "next/head";

import { Form } from "../../components/employee/Form";
import Template from "../../components/Template";

const Page: NextComponentType<NextPageContext> = () => (
    <div>
        <div>
            <Head>
                <title>Create Employee</title>
            </Head>
        </div>
        <Template>
            <Form />
        </Template>
    </div>
);

export default Page;
