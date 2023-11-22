export const dynamic = "force-dynamic";

import prisma from '../../../lib/prisma';
import { getEvents } from '../../../lib/getEvents';

import moment from 'moment';

import { createEvent, createEvents } from 'ics';

import { NextRequest } from "next/server";
import { log } from 'console';

// import ICAL from 'ical.js';
// import { promises as fs } from 'fs';
// import path from 'path';
// import IcalExpander from 'ical-expander';


export async function GET(request) {

    let startSpan = moment().startOf('day').toDate();
    let endSpan = moment().startOf('day').add(90, 'days').add(4, 'hours').toDate();

    // let searchParams = request.nextUrl.searchParams;    // const all = await getEvents(searchParams, start, end);


    const params = Object.fromEntries(request.nextUrl.searchParams.entries());


    let allEvents = await getEvents(params, startSpan, endSpan);


    let dayEvents = [];


    for (let dayCount = 0; dayCount < 90; dayCount++) {

        let eventPerDayCount = 0;

        let start = moment().startOf('day').add(dayCount, 'days').toDate();
        let end = moment().startOf('day').add(dayCount + 1, 'days').add(4, 'hours').toDate();

        let dayText = '';
        allEvents.forEach(event => {

            if (event.start >= start && event.end <= end) {

                let timeText = '';
                let timeStart = moment(event.start).format('HH:mm');
                let timeEnd = moment(event.end).format('HH:mm');
                if (timeStart == '00:00' && timeEnd == '00:00') {
                    timeText = 'Whole day';
                } else {
                    if (timeStart == timeEnd) {
                        timeText = timeStart;
                    } else {
                        timeText = timeStart + '-' + timeEnd;
                    }
                }
                dayText += `${timeText} - ${event.venue.title}, ${event.summary} \n\n`;

                eventPerDayCount++;
            }
        })

        let tempDay = start.getDate();
        if (tempDay > 31) tempDay = 31;

        let tempDay2 = tempDay + 1;
        if (tempDay2 > 31) tempDay2 = 31;

        let dayEvent = {
            start: [start.getFullYear(), start.getMonth() + 1, tempDay],
            end: [start.getFullYear(), start.getMonth() + 1, tempDay2],
            // duration: { hours: 24, minutes: 0 },
            title: eventPerDayCount + ' public events',
            description: dayText,

            // location: '',
            // url: '',
            // geo: { lat: 40.0095, lon: 105.2669 },
            // categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
            // status: 'CONFIRMED',
            // busyStatus: 'BUSY',
            // organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
            // attendees: [
            //     { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
            //     { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
            // ]

        }

        if (eventPerDayCount > 0) {

            dayEvents.push(dayEvent);
        }

    }



    let { error, value } = createEvents(dayEvents);

    if (error) {
        console.log('Error creating .ics:');
        console.log(JSON.stringify(error, null, 4));
    }

    // let s = "BEGIN:VCALENDAR\n"
    // s += "VERSION:2.0\n";
    // s += 'PRODID: -//hacksw/handcal//NONSGML v1.0//EN"' + "\n";

    return new Response(value);


    // return s + value;
}

// export async function GET(request: Request, context: { params }) {


//     let allEvents = [];

//     for (let dayCount = 0; dayCount < 20; dayCount++) {

//         let start = moment().startOf('day').add(dayCount, 'days').toDate();
//         let end = moment().startOf('day').add(dayCount + 1, 'days').add(4, 'hours').toDate();

//         const events = await getEvents(start, end);

//         let d = '';
//         events.forEach(event => {
//             let time = moment(event.start).format('HH:mm');
//             d += `${time} ${event.venue.title}, ${event.summary}) \n\n`;
//         })

//         let ee = {
//             start: [start.getFullYear(), start.getMonth() + 1, start.getDate() + 1],
//             end: [start.getFullYear(), start.getMonth() + 1, start.getDate() + 2],
//             // duration: { hours: 24, minutes: 0 },
//             title: events.length + ' public events',
//             description: d,

//             // location: '',
//             // url: '',
//             // geo: { lat: 40.0095, lon: 105.2669 },
//             // categories: ['10k races', 'Memorial Day Weekend', 'Boulder CO'],
//             // status: 'CONFIRMED',
//             // busyStatus: 'BUSY',
//             // organizer: { name: 'Admin', email: 'Race@BolderBOULDER.com' },
//             // attendees: [
//             //     { name: 'Adam Gibbons', email: 'adam@example.com', rsvp: true, partstat: 'ACCEPTED', role: 'REQ-PARTICIPANT' },
//             //     { name: 'Brittany Seaton', email: 'brittany@example2.org', dir: 'https://linkedin.com/in/brittanyseaton', role: 'OPT-PARTICIPANT' }
//             // ]

//         }

//         if (events.length > 0) {
//             allEvents.push(ee);
//         }

//     }

//     let { error, value } = createEvents(allEvents);

//     if (error) {
//         console.log('Error creating .ics:');
//         console.log(JSON.stringify(error, null, 4));
//     }

//     let s = "BEGIN:VCALENDAR\n"
//     s += "VERSION:2.0\n";
//     s += 'PRODID: -//hacksw/handcal//NONSGML v1.0//EN"' + "\n";



//     return new Response(s + value);
// }

// async function getEvents(start: Date, end: Date) {
//     return await prisma.event.findMany({
//         where: {
//             start: {
//                 gt: start
//             },
//             end: {
//                 lt: end
//             },
//             venue: {
//                 lists: {
//                     some: {
//                         id: {
//                             in: [11]
//                         }
//                     }
//                 }
//             }
//         },
//         include: {
//             venue: true
//         },
//         orderBy: {
//             start: 'asc'
//         }
//     });
// }


