import prisma from '../lib/prisma'
import Link from 'next/link'
import moment from 'moment';
import EventLead from './components/EventLead';
import EventDate from './components/EventDate';
import Day from './components/Day';
import { Darumadrop_One } from 'next/font/google';

export default async function Home() {

  let days = [];
  for (let dayCount = 0; dayCount < 6; dayCount++) {
    let start = moment().add(dayCount, 'days').toDate();
    let end = moment().add(dayCount + 1, 'days').startOf('day').add(4, 'hours').toDate();
    const events = await getEvents(start, end);

    days.push({
      day: start,
      events: events
    });
  }

  let monthStart = moment().add(6, 'days').startOf('day').add(4, 'hours').toDate();
  let monthEnd = moment().add(36, 'days').startOf('day').add(4, 'hours').toDate();

  const month = await getEvents(monthStart, monthEnd);

  console.log(monthStart);
  console.log(monthEnd);


  // let month = await getEvents(monthStart, monthEnd);


  return (
    <>

      {days.map(day => {
        return (
          <div className="">
            <h2 className="text-6xl m-4 mt-16"><Day date={day.day} /></h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 m-4">
              {day.events.map(event => {
                return (
                  <EventLead event={event} />
                )
              })}
            </div>
          </div>
        )
      })}

      <div className="">
        <h2 className="text-6xl m-4 mt-16"><Day date={monthStart} endDate={monthEnd} /></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 m-4">
          {month.map(event => {
            return (
              <EventLead event={event} />
            )
          })}
        </div>
      </div>

    </>
  )
}

async function getEvents(start: Date, end: Date) {
  return await prisma.event.findMany({
    where: {
      start: {
        gt: start
      },
      end: {
        lt: end
      }
    },
    include: {
      calendar: true
    },
    orderBy: {
      start: 'asc'
    }
  });
}

