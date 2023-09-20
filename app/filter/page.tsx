import EventDate from '../components/EventDate'
import prisma from '../../lib/prisma'
import Link from 'next/link';
import Filter from '../components/Filter';
import { data } from 'autoprefixer';


export default async function Page({ params }) {

    const lists = await getLists();
    const tags = await getTags();
    const cities = await getCities();
    // const venueTags = await getVenueTags();
    const venues = await getVenues();

    let data = [];
    data.lists = lists;
    data.tags = tags;
    data.cities = cities;
    data.venues = venues;

    return (
        <Filter data={{ lists: lists, tags: tags, cities: cities, venues: venues }}></Filter>
    );
}

async function getLists() {
    return await prisma.list.findMany({});
}

async function getTags() {
    return await prisma.tag.findMany({
        // include: {
        //     events: true,
        //     venues: true
        // },
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
            }
        },
        orderBy: {
            tags: {
                _count: 'asc'
            }
        }
    });
}