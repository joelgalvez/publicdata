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

            <div className="fixed bg-opacity-95 bg-black/50 w-full h-screen right-0 top-0 ">
            </div >

            <div className="panel absolute p-4  top-0 right-0 h-screen w-[90%] lg:w-[50rem] overflow-y-auto" >
                {event.venue &&
                    <div className="flex h-12 my-2 items-center gap-3">
                        <div className="w-[2rem] h-[2rem] flex items-center justify-center bg-white">
                            <img loading="lazy" className="" src={`https://www.google.com/s2/favicons?domain=${event.url ? event.url : event.venue.website}&sz=256`} alt="" />
                        </div>
                        <div className="">{event.venue.title}</div>
                    </div>
                }


                {event && event.venue &&
                    < div >
                        <header className="">
                            <hgroup className="">

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
                                {event.imageUrl &&
                                    <img className="mb-4 " src={event.imageUrl} alt="" />
                                }
                                <pre className="text text-xl break-normal whitespace-break-spaces">
                                    {event.description}
                                </pre>
                            </article>
                        }
                    </div>
                }
                {event.scraped &&
                    <div className="my-4 text-sm"> ⚠️ Warning this is scraped data, it&apos;s less reliable</div>
                }


            </div>


        </div>
    )
}