const $ = require('jquery');
const DatePicker = require('../js/datepicker');
const today = new Date();
const previousMonth = new Date();
previousMonth.setMonth(today.getMonth() - 1);
const nextMonth = new Date();
nextMonth.setMonth(today.getMonth() + 1);

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

describe('Date picker', () => {
  beforeEach(() => {
   document.body.innerHTML = `
   <div class="date-picker">
     <fieldset>
       <legend>
         <h1>When was your passport issued?</h1>
       </legend>
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
      const closeButton = document.querySelector('.date-picker__button__close')

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
});