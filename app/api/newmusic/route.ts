import prisma from '../../../lib/prisma'

// import ICAL from 'ical.js';
// import { promises as fs } from 'fs';
// import path from 'path';
// import IcalExpander from 'ical-expander';


export async function GET(request) {

    // try {

    await prisma.event.deleteMany({
        where: {
            sourceType: 'nmn'
        }
    });




    let all = await fetch('https://newmusicnow.nl/api/ddw?v2')
        .then(response => response.json())

    let total = 0;




    for (const [venue, venueArr] of Object.entries(all)) {


        for (let venueInner of venueArr) {

            for (let event of venueInner.event) {

                try {
                    // console.log(event);

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
                    // console.log();



                    const r = await prisma.event.create({
                        data: {
                            summary: event.name,
                            description: event.description,
                            url: event.url,
                            start: start,
                            end: end,
                            imageUrl: '',
                            sourceType: 'nmn',
                            tags: {
                                connectOrCreate: event.keywords.map((tag: String) => {
                                    return {
                                        where: { title: tag },
                                        create: { title: tag },
                                    };
                                }),
                            },
                        }
                    })
                } catch (e) {
                    return new Response('problem with event' + venueInner.name + ', ' + event.name + ': ' + e);
                }
            }
        }

        // const ret2 = await prisma.event.create({
        //     data: {
        //         summary: 
        //         title: l.title,
        //         url: l.ics,
        //         tags: {
        //             connectOrCreate: tags.map((tag) => {
        //                 return {
        //                     where: { title: tag },
        //                     create: { title: tag },
        //                 };
        //             }),
        //         }
        //     }
        // })            

    }


    // let tags = ['Art', 'Amsterdam'];

    // for (let l of f) {

    //     const r = await prisma.event.create({
    //         data: {
    //             website: l.website ? l.website : '',
    //             title: l.title,
    //             url: l.ics,
    //             tags: {
    //                 connectOrCreate: tags.map((tag) => {
    //                     return {
    //                         where: { title: tag },
    //                         create: { title: tag },
    //                     };
    //                 }),
    //             }
    //         }
    //     })
    //     total++;

    // }

    return new Response('ok');

    // } catch (e) {
    //     return new Response('not ok' + e);
    // }







}