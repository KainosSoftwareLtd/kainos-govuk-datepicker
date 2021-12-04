# Accessible Date picker (GOV.UK Theme)

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
npm install accessible-date-picker
```

Files & locations:

|        File        |             Folder                          |               Description               |
| ------------------ | ------------------------------------------- | --------------------------------------- |
| datepicker.min.js  | node_modules/govuk-datepicker/dist          | production build - (ES5, 14kb) |
| datepicker.min.css | node_modules/govuk-datepicker/dist          | production stylesheet                   |
| datepicker.scss    | node_modules/govuk-datepicker/src/scss      | SCSS file for use in builds             |

## Basic Usage

Importing the library if you're using it in Node:
```javascript
import datePicker from 'govuk-datepicker';
// or
const datePicker = require('govuk-datepicker');
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
@import '~govuk-datepicker/src/scss/datepicker.scss';
// Import datepickers css file.
@import '~govuk-datepicker/dist/govuk-datepicker.min.css';
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
