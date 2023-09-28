import prisma from '../../../lib/prisma'
import moment from 'moment';

import { createEvent, createEvents } from 'ics';
import { log } from 'console';
// import ICAL from 'ical.js';
// import { promises as fs } from 'fs';
// import path from 'path';
// import IcalExpander from 'ical-expander';


export async function GET(request: Request, context: { params }) {


    let allEvents = [];

    for (let dayCount = 0; dayCount < 20; dayCount++) {

        let start = moment().startOf('day').add(dayCount, 'days').toDate();
        let end = moment().startOf('day').add(dayCount + 1, 'days').add(4, 'hours').toDate();

        const events = await getEvents(start, end);

        let d = '';
        events.forEach(event => {
            let time = moment(event.start).format('HH:mm');
            d += `${time} ${event.venue.title}, ${event.summary}) \n\n`;
        })

        let ee = {
            start: [start.getFullYear(), start.getMonth() + 1, start.getDate() + 1],
            end: [start.getFullYear(), start.getMonth() + 1, start.getDate() + 2],
            // duration: { hours: 24, minutes: 0 },
            title: events.length + ' public events',
            description: d,

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

        if (events.length > 0) {
            allEvents.push(ee);
        }

    }

    let { error, value } = createEvents(allEvents);

    if (error) {
        console.log('Error creating .ics:');
        console.log(JSON.stringify(error, null, 4));
    }

    let s = "BEGIN:VCALENDAR\n"
    s += "VERSION:2.0\n";
    s += 'PRODID: -//hacksw/handcal//NONSGML v1.0//EN"' + "\n";



    return new Response(s + value);
}

async function getEvents(start: Date, end: Date) {
    return await prisma.event.findMany({
        where: {
            start: {
                gt: start
            },
            end: {
                lt: end
            }
        },
        include: {
            venue: true
        },
        orderBy: {
            start: 'asc'
        }
    });
}

