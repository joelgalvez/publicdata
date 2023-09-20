import prisma from '../../lib/prisma'
import moment from 'moment';
import navigation from 'next/navigation';
import EventLead from '../components/EventLead';

import Day from '../components/Day';


export default async function Page({ params, searchParams }) {





    let open = true;

    let days = [];
    for (let dayCount = 0; dayCount < 6; dayCount++) {
        let start = moment().add(dayCount, 'days').toDate();
        let end = moment().add(dayCount + 1, 'days').startOf('day').add(4, 'hours').toDate();
        const events = await getEvents(searchParams.tag, start, end);

        days.push({
            day: start,
            events: events
        });
    }

    let monthStart = moment().add(6, 'days').startOf('day').add(4, 'hours').toDate();
    let monthEnd = moment().add(36, 'days').startOf('day').add(4, 'hours').toDate();

    const month = await getEvents(searchParams, monthStart, monthEnd);

    let yearStart = moment().add(37, 'days').startOf('day').add(4, 'hours').toDate();
    let yearEnd = moment().add(402, 'days').startOf('day').add(4, 'hours').toDate();

    const year = await getEvents(searchParams, yearStart, yearEnd);


    // let month = await getEvents(monthStart, monthEnd);


    return (
        <>
            <div className="">
                {
                    days.map(day => {
                        return (
                            <div className="">
                                <h2 className="text-6xl m-4 mt-16"><Day date={day.day} /></h2>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 m-4">
                                    {day.events.map(event => {
                                        return (
                                            <EventLead event={event} />
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })
                }

                < div className="">
                    <h2 className="text-6xl m-4 mt-16"><Day date={monthStart} endDate={monthEnd} /></h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 m-4">
                        {month.map(event => {
                            return (
                                <EventLead event={event} />
                            )
                        })}
                    </div>
                </div>

                <div className="">
                    <h2 className="text-6xl m-4 mt-16"><Day date={yearStart} endDate={yearEnd} /></h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 m-4">
                        {year.map(event => {
                            return (
                                <EventLead event={event} />
                            )
                        })}
                    </div>
                </div>

            </div >


        </>
    )
}

async function getEvents(searchParams, start: Date, end: Date) {

    let tags = ['Art'];

    if (searchParams) {
        for (const [key, value] of Object.entries(searchParams)) {
            if (key.substring(0, 3) == 'tag') {
                tags.push(key.substring(4, key.length));
            }
        }
    }


    return await prisma.event.findMany({
        where: {
            start: {
                gt: start
            },
            end: {
                lt: end
            },
            tags: {
                some: {
                    // title: searchParams.tag
                    title: {
                        in: tags
                    }
                }
            }
        },
        include: {
            venue: {
                include: {
                    tags: true
                }
            },
            tags: true
        },
        orderBy: {
            start: 'asc'
        }
    });
}

