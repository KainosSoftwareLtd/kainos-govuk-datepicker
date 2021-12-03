import './scss/demo.scss';
import './scss/index.scss';

import datePicker from './js/datepicker';

const today = new Date();
const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);

datePicker(document.querySelector('.date-picker-default'));

datePicker(document.querySelector('.date-picker-min-date'), {
  minDate: today,
});

datePicker(document.querySelector('.date-picker-max-date'), {
  maxDate: nextMonth,
});

datePicker(document.querySelector('.date-picker-date-range'), {
  minDate: today,
  maxDate: nextMonth,
});

datePicker(document.querySelector('.date-picker-welsh'), {
  language: 'cy',
});
