import './scss/demo.scss';
import './scss/index.scss';

const DatePicker = require('./js/datepicker');

const today = new Date();
const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);

DatePicker(document.querySelector('.date-picker-default'));

DatePicker(document.querySelector('.date-picker-min-date'), {
  minDate: today,
});

DatePicker(document.querySelector('.date-picker-max-date'), {
  maxDate: nextMonth,
});

DatePicker(document.querySelector('.date-picker-date-range'), {
  minDate: today,
  maxDate: nextMonth,
});

DatePicker(document.querySelector('.date-picker-welsh'), {
  language: 'cy',
});
