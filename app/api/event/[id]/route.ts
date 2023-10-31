export const dynamic = "force-dynamic";

import prisma from '../../../../lib/prisma'

// import ICAL from 'ical.js';
// import { promises as fs } from 'fs';
// import path from 'path';
// import IcalExpander from 'ical-expander';


export async function GET(request: Request, context: { params }) {
    try {
        const event = await getEvent(parseInt(context.params.id, 10));
        return new Response(JSON.stringify(event, null, '\t'));
    } catch (e) {
        return new Response('Problem: ' + e);
    }
}

async function getEvent(id: Number) {

    return await prisma.event.findFirst({
        include: {
            calendar: true
        },
        where: {
            id: id
        }
    });
}