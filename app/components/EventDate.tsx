import Link from 'next/link'
import moment from 'moment';

// EventDate.propTypes = {
//     start: Date,
//     end: Date
// }

export default function EventDate(props) {

    let start = props.start;
    let end = props.end;

    let dd = '(no date)';

    if (
        start.getYear() == end.getYear() &&
        start.getMonth() == end.getMonth() &&
        start.getDay() == end.getDay()
    ) {
        // same day
        dd = moment(start).format('ddd D') + ' ' + moment(start).format('MMM')
        let h1 = start.getHours();
        let h2 = end.getHours();
        let m1 = start.getMinutes();
        let m2 = end.getMinutes();
        dd += ' ' + moment(start).format('HH:SS');
        if (h1 != h2 && m1 != m2) {
            dd += '-' + moment(end).format('HH:SS');
        }
    } else {
        dd = moment(start).format('DD MMM') + ' — ' + moment(end).format('DD MMM')
    }

    return (
        dd
    )
}

