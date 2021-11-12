# Accessible Date picker (GOV.UK Theme)

A Date picker design and developed to be used within GOV.UK projects. Full support for 'keyboard only' users. Supports both English and Welsh.  

See a preview [here](https://still-headland-16463.herokuapp.com)

### Table of Contents

* [Installation](#installation)
* [Basic Usage](#basic-usage)
* [Configuration options](#options)

## Installation

### Via NPM

```
npm install accessible-date-picker
```

Files & locations:

|        File        |             Folder              |               Description               |
| ------------------ | ------------------------------- | --------------------------------------- |
| datepicker.min.js  | node_modules/js-datepicker/dist | production build - (ES5, 5.9kb gzipped) |
| datepicker.min.css | node_modules/js-datepicker/dist | production stylesheet                   |
| datepicker.scss    | node_modules/js-datepicker/src  | Scss file. Use it in your own builds.   |

## Basic Usage

Importing the library if you're using it in Node:
```javascript
import Datepicker from 'accessible-date-picker';
// or
const Datepicker = require('accessible-date-picker');
```

Add a class of 'date-picker' to your HTML form wrapper. Ensure day, month and year inputs have a class of 'date-picker-day', 'date-picker-month', 'date-picker-year'.

```html
<div class="govuk-form-group">
 <fieldset class="govuk-fieldset" role="group" aria-describedby="passport-issued-hint">
   <legend class="govuk-fieldset__legend govuk-fieldset__legend--l">
    <h1 class="govuk-fieldset__heading">
      When was your passport issued?
    </h1>
   </legend>
   <div id="passport-issued-hint" class="govuk-hint">
     For example, 27 3 2007<
   </div>
   <div class="govuk-date-input date-picker" id="passport-issued">
    <div class="govuk-date-input__item">
    <div class="govuk-form-group">
      <label class="govuk-label govuk-date-input__label" for="passport-issued-day">
      Day
      </label>
      <input class="govuk-input govuk-date-input__input govuk-input--width-2 date-picker-day" id="passport-issued-day" name="passport-issued-day" type="text" pattern="[0-9]*" inputmode="numeric"></div>
    </div>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
     <label class="govuk-label govuk-date-input__label" for="passport-issued-month">
      Month
      </label>
      <input class="govuk-input govuk-date-input__input govuk-input--width-2 date-picker-month" id="passport-issued-month" name="passport-issued-month" type="text" pattern="[0-9]*" inputmode="numeric"></div>
    </div>
    <div class="govuk-date-input__item">
      <div class="govuk-form-group">
      <label class="govuk-label govuk-date-input__label" for="passport-issued-year">
      year
      </label>
      <input class="govuk-input govuk-date-input__input govuk-input--width-4 date-picker-year" id="passport-issued-year" name="passport-issued-year" type="text" pattern="[0-9]*" inputmode="numeric"></div>
      </div>
    </div>
 </fieldset>
</div>
```

Using it in your code:
```javascript
new Datepicker(selector, options);
```

Importing the styles into your project using Node:
```javascript
// From within a scss file,
// import datepickers scss file...
@import '~accessible-date-picker/src/accessible-date-picker';

// or import datepickers css file.
@import '~accessible-date-picker/dist/accessible-date-picker.min.css';
```

Datepicker takes 2 arguments:

1. `selector` - two possibilities:
    1. `string` - a CSS selector, such as `'.my-class'`, `'#my-id'`, or `'div'`.
    2. `DOM node` - provide a DOM node, such as `document.querySelector('#my-id')`.
2. (optional) A configuration object (see below).

## Options

The date picker currently supports the following configuration options:

### language

Type: String

Supports English (gb) and Welsh (cy). Defaults to English if not specified.

Using it in your code:
```javascript
new Datepicker(selector, {
  language: 'gb' // 'cy'
});
```

### min date

Type: Date

The minimum date the user can select. Defaults to yesterday.

Using it in your code:
```javascript
new Datepicker(selector, {
  minDate: new Date()
});
```

### max date

Type: Date

The maxinum date the user can select. Null by default.

Using it in your code:
```javascript
new Datepicker(selector, {
  maxDate: new Date()
});
```

