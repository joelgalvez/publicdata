import prisma from '../../../lib/prisma'

export default async function Page({ params }) {
    const event = await getEvent(parseInt(params.id, 10));
    return (
        <div>
            {/*<pre>
                {JSON.stringify(event, null, 4)}
            </pre>*/}
            
            <div className="mb-2">
                {event.Calendar.title}
            </div>

            <div className="text-2xl mb-4 ">
                {event.summary}
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs mb-4">
                <p>{event.start.toString()}</p>
                <p>{event.end.toString()}</p>
            </div>

            <div className="mb-4 w-100">
                <img src={event.imageUrl} alt="" />
            </div>

            <div className="">
                {event.description}
            </div>
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