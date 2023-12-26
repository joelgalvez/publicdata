import prisma from './prisma'

export async function getEvents(searchParams, start: Date, end: Date) {

    let tags = [];
    let lists = [];
    let cities = [];
    let venues = [];

    if (searchParams) {
        for (const [key, value] of Object.entries(searchParams)) {
            if (key.substring(0, 3) == 'tag') {
                tags.push(key.substring(4, key.length));
            }
        }

        for (const [key, value] of Object.entries(searchParams)) {
            if (key.substring(0, 4) == 'list') {
                lists.push(key.substring(5, key.length));
            }
        }

        for (const [key, value] of Object.entries(searchParams)) {
            if (key.substring(0, 4) == 'city') {
                cities.push(key.substring(5, key.length));
            }
        }
        for (const [key, value] of Object.entries(searchParams)) {
            if (key.substring(0, 5) == 'venue') {
                venues.push(key.substring(6, key.length));
            }
        }
    }


    let listSelect = lists.map(l => {
        return { 'title': l }
    })


    let listRecords = await prisma.list.findMany({
        where: {
            OR: listSelect
        }
    })


    let listIds = listRecords.map(lr => lr.id);


    const ret = await prisma.event.findMany({
        where: {
            // AND: [
            //     {
            //         start: {
            //             gt: start
            //         },
            //         end: {
            //             lt: end
            //         },
            //     },
            // ],
            OR: [
                {
                    AND: [
                        {
                            tags: {
                                some: {
                                    // title: searchParams.tag
                                    title: {
                                        in: tags
                                    }
                                }
                            }
                        },
                        {
                            cities: {
                                some: {
                                    // title: searchParams.tag
                                    title: {
                                        in: cities
                                    }
                                }
                            },
                        }
                    ],
                },
                {
                    venue: {
                        title: {
                            in: venues
                        }
                    }
                },
                {
                    venue: {
                        lists: {
                            some: {
                                id: {
                                    in: listIds
                                }
                            }
                        }
                    }
                }
            ]
        },
        include: {
            venue: {
                include: {
                    tags: true,
                    lists: true
                }
            },
            tags: true
        },
        orderBy: {
            start: 'asc'
        }
    });


    return ret;
}