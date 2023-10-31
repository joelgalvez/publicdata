"use client"

import EventDate from './EventDate'
import { useRouter, usePathname } from 'next/navigation';

export default function EventView(props) {

    const router = useRouter()

    let event = props.event;

    function onBack() {
        router.back();
    }

    return (
        <div className="" onClick={onBack}>

            <div className="fixed bg-black/70 w-full h-screen right-0 top-0 ">
            </div >

            <div className="bg-black absolute p-4  top-0 right-0 h-screen w-[90%] lg:w-[50rem] overflow-y-auto" >
                {event && event.venue &&
                    < div >
                        <header className="">
                            <hgroup className="">
                                {event && event.venue &&
                                    <div className="">
                                        <h4 className="">
                                            {event.venue.title}
                                        </h4>
                                    </div>
                                }
                                <h1 className="text-7xl mb-4">
                                    {event.summary}
                                </h1>
                                <a className="mb-4 block underline truncate" target="_blank" href={event.url ? event.url : event?.venue.website}>{event.url ? event.url : event?.venue.website}</a>
                            </hgroup>

                            <div className="mb-16">
                                <EventDate start={event.start} end={event.end}></EventDate>
                            </div>

                            <div className="mb-4 flex gap-4 ">
                                {event.tags.map(tag => {
                                    return (
                                        <div className="" key={tag.id}>{tag.title}</div>
                                    )
                                })}
                            </div>
                        </header>
                        {event.venue &&
                            <article className="max-w-[50rem] ">
                                {event.venue.imageUrl &&
                                    <img className="mb-4 w-fit mx-auto" src={event.venue.imageUrl} alt="" />
                                }
                                <pre className="text text-xl break-normal whitespace-break-spaces">
                                    {event.description}
                                </pre>
                            </article>
                        }
                    </div>
                }

            </div>


        </div>
    )
}