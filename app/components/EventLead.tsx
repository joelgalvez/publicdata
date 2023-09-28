import Link from 'next/link'
import EventDate from './EventDate'
import moment from 'moment';

export default function EventLead(props) {

    let event = props.event;

    return (
        <Link href={`/event/${event.id}`} className={'block border-t-2 py-1 border-white min-h-[12rem]'}>
            <div className=" mb-2">
                {event.venue &&
                    <div className="flex h-12 my-2 items-center gap-3">
                        <div className="w-[2rem] flex items-center justify-center">
                            <img loading="lazy" className="" src={`https://www.google.com/s2/favicons?domain=${event.venue.website}&sz=256`} alt="" />
                        </div>
                        <div className="">{event.venue.title}</div>
                    </div>
                }
                <div>
                    <EventDate start={event.start} end={event.end}></EventDate>
                </div>
            </div>
            <div className="text-2xl mb-4">
                {event.summary}
            </div>
            <div className="text-sm mb-4">
                {event.description.replace(/(<([^>]+)>)/gi, "").substring(0, 100)}...
            </div>
            <div className="">
                {event.imageUrl &&
                    <img src={event.imageUrl} alt="" />
                }
            </div>
        </Link>
    )
}