import prisma from '../../../lib/prisma'

// import ICAL from 'ical.js';
// import { promises as fs } from 'fs';
// import path from 'path';
// import IcalExpander from 'ical-expander';


export async function GET(request) {

    try {
        const ret = await prisma.calendar.deleteMany({});


        let f = await fetch('https://publicdata.events/list/amsterdamart/')
            .then(response => response.json())

        let total = 0;

        for (let l of f) {

            if (l.ics != '') {
                const ret2 = await prisma.calendar.create({
                    data: {
                        website: l.website ? l.website : '',
                        title: l.title,
                        tags: 'Amsterdam,Art',
                        url: l.ics
                    }
                })
                total++;

            }

        }

        return new Response('ok');

    } catch (e) {
        return new Response('not ok' + e);
    }







}