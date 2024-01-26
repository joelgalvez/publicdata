import moment from 'moment';

export function getDays(all) {

    let days = [];

    for (let d = 0; d < 90; d++) {
        let thisDayStarts = moment().startOf('day').add(d, 'days').toDate();
        let thisDayEnds = moment(thisDayStarts).add(24, 'hours').toDate();
        let eventsThisDay = all.filter(e => {
            // if ((e.start >= thisDayStarts && e.start <= thisDayEnds) || (e.end >= thisDayStarts && e.end <= thisDayEnds)) {
            if ((e.end >= thisDayStarts && e.start < thisDayEnds)) {
                return e;
            }
        })
        let day = {
            'id': d,
            'date': thisDayStarts,
            'events': eventsThisDay
        }
        days.push(day);
    }

    return days;

}