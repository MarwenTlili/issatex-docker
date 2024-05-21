import { FunctionComponent, useState } from "react";
import Link from "next/link";
import Head from "next/head";

import { WeeklySchedule } from "../../types/WeeklySchedule";
import { ManufacturingOrder } from "../../types/ManufacturingOrder";
import { Article } from "../../types/Article";
import { DailyProductionQuantity } from "../../types/DailyProductionQuantity";
import { Size } from "../../types/Size";
import { Choice } from "../../types/Choice";

interface Props {
    weeklyschedule: WeeklySchedule;
    text: string;
    sizes?: Size[];
    choices?: Choice[];
}

export const Show: FunctionComponent<Props> = ({ weeklyschedule, text, sizes, choices }) => {
    const [error, setError] = useState<string | null>(null);

    if (!weeklyschedule) {
        setError(`Error when showing the resource: weeklyschedule`);
    }

    return (
        <div className="container p-4">
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
                <div className="grid font-sans gap-y-2">
                    <div className="flex flex-col sm:flex-row">
                        <div className="flex-shrink-0 mr-2 font-sans md:flex-shrink">Schedule </div>
                        <span className="prose">{weeklyschedule.id}</span>
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
                    {/* <div className="font-sans">
                        Order:
                        <span className="ml-2 font-sans prose">
                            {weeklyschedule.manufacturingOrder && (
                                (weeklyschedule.manufacturingOrder as ManufacturingOrder).id
                            )}
                        </span>
                    </div> */}
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
                    {/* if there is productions to display */}
                    {(weeklyschedule.dailyProductions && weeklyschedule.dailyProductions?.length > 0) && (
                        <div className="mb-4">
                            <span className="font-sans font-medium text-purple-500">
                                Daily Productions (days): {weeklyschedule.dailyProductions?.length}
                            </span>
                            <div className="font-sans space-y-4 md:space-y-0 md:grid md:grid-cols-2 md:gap-4 lg:grid-cols-3 lg:gap-6">
                                {weeklyschedule.dailyProductions?.map((prod, index) => {
                                    return (
                                        <div key={index} className="w-full">
                                            {/* US: 25/03/2024 */}
                                            {/* <span>{new Date(prod.day || '').toLocaleDateString()}, </span>  */}

                                            {/* EN(BR): Mon Mar 25 2024 |   25/05/2024  */}
                                            {/* EN(US): Mon Mar 25 2024 |   05/25/2024 */}
                                            {/* FR:     25 mai 2024     |   25/05/2024 */}
                                            <span>{new Date(prod.day || '').toDateString()}</span>

                                            {/* {new Intl.DateTimeFormat(navigator.language).format(new Date(prod.day || ''))} */}

                                            <table className="w-full md:w-auto border border-sky-500">
                                                <thead className="border border-sky-500">
                                                    <tr className="bg-sky-100">
                                                        <th className={`text-sm font-sans w-24 border border-sky-500`}>Size\Choice</th>
                                                        {choices?.map((choice, index) =>
                                                            <th key={index} className={`text-sm font-sans border border-sky-500 sm:px-4 sm:py-2`}>
                                                                {choice.name}
                                                            </th>
                                                        )}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {sizes?.map((size, sizeIndex) => (
                                                        <tr key={sizeIndex} className="h-12 border border-sky-500 even:bg-gray-50">
                                                            <td className={`text-sm font-sans font-bold border border-sky-500 px-2 py-2`}>
                                                                {size.name}
                                                            </td>
                                                            {choices?.map((choice, choiceIndex) => {
                                                                const dailyProductionQuantities = prod.dailyProductionQuantities as DailyProductionQuantity[]
                                                                const q = dailyProductionQuantities.find(qty => {
                                                                    const DailyProductionQuantityObject = qty as DailyProductionQuantity
                                                                    return (DailyProductionQuantityObject.size as Size)["@id"] === size['@id']
                                                                        && (DailyProductionQuantityObject.choice as Choice)["@id"] === choice['@id']
                                                                });
                                                                if (dailyProductionQuantities && q && typeof q === 'object') {
                                                                    const index = dailyProductionQuantities.indexOf(q)
                                                                    return (
                                                                        <td key={`${sizeIndex}-${choiceIndex}`} className={`font-sans border border-sky-500 text-center px-4 py-2`}>
                                                                            <span>
                                                                                {(prod?.dailyProductionQuantities?.[index] as DailyProductionQuantity).quantity}
                                                                            </span>
                                                                        </td>
                                                                    );
                                                                }
                                                            })}
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )
                                }
                                )}
                            </div>
                        </div>
                    )}

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
