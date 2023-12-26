export const dynamic = "force-dynamic";

import prisma from '../../../lib/prisma'
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

import { upsertEvent } from '../../../lib/upsertEvent'

import moment from 'moment';
import { parse } from 'path';


export async function GET(request) {




    let stedelijk = await prisma.venue.findUnique({
        where: {
            importId: 'stedelijk-museum'
        }
    });

    let tags = ['Art'];
    let cities = ['Amsterdam'];


    // let tagsPrisma = await prisma.tag.findMany({
    //     where: {
    //         title: { in: tags }
    //     }
    // })

    // let citiesPrisma = await prisma.city.findMany({
    //     where: {
    //         title: { in: cities }
    //     }
    // })


    if (!stedelijk) {

        console.log('--- add stedelijk');


        let data = {
            importId: 'stedelijk-museum',
            website: 'https://www.stedelijk.nl/',
            title: 'Stedelijk Museum',
            url: null,
            sourceType: 'scraped',
            tags: {
                connectOrCreate: tags.map((tag: String) => {
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
                connectOrCreate: cities.map((city: String) => {
                    return {
                        where: { title: city },
                        create: { title: city },
                    };
                }),
            }
        };

        // try {
        stedelijk = await prisma.venue.upsert({
            where: {
                importId: 'stedelijk-museum'
            },
            create: data,
            update: data
        })

    }

    await prisma.event.deleteMany({
        where: {
            venue: stedelijk
        }
    });




    let articles = null;


    const browser = await puppeteer.launch();
    // Open a new page
    const page = await browser.newPage();

    // Navigate to the URL
    await page.goto('https://www.stedelijk.nl/en/whats-on');

    // await page.waitForTimeout(5000)

    // Extract some information (replace with your specific scraping logic)

    const content = await page.content();

    // Print the extracted information
    //console.log('Title:', title);

    const $ = cheerio.load(content);

    articles = $('article').toArray();





    // console.log($bars.text());

    // $bars.forEach(b => {
    //     console.log('---');
    //     console.log(b.text());
    // })

    // Close the browser

    await browser.close();




    for (let elm of articles) {

        let title = $(elm).find('.bar__title-part').text().trim();
        let date = $(elm).find('.bar__footer').text().trim();
        let dates = date.split('until');

        let start = moment(dates[0]);
        let end = moment(dates[1]);



        if (start.isValid() && end.isValid()) {

            let event = {
                uid: 'random-' + Math.round(Math.random() * 1000000000),
                summary: title,
                description: '',
                startDate: start.toDate(),
                endDate: end.toDate(),
                url: 'https://stedelijk.nl'
            }

            // console.log(event);


            console.log(tags);
            console.log(cities);

            await upsertEvent(event, 0, stedelijk, tags, cities, true);
            console.log(event);

        }

    }








    return new Response('Scrape');
}