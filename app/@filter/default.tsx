import EventDate from '../components/EventDate'
import prisma from '../../lib/prisma'


export default async function Page({ params }) {

    const lists = await getLists();
    const tags = await getTags();
    const venueTags = await getVenueTags();
    const venues = await getVenues();

    return (
        <div className="m-4 container mx-auto grid lg:grid-cols-4">

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
                <div className='text-2xl'>Venue tags</div>
                {venueTags.map(tag => {
                    return (
                        <div>
                            {tag.venues.length > 1 &&

                                <div>{tag.title} ({tag.venues.length})</div>
                            }
                        </div>
                    )
                })}
            </div>

            <div className="mb-8">
                <div className='text-2xl'>Event tags</div>
                {tags.map(tag => {
                    return (
                        <div>
                            {tag.events.length > 1 &&
                                <div>{tag.title} ({tag.events.length})</div>
                            }
                        </div>
                    )
                })}
            </div>

            <div className="mb-8">
                <div className='text-2xl'>Individual Venues</div>
                {venues.map(venue => {
                    return (
                        <div class={venue.events.length == 0 ? 'opacity-40' : ''}>{venue.title} ({venue.events.length})</div>
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
            venues: true
        },
        orderBy: {
            title: 'asc'
        }
    });
}

async function getVenueTags() {
    return await prisma.tag.findMany({
        include: {
            venues: true
        }
    });
}

async function getVenues() {
    return await prisma.venue.findMany({
        include: {
            tags: true,
            events: true
        },
        orderBy: {
            title: 'asc'
        }
    });
}