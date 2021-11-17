const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getFormattedMonthAndYear = (date) => {
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};

Feature('Date picker');

Scenario('it should close calendar on press of the ESC key', ({ I }) => {
  I.amOnPage('');
  I.click('Choose date');
  I.seeElement('.date-picker__dialog');
  I.pressKey('Escape');
  I.dontSeeElement('.date-picker__dialog');
});

Scenario('it close the calendar when DOM elements outside of the calendar are clicked', async ({ I }) => {
  I.amOnPage('');
  I.click('Choose date');
  I.seeElement('.date-picker__dialog');
  I.click('#passport-issued-day');
  I.dontSeeElement('.date-picker__dialog');
});

Scenario('it should allow navigation & selection of a date using keyboard only', async ({ I }) => {
  const selectedDate = new Date('2021-11-15');
  selectedDate.setDate(selectedDate.getDate() + 7); // Simulates DOWN keypress
  selectedDate.setDate(selectedDate.getDate() + 1); // Simulates RIGHT keypress
  selectedDate.setDate(selectedDate.getDate() - 1); // Simulates LEFT keypress
  selectedDate.setDate(selectedDate.getDate() + 7); // Simulates DOWN keypress
  selectedDate.setDate(selectedDate.getDate() - 7); // Simulates UP keypress

  I.amOnPage('');

  await I.seeElement('#passport-issued-day');
  await I.fillField('#passport-issued-day', '15');
  await I.fillField('#passport-issued-month', '11');
  await I.fillField('#passport-issued-year', '2021');

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

Scenario('it should allow for navigation to the previous month using left arrow key only', async ({ I }) => {
  const currentMonth = new Date('2021-11-01');
  const previousMonth = new Date('2021-10-31');
  I.amOnPage('');

  await I.seeElement('#passport-issued-day');
  await I.fillField('#passport-issued-day', '1');
  await I.fillField('#passport-issued-month', '11');
  await I.fillField('#passport-issued-year', '2021');

  I.click('Choose date');
  I.see(getFormattedMonthAndYear(currentMonth));
  I.pressKey('ArrowLeft');
  I.see(getFormattedMonthAndYear(previousMonth));

  I.pressKey('Enter');

  I.seeInField('passport-issued-day', '31');
  I.seeInField('passport-issued-month', '10');
  I.seeInField('passport-issued-year', '2021');
});

Scenario('it should allow for navigation to the previous month using up arrow key only', async ({ I }) => {
  const currentMonth = new Date('2021-11-01');
  const previousMonth = new Date('2021-10-31');
  I.amOnPage('');

  await I.seeElement('#passport-issued-day');
  await I.fillField('#passport-issued-day', '1');
  await I.fillField('#passport-issued-month', '11');
  await I.fillField('#passport-issued-year', '2021');

  I.click('Choose date');
  I.see(getFormattedMonthAndYear(currentMonth));
  I.pressKey('ArrowUp');
  I.see(getFormattedMonthAndYear(previousMonth));

  I.pressKey('Enter');

  I.seeInField('passport-issued-day', '31');
  I.seeInField('passport-issued-month', '10');
  I.seeInField('passport-issued-year', '2021');
});

Scenario('it should allow for navigation to the next month using right key only', async ({ I }) => {
  const currentMonth = new Date('2021-10-31');
  const nextMonth = new Date('2021-11-01');
  I.amOnPage('');

  await I.seeElement('#passport-issued-day');
  await I.fillField('#passport-issued-day', '31');
  await I.fillField('#passport-issued-month', '10');
  await I.fillField('#passport-issued-year', '2021');

  I.click('Choose date');
  I.see(getFormattedMonthAndYear(currentMonth));
  I.pressKey('ArrowRight');
  I.see(getFormattedMonthAndYear(nextMonth));

  I.pressKey('Enter');

  I.seeInField('passport-issued-day', '01');
  I.seeInField('passport-issued-month', '11');
  I.seeInField('passport-issued-year', '2021');
});

Scenario('it should allow for navigation to the next month using down arrow key only', async ({ I }) => {
  const currentMonth = new Date('2021-10-31');
  const nextMonth = new Date('2021-11-01');
  I.amOnPage('');

  await I.seeElement('#passport-issued-day');
  await I.fillField('#passport-issued-day', '31');
  await I.fillField('#passport-issued-month', '10');
  await I.fillField('#passport-issued-year', '2021');

  I.click('Choose date');
  I.see(getFormattedMonthAndYear(currentMonth));
  I.pressKey('ArrowDown');
  I.see(getFormattedMonthAndYear(nextMonth));

  I.pressKey('Enter');

  I.seeInField('passport-issued-day', '01');
  I.seeInField('passport-issued-month', '11');
  I.seeInField('passport-issued-year', '2021');
});
