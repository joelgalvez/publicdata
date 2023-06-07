import prisma from '../../../lib/prisma'

export default async function Page({ params }) {
    const event = await getEvent(parseInt(params.id, 10));
    return (
        <div>
            Hello
            <pre>
                {JSON.stringify(event, null, 4)}
            </pre>
        </div>
    );
}

async function getEvent(id: Number) {
    return await prisma.event.findFirst({
        include: {
            calendar: true
        },
        where: {
            id: id
        }
    });
}