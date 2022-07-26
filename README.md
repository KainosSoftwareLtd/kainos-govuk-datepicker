# Accessible Date picker (GOV.UK Theme)

![Latest merge to main](https://github.com/KainosSoftwareLtd/accessible-date-picker/actions/workflows/main-ci.yml/badge.svg)
![Nightly CI](https://github.com/KainosSoftwareLtd/accessible-date-picker/actions/workflows/nightly-ci.yml/badge.svg)

A Date picker design and developed to be used within GOV.UK projects. Full support for 'keyboard only' users. Supports both English and Welsh.

See a preview [here](https://still-headland-16463.herokuapp.com)

### Table of Contents

* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [Configuration options](#options)
* [Running locally](#running-locally)
* [Testing](#testing)

## Installation

### Via NPM

```
npm i kainos-govuk-datepicker
```

Files & locations:

| File               | Folder                                        | Description                    |
|--------------------|-----------------------------------------------|--------------------------------|
| datepicker.min.js  | node_modules/kainos-govuk-datepicker/dist     | production build - (ES5, 14kb) |
| datepicker.min.css | node_modules/kainos-govuk-datepicker/dist     | production stylesheet          |
| datepicker.scss    | node_modules/kainos-govuk-datepicker/src/scss | SCSS file for use in builds    |

## Basic Usage

Importing the library if you're using it in Node:
```javascript
import datePicker from 'kainos-govuk-datepicker';
// or
const datePicker = require('kainos-govuk-datepicker');
```

Add a class of `.date-picker` (can be named differently) to your HTML form wrapper.

Ensure day, month and year inputs have a class of `.date-picker-day`, `.date-picker-month`, `.date-picker-year`.

See recommended HTML -

```html
<div class="govuk-form-group">
 <fieldset class="govuk-fieldset" role="group" aria-describedby="passport-issued-hint">
   <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
    <h1 class="govuk-fieldset__heading">When was your passport issued?</h1>
   </legend>
   <div class="govuk-hint">For example, 27 3 2007</div>
   <div class="govuk-date-input date-picker" id="passport-issued">
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label class="govuk-label govuk-date-input__label" for="passport-issued-day">Day</label>
        <input class="govuk-input govuk-date-input__input govuk-input--width-2 date-picker-day" id="passport-issued-day" name="passport-issued-day" type="text" pattern="[0-9]*" inputmode="numeric" />
      </div>
    <div>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label class="govuk-label govuk-date-input__label" for="passport-issued-month">Month</label>
        <input class="govuk-input govuk-date-input__input govuk-input--width-2 date-picker-month" id="passport-issued-month" name="passport-issued-month" type="text" pattern="[0-9]*" inputmode="numeric" />
      </div>
    </div>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
        <label class="govuk-label govuk-date-input__label" for="passport-issued-year">year</label>
        <input class="govuk-input govuk-date-input__input govuk-input--width-4 date-picker-year" id="passport-issued-year" name="passport-issued-year" type="text" pattern="[0-9]*" inputmode="numeric" />
      </div>
    </div>
   </div>
 </fieldset>
</div>
```

Importing the styles into your project using Node:
```javascript
// Import datepickers scss file.
@import '~kainos-govuk-datepicker/src/scss/datepicker.scss';
// Import datepickers css file.
@import '~kainos-govuk-datepicker/dist/datepicker.min.css';
```

Using it in your code:
```javascript
datePicker(selector, options);
```

datePicker takes 2 arguments:

1. `selector` - DOM node, such as `document.querySelector('#my-id')`.
2. `options` - (optional) - A configuration object (see below).

## Options

The date picker currently supports the following configuration options:

### language

Type: String | `en` or `cy`

Supports English `en` and Welsh `cy`. Defaults to English if not specified.

Using it in your code:
```javascript
datePicker(selector, {
  language: 'en', // 'cy'
});
```

### minDate

Type: Date

The minimum date the user can select. Null by default.

Using it in your code:
```javascript
datePicker(selector, {
  minDate: new Date(),
});
```

### maxDate

Type: Date

The maximum date the user can select. Null by default.

Using it in your code:
```javascript
datePicker(selector, {
  maxDate: new Date(),
});
```

### theme

Type: String

The class to append to the date picker container to assist with CSS overwrites. Empty by default.

Using it in your code:
```javascript
datePicker(selector, {
  theme: 'my-class-name',
});
```

### icon

Type: String

The icon you wish to use in place of the default 'choose date' text.

Using it in your code:
```javascript
datePicker(selector, {
  icon: 'http://my-icon-url.com',
});
```

## Running locally

Clone this repository to your local machine and install dependencies.

```shell
npm install
```

Webpack is used to bundle the date picker's files, while express is used to spin up the local dev environment.

Both can be ran simultaneously via running -

```shell
npm run start:dev
```

After a few moments, you should be able to see the express server on port 8080.

## Testing

The date picker component is tested via Jest unit tests and Codecept e2e tests.

To run the unit tests run -

```shell
npm run test
```

To run the e2e tests run -

```shell
npm run test:e2e
```


## Usage in Angular 8 Application (as a js file)

These instructions cover the inclusion of the accessible-date-picker as a javascript code module (not an NPM component)

The first step is to copy the datepicker.js file to your assets/js directory and declare it in the angular.json file as follows:
```
  "projects": {
    ...
    "architect": {
        "build": {
          "options": {
            ...
            "scripts": [
              "src/assets/js/datepicker.js"
            ]
          },
```

After creating a date picker component in your angular application, you need to include the following line above the component annotation
```
  declare function datePicker(datePickerElement, callback, options?): any;

  @Component({ ...
```

The HTML of this component should follow this pattern
```
<div style="white-space: nowrap">

  <div class='govuk-date-input date-picker-default' #dpElement [id]="inputId" style="width: 100%;">
    <div class='govuk-date-input__item'>
      <div class='govuk-form-group'>
        <label class='govuk-label govuk-date-input__label' [for]='dayInputId'>Day</label>
        <input class='govuk-input govuk-date-input__input govuk-input--width-2 date-picker-day'
               [(ngModel)]="dayField" (ngModelChange)="dateFieldChanged('day', $event)" [disabled]="inputDisabled"
               [id]='dayInputId' [name]='dayInputId' type='text' pattern='[0-9]*' inputmode='numeric'/>
      </div>
    </div>
    <div class='govuk-date-input__item'>
      <div class='govuk-form-group'>
        <label class='govuk-label govuk-date-input__label' [for]='monthInputId'>Month</label>
        <input class='govuk-input govuk-date-input__input govuk-input--width-2 date-picker-month' [disabled]="inputDisabled"
               [(ngModel)]="monthField" (ngModelChange)="dateFieldChanged('month', $event)"
               [id]='monthInputId' [name]='monthInputId' type='text' pattern='[0-9]*' inputmode='numeric'/>
      </div>
    </div>
    <div class='govuk-date-input__item'>
      <div class='govuk-form-group'>
        <label class='govuk-label govuk-date-input__label' [for]='yearInputId'>Year</label>
        <input class='govuk-input govuk-date-input__input govuk-input--width-3 date-picker-year' [disabled]="inputDisabled"
               [(ngModel)]="yearField" (ngModelChange)="dateFieldChanged('year', $event)"
               [id]='yearInputId' [name]='yearInputId' type='text' pattern='[0-9]*' inputmode='numeric'/>
      </div>
    </div>
  </div>
</div>
```

A view child needs to be created for access to the html elements
```
  @ViewChild('dpElement', { static: false }) dpElement: ElementRef;
```

Within the ngAfterViewInit() function, the datepicker should be initialised as follows:
```
    const self = this;
    const callback = function dateCallback(date) {
      self.initDate(date);
      self.setSelectedDate(false);
    };
    const tomorrow = moment().add(1, 'day').toDate();
    const options = {chooseDateButtonBelow: true, maxDate: tomorrow};
    datePicker(this.dpElement.nativeElement, callback, options);
```
Note: maxDate is optional here


The dateFieldChanged function in the component ts should look something like this
```
  dateFieldChanged(field, value) {
    switch (field) {
      case 'day' : this.dayField = value; break;
      case 'month' : this.monthField = value; break;
      case 'year' : this.yearField = value; break;
      default: return;
    }
    if (this.dayField && this.monthField && this.yearField) {
      if (/^[0-9]{1,2}$/.test(this.dayField) &&
        /^[0-9]{1,2}$/.test(this.monthField) &&
        /^[0-9]{4}$/.test(this.yearField)) {
        const date = new Date(Number(this.yearField), Number(this.monthField) - 1, Number(this.dayField));
        this.initDate(date);
        this.setSelectedDate(false);
      }
    }
  }
  
    initDate(date) {
    this.currentDate = date;
    this.tempDate = {
      isRange: false,
      singleDate: {
        jsDate: this.currentDate
      }
    };
  }

  setSelectedDate(updateFields = true) {
    this.date = this.tempDate;
    this.selectedDate = this.getSelectedDate();
    this.dateString = format(this.date.singleDate.jsDate, 'dd/MM/yyyy');
    if (updateFields) { this.updateFields(this.date.singleDate.jsDate); }
    this.updatehandler.emit(this.date);
  }

  updateFields(date: Date) {
    this.dayField = '' + date.getDate();
    this.monthField = '' + (date.getMonth() + 1);
    this.yearField = '' + date.getFullYear();
  }

  getSelectedDate() {
    return format(this.date.singleDate.jsDate, 'yyyy-MM-dd');
  }

```

