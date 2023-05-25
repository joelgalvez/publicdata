import prisma from '../lib/prisma'
<<<<<<< Updated upstream
=======
import Link from 'next/link'
//import TagFilter from '../features/components/tags.tsx'

function TagFilter () {
  return (
    <div className='f_wrapper bg-red-400 block h-1/2'>
      asasas
    </div>
  );
}

export function FilterNav () {
  return (
    <TagFilter />
  );
}
>>>>>>> Stashed changes

export default async function Home() {

  const events = await getEvents();


  return (
    <main className="grid grid-cols-3 gap-8 m-8">
      {events.map(event => {
        return (
          <div key={event.id} className={'border-t-2 py-1 border-white min-h-[12rem] ' + (event.imageUrl ? 'row-span-4' : 'row-span-2')} >
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
          </div>
        )
      })}
    </main >
  )
}


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
