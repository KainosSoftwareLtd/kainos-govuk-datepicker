# Kainos GOV.UK Date picker

![Latest merge to main](https://github.com/KainosSoftwareLtd/accessible-date-picker/actions/workflows/main-ci.yml/badge.svg)
![Nightly CI](https://github.com/KainosSoftwareLtd/accessible-date-picker/actions/workflows/nightly-ci.yml/badge.svg)

A Date picker library designed and developed to be used within GOV.UK projects. Full support for 'keyboard only' users. Supports both English and Welsh.

See a preview [here](https://still-headland-16463.herokuapp.com)

### Table of Contents

* [Installation](#installation)
* [Dependencies](#Dependencies)
* [Basic Usage](#basic-usage)
* [Configuration options](#options)
* [Callbacks](#callbacks)
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

## Dependencies

The date picker has only one dependency i.e. [govuk-frontend](https://www.npmjs.com/package/govuk-frontend) ^3.14.0

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
datePicker(selector, options, callbacks);
```

datePicker takes 2 arguments:

1. `selector` - DOM node, such as `document.querySelector('#my-id')`.
2. `options` - (optional) - A configuration object (see below).
3. `callbacks` - (optional) - An object of callbacks (see below)

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

### icon (Experimental)

Type: String

The icon you wish to use in place of the default 'choose date' text. Please note this feature is experimental and is not fully supported in Internet Explorer.

Using it in your code:
```javascript
datePicker(selector, {
  icon: 'http://my-icon-url.com',
});
```

## Callbacks

The datepicker currently supports the following optional callbacks

### onParseInputs

A callback that accepts 3 inputs: `day`, `month`, `year` which are taken from the input elements.
You can then manipulate these inputs and return an object with the following structure:
```javascript
{
  day,
  month,
  year
}
```
This returned object is then validated and used to set the focused date upon opening the date picker.


Using it in your code:
```javascript
datePicker(selector, options, {
  onParseInputs: function(day, month, year) {
    // some minpulation logic
    var manipulatedDay, manipulatedMonth, manipulatedYear;
    return {
      day: manipulatedDay,
      month: manipulatedMonth,
      year: manipulatedYear,
    };
  }
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
