import prisma from '../../../lib/prisma'
import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

import { upsertEvent } from '../../../lib/upsertEvent'

import moment from 'moment';
import { parse } from 'path';

async function prepareVenue(importId, title, tags, cities, website) {


    let venue = await prisma.venue.findUnique({
        where: {
            importId: importId
        }
    });

    if (!venue) {

        console.log('--- add ' + venue);


        let data = {
            importId: importId,
            website: website,
            title: title,
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
        venue = await prisma.venue.upsert({
            where: {
                importId: importId
            },
            create: data,
            update: data
        })

    }

    await prisma.event.deleteMany({
        where: {
            venue: venue
        }
    });

    return venue;

}

async function scrape(url: String) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    const content = await page.content();
    await browser.close();

    return content;

}



export async function scrapeSources() {

    let tags = ['Art'];
    let cities = ['Amsterdam'];

    let venue = await prepareVenue('stedelijk-museum', 'Stedelijk Museum', tags, cities, 'https://www.stedelijk.nl');
    let html = await scrape('https://www.stedelijk.nl/en/whats-on');


    let articles = null;
    let $ = cheerio.load(html);
    articles = $('article').toArray();

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
            await upsertEvent(event, 0, venue, tags, cities, true);
        }
    }


    tags = ['Art'];
    cities = ['Rotterdam'];

    venue = await prepareVenue('nieuwe-instituut', 'Nieuwe Instituut', tags, cities, 'https://nieuweinstituut.nl');
    html = await scrape('https://nieuweinstituut.nl/en/events');


    $ = cheerio.load(html);
    let as = $('main a').toArray();

    for (let a of as) {

        let c = $(a).find('> * > * ').toArray();
        for (let ce of c) {

            let cs = $(ce).find('> *').toArray();

            let date = $(cs[0]).text();
            let title = $(cs[1]).text();
            let description = $(cs[2]).text();

            let dates = date.split('-');

            let startString = dates[0].trim();
            let endString = null;

            if (dates.length < 2) {
                endString = dates[0].trim()
            } else {
                endString = dates[1].trim()
            }

            let start = moment(startString);
            let end = moment(endString);

            if (start.isValid() && end.isValid()) {

                let event = {
                    uid: 'random-' + Math.round(Math.random() * 1000000000),
                    summary: title,
                    description: description,
                    startDate: start.toDate(),
                    endDate: end.toDate(),
                    url: 'https://nieuweinstituut.nl'
                }
                await upsertEvent(event, 0, venue, tags, cities, true);
            }

        }




    }



    return true;
}