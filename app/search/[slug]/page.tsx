import prisma from '../../../lib/prisma'
import moment from 'moment';
import EventLead from '../../components/EventLead';

import Day from '../../components/Day';


export default async function Page({ params }: { params: { slug: string } }) {

    let open = true;

    let days = [];
    for (let dayCount = 0; dayCount < 6; dayCount++) {
        let start = moment().add(dayCount, 'days').toDate();
        let end = moment().add(dayCount + 1, 'days').startOf('day').add(4, 'hours').toDate();
        const events = await getEvents(params.slug, start, end);

        days.push({
            day: start,
            events: events
        });
    }

    let monthStart = moment().add(6, 'days').startOf('day').add(4, 'hours').toDate();
    let monthEnd = moment().add(36, 'days').startOf('day').add(4, 'hours').toDate();

    const month = await getEvents(params.slug, monthStart, monthEnd);

    let yearStart = moment().add(37, 'days').startOf('day').add(4, 'hours').toDate();
    let yearEnd = moment().add(402, 'days').startOf('day').add(4, 'hours').toDate();

    const year = await getEvents(params.slug, yearStart, yearEnd);


    // let month = await getEvents(monthStart, monthEnd);


    return (
        <>
            <div className={'transition-transform top-0 absolute w-full h-screen overflow-y-auto bg-black'} style={{ transform: open ? 'translate3d(0,50vh,0)' : 'translate3d(0,0vh,0)' }} >
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

async function getEvents(string, start: Date, end: Date) {


    let str = decodeURI(string);
    let tags = str.split('|')

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

