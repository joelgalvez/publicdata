import EventDate from '../../components/EventDate'
import prisma from '../../../lib/prisma'

export default async function Page({ params }) {
    const event = await getEvent(parseInt(params.id, 10));
    return (
        <div className="fixed bg-black/80 w-full h-screen right-0 top-0 ">
            <div className="bg-black absolute p-4  top-0 right-0 w-[90%] h-screen overflow-y-auto">
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
                                        <div className="">{tag.title}</div>
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

        </div >
    );
}

async function getEvent(id: Number) {
    return await prisma.event.findFirst({
        include: {
            tags: true,
            venue: {
                include: {
                    tags: true
                }
            }
        },
        where: {
            id: id
        }
    });
}