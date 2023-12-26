import Link from 'next/link'
import EventDate from './EventDate'
import moment from 'moment';

export default function EventLead(props) {

    let event = props.event;

    return (
        <Link href={`/event/${event.id}`} className={'block border-t-2 py-1 border-white min-h-[12rem]'}>
            <div className=" mb-2">
                <div className=" float-right ml-4 mb-4">
                    {event.imageUrl &&
                        <img loading="lazy" className="h-24 w-24 object-contain object-right-top" src={event.imageUrl} alt="" />
                    }
                </div>

                {event.venue &&
                    <div className="flex h-12 my-2 items-center gap-3">
                        <div className="w-[2rem] h-[2rem] flex items-center justify-center bg-white">
                            <img loading="lazy" className="" src={`https://www.google.com/s2/favicons?domain=${event.url ? event.url : event.venue.website}&sz=256`} alt="" />
                        </div>
                        <div className="">{event.venue.title}</div>
                    </div>
                }

                <div className='text-xs'>
                    <EventDate start={event.start} end={event.end}></EventDate>
                </div>

            </div>
            <div className="text-2xl mb-4">
                {event.summary}
            </div>
            <div className="text-sm mb-4">
                {event.description.replace(/(<([^>]+)>)/gi, "").substring(0, 100)}...
            </div>
            {event.scraped &&
                <div className="my-4 text-sm"> ⚠️ Scraped event</div>
            }
        </Link>
    )
}