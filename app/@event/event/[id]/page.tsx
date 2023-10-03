"use server"

import EventView from '../../../components/EventView'
import prisma from '../../../../lib/prisma'

export default async function Page({ params }) {


    const event = await getEvent(parseInt(params.id, 10));
    return (
        <EventView event={event}></EventView>
    );
}

async function getEvent(id: Number) {
    return await prisma.event.findFirst({
        include: {
            tags: true,
            venue: {
                include: {
                    tags: true
                }
            }
        },
        where: {
            id: id
        }
    });
}