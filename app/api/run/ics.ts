import fs from "fs/promises";

import prisma from "../../../lib/prisma";
import { upsertEvent } from "../../../lib/upsertEvent";
import IcalExpander from "ical-expander";

// import moment from 'moment';


function extractEvents(ics: string) {

    let icalExpander = null;
    try {
        icalExpander = new IcalExpander({ ics: ics, maxIterations: 100 });
    } catch (e) {

        return false;
        // throw new Error('Failed to expand ics');
    }

    const events = icalExpander.between(new Date('2023-11-03T00:00:00.000Z'), new Date('2024-12-31T00:00:00.000Z'));


    for (let event of events.events) {
        for (let l of event.component.jCal[1]) {
            let imageUrl = null;
            let url = null;
            let uid = null;

            event.categories = [];
            if (l[0] == 'attach') {
                imageUrl = l[3];
                event.imageUrl = imageUrl;
            }
            if (l[0] == 'url') {
                url = l[3];
                event.url = url;
            }
            if (l[0] == 'uid') {
                uid = l[3];
                event.uid = uid;
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
            uid: e.uid,
            url: e.url,
            imageUrl: e.imageUrl
        }
    });



    const mappedOccurrences = events.occurrences.map(o => ({

        startDate: o.startDate,
        endDate: o.endDate,
        uid: o.item.uid,
        summary: o.item.summary,
        description: o.item.description,
        url: o.item.url,
        imageUrl: o.item.imageUrl

        // categories: o.categories,
    }));

    // const allEvents = [].concat(mappedEvents, mappedOccurrences);

    return { 'events': mappedEvents, 'occurrences': mappedOccurrences };

}


async function updateLists(jsonLists) {

    await prisma.list.deleteMany({});


    for (let list of jsonLists) {


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
}

async function upsertVenue(cal) {

    if (cal.ics) {
        console.log('--- upsert ', cal.title);

        let prismaVenue = null;

        let data = {
            importId: cal.name,
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
        };

        // try {
        return prismaVenue = await prisma.venue.upsert({
            where: {
                importId: cal.name
            },
            create: data,
            update: data
        })
    }
}

async function fetchICS(url, cacheBusting) {

    let ret = null;

    try {

        if (cacheBusting === true) {
            if (url.includes('calendar.google')) {
                let r = Math.round(Math.random() * 10000000000);
                url += '?' + r;
            }
        }

        let cacheObj = { 'cache': 'force-cache' }

        if (cacheBusting === true) {
            cacheObj = { 'cache': 'no-store' };
        }

        await fetch(url, cacheObj)
            // await fetch(cal.ics)
            .then(response => response.text())
            .then(text => {
                ret = text;
            });

    } catch (e) {
        console.trace("\nCannot fetch " + url);
    }

    return ret;
}



export async function runIcs() {

    console.log('-------- Running ics import');


    // await prisma.event.deleteMany({
    //     where: {
    //         sourceType: 'ics'
    //     }
    // });
    // return;

    // let last = await prisma.last.findUnique({
    //     where: {
    //         strid: 'ics'
    //     }
    // })


    // if (last === null) {
    //     await prisma.last.create({
    //         data: {
    //             strid: 'ics',
    //             updated: new Date()
    //         }
    //     })
    // } else {
    //     let now = new Date();
    //     let diff = now - last.updated;
    //     if (diff < 14400000) {
    //         return new Response('OK');
    //     }
    // }



    let cacheBusting = true;

    // If a sources.json file is present, use that. If not, use NEXT_PUBLIC_SOURCES
    //
    // TODO: Properly load config globally in a single object.
    let json = await (async () => {
        try {
            return await fs.readFile('sources.json', { encoding: "utf8" }).then(file => JSON.parse(file))
        }
        catch (err) {
            console.log(err)
            console.log('Trying to fetch json from URL ' + process.env.NEXT_PUBLIC_SOURCES);
            return await fetch(process.env.NEXT_PUBLIC_SOURCES + '?random=' + Math.round(Math.random() * 1000000000))
                .then(response => response.json())
        }
    })()



    for (let calendar of json.calendars) {
        await upsertVenue(calendar);
    }

    if ("lists" in json) {
        await updateLists(json.lists);
    }


    let venuesWithUrl = await prisma.venue.findMany({ where: { NOT: [{ url: null }] } });

    for (let venue of venuesWithUrl) {

        console.log(' --- Venue ' + venue.title);

        let venuePrisma = await prisma.venue.findUnique({
            where: {
                id: venue.id
            },
            include: {
                tags: true,
                cities: true
            }
        })

        let venueTagsPrisma = venuePrisma?.tags.map(tag => tag.title);
        let venueCitiesPrisma = venuePrisma?.cities.map(city => city.title);

        const ics = await fetchICS(venue.url, cacheBusting);

        if (ics == null) {
            console.log('ERR --- Failed to fetch ' + venue.title);
        } else {

            const ret = extractEvents(ics);

            // console.log(JSON.stringify(ret, null, 4));

            let eventCount = 0;
            let occuranceCount = 0;

            if (ret === false) {
                console.log('ERR --- failed to expand ics ' + venue.title);
            } else {

                const { events, occurrences } = ret;

                for (const event of events) {
                    await upsertEvent(event, 0, venuePrisma, venueTagsPrisma, venueCitiesPrisma);
                    eventCount++;
                }
                let sequence = 1;
                for (const occ of occurrences) {
                    await upsertEvent(occ, sequence++, venuePrisma, venueTagsPrisma, venueCitiesPrisma);
                    occuranceCount++;
                }

                console.log('     --- added ' + eventCount + ' events');
                console.log('     --- added ' + occuranceCount + ' occurrances');
                console.log(' ');

            }
        }
    }

    return true;
    // } catch (e) {
    //     return new Response('Not OK: ' + e);
    // }
}