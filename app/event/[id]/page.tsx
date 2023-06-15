import EventDate from '../../components/EventDate'
import prisma from '../../../lib/prisma'

//custom styles here
// import styles from './template.module.css'


export default async function Page({ params }) {
    const event = await getEvent(parseInt(params.id, 10));
    return (
        <div className="m-4 container mx-auto">

            {/*<pre>
                {JSON.stringify(event, null, 4)}
            </pre>*/}

            <header className="">

                <hgroup className="text-center">
                    {event.calendar &&
                        <h4 className="text-sm font-thin mb-2 uppercase tracking-wider">
                            {event.calendar.title}
                        </h4>
                    }

                    <h1 className="text-7xl mb-4">
                        {event.summary}
                    </h1>
                </hgroup>

                <div className="m-4 text-center">
                    <EventDate start={event.start} end={event.end}></EventDate>
                </div>

            </header>

            <article className="">

                {event.imageUrl &&
                    <img className="mb-4 w-fit mx-auto" src={event.imageUrl} alt="" />
                }

                <p className="text-3xl px-8">
                    {event.description}
                </p>

            </article>
        </div>
    );
}

async function getEvent(id: Number): Event {
    return await prisma.event.findFirst({
        include: {
            calendar: true
        },
        where: {
            id: id
        }
    });
}