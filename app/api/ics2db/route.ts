import prisma from '../../../lib/prisma'

import ICAL from 'ical.js';
import { promises as fs } from 'fs';
import path from 'path';
import IcalExpander from 'ical-expander';


export async function GET(request) {

    let response = '';
    let total = 0;
    // const token = req.headers.AUTHORIZATION
    // const userId = await getUserId(token)
    // const prisma = new PrismaClient()

    const ret = await prisma.event.deleteMany({});

    const calendars = await prisma.calendar.findMany({
    });

    for (let calendar of calendars) {
        try {
            // const res = await fetch('https://jgdev.xyz/rr.ics');
            const dir = path.join(process.cwd(), 'ics-cache');
            let file = dir + '/cal-cache-' + calendar.id + '.ics';
            const fileContents = await fs.readFile(file, 'utf8');

            const icalExpander = new IcalExpander({ ics: fileContents, maxIterations: 100 });
            const events = icalExpander.between(new Date('2023-05-24T00:00:00.000Z'), new Date('2023-12-31T00:00:00.000Z'));

            //yuck, please someone tell me how to do this properly
            let imageUrl = null;
            for (let event of events.events) {
                for (let l of event.component.jCal[1]) {
                    if (l[0] == 'attach') {
                        imageUrl = l[3];
                        event.imageUrl = imageUrl;
                    }
                }
            }

            const mappedEvents = events.events.map(e => (
                {
                    startDate: e.startDate,
                    endDate: e.startDate,
                    summary: e.summary,
                    description: e.description,
                    imageUrl: e.imageUrl,
                }
            ));

            const mappedOccurrences = events.occurrences.map(o => ({ startDate: o.startDate, summary: o.item.summary }));
            const allEvents = [].concat(mappedEvents, mappedOccurrences);

            // console.log('delete where calendarId ' + calendar.id);


            for (let e of allEvents) {

                const ret2 = await prisma.event.create({
                    data: {
                        // calendar: calendar,
                        calendarId: calendar.id,
                        summary: e.summary ? e.summary : '',
                        description: e.description ? e.description : '',
                        start: "2022-01-20T12:01:30.543Z",
                        end: "2022-01-23T12:01:30.543Z",
                        url: e.url ? e.url : '',
                        // lastUpdated: "2022-01-23T12:01:30.543Z",
                        imageUrl: e.imageUrl ? e.imageUrl : ''
                    }
                })
                total++;



            }



        } catch (e) {
            response += e + "\n";
        }
    }

    // console.log('res', res);
    // const text = await res.text();

    return new Response('Done ' + response);

    // console.log(events);

}