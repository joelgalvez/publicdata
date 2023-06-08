import prisma from '../../../lib/prisma'

//custom styles here
import styles from './template.module.css'

const formatedDate = (date) => {
    const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
        timeZone: "CET"
    };
    const dateTimeFormat = new Intl.DateTimeFormat('en-US', options);

    const parts = dateTimeFormat.formatToParts(date);
    const partValues = parts.map(p => p.value);

    return partValues;
}

export default async function Page({ params }) {
    const event = await getEvent(parseInt(params.id, 10));
    return (
        <div className="event_wrapper font-sans px-5">
            {/*<pre>
                {JSON.stringify(event, null, 4)}
            </pre>*/}

            <header className={styles.event_header}>

                <hgroup className="text-center">
                    <h4 className="text-sm font-thin mb-2 uppercase tracking-wider">
                        {event.Calendar.title}
                    </h4>

                    <h1 className="text-7xl mb-4">
                        {event.summary}
                    </h1>
                </hgroup>

                <div className="event_period text-sm grid grid-cols-2 gap-10 mb-4 uppercase">

                    <p className="text-left flex">
                        {formatedDate(event.start).slice(0, 7)}<br />
                        {formatedDate(event.start).slice(7, 11)}
                    </p>

                    <p className="text-right flex justify-end">
                        {formatedDate(event.end).slice(0, 7)}<br />
                        {formatedDate(event.end).slice(7, 11)}
                    </p>

                </div>

            </header>

            <article className={styles.event_content}>

                <img className="mb-4 w-fit mx-auto" src={event.imageUrl} alt="" />

                <p className="text-3xl px-8">
                    {event.description}
                </p>

            </article>
        </div>
    );
}

async function getEvent(id: Number) {
    return await prisma.event.findFirst({
        include: {
            Calendar: true
        },
        where: {
            id: id
        }
    });
}