import EventDate from '../components/EventDate'
import prisma from '../../lib/prisma'


export default async function Page({ params }) {

    const lists = await getLists();
    const tags = await getTags();
    const calendars = await getCalendars();

    return (
        <div className="m-4 container mx-auto">

            <div className="mb-8">
                <div className='text-2xl'>Lists</div>
                {lists.map(list => {
                    return (
                        <div>
                            <input type="checkbox" id="vehicle1" name={list.name} value={1} />
                            <label for="vehicle1">{list.title}</label>
                        </div>
                    )
                })}
            </div>

            <div className="mb-8">
                <div className='text-2xl'>Tags</div>
                {tags.map(tag => {
                    return (
                        <div>
                            {tag.events.length > 1 &&
                                <div>{tag.title} ({tag.events.length + tag.calendars.length})</div>
                            }
                        </div>
                    )
                })}
            </div>

            <div className="mb-8">
                <div className='text-2xl'>Individual Calendars</div>
                {calendars.map(calendar => {
                    return (
                        <div>{calendar.title}</div>
                    )
                })}
            </div>

        </div>
    );
}

async function getLists() {
    return await prisma.list.findMany({});
}

async function getTags() {
    return await prisma.tag.findMany({
        include: {
            events: true,
            calendars: true
        }
    });
}

async function getCalendars() {
    return await prisma.calendar.findMany({
        include: {
            tags: true
        }
    });
}