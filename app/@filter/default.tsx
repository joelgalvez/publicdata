export const dynamic = "force-dynamic";

import EventDate from '../components/EventDate'
import prisma from '../../lib/prisma'
import Link from 'next/link';
import Filter from '../components/Filter';
import { data } from 'autoprefixer';


export default async function Page({ params }) {

    const lists = await getLists();
    const pinnedTags = await getPinnedTags();
    const unpinnedTags = await getUnpinnedTags();
    const cities = await getCities();
    // const venueTags = await getVenueTags();
    const venues = await getVenues();

    let data = [];
    data.lists = lists;
    data.pinnedTags = pinnedTags;
    data.unpinnedTags = unpinnedTags;

    data.cities = cities;
    data.venues = venues;

    return (
        <Filter data={{ lists: lists, unpinnedTags: unpinnedTags, pinnedTags: pinnedTags, cities: cities, venues: venues }}></Filter>
    );
}

async function getLists() {
    return await prisma.list.findMany({
        include: {
            venues: true
        }
    });
}

async function getPinnedTags() {
    return await prisma.tag.findMany({
        // include: {
        //     events: true,
        //     venues: true
        // },
        where: {
            pinned: true
        },
        include: {
            _count: {
                select: {
                    events: true
                }
            }
            // events: true,
            // venues: true
        },
        orderBy: {
            events: {
                _count: 'desc'
            }
        }
    });
}
async function getUnpinnedTags() {
    return await prisma.tag.findMany({
        // include: {
        //     events: true,
        //     venues: true
        // },
        where: {
            pinned: false
        },
        include: {
            _count: {
                select: {
                    events: true
                }
            }
            // events: true,
            // venues: true
        },
        orderBy: {
            events: {
                _count: 'desc'
            }
        }
    });
}

async function getCities() {
    return await prisma.city.findMany({
        include: {
            _count: {
                select: {
                    events: true,
                    venues: true
                }
            }
        },
        orderBy: {
            title: 'asc'
        }
    });
}

async function getVenues() {
    return await prisma.venue.findMany({
        include: {
            _count: {
                select: {
                    tags: true,
                    events: true
                }
            },
            cities: true
        },
        orderBy: {
            title: 'asc'
        }
    });
}