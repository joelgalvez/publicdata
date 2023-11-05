"use client"


import { React, useState } from 'react';

import { useRouter } from 'next/navigation'

import { log } from 'console';
import Link from 'next/link'
import InformationDialog from './InformationDialog'


export default function Filter(props) {

    let lists = props.data.lists;
    let cities = props.data.cities;
    let unpinnedTags = props.data.unpinnedTags;
    let pinnedTags = props.data.pinnedTags;

    let venues = props.data.venues;

    const router = useRouter();

    // const [on, setOn] = useState('on');
    // const [str, setStr] = useState('');



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
        ;
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

    }

    function changed(e) {

        let parent = e.target.closest('.checkboxes');
        let all = parent.querySelectorAll('input[type=checkbox]');

        updateRouter(all);



    }

    return (
        <>
            {/* <Link href={'/q?' + str} className='fixed bottom-4 right-4 bg-red-600 py-2 px-4 rounded-lg text-2xl'>View Result</Link> */}
            <div className="text-sm h-screen overflow-y-scroll p-2 container mx-auto grid gap-8 checkboxes">

                <div className="mb-8 checkbox-group">
                    <div className="">
                        <div className='text-3xl mb-2'>Cities</div>
                    </div>

                    <div className="">
                        <span className="mr-2 cursor-pointer" onClick={selectAll}>All</span>
                        <span className="cursor-pointer" onClick={selectNone}>None</span>
                    </div>
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
                                                <div className="">
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
                        <summary>All cities</summary>


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
                                                    <div className="">
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
                <div className="mb-8 checkbox-group">
                    <div className="">
                        <div className='text-2xl mb-2'>Tags</div>
                    </div>
                    <div className="">
                        <span className="mr-2 cursor-pointer" onClick={selectAll}>All</span>
                        <span className="cursor-pointer" onClick={selectNone}>None</span>
                    </div>

                    <div className="mb-[1em]">
                        {pinnedTags.map(tag => {
                            return (
                                <div className="" key={tag.id}>
                                    {tag._count.events > 1 &&
                                        <div className="grid grid-cols-[auto,1fr,1fr] gap-x-2">
                                            <div className="" >
                                                📌 <input type="checkbox" name={'tag-' + tag.title} value="1" onChange={changed} />
                                            </div>
                                            <div className="">
                                                {tag.title}
                                            </div>
                                            <div className="">
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
                            {unpinnedTags.map(tag => {
                                return (
                                    <div className="" key={tag.id}>
                                        {tag._count.events > 1 &&
                                            <div className="grid grid-cols-[auto,1fr,1fr] gap-x-2">
                                                <div className="" >
                                                    <input type="checkbox" name={'tag-' + tag.title} value="1" onChange={changed} />
                                                </div>
                                                <div className="">
                                                    {tag.title}
                                                </div>
                                                <div className="">
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

                <div className="mb-8">
                    <div className="">
                        <div className='text-2xl mb-2'>Individual Venues</div>

                    </div>
                    {venues.map(venue => {
                        return (
                            <div className="" key={venue.id}>
                                <div className="grid w-full grid-cols-[1fr,5fr,1fr,1fr] gap-x-2" key={venue.id}>
                                    <div className="">
                                        <input type="checkbox" name={'venue-' + venue.title} value="1" onChange={changed} />
                                    </div>
                                    <div className={venue._count.events == 0 ? 'opacity-40' : ''}>{venue.title}</div>
                                    <div className={venue._count.events == 0 ? 'opacity-40' : ''}>{venue._count.events}</div>
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

                </div>


                <div className="mb-8">
                    <div className="">
                        <div className='text-3xl mb-2'>Lists</div>
                        <div className="mb-6 text-sm">Curated list by someone,<br></br>contact them to be on that list</div>
                    </div>
                    {lists.map(list => {
                        return (
                            <div key={list.id}>
                                <input type="checkbox" name={'list-' + list.title} value="1" onChange={changed} />
                                <label className="ml-1 mr-1" htmlFor={'list-' + list.title}>{list.title}</label>
                                {/* <pre className="text-sm">
                                    {JSON.stringify(list, null, 4)}
                                </pre> */}
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
                </div>

            </div>
        </>
    )
}



