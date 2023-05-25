import prisma from '../../../lib/prisma'

export default async function Page({ params }) {
    const event = await getEvent(parseInt(params.id, 10));
    return (
        <div>
            <pre>
                {JSON.stringify(event, null, 4)}
            </pre>
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