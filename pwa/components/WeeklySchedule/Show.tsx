import { FunctionComponent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";

import { WeeklySchedule } from "../../types/WeeklySchedule";
import { useSession } from "next-auth/react";
import { ManufacturingOrder } from "../../types/ManufacturingOrder";
import { Article } from "../../types/Article";

interface Props {
    weeklyschedule: WeeklySchedule;
    text: string;
}

export const Show: FunctionComponent<Props> = ({ weeklyschedule, text }) => {
    const { data: session, status } = useSession()
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    return (
        <div className="p-4">
            <Head>
                <title>{`Show WeeklySchedule ${weeklyschedule["@id"]}`}</title>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: text }}
                />
            </Head>
            <Link
                href="/weekly-schedules"
                className="text-sm text-cyan-500 font-bold hover:text-cyan-700"
            >
                {"< Back to list"}
            </Link>

            <div className="w-full border-b-2 my-4 rounded-md">
                <div className="grid font-sans">
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mr-2 font-sans md:flex-shrink">Schedule </div>
                        {weeklyschedule.id}
                    </div>

                    <div className="flex flex-col sm:flex-row">
                        <div className="font-sans">
                            From: <span className="prose">{new Date(weeklyschedule.startAt || '').toLocaleDateString()}</span>
                        </div>
                        <div className="font-sans sm:ml-4">
                            To: <span className="prose">{new Date(weeklyschedule.endAt || '').toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="font-sans">
                        Ilot:
                        <span className="ml-2 font-sans prose">
                            {weeklyschedule.ilot?.name}
                        </span>
                    </div>
                    <div className="font-sans">
                        Order:
                        <span className="ml-2 font-sans prose">
                            {weeklyschedule.manufacturingOrder && (
                                (weeklyschedule.manufacturingOrder as ManufacturingOrder).id
                            )}
                        </span>
                    </div>
                    <div className="font-sans">
                        Article:
                            <span className="ml-2 font-sans prose">
                                {((weeklyschedule.manufacturingOrder as ManufacturingOrder).article as Article) && (
                                    ((weeklyschedule.manufacturingOrder as ManufacturingOrder).article as Article).designation
                                )}
                            </span>
                    </div>
                    <div className="font-sans">
                        Observation:
                        <p className='max-w-full font-sans prose'
                            dangerouslySetInnerHTML={{ __html: weeklyschedule.observation ?? "" }}
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div
                    className="border px-4 py-3 my-4 rounded text-red-700 border-red-400 bg-red-100"
                    role="alert"
                >
                    {error}
                </div>
            )}
        </div>
    );
};
