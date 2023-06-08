import Link from 'next/link'

export default function EventLead(props) {

    let event = props.event;

    return (
        <Link href={`/event/${event.id}`} className={'block border-t-2 py-1 border-white min-h-[12rem] ' + (event.imageUrl ? 'row-span-4' : 'row-span-2')} >
            <div className=" mb-2">
                <div className="mb-2">{event.calendar.title}</div>
                <div>
                    {event.start.toString()} - {event.end.toString()}
                </div>
            </div>
            <div className="text-2xl mb-4 ">
                {event.summary}
            </div>
            {/* {JSON.stringify(event)} */}
            <div className="">
                <img src={event.imageUrl} alt="" />
            </div>
        </Link>
    )
}