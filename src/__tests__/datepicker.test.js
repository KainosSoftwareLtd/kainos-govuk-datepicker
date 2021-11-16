const $ = require('jquery');
const DatePicker = require('../js/datepicker');
const dateFixtures = require('./fixtures/dateFixtures');

const today = new Date();
const previousMonth = new Date();
previousMonth.setMonth(today.getMonth() - 1);

const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const monthsEnglish = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const monthsWelsh = ['Ionawr', 'Chwefror', 'Mawrth', 'Ebrill', 'Mai', 'Mehefin', 'Gorffennaf', 'Awst', 'Medi', 'Hydref',
  'Tachwedd', 'Rhagfyr'];

const getFormattedMonthAndYear = (date, months = monthsEnglish) => {
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${year}`;
};

describe('Date picker', () => {
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
      const datePickerElement = document.querySelector('.date-picker__container');
      const revealButton = document.querySelector('.date-picker__reveal');

      expect(datePickerElement).toBeTruthy();
      expect(revealButton).toBeTruthy();
    };

    it('it should should render with no configuration options', () => {
      DatePicker(document.querySelector('.date-picker'));

      assertRender();
    });

    it('it should render with empty configuration options', () => {
      DatePicker(document.querySelector('.date-picker'), {});

      assertRender();
    });

    it('it should render with partial configuration options', () => {
      DatePicker(document.querySelector('.date-picker'), {
        language: 'cy',
      });

      assertRender();
    });

    it('it should render with full configuration options', () => {
      DatePicker(document.querySelector('.date-picker'), {
        language: 'cy',
        minDate: new Date(),
        maxDate: new Date(),
      });

      assertRender();
    });

    it('it should throw an error when date picker element was not provided', () => {
      expect(() => {
        DatePicker();
      }).toThrow('Date picker not configured correctly');
    });

    it('it should throw an error when an unsupported language is used', () => {
      const unsupportedLanguageKey = 'fr';

      expect(() => {
        DatePicker(document.querySelector('.date-picker'), {
          language: unsupportedLanguageKey,
        });
      }).toThrow(`Date picker does not currently support language ${unsupportedLanguageKey}`);
    });

    it('it should throw an error when min date is not of type date', () => {
      expect(() => {
        DatePicker(document.querySelector('.date-picker'), {
          minDate: '12/05/2005',
        });
      }).toThrow('Date picker min and max dates must be of type Date');
    });

    it('it should throw an error when max date is not of type date', () => {
      expect(() => {
        DatePicker(document.querySelector('.date-picker'), {
          maxDate: '12/10/2050',
        });
      }).toThrow('Date picker min and max dates must be of type Date');
    });
  });

  describe('Date picker visibility', () => {
    it('should hide the calendar on initial load', () => {
      DatePicker(document.querySelector('.date-picker'), {});
      const dialog = document.querySelector('.date-picker__dialog');
      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();
    });

    it('should display the calendar when reveal button is clicked', () => {
      DatePicker(document.querySelector('.date-picker'), {});
      const dialog = document.querySelector('.date-picker__dialog');
      const revealButton = document.querySelector('.date-picker__reveal');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();

      $(revealButton).trigger('click');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeFalsy();
    });

    it('should hide the calendar when the close button is clicked', () => {
      DatePicker(document.querySelector('.date-picker'), {});
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
      DatePicker(document.querySelector('.date-picker'), {});
      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const previousMonthButton = document.querySelector('.date-picker__button__previous-month');

      $(revealButton).trigger('click');

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(previousMonthButton.classList.contains('date-picker__button--disabled')).toBeFalsy();
    });

    it('should disable previous month button when min date is within this month', () => {
      DatePicker(document.querySelector('.date-picker'), {
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
      DatePicker(document.querySelector('.date-picker'), {});

      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const nextMonthButton = document.querySelector('.date-picker__button__next-month');

      $(revealButton).trigger('click');

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(nextMonthButton.tabIndex).toEqual(0);
      expect(nextMonthButton.classList.contains('date-picker__button--disabled')).toBeFalsy();
    });

    it('should disable next month button when max date is within this month', () => {
      DatePicker(document.querySelector('.date-picker'), {
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

    it('should navigate between previous and next month', () => {
      DatePicker(document.querySelector('.date-picker'), {});

      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const previousMonthButton = document.querySelector('.date-picker__button__previous-month');
      const nextMonthButtonButton = document.querySelector('.date-picker__button__next-month');

      $(revealButton).trigger('click');

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(previousMonthButton.tabIndex).toEqual(0);
      expect(previousMonthButton.classList.contains('date-picker__button--disabled')).toBeFalsy();

      $(nextMonthButtonButton).trigger('click');

      expect($(heading).text()).toEqual(nextMonthAsFormattedMonthYear);
      expect(previousMonthButton.tabIndex).toEqual(0);
      expect(previousMonthButton.classList.contains('date-picker__button--disabled')).toBeFalsy();

      $(previousMonthButton).trigger('click');

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(previousMonthButton.tabIndex).toEqual(0);
      expect(previousMonthButton.classList.contains('date-picker__button--disabled')).toBeFalsy();
    });

    it('should keep focus on previous month button when clicked', () => {
      DatePicker(document.querySelector('.date-picker'), {});

      const previousMonthButton = document.querySelector('.date-picker__button__previous-month');
      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');
      $(previousMonthButton).trigger('click');

      expect(previousMonthButton === document.activeElement).toBeTruthy();
    });

    it('should keep focus on next month button when clicked', () => {
      DatePicker(document.querySelector('.date-picker'), {});

      const nextMonthButtonButton = document.querySelector('.date-picker__button__next-month');
      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');
      $(nextMonthButtonButton).trigger('click');

      expect(nextMonthButtonButton === document.activeElement).toBeTruthy();
    });
  });

  describe('Date selection', () => {
    it('should set focus on today when date inputs are empty', () => {
      DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).trigger('click');

      const todayDateButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      expect(todayDateButton.tabIndex).toEqual(0);
      expect(todayDateButton === document.activeElement).toBeTruthy();
      expect(todayDateButton.classList.contains('date__button--today')).toBeTruthy();
    });

    it('should insert selected date into date inputs', () => {
      DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');
      const radix = 10;

      $(revealButton).trigger('click');

      const todayDateButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      $(todayDateButton).trigger('click');

      expect(parseInt($(dayInput).val(), radix)).toEqual(today.getDate());
      expect(parseInt($(monthInput).val(), radix)).toEqual(today.getMonth() + 1);
      expect(parseInt($(yearInput).val(), radix)).toEqual(today.getFullYear());
    });

    it('should allow for selection of tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      DatePicker(document.querySelector('.date-picker'), {});

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
      DatePicker(document.querySelector('.date-picker'), {});

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
      const nextMonthWithSetDay = new Date();
      nextMonthWithSetDay.setDate(10);
      nextMonthWithSetDay.setMonth(today.getMonth() + 1);

      DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(nextMonthWithSetDay.getDate());
      $(monthInput).val(nextMonthWithSetDay.getMonth() + 1);
      $(yearInput).val(nextMonthWithSetDay.getFullYear());

      $(revealButton).trigger('click');

      const nextMonthButton = document.querySelector(`[data-test-id="${nextMonthWithSetDay.toLocaleDateString()}"]`);

      expect(nextMonthButton === document.activeElement).toBeTruthy();
      expect(nextMonthButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day next month', () => {
      const previousMonthWithSetDay = new Date();
      previousMonthWithSetDay.setDate(10);
      previousMonthWithSetDay.setMonth(today.getMonth() - 1);

      DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(previousMonthWithSetDay.getDate());
      $(monthInput).val(previousMonthWithSetDay.getMonth() + 1);
      $(yearInput).val(previousMonthWithSetDay.getFullYear());

      $(revealButton).trigger('click');

      const previousMonthButton = document.querySelector(`[data-test-id="${previousMonthWithSetDay.toLocaleDateString()}"]`);

      expect(previousMonthButton === document.activeElement).toBeTruthy();
      expect(previousMonthButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day next year', () => {
      const nextYear = new Date();
      nextYear.setDate(10);
      nextYear.setFullYear(today.getFullYear() + 1);

      DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(nextYear.getDate());
      $(monthInput).val(nextYear.getMonth() + 1);
      $(yearInput).val(nextYear.getFullYear());

      $(revealButton).trigger('click');

      const nextYearButton = document.querySelector(`[data-test-id="${nextYear.toLocaleDateString()}"]`);

      expect(nextYearButton === document.activeElement).toBeTruthy();
      expect(nextYearButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day last year', () => {
      const previousYear = new Date();
      previousYear.setDate(10);
      previousYear.setFullYear(today.getFullYear() + 1);

      DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(previousYear.getDate());
      $(monthInput).val(previousYear.getMonth() + 1);
      $(yearInput).val(previousYear.getFullYear());

      $(revealButton).trigger('click');

      const previousYearButton = document.querySelector(`[data-test-id="${previousYear.toLocaleDateString()}"]`);

      expect(previousYearButton === document.activeElement).toBeTruthy();
      expect(previousYearButton.tabIndex).toEqual(0);
    });

    it('should set focus on today when date inputs are incorrectly formatted', () => {
      DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(40);
      $(monthInput).val(today.getMonth() + 1);
      $(yearInput).val(today.getFullYear());

      $(revealButton).trigger('click');

      const todayDateButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      expect(todayDateButton === document.activeElement).toBeTruthy();
      expect(todayDateButton.tabIndex).toEqual(0);
      expect(todayDateButton.classList.contains('date__button--today')).toBeTruthy();
    });
  });

  describe('Date ranges', () => {
    const maxDate = new Date();
    maxDate.setDate(10);
    maxDate.setMonth(today.getMonth() + 1);

    it('should disable interaction with days before min date', () => {
      DatePicker(document.querySelector('.date-picker'), {
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
      const maxDatePlusDay = new Date();
      maxDatePlusDay.setDate(11);
      maxDatePlusDay.setMonth(today.getMonth() + 1);

      DatePicker(document.querySelector('.date-picker'), { maxDate });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');
      const nextMonthButton = document.querySelector('.date-picker__button__next-month');

      $(revealButton).trigger('click');
      $(nextMonthButton).trigger('click');

      const disabledButton = document.querySelector(`[data-test-id="${maxDatePlusDay.toLocaleDateString()}"]`);

      expect(disabledButton.tabIndex).toEqual(-1);
      expect(disabledButton.getAttribute('aria-disabled')).toBeTruthy();
      expect(disabledButton.classList.contains('date__button--disabled')).toBeTruthy();

      $(disabledButton).trigger('click');

      expect($(dayInput).val()).toEqual('');
      expect($(monthInput).val()).toEqual('');
      expect($(yearInput).val()).toEqual('');
    });

    it('should default focus day to min date when input dates are before min date', () => {
      DatePicker(document.querySelector('.date-picker'), {
        minDate: today,
      });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(yesterday.getDate());
      $(monthInput).val(yesterday.getMonth() + 1);
      $(yearInput).val(yesterday.getFullYear());

      $(revealButton).trigger('click');

      const todayButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      expect(todayButton.tabIndex).toEqual(0);
      expect(todayButton === document.activeElement).toBeTruthy();
      expect(todayButton.getAttribute('aria-disabled')).toBeFalsy();
      expect(todayButton.classList.contains('date__button--disabled')).toBeFalsy();
    });

    it('should default focus day to max date when input dates exceed max date', () => {
      DatePicker(document.querySelector('.date-picker'), { maxDate });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(maxDate.getDate() + 1);
      $(monthInput).val(maxDate.getMonth() + 1);
      $(yearInput).val(maxDate.getFullYear());

      $(revealButton).trigger('click');

      const maxDateButton = document.querySelector(`[data-test-id="${maxDate.toLocaleDateString()}"]`);

      expect(maxDateButton.tabIndex).toEqual(0);
      expect(maxDateButton === document.activeElement).toBeTruthy();
      expect(maxDateButton.getAttribute('aria-disabled')).toBeFalsy();
      expect(maxDateButton.classList.contains('date__button--disabled')).toBeFalsy();
    });

    it('should display days outside of current month', () => {
      const nov192021 = new Date('November 19, 2021 23:15:30');
      const oct312021 = new Date('October 31, 2021 23:15:30');
      const dec012022 = new Date('October 31, 2021 23:15:30');
      const dec022022 = new Date('October 31, 2021 23:15:30');
      const dec032022 = new Date('October 31, 2021 23:15:30');
      const dec042022 = new Date('October 31, 2021 23:15:30');

      DatePicker(document.querySelector('.date-picker'), {});

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(nov192021.getDate());
      $(monthInput).val(nov192021.getMonth() + 1);
      $(yearInput).val(nov192021.getFullYear());

      $(revealButton).trigger('click');

      const oct312021Button = document.querySelector(`[data-test-id="${oct312021.toLocaleDateString()}"]`);
      const dec012022Button = document.querySelector(`[data-test-id="${dec012022.toLocaleDateString()}"]`);
      const dec022022Button = document.querySelector(`[data-test-id="${dec022022.toLocaleDateString()}"]`);
      const dec032022Button = document.querySelector(`[data-test-id="${dec032022.toLocaleDateString()}"]`);
      const dec042022Button = document.querySelector(`[data-test-id="${dec042022.toLocaleDateString()}"]`);

      const dateButtons = [oct312021Button, dec012022Button, dec022022Button, dec032022Button,
        dec042022Button];

      dateButtons.forEach((dateButton) => {
        expect(dateButton.tabIndex).toEqual(-1);
        expect(dateButton.getAttribute('aria-disabled')).toBeFalsy();
        expect(dateButton.classList.contains('date__button--inactive')).toBeTruthy();
      });
    });

    describe('English / Welsh translations', () => {
      it('should render in English', () => {
        DatePicker(document.querySelector('.date-picker'), {});

        const revealButton = document.querySelector('.date-picker__reveal');
        const heading = document.querySelector('.date-picker__heading');

        $(revealButton).trigger('click');

        expect(heading.textContent.includes(getFormattedMonthAndYear(today))).toBeTruthy();
      });

      it('should render in Welsh', () => {
        DatePicker(document.querySelector('.date-picker'), {
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

    describe('Date grid', () => {
      const getDateFromString = (date) => {
        const day = date.split('/', 1)[0];
        const month = date.split('/', 2)[1];
        const year = date.split('/', 3)[2];

        return new Date(year, (month - 1), day);
      };

      const assertGrid = (fixture) => {
        DatePicker(document.querySelector('.date-picker'), {});

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

        let button;
        fixture.dates.forEach((date) => {
          button = document.querySelector(`[data-test-id="${getDateFromString(date).toLocaleDateString()}"]`);
          expect(button).toBeTruthy();
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
    });
  });
});
