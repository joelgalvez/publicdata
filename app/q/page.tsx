export const dynamic = "force-dynamic";

import Link from 'next/link'
import { getEvents } from '../../lib/getEvents'
import moment from 'moment';

import EventLead from '../components/EventLead';
import Reminder from '../components/Reminder';
import { env } from 'process';

export default async function Page({ params, searchParams }) {


    // let open = true;

    // let days = [];
    // for (let dayCount = 0; dayCount < 6; dayCount++) {
    //     let start = moment().add(dayCount, 'days').toDate();
    //     let end = moment().add(dayCount + 1, 'days').startOf('day').add(4, 'hours').toDate();
    //     const events = await getEvents(searchParams.tag, start, end);

    //     days.push({
    //         day: start,
    //         events: events
    //     });
    // }

    // let monthStart = moment().add(6, 'days').startOf('day').add(4, 'hours').toDate();
    // let monthEnd = moment().add(36, 'days').startOf('day').add(4, 'hours').toDate();

    // const month = await getEvents(searchParams, monthStart, monthEnd);

    // let yearStart = moment().add(37, 'days').startOf('day').add(4, 'hours').toDate();
    // let yearEnd = moment().add(402, 'days').startOf('day').add(4, 'hours').toDate();

    // const year = await getEvents(searchParams, yearStart, yearEnd);

    let start = moment().toDate();
    let end = moment().add(2, 'years').toDate();
    const all = await getEvents(searchParams, start, end);

    // console.log(all);


    let days = [];
    for (let d = 0; d < 90; d++) {
        let thisDayStarts = moment().startOf('day').add(d, 'days').toDate();
        let thisDayEnds = moment(thisDayStarts).add(24, 'hours').toDate();
        let eventsThisDay = all.filter(e => {
            // if ((e.start >= thisDayStarts && e.start <= thisDayEnds) || (e.end >= thisDayStarts && e.end <= thisDayEnds)) {
            if ((e.end >= thisDayStarts && e.start < thisDayEnds)) {
                return e;
            }
        })
        let day = {
            'id': d,
            'date': thisDayStarts,
            'events': eventsThisDay
        }
        days.push(day);
    }

    // let month = await getEvents(monthStart, monthEnd);

    return (
        <>

            <div className="">
                <div className="h-screen overflow-y-auto">
                    <div className="">
                        {/* <h2 className="text-6xl m-4 mt-16"><Day date={day.day} /></h2> */}

                        {days.map(day => {
                            return (
                                <div key={day.id}>
                                    {day.events.length > 0 &&
                                        <div className="">
                                            <div className="mb-2 mt-16 text-5xl lg:text-7xl px-2">{moment(day.date).format('dddd MMM Do YYYY')}</div>
                                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 px-2">

                                                {day.events.map(event => {
                                                    return (
                                                        <EventLead event={event} key={event.id}></EventLead>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    }
                                </div>
                            )
                        })}
                        {/* </div> */}
                    </div>

                    {/* 
                <div className="">
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
                </div> */}

                </div >

                <div className="fixed top-0 right-2">
                    <Link href="/subscribe">
                        <div className="m-4 rounded-md button text-sm glow">Subscribe</div>
                    </Link>
                    <Reminder></Reminder>
                </div>

            </div>

        </>
    )


}


