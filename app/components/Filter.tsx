"use client"

import Link from 'next/link'

export default function Filter(props) {

    let lists = props.data.lists;
    let cities = props.data.cities;
    let tags = props.data.tags;
    let venues = props.data.venues;

    function changed(e) {
        console.log(e.target);

    }

    return (
        <>
            <div className="m-4 container mx-auto grid lg:grid-cols-4">
                <div className="mb-8">
                    <div className='text-2xl'>Lists</div>
                    {lists.map(list => {
                        return (
                            <div key={list.id}>
                                <input type="checkbox" name={'list-' + list.title} value="1" onChange={changed} />
                                <label htmlFor="aa">{list.title}</label>
                            </div>
                        )
                    })}
                </div>

                <div className="mb-8">
                    <div className='text-2xl'>Cities</div>
                    <div className="">
                        {cities.map(city => {
                            return (
                                <div className="" key={city.id}>
                                    <div className="grid grid-cols-[auto,1fr,1fr] gap-x-2">
                                        <div className="">
                                            <input type="checkbox" name={'city-' + city.title} value="1" />
                                        </div>
                                        <div className="">
                                            {city.title}
                                        </div>
                                        <div className="">
                                            {city._count.events}
                                        </div>

                                    </div>

                                </div>
                            )
                        })}
                    </div>
                </div>
                <div className="mb-8">
                    <div className='text-2xl'>Tags</div>
                    <div className="">
                        {tags.map(tag => {
                            return (
                                <div className="" key={tag.id}>
                                    {tag._count.events > 1 &&
                                        <div className="grid grid-cols-[auto,1fr,1fr] gap-x-2">
                                            <div className="" >
                                                <input type="checkbox" name={'tag-' + tag.title} value="1" />
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
                </div>

                <div className="mb-8">
                    <div className='text-2xl'>Individual Venues</div>
                    {venues.map(venue => {
                        return (
                            <div className="grid grid-cols-[auto,1fr,1fr] gap-x-2" key={venue.id}>
                                <div className="">
                                    <input type="checkbox" name={'venue-' + venue.title} value="1" />
                                </div>
                                <div className={venue._count.events == 0 ? 'opacity-40' : ''}>{venue.title}</div>
                                <div className={venue._count.events == 0 ? 'opacity-40' : ''}>{venue._count.events}</div>
                            </div>
                        )
                    })}

                </div>
            </div>
        </>
    )
}



