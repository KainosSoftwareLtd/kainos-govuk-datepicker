const today = new Date();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

Feature('Date picker');

Scenario('it should close date picker dialog on press of the ESC key', ({ I }) => {
  I.amOnPage('');
  I.click('Choose date');
  I.seeElement('.date-picker__dialog');
  I.pressKey('Escape');
  I.dontSeeElement('.date-picker__dialog');
});

Scenario('it should allow navigation & selection of a date using keyboard only', ({ I }) => {
  const selectedDate = new Date();
  selectedDate.setDate(today.getDate() + 7); // Simulates DOWN keypress
  selectedDate.setDate(today.getDate() + 1); // Simulates RIGHT keypress
  selectedDate.setDate(today.getDate() - 1); // Simulates LEFT keypress
  selectedDate.setDate(today.getDate() + 7); // Simulates DOWN keypress
  selectedDate.setDate(today.getDate() + 7); // Simulates UP keypress

  I.amOnPage('');
  I.click('Choose date');
  I.pressKey('ArrowDown');
  I.pressKey('ArrowRight');
  I.pressKey('ArrowLeft');
  I.pressKey('ArrowDown');
  I.pressKey('ArrowUp');

  I.see(getFormattedMonthAndYear(selectedDate));

  I.pressKey('Enter');

  I.seeInField('passport-issued-day', selectedDate.getDate().toString());
  I.seeInField('passport-issued-month', (selectedDate.getMonth() + 1).toString());
  I.seeInField('passport-issued-year', selectedDate.getFullYear().toString());
});

const getFormattedMonthAndYear = date => {
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};
