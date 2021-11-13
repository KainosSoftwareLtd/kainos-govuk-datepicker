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

Scenario('it should allow for navigation to the previous month using arrow keys only', async ({ I }) => {
  const previousMonth = new Date();
  previousMonth.setMonth(today.getMonth() - 1);

  I.amOnPage('');

  await I.seeElement('#passport-issued-day');
  await I.fillField('#passport-issued-day', '1');
  await I.fillField('#passport-issued-month', today.getMonth() + 1);
  await I.fillField('#passport-issued-year', today.getFullYear());

  I.click('Choose date');
  I.see(getFormattedMonthAndYear(today));
  I.pressKey('ArrowLeft');
  I.see(getFormattedMonthAndYear(previousMonth));
});

Scenario('it should allow for navigation to the next month using arrow keys only', async ({ I }) => {
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth()+1, 0);
  const nextMonth = new Date();
  nextMonth.setMonth(today.getMonth() + 1);

  I.amOnPage('');

  await I.seeElement('#passport-issued-day');
  await I.fillField('#passport-issued-day', lastDayOfMonth.getDate());
  await I.fillField('#passport-issued-month', today.getMonth() + 1);
  await I.fillField('#passport-issued-year', today.getFullYear());

  I.click('Choose date');
  I.see(getFormattedMonthAndYear(today));
  I.pressKey('ArrowRight');
  I.see(getFormattedMonthAndYear(nextMonth));
});

const getFormattedMonthAndYear = date => {
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};
