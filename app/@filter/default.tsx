import EventDate from '../components/EventDate'
import prisma from '../../lib/prisma'
import Link from 'next/link';


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
                            <input type="checkbox" id="aa" name={list.name} value={1} />
                            <label htmlFor="aa">{list.title}</label>
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
                                <div>
                                    <Link href={'/search/' + tag.title}>
                                        {tag.title} ({tag.events.length})
                                    </Link>
                                </div>
                            }
                        </div>
                    )
                })}
            </div>

            <div className="mb-8">
                <div className='text-2xl'>Individual Venues</div>
                {venues.map(venue => {
                    return (
                        <div className={venue.events.length == 0 ? 'opacity-40' : ''}>{venue.title} ({venue.events.length})</div>
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
            events: {
                _count: 'desc'
            }
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
            tags: {
                _count: 'asc'
            }
        }
    });
}