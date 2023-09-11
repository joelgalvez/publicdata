import EventDate from '../../components/EventDate'
import prisma from '../../../lib/prisma'

export default async function Page({ params }) {
    const event = await getEvent(parseInt(params.id, 10));
    return (
        <div className="m-4 container mx-auto">
            {/* <pre>
                {JSON.stringify(event, null, 4)}
            </pre> */}

            <header className="">
                <hgroup className="">
                    {event.calendar &&
                        <h4 className="">
                            {event.calendar.title}
                        </h4>
                    }
                    <h1 className="text-7xl mb-4">
                        {event.summary}
                    </h1>
                    <a className="mb-4 block underline truncate" target="_blank" href={event.url ? event.url : event?.calendar.website}>{event.url ? event.url : event?.calendar.website}</a>
                </hgroup>

                <div className="mb-16">
                    <EventDate start={event.start} end={event.end}></EventDate>
                </div>

                <div className="text-sm">Event tags</div>
                <div className="mb-4 flex gap-4 ">
                    {event.tags.map(tag => {
                        return (
                            <div className="">{tag.title}</div>
                        )
                    })}
                </div>
            </header>

            <article className="max-w-[50rem] ">
                {event.imageUrl &&
                    <img className="mb-4 w-fit mx-auto" src={event.imageUrl} alt="" />
                }
                <div className="text text-xl " dangerouslySetInnerHTML={{ __html: event.description }}>

                </div>
            </article>
        </div>
    );
}

async function getEvent(id: Number) {
    return await prisma.event.findFirst({
        include: {
            calendar: true,
            tags: true
        },
        where: {
            id: id
        }
    });
}