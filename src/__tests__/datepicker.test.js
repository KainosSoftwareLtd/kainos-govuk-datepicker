import $ from 'jquery';
import { DateTime, Settings } from 'luxon';

import datePicker from '../js/datepicker';
import dateFixtures from './fixtures/dateFixtures';

const now = DateTime.now();
const today = now.toJSDate();
const nextMonth = now.plus({ months: 1 }).toJSDate();
const yesterday = now.minus({ days: 1 }).toJSDate();
const tomorrow = now.plus({ days: 1 }).toJSDate();

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const monthsEnglish = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthsWelsh = ['Ionawr', 'Chwefror', 'Mawrth', 'Ebrill', 'Mai', 'Mehefin', 'Gorffennaf', 'Awst', 'Medi', 'Hydref',
  'Tachwedd', 'Rhagfyr'];

const getFormattedMonthAndYear = (date, months = monthsEnglish) => {
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};

describe('Date picker', () => {
  beforeAll(() => {
    Settings.defaultZone = 'utc';
    Settings.defaultLocale = 'en-gb';
  });

  beforeEach(() => {
    document.body.innerHTML = `
   <div class="date-picker">
     <fieldset>
       <div>
         <div>
           <div class="govuk-form-group">
             <label for="passport-issued-day">Day</label>
             <input class="date-picker-day" id="passport-issued-day" name="passport-issued-day"/>
           </div>
         </div>
         <div>
           <div>
             <label for="passport-issued-month">Month</label>
             <input class="date-picker-month" id="passport-issued-month" name="passport-issued-month" />
           </div>
          </div>
         <div>
           <div>
             <label for="passport-issued-year">Year</label>
             <input class="date-picker-year" id="passport-issued-year" name="passport-issued-year" type="text">
           </div>
         </div>
       </div>
     </fieldset>
   </div>`;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Initialisation', () => {
    const assertRender = () => {
      const revealButton = document.querySelector('.date-picker__reveal');
      const revealButtonIcon = document.querySelector('.date-picker__reveal__icon');

      expect(revealButton).toBeTruthy();
      expect(revealButtonIcon).toBeFalsy();
    };

    const assertIconRender = () => {
      const revealButtonIcon = document.querySelector('.date-picker__reveal__icon');
      const revealButton = document.querySelector('.date-picker__reveal');

      expect(revealButtonIcon).toBeTruthy();
      expect(revealButton).toBeFalsy();
    };

    it('should render with no configuration options', () => {
      datePicker(document.querySelector('.date-picker'));

      assertRender();
    });

    it('should render with empty configuration options', () => {
      datePicker(document.querySelector('.date-picker'), {});

      assertRender();
    });

    it('should render with partial configuration options', () => {
      datePicker(document.querySelector('.date-picker'), {
        language: 'cy',
      });

      assertRender();
    });

    it('should render with full configuration options', () => {
      datePicker(document.querySelector('.date-picker'), {
        language: 'cy',
        minDate: yesterday,
        maxDate: tomorrow,
        icon: 'location',
        theme: 'test-theme',
      });

      assertIconRender();
    });

    it('should throw an error when date picker element was not provided', () => {
      expect(() => {
        datePicker();
      }).toThrow('Date picker not configured correctly');
    });

    it('should throw an error when an unsupported language is used', () => {
      const unsupportedLanguageKey = 'fr';

      expect(() => {
        datePicker(document.querySelector('.date-picker'), {
          language: unsupportedLanguageKey,
        });
      }).toThrow(`Date picker does not currently support language ${unsupportedLanguageKey}`);
    });

    it('should throw an error when min date is not of type date', () => {
      expect(() => {
        datePicker(document.querySelector('.date-picker'), {
          minDate: '12/05/2005',
        });
      }).toThrow('Date picker min and max dates must be of type Date');
    });

    it('should throw an error when max date is not of type date', () => {
      expect(() => {
        datePicker(document.querySelector('.date-picker'), {
          maxDate: '12/10/2050',
        });
      }).toThrow('Date picker min and max dates must be of type Date');
    });

    it('should throw an error when min date is greater than max date', () => {
      expect(() => {
        datePicker(document.querySelector('.date-picker'), {
          minDate: tomorrow,
          maxDate: yesterday,
        });
      }).toThrow('Date picker min date cannot be greater than max date');
    });

    const scenarios = [
      {
        element: 'day',
        day: 'irrelevant',
        month: 'date-picker-month',
        year: 'date-picker-year',
      },
      {
        element: 'month',
        day: 'date-picker-day',
        month: 'irrelevant',
        year: 'date-picker-year',
      },
      {
        element: 'year',
        day: 'date-picker-day',
        month: 'date-picker-month',
        year: 'irrelevant',
      },
    ];
    scenarios.forEach((scenario) => {
      it(`should throw an error when the ${scenario.element} element is not accessible`, () => {
        document.body.innerHTML = `
          <div class="irrelevant">
            <div class="${scenario.day}"></div>
            <div class="${scenario.month}"></div>
            <div class="${scenario.year}"></div>
          </div>`;
        expect(() => {
          datePicker(document.querySelector('.irrelevant'));
        }).toThrow('Date picker not configured correctly');
      });
    });
  });

  describe('Date picker visibility', () => {
    it('should hide the calendar on initial load', () => {
      datePicker(document.querySelector('.date-picker'), {});
      const dialog = document.querySelector('.date-picker__dialog');
      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();
    });

    it('should display the calendar when reveal button is clicked', () => {
      datePicker(document.querySelector('.date-picker'), {});
      const dialog = document.querySelector('.date-picker__dialog');
      const revealButton = document.querySelector('.date-picker__reveal');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();

      $(revealButton).trigger('click');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeFalsy();
    });

    it('should hide the calendar when the close button is clicked', () => {
      datePicker(document.querySelector('.date-picker'), {});
      const dialog = document.querySelector('.date-picker__dialog');
      const revealButton = document.querySelector('.date-picker__reveal');
      const closeButton = document.querySelector('.date-picker__button__close');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();

      $(revealButton).trigger('click');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeFalsy();

      $(closeButton).trigger('click');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();
      expect(revealButton === document.activeElement).toBeTruthy();
    });
  });

  describe('Previous / next month button', () => {
    const todayAsFormattedMonthYear = getFormattedMonthAndYear(today);
    const nextMonthAsFormattedMonthYear = getFormattedMonthAndYear(nextMonth);

    it('should enabled previous month button by default', () => {
      datePicker(document.querySelector('.date-picker'), {});
      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const previousMonthButton = document.querySelector('.date-picker__button__previous-month');

      $(revealButton).trigger('click');

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(previousMonthButton.classList.contains('date-picker__button--disabled')).toBeFalsy();
    });

    it('should disable previous month button when min date is within this month', () => {
      datePicker(document.querySelector('.date-picker'), {
        minDate: today,
      });

      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const previousMonthButton = document.querySelector('.date-picker__button__previous-month');

      $(revealButton).trigger('click');

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(previousMonthButton.tabIndex).toEqual(-1);
      expect(previousMonthButton.getAttribute('aria-disabled')).toBeTruthy();
      expect(previousMonthButton.classList.contains('date-picker__button--disabled')).toBeTruthy();
    });

    it('should enable next month button by default', () => {
      datePicker(document.querySelector('.date-picker'), {});

      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const nextMonthButton = document.querySelector('.date-picker__button__next-month');

      $(revealButton).trigger('click');

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(nextMonthButton.tabIndex).toEqual(0);
      expect(nextMonthButton.classList.contains('date-picker__button--disabled')).toBeFalsy();
    });

    it('should disable next month button when max date is within this month', () => {
      datePicker(document.querySelector('.date-picker'), {
        maxDate: nextMonth,
      });

      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const nextMonthButton = document.querySelector('.date-picker__button__next-month');

      $(revealButton).trigger('click');
      $(nextMonthButton).trigger('click');

      expect($(heading).text()).toEqual(nextMonthAsFormattedMonthYear);
      expect(nextMonthButton.tabIndex).toEqual(-1);
      expect(nextMonthButton.getAttribute('aria-disabled')).toBeTruthy();
      expect(nextMonthButton.classList.contains('date-picker__button--disabled')).toBeTruthy();
    });

    // eslint-disable-next-line max-len
    const generateMonthTransitionScenario = (year, monthIndex, changedYear, changedMonthIndex, modifier) => ({
      before: {
        year,
        index: monthIndex,
      },
      after: {
        year: changedYear || year,
        index: changedMonthIndex !== undefined ? changedMonthIndex : monthIndex + modifier,
      },
    });

    // eslint-disable-next-line max-len
    const generatePreviousMonthScenario = (year, monthIndex, previousYear, previousMonthIndex) => generateMonthTransitionScenario(year, monthIndex, previousYear, previousMonthIndex, -1);
    const previousMonthScenarios = [
      generatePreviousMonthScenario('2021', 0, '2020', 11),
      generatePreviousMonthScenario('2021', 1),
      generatePreviousMonthScenario('2021', 2),
      generatePreviousMonthScenario('2021', 3),
      generatePreviousMonthScenario('2021', 4),
      generatePreviousMonthScenario('2021', 5),
      generatePreviousMonthScenario('2021', 6),
      generatePreviousMonthScenario('2021', 7),
      generatePreviousMonthScenario('2021', 8),
      generatePreviousMonthScenario('2021', 9),
      generatePreviousMonthScenario('2021', 10),
      generatePreviousMonthScenario('2021', 11),
    ];
    previousMonthScenarios.forEach(({ before, after }) => {
      it(`should navigate from ${monthsEnglish[before.index]} ${before.year} to ${monthsEnglish[after.index]} ${after.year} when the previous button is clicked`, () => {
        datePicker(document.querySelector('.date-picker'), {});

        const heading = document.querySelector('.date-picker__heading');
        const revealButton = document.querySelector('.date-picker__reveal');
        const previousMonthButton = document.querySelector('.date-picker__button__previous-month');
        const dayInput = document.querySelector('.date-picker-day');
        const monthInput = document.querySelector('.date-picker-month');
        const yearInput = document.querySelector('.date-picker-year');

        $(dayInput).val('12');
        $(monthInput).val(`${before.index + 1}`);
        $(yearInput).val(before.year);

        $(revealButton).trigger('click');

        expect($(heading).text()).toEqual(`${monthsEnglish[before.index]} ${before.year}`);

        $(previousMonthButton).trigger('click');

        expect($(heading).text()).toEqual(`${monthsEnglish[after.index]} ${after.year}`);
      });
    });

    // eslint-disable-next-line max-len
    const generateNextMonthScenario = (year, monthIndex, nextYear, nextMonthIndex) => generateMonthTransitionScenario(year, monthIndex, nextYear, nextMonthIndex, 1);
    const nextMonthScenarios = [
      generateNextMonthScenario('2021', 0),
      generateNextMonthScenario('2021', 1),
      generateNextMonthScenario('2021', 2),
      generateNextMonthScenario('2021', 3),
      generateNextMonthScenario('2021', 4),
      generateNextMonthScenario('2021', 5),
      generateNextMonthScenario('2021', 6),
      generateNextMonthScenario('2021', 7),
      generateNextMonthScenario('2021', 8),
      generateNextMonthScenario('2021', 9),
      generateNextMonthScenario('2021', 10),
      generateNextMonthScenario('2021', 11, '2022', 0),
    ];
    nextMonthScenarios.forEach(({ before, after }) => {
      it(`should navigate from ${monthsEnglish[before.index]} ${before.year} to ${monthsEnglish[after.index]} ${after.year} when the next button is clicked`, () => {
        datePicker(document.querySelector('.date-picker'), {});

        const heading = document.querySelector('.date-picker__heading');
        const revealButton = document.querySelector('.date-picker__reveal');
        const nextMonthButtonButton = document.querySelector('.date-picker__button__next-month');
        const dayInput = document.querySelector('.date-picker-day');
        const monthInput = document.querySelector('.date-picker-month');
        const yearInput = document.querySelector('.date-picker-year');

        $(dayInput).val('12');
        $(monthInput).val(`${before.index + 1}`);
        $(yearInput).val(before.year);

        $(revealButton).trigger('click');

        expect($(heading).text()).toEqual(`${monthsEnglish[before.index]} ${before.year}`);

        $(nextMonthButtonButton).trigger('click');

        expect($(heading).text()).toEqual(`${monthsEnglish[after.index]} ${after.year}`);
      });
    });

    it('should keep focus on previous month button when clicked', () => {
      datePicker(document.querySelector('.date-picker'), {});

      const previousMonthButton = document.querySelector('.date-picker__button__previous-month');
      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');
      $(previousMonthButton).trigger('click');

      expect(previousMonthButton === document.activeElement).toBeTruthy();
    });

    it('should keep focus on next month button when clicked', () => {
      datePicker(document.querySelector('.date-picker'), {});

      const nextMonthButtonButton = document.querySelector('.date-picker__button__next-month');
      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');
      $(nextMonthButtonButton).trigger('click');

      expect(nextMonthButtonButton === document.activeElement).toBeTruthy();
    });
  });

  describe('Date selection', () => {
    it('should allow for selection of tomorrow', () => {
      datePicker(document.querySelector('.date-picker'), {});

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(tomorrow.getDate());
      $(monthInput).val(tomorrow.getMonth() + 1);
      $(yearInput).val(tomorrow.getFullYear());

      $(revealButton).trigger('click');

      const tomorrowButton = document.querySelector(`[data-test-id="${tomorrow.toLocaleDateString()}"]`);

      expect(tomorrowButton === document.activeElement).toBeTruthy();
      expect(tomorrowButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of yesterday', () => {
      datePicker(document.querySelector('.date-picker'), {});

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(yesterday.getDate());
      $(monthInput).val(yesterday.getMonth() + 1);
      $(yearInput).val(yesterday.getFullYear());

      $(revealButton).trigger('click');

      const yesterdayButton = document.querySelector(`[data-test-id="${yesterday.toLocaleDateString()}"]`);

      expect(yesterdayButton === document.activeElement).toBeTruthy();
      expect(yesterdayButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day next month', () => {
      const nextMonthWithSetDay = now.set({ day: 10 }).plus({ months: 1 });

      datePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(nextMonthWithSetDay.day);
      $(monthInput).val(nextMonthWithSetDay.month);
      $(yearInput).val(nextMonthWithSetDay.year);

      $(revealButton).trigger('click');

      const nextMonthButton = document.querySelector(`[data-test-id="${nextMonthWithSetDay.toLocaleString()}"]`);

      expect(nextMonthButton === document.activeElement).toBeTruthy();
      expect(nextMonthButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day next month', () => {
      const previousMonthWithSetDay = now.set({ day: 10 }).minus({ months: 1 });

      datePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(previousMonthWithSetDay.day);
      $(monthInput).val(previousMonthWithSetDay.month);
      $(yearInput).val(previousMonthWithSetDay.year);

      $(revealButton).trigger('click');

      const previousMonthButton = document.querySelector(`[data-test-id="${previousMonthWithSetDay.toLocaleString()}"]`);

      expect(previousMonthButton === document.activeElement).toBeTruthy();
      expect(previousMonthButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day next year', () => {
      const nextYear = now.set({ day: 10 }).plus({ years: 1 });

      datePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(nextYear.day);
      $(monthInput).val(nextYear.month);
      $(yearInput).val(nextYear.year);

      $(revealButton).trigger('click');

      const nextYearButton = document.querySelector(`[data-test-id="${nextYear.toLocaleString()}"]`);

      expect(nextYearButton === document.activeElement).toBeTruthy();
      expect(nextYearButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day last year', () => {
      const previousYear = now.set({ day: 10 }).minus({ years: 1 });

      datePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(previousYear.day);
      $(monthInput).val(previousYear.month);
      $(yearInput).val(previousYear.year);

      $(revealButton).trigger('click');

      const previousYearButton = document.querySelector(`[data-test-id="${previousYear.toLocaleString()}"]`);

      expect(previousYearButton === document.activeElement).toBeTruthy();
      expect(previousYearButton.tabIndex).toEqual(0);
    });
  });

  describe('Read from inputs', () => {
    let revealButton;
    let dayInput;
    let monthInput;
    let yearInput;

    beforeEach(() => {
      datePicker(document.querySelector('.date-picker'), {});
      revealButton = document.querySelector('.date-picker__reveal');
      dayInput = document.querySelector('.date-picker-day');
      monthInput = document.querySelector('.date-picker-month');
      yearInput = document.querySelector('.date-picker-year');
    });

    it('should set focus on today when date inputs are empty', () => {
      $(revealButton).trigger('click');

      const todayDateButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      expect(todayDateButton.tabIndex).toEqual(0);
      expect(todayDateButton === document.activeElement).toBeTruthy();
      expect(todayDateButton.classList.contains('date__button--today')).toBeTruthy();
    });

    it('should set focus on date given with input fields when year has 4 digits', () => {
      $(dayInput).val('12');
      $(monthInput).val('11');
      $(yearInput).val('2021');

      $(revealButton).trigger('click');

      const expectedDate = DateTime.fromObject({ year: 2021, month: 11, day: 12 });
      const focusedDate = document.querySelector(`[data-test-id="${expectedDate.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
    });

    it('should set focus on date given with input fields when year has 2 digits', () => {
      $(dayInput).val('12');
      $(monthInput).val('11');
      $(yearInput).val('21');

      $(revealButton).trigger('click');

      const expectedDate = DateTime.fromObject({ year: 21, month: 11, day: 12 });
      const focusedDate = document.querySelector(`[data-test-id="${expectedDate.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
    });

    it('should set focus on date given with input fields when year has 1 digit', () => {
      $(dayInput).val('12');
      $(monthInput).val('11');
      $(yearInput).val('1');

      $(revealButton).trigger('click');

      const expectedDate = DateTime.fromObject({ year: 1, month: 11, day: 12 });
      const focusedDate = document.querySelector(`[data-test-id="${expectedDate.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
    });

    it('should set focus on today when day input is not a number', () => {
      $(dayInput).val('3 12');
      $(monthInput).val('11');
      $(yearInput).val('2021');

      $(revealButton).trigger('click');

      const focusedDate = document.querySelector(`[data-test-id="${now.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
      expect(focusedDate.tabIndex).toEqual(0);
    });

    it('should set focus on today when month input is not a number', () => {
      $(dayInput).val('15');
      $(monthInput).val('11 20');
      $(yearInput).val('2021');

      $(revealButton).trigger('click');

      const focusedDate = document.querySelector(`[data-test-id="${now.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
      expect(focusedDate.tabIndex).toEqual(0);
    });

    it('should set focus on today when year input is not a number', () => {
      $(dayInput).val('15');
      $(monthInput).val('11');
      $(yearInput).val('20 22');

      $(revealButton).trigger('click');

      const focusedDate = document.querySelector(`[data-test-id="${now.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
      expect(focusedDate.tabIndex).toEqual(0);
    });

    it('should set focus on today when day input is an invalid number', () => {
      $(dayInput).val('1125');
      $(monthInput).val('11');
      $(yearInput).val('2022');

      $(revealButton).trigger('click');

      const focusedDate = document.querySelector(`[data-test-id="${now.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
      expect(focusedDate.tabIndex).toEqual(0);
    });

    it('should set focus on today when month input is an invalid number', () => {
      $(dayInput).val('11');
      $(monthInput).val('13');
      $(yearInput).val('2022');

      $(revealButton).trigger('click');

      const focusedDate = document.querySelector(`[data-test-id="${now.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
      expect(focusedDate.tabIndex).toEqual(0);
    });

    it('should set focus on today when year input is an invalid number', () => {
      $(dayInput).val('11');
      $(monthInput).val('11');
      $(yearInput).val('202220222022202220222022');

      $(revealButton).trigger('click');

      const focusedDate = document.querySelector(`[data-test-id="${now.toLocaleString()}"]`);

      expect(focusedDate === document.activeElement).toBeTruthy();
      expect(focusedDate.tabIndex).toEqual(0);
    });
  });

  describe('Write to inputs', () => {
    let revealButton;
    let dayInput;
    let monthInput;
    let yearInput;

    beforeEach(() => {
      datePicker(document.querySelector('.date-picker'), {});
      revealButton = document.querySelector('.date-picker__reveal');
      dayInput = document.querySelector('.date-picker-day');
      monthInput = document.querySelector('.date-picker-month');
      yearInput = document.querySelector('.date-picker-year');
    });

    it('should insert selected date into date inputs', () => {
      $(revealButton).trigger('click');

      $(document.activeElement).trigger('click');

      const expectedDate = now.toISODate().split('-');
      expect($(dayInput).val()).toEqual(expectedDate[2]);
      expect($(monthInput).val()).toEqual(expectedDate[1]);
      expect($(yearInput).val()).toEqual(expectedDate[0]);
    });

    it('should pad the day value of the selected date when it is only 1 digit', () => {
      $(dayInput).val('1');
      $(monthInput).val('11');
      $(yearInput).val('2021');

      $(revealButton).trigger('click');

      $(document.activeElement).trigger('click');

      expect($(dayInput).val()).toEqual('01');
      expect($(monthInput).val()).toEqual('11');
      expect($(yearInput).val()).toEqual('2021');
    });

    it('should pad the month value of the selected date when it is only 1 digit', () => {
      $(dayInput).val('11');
      $(monthInput).val('1');
      $(yearInput).val('2021');

      $(revealButton).trigger('click');

      $(document.activeElement).trigger('click');

      expect($(dayInput).val()).toEqual('11');
      expect($(monthInput).val()).toEqual('01');
      expect($(yearInput).val()).toEqual('2021');
    });

    it('should pad the year value of the selected date when it is only 1 digit', () => {
      $(dayInput).val('11');
      $(monthInput).val('01');
      $(yearInput).val('1');

      $(revealButton).trigger('click');

      $(document.activeElement).trigger('click');

      expect($(dayInput).val()).toEqual('11');
      expect($(monthInput).val()).toEqual('01');
      expect($(yearInput).val()).toEqual('0001');
    });

    it('should pad the year value of the selected date when it is only 2 digit', () => {
      $(dayInput).val('11');
      $(monthInput).val('01');
      $(yearInput).val('11');

      $(revealButton).trigger('click');

      $(document.activeElement).trigger('click');

      expect($(dayInput).val()).toEqual('11');
      expect($(monthInput).val()).toEqual('01');
      expect($(yearInput).val()).toEqual('0011');
    });

    it('should pad the year value of the selected date when it is only 3 digit', () => {
      $(dayInput).val('11');
      $(monthInput).val('01');
      $(yearInput).val('111');

      $(revealButton).trigger('click');

      $(document.activeElement).trigger('click');

      expect($(dayInput).val()).toEqual('11');
      expect($(monthInput).val()).toEqual('01');
      expect($(yearInput).val()).toEqual('0111');
    });
  });

  describe('Date ranges', () => {
    const maxDate = now.set({ day: 10 }).plus({ months: 1 }).toJSDate();

    it('should disable interaction with days before min date', () => {
      datePicker(document.querySelector('.date-picker'), {
        minDate: today,
      });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(revealButton).trigger('click');

      const yesterdayButton = document.querySelector(`[data-test-id="${yesterday.toLocaleDateString()}"]`);

      expect(yesterdayButton.tabIndex).toEqual(-1);
      expect(yesterdayButton.getAttribute('aria-disabled')).toBeTruthy();
      expect(yesterdayButton.classList.contains('date__button--disabled')).toBeTruthy();

      $(yesterdayButton).trigger('click');

      expect($(dayInput).val()).toEqual('');
      expect($(monthInput).val()).toEqual('');
      expect($(yearInput).val()).toEqual('');
    });

    it('should disable interaction with days after max date', () => {
      const maxDatePlusDay = now.set({ day: 11 }).plus({ months: 1 });

      datePicker(document.querySelector('.date-picker'), { maxDate });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');
      const nextMonthButton = document.querySelector('.date-picker__button__next-month');

      $(revealButton).trigger('click');
      $(nextMonthButton).trigger('click');

      const disabledButton = document.querySelector(`[data-test-id="${maxDatePlusDay.toLocaleString()}"]`);

      expect(disabledButton.tabIndex).toEqual(-1);
      expect(disabledButton.getAttribute('aria-disabled')).toBeTruthy();
      expect(disabledButton.classList.contains('date__button--disabled')).toBeTruthy();

      $(disabledButton).trigger('click');

      expect($(dayInput).val()).toEqual('');
      expect($(monthInput).val()).toEqual('');
      expect($(yearInput).val()).toEqual('');
    });

    it('should default focus day to min date when input dates are before min date', () => {
      const yesterdayMinusOne = now.minus({ days: 1 });

      datePicker(document.querySelector('.date-picker'), {
        minDate: yesterday,
      });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(yesterdayMinusOne.day);
      $(monthInput).val(yesterdayMinusOne.month);
      $(yearInput).val(yesterdayMinusOne.year);

      $(revealButton).trigger('click');

      const yesterdayButton = document.querySelector(`[data-test-id="${yesterday.toLocaleDateString()}"]`);

      expect(yesterdayButton.tabIndex).toEqual(0);
      expect(yesterdayButton === document.activeElement).toBeTruthy();
      expect(yesterdayButton.getAttribute('aria-disabled')).toBeFalsy();
      expect(yesterdayButton.classList.contains('date__button--disabled')).toBeFalsy();
    });

    it('should default focus day to max date when input dates exceed max date', () => {
      const maxDatePlusDay = now.set({ day: 11 }).plus({ months: 1 });

      datePicker(document.querySelector('.date-picker'), {
        maxDate,
      });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(maxDatePlusDay.day);
      $(monthInput).val(maxDatePlusDay.month);
      $(yearInput).val(maxDatePlusDay.year);

      $(revealButton).trigger('click');

      const maxDateButton = document.querySelector(`[data-test-id="${maxDate.toLocaleDateString()}"]`);

      expect(maxDateButton.tabIndex).toEqual(0);
      expect(maxDateButton === document.activeElement).toBeTruthy();
      expect(maxDateButton.getAttribute('aria-disabled')).toBeFalsy();
      expect(maxDateButton.classList.contains('date__button--disabled')).toBeFalsy();
    });

    it('should display days outside of current month', () => {
      const nov192021 = DateTime.fromISO('2021-11-19');
      const oct312021 = DateTime.fromISO('2021-10-31');
      const dec012021 = DateTime.fromISO('2021-12-01');
      const dec022021 = DateTime.fromISO('2021-12-02');
      const dec032021 = DateTime.fromISO('2021-12-03');
      const dec042021 = DateTime.fromISO('2021-12-04');

      datePicker(document.querySelector('.date-picker'), {});

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(nov192021.day);
      $(monthInput).val(nov192021.month);
      $(yearInput).val(nov192021.year);

      $(revealButton).trigger('click');

      const oct312021Button = document.querySelector(`[data-test-id="${oct312021.toLocaleString()}"]`);
      const dec012021Button = document.querySelector(`[data-test-id="${dec012021.toLocaleString()}"]`);
      const dec022021Button = document.querySelector(`[data-test-id="${dec022021.toLocaleString()}"]`);
      const dec032021Button = document.querySelector(`[data-test-id="${dec032021.toLocaleString()}"]`);
      const dec042021Button = document.querySelector(`[data-test-id="${dec042021.toLocaleString()}"]`);

      const dateButtons = [
        oct312021Button, dec012021Button, dec022021Button, dec032021Button, dec042021Button,
      ];

      dateButtons.forEach((dateButton) => {
        expect(dateButton.tabIndex).toEqual(-1);
        expect(dateButton.getAttribute('aria-disabled')).toBeFalsy();
        expect(dateButton.classList.contains('date__button--inactive')).toBeTruthy();
      });
    });

    it('should set focus on maxDate when day and month input is incorrectly formatted beyond maxDate', () => {
      const max = DateTime.fromObject({ year: 2022, month: 6, day: 15 });
      datePicker(document.querySelector('.date-picker'), {
        maxDate: max.toJSDate(),
      });
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val('32');
      $(monthInput).val('13');
      $(yearInput).val('2022');

      $(revealButton).trigger('click');
      const nearestDateButton = document.querySelector(`[data-test-id="${max.toLocaleString()}"]`);

      expect(nearestDateButton === document.activeElement).toBeTruthy();
      expect(nearestDateButton.tabIndex).toEqual(0);
    });
  });

  describe('English / Welsh translations', () => {
    it('should render in English', () => {
      datePicker(document.querySelector('.date-picker'), {});

      const revealButton = document.querySelector('.date-picker__reveal');
      const heading = document.querySelector('.date-picker__heading');

      $(revealButton).trigger('click');

      expect(heading.textContent.includes(getFormattedMonthAndYear(today))).toBeTruthy();
    });

    it('should render in Welsh', () => {
      datePicker(document.querySelector('.date-picker'), {
        language: 'cy',
      });

      const revealButton = document.querySelector('.date-picker__reveal');
      const heading = document.querySelector('.date-picker__heading');

      $(revealButton).trigger('click');

      expect(heading.textContent.includes(
        getFormattedMonthAndYear(today, monthsWelsh),
      )).toBeTruthy();
    });
  });

  describe('Aria message', () => {
    it('should inform the user they cannot select a day in the past', () => {
      datePicker(document.querySelector('.date-picker'), {
        maxDate: today,
      });

      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');

      const dateButton = document.querySelector(`[data-test-id="${tomorrow.toLocaleDateString()}"]`);

      $(dateButton).trigger('click');
      const dialog = document.querySelector('.date-picker__dialog');

      const ariaLiveMessage = dialog.querySelector('.aria-live-message');

      expect(ariaLiveMessage.getAttribute('aria-live')).toEqual('assertive');
      expect(ariaLiveMessage.innerText).toContain('You cannot select a day after');
    });

    it('should inform the user they cannot select a day in the future', () => {
      datePicker(document.querySelector('.date-picker'), {
        maxDate: today,
      });

      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');

      const dateButton = document.querySelector(`[data-test-id="${tomorrow.toLocaleDateString()}"]`);

      $(dateButton).trigger('click');
      const dialog = document.querySelector('.date-picker__dialog');

      const ariaLiveMessage = dialog.querySelector('.aria-live-message');

      expect(ariaLiveMessage.getAttribute('aria-live')).toEqual('assertive');
      expect(ariaLiveMessage.innerText).toContain('You cannot select a day after');
    });
  });

  describe('Theming & Icon', () => {
    it('should append theme class to datepicker container when provided', () => {
      const testClass = 'test';

      datePicker(document.querySelector('.date-picker'), {
        theme: testClass,
      });

      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');

      const container = document.querySelector('.date-picker__container');

      expect(container.classList.contains(testClass)).toBeTruthy();
    });

    it('should append icon class to datepicker container when provided', () => {
      datePicker(document.querySelector('.date-picker'), {
        icon: 'location',
      });

      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');

      const container = document.querySelector('.date-picker__container');

      expect(container.classList.contains('date-picker__container--icon')).toBeTruthy();
    });

    it('should append both theme and icon classes when both theme and icon options provided', () => {
      const testClass = 'test';

      datePicker(document.querySelector('.date-picker'), {
        icon: 'location',
        theme: testClass,
      });

      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');

      const container = document.querySelector('.date-picker__container');

      expect(container.classList.contains(testClass)).toBeTruthy();
      expect(container.classList.contains('date-picker__container--icon')).toBeTruthy();
    });

    it('should focus on the icon when the close button is clicked', () => {
      datePicker(document.querySelector('.date-picker'), {
        icon: 'some/icon/path',
      });
      const dialog = document.querySelector('.date-picker__dialog');
      const revealButton = document.querySelector('.date-picker__reveal__icon');
      const closeButton = document.querySelector('.date-picker__button__close');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();

      $(revealButton).trigger('click');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeFalsy();

      $(closeButton).trigger('click');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();
      expect(revealButton === document.activeElement).toBeTruthy();
    });
  });

  describe('Date grid', () => {
    const assertGrid = (fixture) => {
      datePicker(document.querySelector('.date-picker'), {});

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');
      const heading = document.querySelector('.date-picker__heading');

      $(dayInput).val(fixture.dateInputs.day);
      $(monthInput).val(fixture.dateInputs.month);
      $(yearInput).val(fixture.dateInputs.year);

      $(revealButton).trigger('click');

      expect($(heading).text()).toEqual(fixture.heading);

      fixture.dates.forEach((fixtureDate) => {
        const date = DateTime.fromFormat(fixtureDate, 'dd/MM/yyyy');
        const button = document.querySelector(`[data-test-id="${date.toLocaleString()}"]`);
        expect(button).toBeTruthy();
        expect(button.getAttribute('aria-label'))
          .toContain(`${days[date.weekday - 1]}, ${date.day} ${monthsEnglish[date.month - 1]} ${date.year}`);
      });
    };

    it('should render expected dates (Dec 2021)', () => {
      assertGrid(dateFixtures.dec2021);
    });

    it('should render expected dates (Jan 2022)', () => {
      assertGrid(dateFixtures.jan2022);
    });

    it('should render expected dates (May 2022)', () => {
      assertGrid(dateFixtures.may2022);
    });

    it('should render expected dates (June 2022)', () => {
      assertGrid(dateFixtures.june2022);
    });

    // Check that February correctly renders for leap years
    it('should render expected dates (Feb 2024)', () => {
      assertGrid(dateFixtures.feb2024);
    });

    // Check that dates render when there are exactly 4 weeks with no padding
    it('should render expected dates (Feb 2026)', () => {
      assertGrid(dateFixtures.feb2026);
    });
  });
});
