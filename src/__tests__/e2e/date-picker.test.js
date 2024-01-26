const { DateTime } = require('luxon');

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const getFormattedMonthAndYear = (date) => {
  const month = months[date.month - 1];
  return `${month} ${date.year}`;
};

Feature('Date picker');

Before(({ I }) => {
  I.amOnPage('');
});

Scenario('it should close calendar on press of the ESC key', async ({ I }) => {
  await within('.date-picker-default', () => {
    I.click('Choose date');
    I.seeElement('.date-picker__dialog');
    I.pressKey('Escape');
    I.dontSeeElement('.date-picker__dialog');
  });
});

Scenario('it should close the calendar when DOM elements outside of the calendar are clicked', async ({ I }) => {
  await within('.date-picker-default', () => {
    I.click('Choose date');
    I.seeElement('.date-picker__dialog');
    I.click('#example-1-day');
    I.dontSeeElement('.date-picker__dialog');
  });
});

Scenario('it should open the calendar via icon', async ({ I }) => {
  await within('.date-picker-icon', () => {
    I.click({ css: '.date-picker__reveal__icon' });
    I.seeElement('.date-picker__dialog');
  });
});

Scenario('it should allow navigation & selection of a date using keyboard only', async ({ I }) => {
  let selectedDate = DateTime.fromObject({ year: 2021, month: 11, day: 15 });
  selectedDate = selectedDate.plus({ days: 7 }); // Simulates DOWN keypress
  selectedDate = selectedDate.plus({ days: 1 }); // Simulates RIGHT keypress
  selectedDate = selectedDate.minus({ days: 1 }); // Simulates LEFT keypress
  selectedDate = selectedDate.plus({ days: 7 }); // Simulates DOWN keypress
  selectedDate = selectedDate.minus({ days: 7 }); // Simulates UP keypress

  await within('.date-picker-default', async () => {
    await I.seeElement('#example-1-day');
    await I.fillField('#example-1-day', '15');
    await I.fillField('#example-1-month', '11');
    await I.fillField('#example-1-year', '2021');

    I.click('Choose date');
    I.pressKey('ArrowDown');
    I.pressKey('ArrowRight');
    I.pressKey('ArrowLeft');
    I.pressKey('ArrowDown');
    I.pressKey('ArrowUp');

    I.see(getFormattedMonthAndYear(selectedDate));

    I.pressKey('Enter');

    I.seeInField('#example-1-day', selectedDate.day.toString());
    I.seeInField('#example-1-month', selectedDate.month.toString());
    I.seeInField('#example-1-year', selectedDate.year.toString());
  });
});

Scenario('it should allow for navigation to the previous month using left arrow key only', async ({ I }) => {
  const currentMonth = DateTime.fromObject({ year: 2021, month: 11, day: 1 });
  const previousMonth = DateTime.fromObject({ year: 2021, month: 10, day: 31 });
  await within('.date-picker-default', async () => {
    await I.seeElement('#example-1-day');
    await I.fillField('#example-1-day', currentMonth.day.toString());
    await I.fillField('#example-1-month', currentMonth.month.toString());
    await I.fillField('#example-1-year', currentMonth.year.toString());

    I.click('Choose date');
    I.see(getFormattedMonthAndYear(currentMonth));
    I.pressKey('ArrowLeft');
    I.see(getFormattedMonthAndYear(previousMonth));

    I.pressKey('Enter');

    I.seeInField('#example-1-day', previousMonth.day.toString());
    I.seeInField('#example-1-month', previousMonth.month.toString());
    I.seeInField('#example-1-year', previousMonth.year.toString());
  });
});

Scenario('it should allow for navigation to the previous month using up arrow key only', async ({ I }) => {
  const currentMonth = DateTime.fromObject({ year: 2021, month: 11, day: 1 });
  const previousMonth = DateTime.fromObject({ year: 2021, month: 10, day: 31 });

  await within('.date-picker-default', async () => {
    await I.seeElement('#example-1-day');
    await I.fillField('#example-1-day', currentMonth.day.toString());
    await I.fillField('#example-1-month', currentMonth.month.toString());
    await I.fillField('#example-1-year', currentMonth.year.toString());

    I.click('Choose date');
    I.see(getFormattedMonthAndYear(currentMonth));
    I.pressKey('ArrowUp');
    I.see(getFormattedMonthAndYear(previousMonth));

    I.pressKey('Enter');

    I.seeInField('#example-1-day', previousMonth.day.toString());
    I.seeInField('#example-1-month', previousMonth.month.toString());
    I.seeInField('#example-1-year', previousMonth.year.toString());
  });
});

Scenario('it should allow for navigation to the next month using right key only', async ({ I }) => {
  const currentMonth = DateTime.fromObject({ year: 2021, month: 10, day: 31 });
  const nextMonth = DateTime.fromObject({ year: 2021, month: 11, day: 1 });

  await within('.date-picker-default', async () => {
    await I.seeElement('#example-1-day');
    await I.fillField('#example-1-day', currentMonth.day.toString());
    await I.fillField('#example-1-month', currentMonth.month.toString());
    await I.fillField('#example-1-year', currentMonth.year.toString());

    I.click('Choose date');
    I.see(getFormattedMonthAndYear(currentMonth));
    I.pressKey('ArrowRight');
    I.see(getFormattedMonthAndYear(nextMonth));

    I.pressKey('Enter');

    I.seeInField('#example-1-day', nextMonth.day.toString());
    I.seeInField('#example-1-month', nextMonth.month.toString());
    I.seeInField('#example-1-year', nextMonth.year.toString());
  });
});

Scenario('it should allow for navigation to the next month using down arrow key only', async ({ I }) => {
  const currentMonth = DateTime.fromObject({ year: 2021, month: 10, day: 31 });
  const nextMonth = DateTime.fromObject({ year: 2021, month: 11, day: 1 });

  await within('.date-picker-default', async () => {
    await I.seeElement('#example-1-day');
    await I.fillField('#example-1-day', currentMonth.day.toString());
    await I.fillField('#example-1-month', currentMonth.month.toString());
    await I.fillField('#example-1-year', currentMonth.year.toString());

    I.click('Choose date');
    I.see(getFormattedMonthAndYear(currentMonth));
    I.pressKey('ArrowDown');
    I.see(getFormattedMonthAndYear(nextMonth));

    I.pressKey('Enter');

    I.seeInField('#example-1-day', nextMonth.day.toString());
    I.seeInField('#example-1-month', nextMonth.month.toString());
    I.seeInField('#example-1-year', nextMonth.year.toString());
  });
});

Scenario('it should allow for navigation from the close button to the previous month button using tab key only', async ({ I }) => {
  const currentMonth = DateTime.fromObject({ year: 2021, month: 11, day: 1 });
  let focusedElement;
  await within('.date-picker-default', async () => {
    await I.seeElement('#example-1-day');
    await I.fillField('#example-1-day', currentMonth.day.toString());
    await I.fillField('#example-1-month', currentMonth.month.toString());
    await I.fillField('#example-1-year', currentMonth.year.toString());

    I.click('Choose date');
    I.see(getFormattedMonthAndYear(currentMonth));

    I.pressKey('Tab');
    await I.usePuppeteerTo('Get the active element', async ({ page }) => {
      const focusedElementHandle = await page.evaluateHandle(() => document.activeElement);
      focusedElement = await page.evaluate((el) => el.innerText, focusedElementHandle);
    });

    I.assertEqual(focusedElement, 'Cancel');

    I.pressKey('Tab');
    await I.usePuppeteerTo('Get the active element', async ({ page }) => {
      const focusedElementHandle = await page.evaluateHandle(() => document.activeElement);
      focusedElement = await page.evaluate((el) => el.innerText, focusedElementHandle);
    });

    I.assertEqual(focusedElement, 'Previous month');
  });
});

Scenario('it should allow for navigation from the previous month button to close button using shift tab keys only', async ({ I }) => {
  const currentMonth = DateTime.fromObject({ year: 2021, month: 11, day: 1 });
  let focusedElement;
  await within('.date-picker-default', async () => {
    await I.seeElement('#example-1-day');
    await I.fillField('#example-1-day', currentMonth.day.toString());
    await I.fillField('#example-1-month', currentMonth.month.toString());
    await I.fillField('#example-1-year', currentMonth.year.toString());

    I.click('Choose date');
    I.see(getFormattedMonthAndYear(currentMonth));

    I.pressKey(['Shift', 'Tab']);
    I.pressKey(['Shift', 'Tab']);
    await I.usePuppeteerTo('Get the active element', async ({ page }) => {
      const focusedElementHandle = await page.evaluateHandle(() => document.activeElement);
      focusedElement = await page.evaluate((el) => el.innerText, focusedElementHandle);
    });

    I.assertEqual(focusedElement, 'Previous month');

    I.pressKey(['Shift', 'Tab']);
    await I.usePuppeteerTo('Get the active element', async ({ page }) => {
      const focusedElementHandle = await page.evaluateHandle(() => document.activeElement);
      focusedElement = await page.evaluate((el) => el.innerText, focusedElementHandle);
    });

    I.assertEqual(focusedElement, 'Cancel');
  });
});

Scenario('it should not change the value of another date picker when multiple present', async ({ I }) => {
  const today = DateTime.now();
  const baseDate = DateTime.fromObject({ year: 2021, month: 11, day: 15 });
  let selectedDate = baseDate.plus({ days: 7 }); // Simulates DOWN keypress
  selectedDate = selectedDate.plus({ days: 1 }); // Simulates RIGHT keypress
  selectedDate = selectedDate.minus({ days: 1 }); // Simulates LEFT keypress
  selectedDate = selectedDate.plus({ days: 7 }); // Simulates DOWN keypress
  selectedDate = selectedDate.minus({ days: 7 }); // Simulates UP keypress

  await within('.date-picker-default', async () => {
    await I.seeElement('#example-1-day');
    await I.fillField('#example-1-day', baseDate.day.toString());
    await I.fillField('#example-1-month', baseDate.month.toString());
    await I.fillField('#example-1-year', baseDate.year.toString());

    I.click('Choose date');
    I.pressKey('ArrowDown');
    I.pressKey('ArrowRight');
    I.pressKey('ArrowLeft');
    I.pressKey('ArrowDown');
    I.pressKey('ArrowUp');

    I.see(getFormattedMonthAndYear(selectedDate));

    I.pressKey('Enter');

    I.seeInField('#example-1-day', selectedDate.day.toString());
    I.seeInField('#example-1-month', selectedDate.month.toString());
    I.seeInField('#example-1-year', selectedDate.year.toString());
  });

  // Scroll into view
  I.pressKey('ArrowDown');
  I.pressKey('ArrowDown');
  I.pressKey('ArrowDown');
  I.pressKey('ArrowDown');
  I.pressKey('ArrowDown');
  I.pressKey('ArrowDown');
  I.pressKey('ArrowDown');
  I.pressKey('ArrowDown');

  await within('.date-picker-min-date', async () => {
    I.seeInField('#example-2-day', '');
    I.seeInField('#example-2-month', '');
    I.seeInField('#example-2-year', '');

    I.click('Choose date');

    I.pressKey('Enter');

    I.seeInField('#example-2-day', today.day.toString());
    I.seeInField('#example-2-month', today.month.toString());
    I.seeInField('#example-2-year', today.year.toString());
  });

  await within('.date-picker-default', async () => {
    I.seeInField('#example-1-day', selectedDate.day.toString());
    I.seeInField('#example-1-month', selectedDate.month.toString());
    I.seeInField('#example-1-year', selectedDate.year.toString());
  });
});
