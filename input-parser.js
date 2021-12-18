const { pipe } = require('./util');
const InvalidInputException = require('./InvalidInputException');

function calculateMinutesFromMidnight12ClockUntil(time) {
  const hourClock = parseInt(time.split(':')[0]);
  const minuteClock = parseInt(time.split(':')[1]);
  const MINUTE_IN_ONE_HOUR = 60;
  return hourClock * MINUTE_IN_ONE_HOUR + minuteClock;
}

function isWorkHourOrderCorrect(workHour) {
  const startTime = workHour.split(' - ')[0];
  const endTime = workHour.split(' - ')[1];

  return (
    calculateMinutesFromMidnight12ClockUntil(endTime) >
    calculateMinutesFromMidnight12ClockUntil(startTime)
  );
}

function isAllWorkHoursOrderCorrect(workHourFromUserInput) {
  const workHours = workHourFromUserInput.match(/\d{2}:\d{2} - \d{2}:\d{2}/g);
  return workHours.every(isWorkHourOrderCorrect);
}

function isAllWorkHoursFormatValid(workHourFromUserInput) {
  const workingHours = workHourFromUserInput.match(/\d{2}:\d{2} - \d{2}:\d{2}/g);
  function getUserInputExceptValidWorkHour() {
    return workingHours.reduce((acc, wh) => acc.replace(wh, ''), workHourFromUserInput);
  }
  return getUserInputExceptValidWorkHour().trim() === '';
}

function validateInput(workHourFromUserInput) {
  function passingTheInput() {
    return workHourFromUserInput;
  }
  function rejectInputBecauseInvalid() {
    throw new InvalidInputException();
  }

  const workingHours = workHourFromUserInput.match(/\d{2}:\d{2} - \d{2}:\d{2}/g);
  const isUserInputNotContainsAnyWorkHour = workingHours === null;
  if (isUserInputNotContainsAnyWorkHour) {
    rejectInputBecauseInvalid();
  }
  if (!isAllWorkHoursFormatValid(workHourFromUserInput)) {
    rejectInputBecauseInvalid();
  }
  if (!isAllWorkHoursOrderCorrect(workHourFromUserInput)) {
    rejectInputBecauseInvalid();
  }

  return passingTheInput();
}

function parseWorkHourToObjects(workHourInString) {
  const workingHours = workHourInString.match(/\d{2}:\d{2} - \d{2}:\d{2}/g);
  return workingHours.map((wh) => ({
    startTime: wh.split(' - ')[0],
    endTime: wh.split(' - ')[1],
  }));
}

function whitespaceToSpace(str) {
  return str.replace(/\s/g, ' ');
}

function removeMultiplespace(str) {
  return str.replace(/ +/g, ' ');
}

const parse = pipe(whitespaceToSpace, removeMultiplespace, validateInput, parseWorkHourToObjects);

module.exports = { parse };
