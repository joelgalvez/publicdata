export const dynamic = "force-dynamic";

import { log } from 'console';
import prisma from '../../../lib/prisma'

// import ICAL from 'ical.js';
// import { promises as fs } from 'fs';
// import path from 'path';
// import IcalExpander from 'ical-expander';


export async function GET(request) {

    function isIterable(obj) {
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

    await prisma.event.deleteMany({
        where: {
            sourceType: 'nmn'
        }
    });

    let all = await fetch('https://newmusicnow.nl/api/ddw?v5')
        .then(response => response.json())

    for (const [venue, venueArr] of Object.entries(all)) {


        for (let venueInner of venueArr) {


            const venueRecord = prisma.venue.upsert({
                where: {
                    title: venue
                },
                update: {
                    title: venue
                },
                create: {
                    title: venue,
                    sourceType: 'nmn',
                    // url: 'https://newmusicnow.nl',
                    website: 'https://newmusicnow.nl',
                    importId: venue
                }
            });

            const venueId = (await venueRecord).id;

            let firstEvent = true;


            if (!venueInner.event) {
                continue;
            }

            if (isIterable(venueInner.event)) {
                for (let event of venueInner.event) {


                    try {

                        if (!event) {
                            continue;
                        }

                        if (event.startDate == 'undefined') {
                            continue;
                        }

                        let start = new Date(event.startDate);

                        let end = null;
                        if (!event.endDate || event.endDate == 'undefined') {
                            end = start;
                        } else {
                            end = new Date(event.endDate);
                        }

                        // console.log('Tag-addr: ' + venueInner.address.addressLocality);

                        let allTags = [];
                        allTags = allTags.concat(event.keywords);

                        allTags.push('New Music Now');


                        let allCities = [venueInner.address.addressLocality];

                        const r = await prisma.event.create({
                            data: {
                                summary: event.name,
                                description: event.description,
                                venueId: venueId,
                                url: event.url,
                                uid: Math.round(Math.random() * 1000000000000000).toString(),
                                sequence: 0,
                                start: start,
                                end: end,
                                imageUrl: '',
                                sourceType: 'nmn',
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
                                    connectOrCreate: allCities.map((city: String) => {
                                        return {
                                            where: { title: city },
                                            create: { title: city },
                                        };
                                    }),
                                },
                            }
                        })

                    } catch (e) {
                        return new Response('problem with event' + venueInner.name + ', ' + event.name + ': ' + e);
                    }
                    firstEvent = false;
                }
            }
        }

    }

    return new Response('ok');

}