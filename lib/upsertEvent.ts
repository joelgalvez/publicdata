import prisma from './prisma'

export async function upsertEvent(event, sequence, venuePrisma, venueTagsPrisma, venueCitiesPrisma, isScraped = false) {


    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    // const end = `${event.endDatevent.year}-${event.endDatevent.month}-${event.endDatevent.day}T${event.endDatevent.hour}:${event.endDatevent.minute}:00`;

    // if (end < moment().toDate()) {
    //     continue;
    // };

    let allTags = [];
    allTags = allTags.concat(event.categories);
    allTags = allTags.concat(venueTagsPrisma);

    allTags = allTags.filter(e => {
        if (e) {
            return e;
        }
    });

    // console.log('venueCitiesPrisma', venueCitiesPrisma);
    // console.log('venueTagsPrisma', venueTagsPrisma);





    let data = {
        // calendar: calendar,
        venueId: venuePrisma.id,
        uid: event.uid,
        sequence: sequence,
        summary: event.summary ? event.summary : '',
        description: event.description ? event.description : '',
        scraped: isScraped,
        start: start,
        // start: "2022-01-20T12:01:30.543Z",
        end: end,
        // end: "2022-01-23T12:01:30.543Z",
        url: event.url ? event.url : '',
        // lastUpdated: "2022-01-23T12:01:30.543Z",
        imageUrl: event.imageUrl ? event.imageUrl : '',
        sourceType: isScraped ? 'scraped' : 'ics',
        tags: {
            connectOrCreate: allTags.map((tag: String) => {
                return {
                    where: { title: tag },
                    create: {
                        title: tag,
                        pinned: false
                    },
                };
            }),
        },
        cities: {
            connectOrCreate: venueCitiesPrisma.map((city: String) => {
                return {
                    where: { title: city },
                    create: { title: city },
                };
            }),
        },

    }
    if (event.uid == null) {
        console.log('ERR --- error uid is null, not creating event ', event.summary);
    } else {
        await prisma.event.upsert({
            where: {
                uidSequence: {
                    uid: event.uid,
                    sequence: sequence
                }
            },
            create: data,
            update: data,
        })
    }

    return 1;
}