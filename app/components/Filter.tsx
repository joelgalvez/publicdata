"use client"


import { React, useState, useEffect, useLayoutEffect } from 'react';

import { useRouter } from 'next/navigation'

import { log } from 'console';
import Link from 'next/link'
import InformationDialog from './InformationDialog'


export default function Filter(props) {

    const [visible, setVisible] = useState(false);
    // let visible = props.data.visible;

    let lists = props.data.lists;
    let cities = props.data.cities;
    let unpinnedTags = props.data.unpinnedTags;
    let pinnedTags = props.data.pinnedTags;

    let venues = props.data.venues;

    const router = useRouter();


    useLayoutEffect(() => {
        selectFromURL();
    }, [router]);



    function escape(s: string): string {

        return s.replace("'", "\\'");

    }

    //there is probably a better way?

    function selectFromURL() {



        const s = window.location.search;

        console.log('selectFromUrl', s);



        if (s[0] === '?') {
            let str = s.slice(1);
            let all = str.split('&');

            all.forEach(a => {
                let suf = a.slice(-2);
                if (suf == '=1') {
                    let pre = a.slice(0, -2);
                    if (pre.substring(0, 4) == 'tag-') {
                        let sel = "input[name='" + escape(decodeURI(pre)) + "']";
                        let tagEl = document.querySelector(sel);
                        if (tagEl) {
                            tagEl.checked = true;
                        }
                    }
                    if (pre.substring(0, 5) == 'city-') {
                        let sel = "input[name='" + escape(decodeURI(pre)) + "']";
                        let tagEl = document.querySelector(sel);
                        if (tagEl) {
                            tagEl.checked = true;
                        }
                    }
                    if (pre.substring(0, 6) == 'venue-') {
                        let sel = "input[name='" + escape(decodeURI(pre)) + "']";
                        let tagEl = document.querySelector(sel);
                        if (tagEl) {
                            tagEl.checked = true;
                        }
                    }
                    if (pre.substring(0, 5) == 'list-') {
                        let sel = "input[name='" + escape(decodeURI(pre)) + "']";
                        let tagEl = document.querySelector(sel);
                        if (tagEl) {
                            tagEl.checked = true;
                        }
                    }
                }
            })
        }
    }

    // function setVisible(v) {
    //     this.visible = visible;
    // }

    function selectAll(e) {
        let parent = e.target.closest('.checkbox-group');
        let all = parent.querySelectorAll('input[type=checkbox]');
        all.forEach(ee => {
            ee.checked = true;
        });
        updateRouter(all);
        ;
    }

    function selectNone(e) {
        let parent = e.target.closest('.checkbox-group');
        let all = parent.querySelectorAll('input[type=checkbox]');
        all.forEach(ee => {
            ee.checked = false;
        });
        updateRouter(all);
    }

    function clearAll() {
        let all = document.querySelectorAll('input[type=checkbox]');
        all.forEach(ee => {
            ee.checked = false;
        });
        updateRouter(all);
    }

    function updateRouter() {

        let parent = document.querySelector('.checkboxes');
        let all = parent.querySelectorAll('input[type=checkbox]');


        let str = '?';
        all.forEach(c => {
            if (c.checked) {
                str += c.name + '=1&';
            }
        });
        str = str.slice(0, -1);

        router.replace('/q' + str);

        localStorage.setItem('q', str);

    }

    function changed(e) {

        let parent = e.target.closest('.checkboxes');
        let all = parent.querySelectorAll('input[type=checkbox]');

        updateRouter(all);

    }

    function show() {
        setVisible(true);
    }

    function hide() {
        setVisible(false);
    }

    return (
        <>
            {/* <Link href={'/q?' + str} className='fixed bottom-4 right-4 bg-red-600 py-2 px-4 rounded-lg text-2xl'>View Result</Link> */}

            <div className={(visible ? 'hidden' : 'block') + ' absolute top-0 left-0 m-4 '}>
                <div className="button cursor-pointer text-sm shade" onClick={show}>Filters</div>
            </div>

            <div className={(visible ? 'block' : 'hidden') + ' panel  text-sm h-screen overflow-y-scroll p-4 container mx-auto grid gap-8 content-start checkboxes absolute z-20 md:static w-[calc(100%-3rem)] md:w-full md:max-w-[17rem]'}>

                <div className="flex gap-4 justify-between">
                    <div className="">
                        <div className="button inline-block cursor-pointer" onClick={clearAll}>Clear all</div>
                    </div>
                    <div className="cross text-xl text-right cursor-pointer" onClick={hide}>
                        ✕
                    </div>

                </div>

                <div className=" checkbox-group">
                    <div className='text-2xl mr-2 mb-2'>Cities</div>
                    <span className="cursor-pointer button mb-2" onClick={selectNone}>Clear</span>

                    {/* <div className="mb-2">
                        <span className="mr-2 cursor-pointer button" onClick={selectAll}>All</span>
                    </div> */}
                    <div className="">
                        {cities.map(city => {
                            return (
                                <div className="" key={city.id}>
                                    {city._count.events > 10 &&
                                        <div className="" key={city.id}>
                                            <div className="grid grid-cols-[auto,3fr,1fr] gap-x-2">
                                                <div className="">
                                                    <input type="checkbox" name={'city-' + city.title} value="1" onChange={changed} />
                                                </div>
                                                <div className="">
                                                    {city.title}
                                                </div>
                                                <div className="opacity-80 text-xs">
                                                    {city._count.events}
                                                </div>

                                            </div>

                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <details>
                        <summary>See all cities</summary>


                        <div className="">
                            {cities.map(city => {
                                return (
                                    <div className="" key={city.id}>
                                        {city._count.events <= 10 &&
                                            <div className="">
                                                <div className="grid grid-cols-[auto,3fr,1fr] gap-x-2">
                                                    <div className="">
                                                        <input type="checkbox" name={'city-' + city.title} value="1" onChange={changed} />
                                                    </div>
                                                    <div className="">
                                                        {city.title}
                                                    </div>
                                                    <div className="opacity-80 text-xs">
                                                        {city._count.events}
                                                    </div>

                                                </div>

                                            </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </details>

                </div>

                <div className="text-center px-4 max-w-[13rem] mx-auto">
                    <div className="">↑</div>
                    <div className="">You need to select both a city and some tags</div>
                    <div className="">↓</div>

                </div>


                <div className=" checkbox-group">
                    <div className='text-2xl mb-2 '>Tags</div>
                    <span className="cursor-pointer button mb-2" onClick={selectNone}>Clear</span>

                    {/* <div className="mb-2">
                        <span className="mr-2 cursor-pointer button" onClick={selectAll}>All</span>
                        <span className="cursor-pointer button" onClick={selectNone}>Clear</span>
                    </div> */}

                    <div className="">
                        {pinnedTags.map(tag => {
                            return (
                                <div className="" key={tag.id}>
                                    {tag._count.events > 1 &&
                                        <div className="grid grid-cols-[auto,3fr,1fr] gap-x-2">
                                            <div className="" >
                                                📌 <input type="checkbox" name={'tag-' + tag.title} value="1" onChange={changed} />
                                            </div>
                                            <div className="">
                                                {tag.title}
                                            </div>
                                            <div className="opacity-80 text-xs">
                                                {tag._count.events}
                                            </div>

                                        </div>
                                    }
                                </div>
                            )
                        })}
                    </div>
                    <details>
                        <summary>
                            See all tags
                        </summary>
                        <div className="">
                            <div className="text-xs opacity-80 my-4 rounded-md bg-blue-100 py-3 px-4  text-blue-800">
                                <div className="flex gap-4">
                                    <div className="text-2xl">ⓘ</div>
                                    <div className="">Selecting the pinned tags above will already cover all events, the remaining tags below are only for specialization</div>
                                </div>
                            </div>

                            {unpinnedTags.map(tag => {
                                return (
                                    <div className="" key={tag.id}>
                                        {tag._count.events > 1 &&
                                            <div className="grid grid-cols-[auto,3fr,1fr] gap-x-2">
                                                <div className="">
                                                    <input type="checkbox" name={'tag-' + tag.title} value="1" onChange={changed} />
                                                </div>
                                                <div className="">
                                                    {tag.title}
                                                </div>
                                                <div className="opacity-80 text-xs">
                                                    {tag._count.events}
                                                </div>

                                            </div>
                                        }
                                    </div>
                                )
                            })}
                        </div>
                    </details>
                </div>

                <hr />

                <div className="checkbox-group">
                    <div className="">
                        <div className='text-2xl mb-2'>Individual Venues</div>
                    </div>

                    <details>
                        <summary>
                            See all venues
                        </summary>
                        <div className="mb-2 mt-2">
                            {/* <span className="mr-2 cursor-pointer button" onClick={selectAll}>All</span> */}
                            <span className="cursor-pointer button" onClick={selectNone}>Clear</span>
                        </div>

                        {venues.map(venue => {
                            return (
                                <div className="" key={venue.id}>
                                    <div className="grid w-full grid-cols-[1fr,5fr,1fr,1fr] gap-x-2" key={venue.id}>
                                        <div className="">
                                            <input type="checkbox" name={'venue-' + venue.title} value="1" onChange={changed} />
                                        </div>
                                        <div className={venue._count.events == 0 ? 'opacity-40' : ''}>{venue.title}</div>
                                        <div className={venue._count.events == 0 ? 'opacity-40' : 'opacity-80' + ' text-xs '}>{venue._count.events}</div>
                                        <InformationDialog html=<div className="text-sm mb-4">
                                            <div className="grid gap-8 grid-cols-2">
                                                <div className="">
                                                    <div className="text-xs mb-1">Website(s)</div>
                                                    <div className="">
                                                        <a className="underline" href={venue.website ? venue.website : null} target="_blank">{venue.website}</a>
                                                    </div>
                                                </div>
                                                <div className="">
                                                    <div className="">
                                                        <div className="text-xs mb-1">City</div>
                                                        {venue.cities.map(city => {
                                                            return (
                                                                <div key={city.title}>{city.title}</div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ></InformationDialog>
                                    </div>

                                </div>
                            )
                        })}
                    </details>

                </div>




                {/* <div className="">
                    <div className="">
                        <div className='text-2xl mb-2'>Curated Lists</div>
                    </div>
                    {lists.map(list => {
                        return (
                            <div key={list.id}>
                                <input type="checkbox" name={'list-' + list.title} value="1" onChange={changed} />
                                <label className="ml-1 mr-1" htmlFor={'list-' + list.title}>{list.title}</label>
                     
                                <InformationDialog html={list.venues.map(venue => {
                                    return (
                                        <div className="text-xs ml-4" key={venue.id}>
                                            <div className="">{venue.title}</div>
                                        </div>
                                    )
                                })}></InformationDialog>
                            </div>
                        )
                    })}
                </div> */}

            </div >
        </>
    )
}



