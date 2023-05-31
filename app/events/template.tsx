import prisma from '../../lib/prisma'
import Link from 'next/link'

//custom styles here
import styles from './template.module.css'

async function SearchEvents () {

  const events = await getEvents();
  return (
    <div className="">
      {events.map(event => {
        const search = 'workshop'
        const hayStack = event.summary.toLowerCase();
        
        if (hayStack.includes(search.toLowerCase())) {
          return (
            <div key={event.id}>
              <div className="mb-2">
                {event.summary}
              </div>
            </div>
          )
        } else {
          return ''
        }
        
      })}
    </div >
  )
};

//Test load stuff from DB
/*async*/ function FilterNav () {
  
  /*
  const events = await getEvents();
  return (
    <div className="grid grid-cols-12 gap-2 m-2">
      {events.map(event => {
        return (
          <div key={event.id}>
            <img
              className="avatar"
              src="https://i.imgur.com/1bX5QH6.jpg"
              alt="Lin Lanying"
              width={50}
              height={50}
            />
          </div>
        )
      })}
    </div >
  )
  */

}

export default function Template({ children }) {
  return (
    <main className='wrappus_maximus'>

      {/* renders db-stuff in here... */}
      <nav className={styles.header}>
        <h1 className='text-red-500 font-bold uppercase text-left text-4xl'>Filter stuff here...</h1>
        <SearchEvents/>
      </nav>

      {/* Here comes the page content */}
      <div className='all_that_page_stuff'>
        {children}
      </div>
    </main>
    );
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
