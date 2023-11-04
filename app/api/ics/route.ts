export const dynamic = "force-dynamic";

import prisma from '../../../lib/prisma'

import ICAL from 'ical.js';
import { promises as fs } from 'fs';
import path from 'path';
import IcalExpander from 'ical-expander';
import { log } from 'console';
import moment from 'moment';


// import ICAL from 'ical.js';
// import { promises as fs } from 'fs';
// import path from 'path';
// import IcalExpander from 'ical-expander';

async function getCalendars(allCalendars) {
    for (let cal of allCalendars) {
        if (cal.ics) {

            let prismaVenue = null;
            // try {
            prismaVenue = await prisma.venue.create({
                data: {
                    website: cal.webpage ? cal.webpage : '',
                    title: cal.title,
                    url: cal.ics,
                    sourceType: 'ics',
                    tags: {
                        connectOrCreate: cal.tags.map((tag: String) => {
                            return {
                                where: { title: tag },
                                create: {
                                    title: tag,
                                    pinned: false
                                },
                            };
                        }),
                    },
                    cities: {
                        connectOrCreate: cal.cities.map((city: String) => {
                            return {
                                where: { title: city },
                                create: { title: city },
                            };
                        }),
                    }
                }
            })

            let venue = await prisma.venue.findUnique({
                where: {
                    id: prismaVenue.id
                },
                include: {
                    tags: true,
                    cities: true
                }
            })

            let venueTags = venue?.tags.map(tag => tag.title);

            let venueCities = venue?.cities.map(city => city.title);

            let fileContents = '';
            if (cal.ics.includes('calendar.google')) {
                let r = Math.round(Math.random() * 10000000000);
                cal.ics += '?' + r;

            }

            await fetch(cal.ics, { cache: 'no-store' })
                // await fetch(cal.ics)
                .then(response => response.text())
                .then(text => {
                    fileContents = text;
                });


            let eventsPerCalendar = null;
            try {
                eventsPerCalendar = await expandIcs(fileContents);

            } catch (e) {
                console.log('Could not expand ics: ' + e);
                continue;
            }



            for (let e of eventsPerCalendar) {

                // response += 'Processing ' + e.summary + "\n";

                const start = new Date(e.startDate);
                const end = new Date(e.endDate);
                // const end = `${e.endDate.year}-${e.endDate.month}-${e.endDate.day}T${e.endDate.hour}:${e.endDate.minute}:00`;




                if (end < moment().toDate()) {
                    continue;
                };

                let allTags = [];
                allTags = allTags.concat(e.categories);
                allTags = allTags.concat(venueTags);

                allTags = allTags.filter(e => {
                    if (e) {
                        return e;
                    }
                });


                let data = {
                    // calendar: calendar,
                    venueId: prismaVenue.id,
                    summary: e.summary ? e.summary : '',
                    description: e.description ? e.description : '',
                    start: start,
                    // start: "2022-01-20T12:01:30.543Z",
                    end: end,
                    // end: "2022-01-23T12:01:30.543Z",
                    url: e.url ? e.url : '',
                    // lastUpdated: "2022-01-23T12:01:30.543Z",
                    imageUrl: e.imageUrl ? e.imageUrl : '',
                    sourceType: 'ics',
                    tags: {
                        connectOrCreate: allTags.map((tag: String) => {
                            return {
                                where: { title: tag },
                                create: {
                                    title: tag,
                                    pinned: false
                                },
                            };
                        }),
                    },
                    cities: {
                        connectOrCreate: venueCities.map((city: String) => {
                            return {
                                where: { title: city },
                                create: { title: city },
                            };
                        }),
                    },

                }
                const event = await prisma.event.create({ data })

                // totalEvents++;

            }


            // } catch (e) {
            //     console.trace("\nProblem with " + prismaVenue.title + ' ' + e);
            // }
        }

    }
}

async function expandIcs(ics: string): Array {

    let icalExpander = null;
    try {
        icalExpander = new IcalExpander({ ics: ics, maxIterations: 100 });
    } catch (e) {
        throw new Error('Failed to expand ics');
    }

    const events = icalExpander.between(new Date('2023-05-24T00:00:00.000Z'), new Date('2024-12-31T00:00:00.000Z'));


    for (let event of events.events) {
        for (let l of event.component.jCal[1]) {
            let imageUrl = null;
            let url = null;
            event.categories = [];
            if (l[0] == 'attach') {
                imageUrl = l[3];
                event.imageUrl = imageUrl;
            }
            if (l[0] == 'url') {
                url = l[3];
                event.url = url;
            }
            if (l[0] == 'categories') {
                let temp = l[3];
                for (let index = 3; index < l.length; index++) {
                    const tagString = l[index];
                    if (tagString) {
                        event.categories.push(tagString);
                    }
                }
                // event.url = url;
            }
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
            categories: e.categories,
        }
    });

    const mappedOccurrences = events.occurrences.map(o => ({
        startDate: o.startDate,
        endDate: o.endDate,
        summary: o.item.summary,
        url: o.item.url,
        // categories: o.categories,
    }));

    const allEvents = [].concat(mappedEvents, mappedOccurrences);

    return allEvents;

}

async function getAll(allExport: string) {

    let allData = await fetch(allExport)
        .then(response => response.json())

    await prisma.event.deleteMany({
        where: {
            sourceType: 'ics'
        }
    });

    await prisma.venue.deleteMany({
        where: {
            sourceType: 'ics'
        }
    });

    await getCalendars(allData.calendars);

    await prisma.list.deleteMany({});


    for (let list of allData.lists) {


        let calendarIcsUrls = list.calendars.map(l => l.ics);

        let calendars = await prisma.venue.findMany({
            where: {
                url: { in: calendarIcsUrls }
                // url: 'https://calendar.google.com/calendar/ical/1nkslmh4uur4t51n3rildsd9s0@group.calendar.google.com/public/basic.ics'
            }
        })

        let calendarIds = calendars.map(c => {
            return {
                id: c.id
            }
        });

        const prismaList = await prisma.list.create({
            data: {
                title: list.title,
                name: list.name,
                venues: {
                    connect: calendarIds
                }
            }
        })
    }

    await prisma.tag.update({ data: { pinned: true }, where: { title: 'Art' } })
    await prisma.tag.update({ data: { pinned: true }, where: { title: 'New Music Now' } })
    await prisma.tag.update({ data: { pinned: true }, where: { title: 'Internet related' } })
    await prisma.tag.update({ data: { pinned: true }, where: { title: 'Academia' } })

}


export async function GET(request) {
    // try {



    await getAll('http://publicdata.jgdev.xyz/export/?v=7');
    return new Response('OK');
    // } catch (e) {
    //     return new Response('Not OK: ' + e);
    // }
}