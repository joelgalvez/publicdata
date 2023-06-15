import prisma from '../lib/prisma'
import Link from 'next/link'
import moment from 'moment';
import EventLead from './components/EventLead';

export default async function Home() {


  // let start = new Date('2023-06-07T00:00:00.000Z');
  // let end = new Date('2023-06-14T00:00:00.000Z');
  // let start = new Date();
  let startToday = moment().startOf('day').toDate();
  let endToday = moment().add(1, 'days').startOf('day').add(4, 'hours').toDate();
  const today = await getEvents(startToday, endToday);

  let startTomorrow = moment().startOf('day').add(1, 'days').toDate();
  let endTomorrow = moment().add(2, 'days').startOf('day').add(4, 'hours').toDate();
  const tomorrow = await getEvents(startTomorrow, endTomorrow);

  let startWeek = moment().startOf('day').toDate();
  let endWeek = moment().add(300, 'days').startOf('day').add(4, 'hours').toDate();
  const week = await getEvents(startWeek, endWeek);


  return (
    <>
      <h1 className="m-4 text-6xl">Today</h1>
      <div className="grid grid-cols-3 gap-8 m-4">
        {today.map(event => {
          return (
            <div className="">
              <EventLead event={event} key={event.id}></EventLead>
            </div>
          )
        })}
      </div>
      <h1 className="m-4 text-6xl">Tomorrow</h1>
      <div className="grid grid-cols-3 gap-8 m-4">
        {tomorrow.map(event => {
          return (
            <div className="">
              <EventLead event={event} key={event.id}></EventLead>
            </div>
          )
        })}
      </div>
      <h1 className="m-4 text-6xl">Week</h1>
      <div className="grid grid-cols-3 gap-8 m-4">
        {week.map(event => {
          return (
            <div className="">
              <EventLead event={event} key={event.id}></EventLead>
            </div>
          )
        })}
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
async function getCalendar(id) {
  return await prisma.calendar.findFirst({
    where: {
      id: id
    }
  });
}
