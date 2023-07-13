import Link from 'next/link'
import moment from 'moment';
import PropTypes from 'prop-types';

type Props = {
    date: Date,
    endDate: Date
}


export default function Day(props: Props) {

    let date = props.date;
    let endDate = props.endDate;
    let today = new Date();
    let endDateString = '';
    if (endDate) {
        endDateString = endDate ? ' – ' + moment(endDate).format('DD MMM YYYY') : '';
    }

    if (
        today.getFullYear() == date.getFullYear() &&
        today.getMonth() == date.getMonth() &&
        today.getDay() == date.getDay()
    ) {
        return 'Today ' + moment(date).format('DD MMM') + endDateString;
    } else if (
        today.getFullYear() == date.getFullYear() &&
        today.getMonth() == date.getMonth() &&
        today.getDay() == date.getDay() - 1
    ) {
        return 'Tomorrow ' + moment(date).format('DD MMMM') + endDateString;
    } else {
        return moment(date).format('DD MMMM') + endDateString;
    }
}

