const $ = require('jquery');
const DatePicker = require('../js/datepicker');
const today = new Date();
const previousMonth = new Date();
previousMonth.setMonth(today.getMonth() - 1);

const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

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
  })

  afterEach(() => {
    document.body.innerHTML = '';
  });

  describe('Initialisation', () => {
    it('it should render with empty configuration options', () => {
      new DatePicker(document.querySelector('.date-picker'), {});

      assertRender();
    });

    it('it should render with partial configuration options', () => {
      new DatePicker(document.querySelector('.date-picker'), {
        language: 'cy',
      });

      assertRender();
    });

    it('it should render with full configuration options', () => {
      new DatePicker(document.querySelector('.date-picker'), {
        language: 'cy',
        minDate: new Date(),
        maxDate: new Date()
      });

      assertRender();
    });

    it('it should throw an error when date picker element was not provided', () => {
      expect(() => {
        new DatePicker()
      }).toThrow(`Date picker not configured correctly`);
    });

    it('it should throw an error when configuration options where not provided', () => {
      expect(() => {
        new DatePicker(document.querySelector('.date-picker'))
      }).toThrow(`Date picker not configured correctly`);
    });

    it('it should throw an error when an unsupported language is used', () => {
      const unsupportedLanguageKey = 'fr';

      expect(() => {
        new DatePicker(document.querySelector('.date-picker'), {
          language: unsupportedLanguageKey
        })
      }).toThrow(`Date picker does not currently support language ${unsupportedLanguageKey}`);
    });

    const assertRender = () => {
      const datePickerElement = document.querySelector('.date-picker__container');
      const revealButton = document.querySelector('.date-picker__reveal');

      expect(datePickerElement).toBeTruthy();
      expect(revealButton).toBeTruthy();
    };
  });

  describe('Date picker visibility', () => {
    it('should hide the calendar on initial load', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const dialog = document.querySelector('.date-picker__dialog');
      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();
    });

    it('should display the calendar when reveal button is clicked', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const dialog = document.querySelector('.date-picker__dialog');
      const revealButton = document.querySelector('.date-picker__reveal');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();

      $(revealButton).click();

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeFalsy();
    });

    it('should hide the calendar when the close button is clicked', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const dialog = document.querySelector('.date-picker__dialog');
      const revealButton = document.querySelector('.date-picker__reveal');
      const closeButton = document.querySelector('.date-picker__button__close');

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();

      $(revealButton).click();

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeFalsy();

      $(closeButton).click();

      expect(dialog.classList.contains('date-picker__dialog--hidden')).toBeTruthy();
    });
  });

  describe('Previous / next month button', () => {
    const getFormattedMonthAndYear = date => {
      const month = months[date.getMonth()];
      const year = date.getFullYear();
      return `${month} ${year}`;
    }

    const todayAsFormattedMonthYear = getFormattedMonthAndYear(today);
    const nextMonthAsFormattedMonthYear = getFormattedMonthAndYear(nextMonth);

    it('should disable previous month by default', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const previousMonth = document.querySelector('.date-picker__button__previous-month');

      $(revealButton).click();

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(previousMonth.classList.contains('date-picker__button--disabled')).toBeTruthy();
    });

    it('should enable next month by default', () => {
      new DatePicker(document.querySelector('.date-picker'), {});

      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const nextMonth = document.querySelector('.date-picker__button__next-month');

      $(revealButton).click();

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(nextMonth.classList.contains('date-picker__button--disabled')).toBeFalsy();
    });

    it('should navigate between previous and next month', () => {
      new DatePicker(document.querySelector('.date-picker'), {});

      const heading = document.querySelector('.date-picker__heading');
      const revealButton = document.querySelector('.date-picker__reveal');
      const previousMonth = document.querySelector('.date-picker__button__previous-month');
      const nextMonth = document.querySelector('.date-picker__button__next-month');

      $(revealButton).click();

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(previousMonth.classList.contains('date-picker__button--disabled')).toBeTruthy();

      $(nextMonth).click();

      expect($(heading).text()).toEqual(nextMonthAsFormattedMonthYear);
      expect(previousMonth.classList.contains('date-picker__button--disabled')).toBeFalsy();

      $(previousMonth).click();

      expect($(heading).text()).toEqual(todayAsFormattedMonthYear);
      expect(previousMonth.classList.contains('date-picker__button--disabled')).toBeTruthy();
    });
  });

  describe('Date selection', () => {
    it('should set focus on today when date inputs are empty', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');

      $(revealButton).click();

      const todayDateButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      expect(todayDateButton.tabIndex).toEqual(0);
      expect(todayDateButton.classList.contains('date__button--today')).toBeTruthy();
    });

    it('should insert selected date into date inputs', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(revealButton).click();

      const todayDateButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      $(todayDateButton).click();

      expect(parseInt($(dayInput).val())).toEqual(today.getDate());
      expect(parseInt($(monthInput).val())).toEqual(today.getMonth() + 1);
      expect(parseInt($(yearInput).val())).toEqual(today.getFullYear());
    });

    it('should allow for selection of tomorrow', () => {
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      new DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(tomorrow.getDate());
      $(monthInput).val(tomorrow.getMonth() + 1);
      $(yearInput).val(tomorrow.getFullYear());

      $(revealButton).click();

      const tomorrowButton = document.querySelector(`[data-test-id="${tomorrow.toLocaleDateString()}"]`);

      expect(tomorrowButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day next month', () => {
      const nextMonth = new Date();
      nextMonth.setDate(10);
      nextMonth.setMonth(today.getMonth() + 1);

      new DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(nextMonth.getDate());
      $(monthInput).val(nextMonth.getMonth() + 1);
      $(yearInput).val(nextMonth.getFullYear());

      $(revealButton).click();

      const nextMonthButton = document.querySelector(`[data-test-id="${nextMonth.toLocaleDateString()}"]`);

      expect(nextMonthButton.tabIndex).toEqual(0);
    });

    it('should allow for selection of a day next year', () => {
      const nextYear = new Date();
      nextYear.setDate(10);
      nextYear.setFullYear(today.getFullYear() + 1);

      new DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(nextYear.getDate());
      $(monthInput).val(nextYear.getMonth() + 1);
      $(yearInput).val(nextYear.getFullYear());

      $(revealButton).click();

      const nextYearButton = document.querySelector(`[data-test-id="${nextYear.toLocaleDateString()}"]`);

      expect(nextYearButton.tabIndex).toEqual(0);
    });

    it('should set focus on today when date inputs are incorrectly formatted', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(40);
      $(monthInput).val(today.getMonth() + 1);
      $(yearInput).val(today.getFullYear());

      $(revealButton).click();

      const todayDateButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      expect(todayDateButton.tabIndex).toEqual(0);
      expect(todayDateButton.classList.contains('date__button--today')).toBeTruthy();
    });
  });

  describe('Date ranges', () => {
    const maxDate = new Date();
    maxDate.setDate(10);
    maxDate.setMonth(today.getMonth() + 1);

    it('should disable interaction with days before min date', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(revealButton).click();

      const yesterdayButton = document.querySelector(`[data-test-id="${yesterday.toLocaleDateString()}"]`);

      expect(yesterdayButton.tabIndex).toEqual(-1);
      expect(yesterdayButton.getAttribute('aria-disabled')).toBeTruthy();
      expect(yesterdayButton.classList.contains('date__button--disabled')).toBeTruthy();

      $(yesterdayButton).click();

      expect($(dayInput).val()).toEqual('');
      expect($(monthInput).val()).toEqual('');
      expect($(yearInput).val()).toEqual('');
    });

    it('should disable interaction with days after max date', () => {
      const maxDatePlusDay = new Date();
      maxDatePlusDay.setDate(11);
      maxDatePlusDay.setMonth(today.getMonth() + 1);

      new DatePicker(document.querySelector('.date-picker'), {
        maxDate: maxDate
      });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');
      const nextMonthButton = document.querySelector('.date-picker__button__next-month');

      $(revealButton).click();
      $(nextMonthButton).click();

      const disabledButton = document.querySelector(`[data-test-id="${maxDatePlusDay.toLocaleDateString()}"]`);

      expect(disabledButton.tabIndex).toEqual(-1);
      expect(disabledButton.getAttribute('aria-disabled')).toBeTruthy();
      expect(disabledButton.classList.contains('date__button--disabled')).toBeTruthy();

      $(disabledButton).click();

      expect($(dayInput).val()).toEqual('');
      expect($(monthInput).val()).toEqual('');
      expect($(yearInput).val()).toEqual('');
    });

    it('should default focus day to min date when input dates are before min date', () => {
      new DatePicker(document.querySelector('.date-picker'), {});
      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(yesterday.getDate());
      $(monthInput).val(yesterday.getDate());
      $(yearInput).val(yesterday.getFullYear());

      $(revealButton).click();

      const todayButton = document.querySelector(`[data-test-id="${today.toLocaleDateString()}"]`);

      expect(todayButton.tabIndex).toEqual(0);
      expect(todayButton.getAttribute('aria-disabled')).toBeFalsy();
      expect(todayButton.classList.contains('date__button--disabled')).toBeFalsy();
    });

    it('should default focus day to max date when input dates exceed max date', () => {
      new DatePicker(document.querySelector('.date-picker'), {
        maxDate: maxDate
      });

      const revealButton = document.querySelector('.date-picker__reveal');
      const dayInput = document.querySelector('.date-picker-day');
      const monthInput = document.querySelector('.date-picker-month');
      const yearInput = document.querySelector('.date-picker-year');

      $(dayInput).val(maxDate.getDate() + 1);
      $(monthInput).val(maxDate.getMonth() + 1);
      $(yearInput).val(maxDate.getFullYear());

      $(revealButton).click();

      const maxDateButton = document.querySelector(`[data-test-id="${maxDate.toLocaleDateString()}"]`);

      expect(maxDateButton.tabIndex).toEqual(0);
      expect(maxDateButton.getAttribute('aria-disabled')).toBeFalsy();
      expect(maxDateButton.classList.contains('date__button--disabled')).toBeFalsy();
    });
  });
});