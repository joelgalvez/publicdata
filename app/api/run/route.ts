export const dynamic = "force-dynamic";

import { log } from 'console';
import prisma from '../../../lib/prisma'

//jobs
import { runIcs } from './ics';
import { scrapeSources } from './scrapeSources';
import { newMusicNow } from './newmusicnow';


export async function GET(request) {

    let initialized = await prisma.settings.findUnique({
        where: {
            key: 'initialized'
        }
    });


    if (!initialized || initialized.value !== '1') {
        let tags = process.env.NEXT_PUBLIC_PINNED_TAGS?.split(',');
        for (let tag of tags) {
            await prisma.tag.upsert({
                create: {
                    title: tag,
                    pinned: true
                },
                update: {
                    pinned: true
                },
                where: {
                    title: tag
                }
            })
        }

        await prisma.settings.upsert({
            create: {
                key: 'initialized',
                value: '1',
                date: new Date()
            },
            update: {
                value: '1',
                date: new Date()
            },
            where: {
                key: 'initialized'
            }
        })

    }

    let running = await prisma.settings.findUnique({
        where: {
            key: 'running'
        }
    });



    // if (running) {
    //     let diff = new Date() - running.date;

    //     if (diff < 10800000) {
    //         console.log('There has not been 3 hours since last run');

    //         return new Response('OK');
    //     }

    // }


    await prisma.settings.upsert({
        create: {
            key: 'running',
            value: '1',
            date: new Date()
        },
        update: {
            value: '1',
            date: new Date()
        },
        where: {
            key: 'running'
        }
    })


    let ret = await runIcs();
    if (!ret) {
        console.log('Error running ICS');
    }

    if (!(process.env.NEXT_PUBLIC_DISABLE_NEW_MUSIC_NOW == "true")) {
        ret = await newMusicNow();
        if (!ret) {
            console.log('Error running New music now');
        }
    }

    if (!(process.env.NEXT_PUBLIC_DISABLE_SCRAPED_SOURCES == "true")) {
        ret = await scrapeSources();
        if (!ret) {
            console.log('Error running scrapeSources');
        }
    }

    console.log('==================');
    console.log('Done initalizing!');
    console.log('==================');


    await prisma.settings.upsert({
        create: {
            key: 'running',
            value: '0',
            date: new Date()
        },
        update: {
            value: '0',
            date: new Date()
        },
        where: {
            key: 'running'
        }
    })



    return new Response('ok');

}