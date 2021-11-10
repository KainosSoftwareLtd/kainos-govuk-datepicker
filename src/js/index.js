/* eslint-disable @typescript-eslint/no-unused-vars */
/* Disabled lint rule as linter complained DatePicker was not used in this file */
function DatePicker(datePickerElement, options) {
  var keyCodes = {
    TAB: 9,
    ENTER: 13,
    ESC: 27,
    SPACE: 32,
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
  };
  var content = {
    gb: {
      days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      dayAbbr: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October',
        'November', 'December'],
      buttons: {
        previous: 'Previous',
        next: 'Next',
        close: 'Cancel',
        dialogTrigger: 'Choose date',
      },
      aria: {
        previousMonth: 'Previous month',
        nextMonth: 'Next month',
        dayInPast: 'You cannot select a day before',
        dayInFuture: 'You cannot select a day after',
      },
    },
    cy: {
      days: ['Dydd Sul', 'Dydd Llun', 'Dydd Mawrth', 'Dydd Mercher', 'Dydd Iau', 'Dydd Gwener', 'Dydd Sadwrn'],
      dayAbbr: ['Su', 'Ll', 'Ma', 'Me', 'Ia', 'Gw', 'Sa'],
      months: ['Ionawr', 'Chwefror', 'Mawrth', 'Ebrill', 'Mai', 'Mehefin', 'Gorffennaf', 'Awst', 'Medi', 'Hydref',
        'Tachwedd', 'Rhagfyr'],
      buttons: {
        previous: 'Blaenorol',
        next: 'Nesaf',
        close: 'Wedi\'i ganslo',
        dialogTrigger: 'Dewiswch ddyddiad',
      },
      aria: {
        previousMonth: 'Mis blaenorol',
        nextMonth: 'Mis nesaf',
        dayInPast: 'Ni allwch ddewis ddiwrnod cynt',
        dayInFuture: 'Ni allwch ddewis ddiwrnod ar ôl',
      },
    },
  };
  var elements = {
    container: datePickerElement,
    buttons: {},
    table: {},
    inputs: {
      day: datePickerElement.querySelector('.date-picker-day'),
      month: datePickerElement.querySelector('.date-picker-month'),
      year: datePickerElement.querySelector('.date-picker-year'),
    },
    ariaLiveMessage: null,
    heading: {},
    dialog: {},
  };
  var state = {
    isOpen: false,
    isPreviousEnabled: false,
    isNextEnabled: true,
    maxDate: options.maxDate || null,
    minDate: options.minDate || new Date(),
    language: options.language,
    focusedDate: new Date(),
    days: [],
  };

  content.ni = content.gb;

  if (!datePickerElement || !elements.inputs.month || !elements.inputs.year || !elements.inputs.day || !options) {
    return console.warn('Date picker not configured correctly');
  }

  if (!(state.maxDate instanceof Date || state.maxDate === null) || !(state.minDate instanceof Date)) {
    return console.warn('Date picker min and max dates must be of type Date');
  }

  if (!(Object.keys(content).indexOf(options.language) > -1)) {
    return console.warn('Date picker does not currently support language ' + options.language);
  }

  function getFormattedDate(date) {
    return date.getDate() + ' ' + content[state.language].months[date.getMonth()] + ' ' + date.getFullYear();
  }

  function getNextMonth() {
    if (state.focusedDate.getMonth() === 11) {
      return new Date(state.focusedDate.getFullYear() + 1, 0, 1);
    }

    return new Date(state.focusedDate.getFullYear(), state.focusedDate.getMonth() + 1, 1);
  }

  function getPreviousMonth() {
    if (state.focusedDate.getMonth() === 1) {
      return new Date(state.focusedDate.getFullYear() - 1, 12, 1);
    }

    return new Date(state.focusedDate.getFullYear(), state.focusedDate.getMonth() - 1, 1);
  }

  function getDateFromInputs() {
    var inputDates = {
      day: elements.inputs.day.value,
      month: elements.inputs.month.value,
      year: elements.inputs.year.value,
    };

    function dateExists() {
      if (inputDates.day > 31 || inputDates.month > 12) {
        return false;
      }
      return inputDates.day <= new Date(inputDates.year, inputDates.month, 0).getDate();
    }

    if (parseInt(inputDates.day, 10) && parseInt(inputDates.month, 10)
      && parseInt(inputDates.year, 10) && dateExists()) {
      return new Date(inputDates.year, inputDates.month - 1, inputDates.day);
    }

    return new Date();
  }

  function setInputDate(date) {
    var formatDateInput = function (dateToFormat) {
      if (dateToFormat <= 9) {
        return '0' + dateToFormat;
      }

      return dateToFormat;
    };

    elements.inputs.day.value = formatDateInput(date.getDate());
    elements.inputs.month.value = formatDateInput(date.getMonth() + 1);
    elements.inputs.year.value = date.getFullYear();
  }

  function setIsPreviousEnabled() {
    function isMonthBeforeMinDate() {
      return state.focusedDate.getMonth() <= state.minDate.getMonth()
        && !(state.focusedDate.getFullYear() > state.minDate.getFullYear());
    }

    if (state.minDate && isMonthBeforeMinDate()) {
      state.isPreviousEnabled = false;
      elements.buttons.previousMonthButton.classList.add('date-picker__button--disabled');
      elements.buttons.previousMonthButton.setAttribute('tabindex', '-1');
      elements.buttons.previousMonthButton.setAttribute('aria-disabled', 'true');
    } else {
      state.isPreviousEnabled = true;
      elements.buttons.previousMonthButton.classList.remove('date-picker__button--disabled');
      elements.buttons.previousMonthButton.setAttribute('tabindex', '0');
      elements.buttons.previousMonthButton.removeAttribute('aria-disabled', 'true');
    }
  }

  function setAriaLiveMessage(message) {
    var ariaLabel = document.createElement('p');
    ariaLabel.setAttribute('class', 'aria-live-message govuk-visually-hidden');
    ariaLabel.setAttribute('aria-live', 'assertive');
    ariaLabel.innerText = message;
    elements.ariaLiveMessage = ariaLabel;
    elements.dialog.appendChild(elements.ariaLiveMessage);
  }

  function removeAriaLiveMessage() {
    var elms;
    var x;

    if (elements.ariaLiveMessage) {
      elms = document.querySelectorAll('.aria-live-message');
      for (x = 0; x < elms.length; x++) {
        elements.dialog.removeChild(elms[x]);
      }
    }
  }

  function setIsNextEnabled() {
    function isMonthPostMaxDate() {
      return state.focusedDate.getMonth() >= state.maxDate.getMonth()
        && !(state.focusedDate.getFullYear() < state.maxDate.getFullYear());
    }

    if (state.maxDate && isMonthPostMaxDate()) {
      state.isNextEnabled = false;
      elements.buttons.nextMonthButton.classList.add('date-picker__button--disabled');
      elements.buttons.nextMonthButton.setAttribute('tabindex', '-1');
      elements.buttons.nextMonthButton.setAttribute('aria-disabled', 'true');
    } else {
      state.isNextEnabled = true;
      elements.buttons.nextMonthButton.classList.remove('date-picker__button--disabled');
      elements.buttons.nextMonthButton.setAttribute('tabindex', '0');
      elements.buttons.nextMonthButton.removeAttribute('aria-disabled', 'true');
    }
  }

  function setFocusDay(date) {
    if (state.minDate && isDateBeforeMinDate(date)) {
      state.focusedDate = new Date(state.minDate.getFullYear(), state.minDate.getMonth(), state.minDate.getDate());
    } else if (state.maxDate && isDateAfterMaxDate(date)) {
      state.focusedDate = new Date(state.maxDate.getFullYear(), state.maxDate.getMonth(), state.maxDate.getDate());
    } else {
      state.focusedDate = date;
    }

    state.nextMonth = getNextMonth();
    state.previousMonth = getPreviousMonth();
  }

  function setFocusOnDayButton(index) {
    state.days[index].element.setAttribute('tabindex', '0');
    state.days[index].element.focus();
    removeAriaLiveMessage();
  }

  function setDays() {
    var currentMonthLastDay = new Date(state.focusedDate.getFullYear(), state.focusedDate.getMonth() + 1, 0)
      .getDate();

    var previousMonthLastDay = new Date(
      state.previousMonth.getFullYear(),
      state.previousMonth.getMonth() + 1,
      /* eslint-disable @typescript-eslint/comma-dangle */
      0
    ).getDate();

    var firstDayOfMonthIndex = new Date(new Date(state.focusedDate).setDate(1)).getDay() + 1;
    var lastDayOfMonthIndex = new Date(state.focusedDate.getFullYear(), state.focusedDate.getMonth() + 1, 0)
      .getDay();

    var nextMonthDays = 7 - lastDayOfMonthIndex - 1;
    var i;
    var j;
    var k;
    var l;

    state.days = [];

    for (i = firstDayOfMonthIndex; i > 0; i--) {
      state.days.push(createDay({
        day: previousMonthLastDay - i + 1,
        month: state.previousMonth.getMonth(),
        year: state.previousMonth.getFullYear(),
      }));
    }

    for (j = 1; j <= currentMonthLastDay; j++) {
      state.days.push(createDay({
        day: j,
        month: state.focusedDate.getMonth(),
        year: state.focusedDate.getFullYear(),
      }));
    }

    for (k = 1; k <= nextMonthDays; k++) {
      state.days.push(createDay({
        day: k,
        month: state.nextMonth.getMonth(),
        year: state.nextMonth.getFullYear(),
      }));
    }

    for (l = 0; l < state.days.length; l++) {
      state.days[l].index = l;
    }
  }

  function showCalender() {
    state.isOpen = true;
    elements.dialog.classList.remove('date-picker__dialog--hidden');
  }

  function hideCalender() {
    state.isOpen = false;
    elements.dialog.classList.add('date-picker__dialog--hidden');
    elements.buttons.revealButton.focus();
  }

  function incrementFocusMonth() {
    state.focusedDate = state.nextMonth;
    state.nextMonth = getNextMonth();
    state.previousMonth = getPreviousMonth();
  }

  function decrementFocusMonth() {
    state.focusedDate = new Date(state.previousMonth.getFullYear(), state.previousMonth.getMonth() + 1, 0);
    state.nextMonth = getNextMonth();
    state.previousMonth = getPreviousMonth();
  }

  function buildUI() {
    var closeButton;
    var container;
    var dialog;
    var headerContainer;
    var heading;
    var headingRow;
    var nextMonthButton;
    var previousMonthButton;
    var revealButton;
    var table;
    var tbody;
    var thead;
    var th;
    var i;
    var j;
    var labelId = 'date-picker-label-' + Math.floor((Math.random() * 100) + 1);

    function createElement(tag, attrs) {
      var e = document.createElement(tag);
      if (attrs) {
        Object.keys(attrs).forEach(function (key) {
          e.setAttribute(key, attrs[key]);
        });
      }
      return e;
    }

    dialog = createElement('div', {
      class: 'date-picker__dialog date-picker__dialog--hidden', role: 'dialog', 'aria-modal': 'true', tabindex: '-1',
    });

    closeButton = createElement('button', {
      class: 'govuk-button govuk-button--secondary date-picker__button__close', type: 'button', value: 'close',
    });

    previousMonthButton = createElement('button', {
      type: 'button', class: 'date-picker__button__previous-month', 'aria-labelledby': labelId
    });
    container = createElement('div', { class: 'date-picker__container' });
    revealButton = createElement('button', { class: 'govuk-link date-picker__reveal', type: 'button' });
    headerContainer = createElement('div', { class: 'date-picker__header govuk-clearfix' });
    nextMonthButton = createElement('button', {
      type: 'button', class: 'date-picker__button__next-month', 'aria-labelledby': labelId
    });
    heading = createElement('h2', {
      id: labelId, class: 'date-picker__heading', 'aria-live': 'assertive', 'aria-atomic': true,
    });
    table = createElement('table', {
      class: 'date-picker__date-table', role: 'grid', 'aria-labelledby': labelId
    });
    thead = createElement('thead');
    tbody = createElement('tbody');
    headingRow = createElement('tr');

    for (i = 0, j = content[state.language].days.length; i < j; i++) {
      th = createElement('th');
      th.setAttribute('scope', 'col');
      th.setAttribute('abbr', content[state.language].days[i]);
      th.innerText = content[state.language].dayAbbr[i];

      headingRow.appendChild(th);
    }

    revealButton.innerHTML = content[state.language].buttons.dialogTrigger;
    closeButton.innerHTML = content[state.language].buttons.close;

    thead.appendChild(headingRow);
    table.appendChild(thead);
    table.appendChild(tbody);
    headerContainer.appendChild(previousMonthButton);
    headerContainer.appendChild(heading);
    headerContainer.appendChild(nextMonthButton);
    dialog.appendChild(headerContainer);
    dialog.appendChild(table);
    dialog.appendChild(closeButton);
    container.appendChild(revealButton);
    container.appendChild(dialog);

    elements.container.appendChild(container);

    elements.buttons = {
      revealButton: revealButton,
      previousMonthButton: previousMonthButton,
      nextMonthButton: nextMonthButton,
      closeButton: closeButton,
    };

    elements.table = {
      container: table,
      head: thead,
      body: tbody,
    };

    elements.dialog = dialog;
    elements.heading = heading;
    setAriaLiveMessage('');
  }

  function registerEventHandlers() {
    document.addEventListener('focus', handleDocumentFocus, true);
    document.body.addEventListener('mousedown', handleDocumentBodyMouseDown, true);
    elements.dialog.addEventListener('keydown', handleDialogKeydown, true);
    elements.buttons.revealButton.addEventListener('click', handleRevealButtonInteraction, true);
    elements.buttons.revealButton.addEventListener('keydown', handleRevealButtonInteraction, true);
    elements.buttons.nextMonthButton.addEventListener('click', handleNextButtonInteraction, true);
    elements.buttons.nextMonthButton.addEventListener('keydown', handleNextButtonInteraction, true);
    elements.buttons.previousMonthButton.addEventListener('click', handlePreviousButtonInteraction, true);
    elements.buttons.previousMonthButton.addEventListener('keydown', handlePreviousButtonInteraction, true);
    elements.buttons.closeButton.addEventListener('click', handleCloseButtonInteraction, true);
    elements.buttons.closeButton.addEventListener('keydown', handleCloseButtonInteraction, true);
  }

  function handleDocumentBodyMouseDown(event) {
    if (state.isOpen && event.target !== elements.dialog && !elements.dialog.contains(event.target)) {
      hideCalender();
      event.preventDefault();
    }
  }

  function handleDocumentFocus(event) {
    var sessionTimeout = document.body.querySelector('.timeout-dialog');
    if (state.isOpen && event.target !== elements.dialog && !elements.dialog.contains(event.target)
      && event.target !== sessionTimeout) {
      event.stopPropagation();
      elements.dialog.focus();
    } else if (event.target === sessionTimeout) {
      document.removeEventListener('focus', handleDocumentFocus, true);
      hideCalender();
    }
  }

  function handleDialogKeydown(event) {
    if (state.isOpen && event.keyCode === keyCodes.ESC) {
      hideCalender();
    }
  }

  function handleCloseButtonInteraction(event) {
    var preventDefault = false;

    switch (event.type) {
      case 'keydown':
        switch (event.keyCode) {
          case keyCodes.ESC:
          case keyCodes.ENTER:
          case keyCodes.SPACE:
            hideCalender();
            preventDefault = true;
            break;
          default:
            break;
        }
        break;
      case 'click':
        hideCalender();
        preventDefault = true;
        break;
      default:
        break;
    }

    if (preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function handleRevealButtonInteraction(event) {
    var preventDefault = false;

    function displayCalendar() {
      setFocusDay(getDateFromInputs());
      showCalender();
      renderDOM();
      preventDefault = true;
    }

    switch (event.type) {
      case 'keydown':
        switch (event.keyCode) {
          case keyCodes.ESC:
          case keyCodes.ENTER:
          case keyCodes.SPACE:
            displayCalendar();
            break;
          default:
            break;
        }
        break;
      case 'click':
        displayCalendar();
        break;
      default:
        break;
    }

    if (preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function handlePreviousButtonInteraction(event) {
    var preventDefault = false;

    function decrementMonthIfEnabled() {
      if (state.isPreviousEnabled) {
        decrementFocusMonth();
        renderDOM();
        elements.buttons.previousMonthButton.focus();
      } else {
        removeAriaLiveMessage();
        setAriaLiveMessage(content[state.language].aria.dayInPast + ' ' + getFormattedDate(state.minDate));
        elements.dialog.focus();
      }
      preventDefault = true;
    }

    switch (event.type) {
      case 'keydown':
        switch (event.keyCode) {
          case keyCodes.ESC:
          case keyCodes.ENTER:
          case keyCodes.SPACE:
            decrementMonthIfEnabled();
            break;
          default:
            break;
        }
        break;
      case 'click':
        decrementMonthIfEnabled();
        break;
      default:
        break;
    }

    if (preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function handleNextButtonInteraction(event) {
    var preventDefault = false;

    function incrementMonthIfEnabled() {
      if (state.isNextEnabled) {
        incrementFocusMonth();
        renderDOM();
        elements.buttons.nextMonthButton.focus();
      } else {
        removeAriaLiveMessage();
        setAriaLiveMessage(content[state.language].aria.dayInFuture + ' ' + getFormattedDate(state.maxDate));
        elements.dialog.focus();
      }
      preventDefault = true;
    }

    switch (event.type) {
      case 'keydown':
        switch (event.keyCode) {
          case keyCodes.ESC:
          case keyCodes.ENTER:
          case keyCodes.SPACE:
            incrementMonthIfEnabled();
            break;
          default:
            break;
        }
        break;
      case 'click':
        incrementMonthIfEnabled();
        break;
      default:
        break;
    }

    if (preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function handleDateButtonInteraction(event) {
    var date = this;
    var preventDefault = false;

    function selectDay() {
      if (!date.isDisabled) {
        setInputDate(date.date);
        hideCalender();
      } else {
        removeAriaLiveMessage();
        setAriaLiveMessage(content[state.language].aria.dayInPast + ' ' + getFormattedDate(state.minDate));
        elements.dialog.focus();
      }
      preventDefault = true;
    }

    function resetFocusOnDays() {
      var i = 0;
      for (i; i < state.days.length; i++) {
        state.days[i].element.setAttribute('tabindex', '-1');
      }
    }

    function moveToPreviousDay() {
      var index = date.index - 1;
      var previousDay = state.days[index];

      if (!previousDay) {
        decrementFocusMonth();
        renderDOM();
      } else if (!previousDay.isDisabled && !previousDay.isInPreviousMonth) {
        resetFocusOnDays();
        setFocusOnDayButton(index);
        state.focusedDate = previousDay;
      } else if (!previousDay.isDisabled && previousDay.isInPreviousMonth) {
        resetFocusOnDays();
        setFocusOnDayButton(index);
        decrementFocusMonth();
        renderDOM();
      } else {
        removeAriaLiveMessage();
        setAriaLiveMessage(content[state.language].aria.dayInPast + ' ' + getFormattedDate(state.minDate));
      }
      preventDefault = true;
    }

    function moveToNextDay() {
      var index = date.index + 1;
      var nextDay = state.days[index];

      if (!nextDay) {
        incrementFocusMonth();
        renderDOM();
      } else if (!nextDay.isDisabled && !nextDay.isInNextMonth) {
        resetFocusOnDays();
        setFocusOnDayButton(index);
        state.focusedDate = nextDay;
      } else if (!nextDay.isDisabled && nextDay.isInNextMonth) {
        incrementFocusMonth();
        resetFocusOnDays();
        setFocusOnDayButton(index);
        renderDOM();
      } else {
        removeAriaLiveMessage();
        setAriaLiveMessage(content[state.language].aria.dayInFuture + ' ' + getFormattedDate(state.maxDate));
      }
      preventDefault = true;
    }

    function moveToPreviousWeek() {
      var index = date.index - 7;
      var previousWeek = state.days[index];

      if (!previousWeek) {
        decrementFocusMonth();
        renderDOM();
      } else if (!previousWeek.isDisabled && !previousWeek.isInPreviousMonth) {
        resetFocusOnDays();
        setFocusOnDayButton(index);
        state.focusedDate = previousWeek;
      } else if (!previousWeek.isDisabled && previousWeek.isInPreviousMonth) {
        decrementFocusMonth();
        resetFocusOnDays();
        setFocusOnDayButton(index);
        renderDOM();
      } else {
        removeAriaLiveMessage();
        setAriaLiveMessage(content[state.language].aria.dayInPast + ' ' + getFormattedDate(state.minDate));
      }
      preventDefault = true;
    }

    function moveToNextWeek() {
      var index = date.index + 7;
      var nextWeek = state.days[index];

      if (!nextWeek) {
        incrementFocusMonth();
        renderDOM();
      } else if (!nextWeek.isDisabled && !nextWeek.isInNextMonth) {
        resetFocusOnDays();
        setFocusOnDayButton(index);
        state.focusedDate = nextWeek;
      } else if (!nextWeek.isDisabled && nextWeek.isInNextMonth) {
        incrementFocusMonth();
        resetFocusOnDays();
        setFocusOnDayButton(index);
        renderDOM();
      } else {
        removeAriaLiveMessage();
        setAriaLiveMessage(content[state.language].aria.dayInFuture + ' ' + getFormattedDate(state.maxDate));
      }
      preventDefault = true;
    }

    switch (event.type) {
      case 'keydown':
        switch (event.keyCode) {
          case keyCodes.ESC:
            hideCalender();
            preventDefault = true;
            break;
          case keyCodes.ENTER:
          case keyCodes.SPACE:
            selectDay();
            break;
          case keyCodes.LEFT:
            moveToPreviousDay();
            break;
          case keyCodes.RIGHT:
            moveToNextDay();
            break;
          case keyCodes.UP:
            moveToPreviousWeek();
            break;
          case keyCodes.DOWN:
            moveToNextWeek();
            break;
          case keyCodes.TAB:
            break;
          default:
            break;
        }
        break;
      case 'click':
        selectDay();
        break;
      default:
        break;
    }

    if (preventDefault) {
      event.stopPropagation();
      event.preventDefault();
    }
  }

  function renderHeading() {
    elements.heading.innerHTML = content[state.language].months[state.focusedDate.getMonth()] + ' '
      + state.focusedDate.getFullYear();
  }

  function renderDaysGrid() {
    var row;
    var cell;
    var i = 1;
    var j;
    var k = 1;
    var l;

    elements.table.body.innerHTML = '';

    while (++i < 8) {
      row = elements.table.body.insertRow(-1);

      for (j = 0, k; j < 7; j++) {
        cell = document.createElement('td');
        cell.classList.add('dateCell');
        if (state.days[k]) {
          cell.appendChild(state.days[k].element);
          row.appendChild(cell);
        }
        k++;

        if (state.days.length < 35) {
          row.style.display = 'none';
        }
      }
    }

    for (l = 0; l < state.days.length; l++) {
      state.days[i].element.setAttribute('tabindex', '-1');

      if (isDatesEqual(state.days[l].date, state.focusedDate)) {
        setFocusOnDayButton(state.days[l].index);
      }
    }
  }

  function createDay(date) {
    var props = {
      element: document.createElement('button'),
      date: new Date(date.year, date.month, date.day),
      isDisabled: false,
      isToday: false,
      isInCurrentMonth: false,
      isInPreviousMonth: false,
      isInNextMonth: false,
    };

    props.element.setAttribute('type', 'button');
    props.element.setAttribute('tabindex', '-1');

    props.element.innerHTML = props.date.getDate();
    props.element.classList.add('date__button');

    if (props.date.getMonth() === state.focusedDate.getMonth()
      && props.date.getFullYear() === state.focusedDate.getFullYear()) {
      props.isInCurrentMonth = true;
      props.element.classList.remove('date__button--inactive');
    } else {
      props.isInCurrentMonth = false;
      props.element.classList.add('date__button--inactive');
    }

    if (!props.isInCurrentMonth) {
      if (props.date > state.focusedDate) {
        props.isInNextMonth = true;
      } else {
        props.isInPreviousMonth = true;
      }
    }

    if ((state.maxDate && isDateAfterMaxDate(props.date)) || (state.minDate && isDateBeforeMinDate(props.date))) {
      props.isDisabled = true;
      props.element.classList.add('date__button--disabled');
      props.element.setAttribute('aria-disabled', 'true');
    } else {
      props.isDisabled = false;
      props.element.classList.remove('date__button--disabled');
      props.element.removeAttribute('aria-disabled', 'true');
    }

    if (isDatesEqual(props.date, new Date())) {
      props.isToday = true;
      props.element.classList.add('date__button--today');
    } else {
      props.isToday = false;
      props.element.classList.remove('date__button--today');
    }

    props.element.addEventListener('click', handleDateButtonInteraction.bind(props), this);
    props.element.addEventListener('keydown', handleDateButtonInteraction.bind(props), this);

    return props;
  }

  function isDateBeforeMinDate(date) {
    return getDateWithoutTime(date) < getDateWithoutTime(state.minDate);
  }

  function isDateAfterMaxDate(date) {
    return getDateWithoutTime(date) > getDateWithoutTime(state.maxDate);
  }

  function getDateWithoutTime(date) {
    var newDate = new Date(date);
    newDate.setHours(0, 0, 0, 0);
    return newDate;
  }

  function isDatesEqual(dateA, dateB) {
    return dateA.getDate() === dateB.getDate() && dateA.getMonth() === dateB.getMonth()
      && dateA.getFullYear() === dateB.getFullYear();
  }

  function renderDOM() {
    setDays();
    renderDaysGrid();
    renderHeading();
    setIsPreviousEnabled();
    setIsNextEnabled();
  }

  buildUI();
  registerEventHandlers();
}
