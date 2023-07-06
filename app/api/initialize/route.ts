import prisma from '../../../lib/prisma'

import ICAL from 'ical.js';
import { promises as fs } from 'fs';
import path from 'path';
import IcalExpander from 'ical-expander';


// import ICAL from 'ical.js';
// import { promises as fs } from 'fs';
// import path from 'path';
// import IcalExpander from 'ical-expander';

async function getCal(ics: string) {

    let response = '';


    let f = await fetch(ics)
        .then(response => response.json())

    let totalCalendars = 0;
    let totalEvents = 0;

    // let tags = ['Art', 'Amsterdam'];

    for (let l of f) {
        if (l.ics != '') {
            let calendar = null;
            try {
                // return;
                calendar = await prisma.calendar.create({
                    data: {
                        website: l.webpage ? l.webpage : '',
                        title: l.title,
                        url: l.ics,
                        tags: {
                            connectOrCreate: l.tags.map((tag: String) => {
                                return {
                                    where: { title: tag },
                                    create: { title: tag },
                                };
                            }),
                        }
                    }
                })



                // const res = await fetch('https://jgdev.xyz/rr.ics');
                // const dir = path.join(process.cwd(), 'ics-cache');
                // let file = dir + '/cal-cache-' + calendar.id + '.ics';
                // const fileContents = await fs.readFile(file, 'utf8');

                let fileContents = '';
                await fetch(l.ics)
                    .then(response => response.text())
                    .then(text => {
                        fileContents = text;
                    });

                const icalExpander = new IcalExpander({ ics: fileContents, maxIterations: 100 });
                const events = icalExpander.between(new Date('2023-05-24T00:00:00.000Z'), new Date('2023-12-31T00:00:00.000Z'));

                //ew, please someone tell me how to do this properly

                for (let event of events.events) {
                    // console.log(JSON.stringify(event, null, 2));

                    for (let l of event.component.jCal[1]) {
                        let imageUrl = null;
                        let url = null;
                        if (l[0] == 'attach') {
                            imageUrl = l[3];
                            event.imageUrl = imageUrl;
                        }
                        if (l[0] == 'url') {
                            url = l[3];
                            event.url = url;
                        }
                        // console.log(JSON.stringify(l, null, 2));
                    }
                }

                const mappedEvents = events.events.map(e => {
                    return {
                        startDate: e.startDate,
                        endDate: e.startDate,
                        summary: e.summary,
                        description: e.description,
                        imageUrl: e.imageUrl,
                        url: e.url,
                    }
                });



                const mappedOccurrences = events.occurrences.map(o => ({
                    startDate: o.startDate,
                    endDate: o.endDate,
                    summary: o.item.summary,
                    url: o.item.url
                }));

                const allEvents = [].concat(mappedEvents, mappedOccurrences);

                for (let e of allEvents) {

                    // response += 'Processing ' + e.summary + "\n";

                    const start = new Date(e.startDate);
                    const end = new Date(e.endDate);
                    // const end = `${e.endDate.year}-${e.endDate.month}-${e.endDate.day}T${e.endDate.hour}:${e.endDate.minute}:00`;

                    let data = {
                        // calendar: calendar,
                        calendarId: calendar.id,
                        summary: e.summary ? e.summary : '',
                        description: e.description ? e.description : '',
                        start: start,
                        // start: "2022-01-20T12:01:30.543Z",
                        end: end,
                        // end: "2022-01-23T12:01:30.543Z",
                        url: e.url ? e.url : '',
                        // lastUpdated: "2022-01-23T12:01:30.543Z",
                        imageUrl: e.imageUrl ? e.imageUrl : '',
                        sourceType: 'ics'

                    }
                    const event = await prisma.event.create({ data })
                    response += `\nCreated event ${calendar.title} - ${event.summary}`
                    totalEvents++;

                }

                totalCalendars++;

            } catch (e) {
                response += "\nProblem with " + calendar.title + ' ' + e;
            }
        }

    }

    return response;

}


export async function GET(request) {

    let response = '';

    try {

        await prisma.calendar.deleteMany({});
        await prisma.event.deleteMany({
            where: {
                sourceType: 'ics'
            }
        });

        // response += await getCal(['Amsterdam', 'Art'], 'https://publicdata.events/list/amsterdamart/');
        response += await getCal('http://publicdata.jgdev.xyz/export/');
        // response += await getCal(['Publishing', 'Academia'], 'https://publicdata.events/list/publishing-academia/');

        return new Response(response);

    } catch (e) {
        return new Response('not ok' + e);
    }

}