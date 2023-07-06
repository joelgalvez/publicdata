import Link from 'next/link'
import moment from 'moment';
import PropTypes from 'prop-types';

type Props = {
    date: Date
}


export default function Day(props: Props) {

    let date = props.date;
    let today = new Date();

    if (
        today.getFullYear() == date.getFullYear() &&
        today.getMonth() == date.getMonth() &&
        today.getDay() == date.getDay()
    ) {
        return 'Today ' + moment(date).format('DD MMM');
    } else if (
        today.getFullYear() == date.getFullYear() &&
        today.getMonth() == date.getMonth() &&
        today.getDay() == date.getDay() - 1
    ) {
        return 'Tomorrow ' + moment(date).format('DD MMMM');
    } else {
        return moment(date).format('DD MMMM')
    }
}

