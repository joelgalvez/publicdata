
import Link from 'next/link'


export function SearchInput () {
    return (
        <input
            className='px-5 py-1 w-2/3 sm:px-5 sm-py-3 flex-1 text-zinc-200 bg-zinc-800 mt-3 rounded-full'
            placeholder='What are your looking for?'
        />
    )
}

async function SearchEvents () {

    const events = await getEvents();
    return (
      <section className="eventFilter">
        <p className='m-8'>Search results:</p>
        <div className='grid grid-cols-3 gap-8 m-8'>

            {events.map(event => {
            const searchInput = 'workshop'
            const eventSummary = event.summary.toLowerCase()
            const eventDescription = event.description.toLowerCase()

            if (eventSummary.includes(searchInput.toLowerCase()) || eventDescription.includes(searchInput.toLowerCase())) {
                return (
                    <Link
                        href={`/event/${event.id}`}
                        key={event.id} className={'block border-t-2 py-1 border-white min-h-[12rem] ' + (event.imageUrl ? 'row-span-4' : 'row-span-2')} >
                        <div className=" mb-2">
                        {event.Calendar.title}
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
            } else {
                return 'No result found! '
            }
            
            })}

        </div>
      </section >
    )
  };


export default SearchEvents;

async function getEvents() {
    return await prisma.event.findMany({
        include: {
        Calendar: true
        }
    });
}
async function getCalendar(id) {
    return await prisma.calendar.findFirst({
        where: {
        id: id
        }
    });
}