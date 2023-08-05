import EventDate from '../components/EventDate'
import prisma from '../../lib/prisma'


export default async function Page({ params }) {

    const event = await getEvent(parseInt(params.id, 10));

    return (
        <div className="m-4 container mx-auto">

            <div>Lists</div>
            <div>Tags</div>
            <div>Calendars</div>

        </div>
    );
}

async function getLists() {
    return await prisma.list.findMany({
    });
}