import Link from 'next/link'
import EventDate from './EventDate'
import moment from 'moment';

export default function EventLead(props) {

    let event = props.event;

    return (

        <Link href={`/event/${event.id}`} className={'block border-t-2 py-1 border-white min-h-[12rem] ' + (event.imageUrl ? 'row-span-4' : 'row-span-2')} >
            <div className=" mb-2">
                {event.calendar &&
                    <div className="mb-2">{event.calendar.title}</div>
                }
                <div>
                    <EventDate start={event.start} end={event.end}></EventDate>
                </div>
            </div>
            <div className="text-2xl mb-4 ">
                {event.summary}
            </div>
            <div className="text-sm">
                {event.description}
            </div>
            {/* <pre class="whitespace-break-spaces">
                {JSON.stringify(event, null, 4)}

            </pre> */}
            <div className="">
                {event.imageUrl &&
                    <img src={event.imageUrl} alt="" />
                }
            </div>
        </Link>
    )
}