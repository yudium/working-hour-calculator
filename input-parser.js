const { pipe } = require('./util');
const InvalidInputException = require('./InvalidInputException');

function calculateMinutesFromMidnight12ClockUntil(time) {
  const hourClock = parseInt(time.split(':')[0]);
  const minuteClock = parseInt(time.split(':')[1]);
  const MINUTE_IN_ONE_HOUR = 60;
  return hourClock * MINUTE_IN_ONE_HOUR + minuteClock;
}

function isWorkHourOrderCorrect(workHour) {
  return (
    calculateMinutesFromMidnight12ClockUntil(workHour.endTime) >
    calculateMinutesFromMidnight12ClockUntil(workHour.startTime)
  );
}

function isAllWorkHoursOrderCorrect(workHours) {
  return workHours.every(isWorkHourOrderCorrect);
}

function isAllWorkHoursFormatValid(workHourFromUserInput) {
  const workingHours = workHourFromUserInput.match(/\d{2}:\d{2} - \d{2}:\d{2}/g);
  function getUserInputExceptValidWorkHour() {
    return workingHours.reduce((acc, wh) => acc.replace(wh, ''), workHourFromUserInput);
  }
  return getUserInputExceptValidWorkHour().trim() === '';
}

function validateInputFormat(workHourFromUserInput) {
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
  return passingTheInput();
}

function isValidHour(hour) {
  return parseInt(hour) >= 0 && parseInt(hour) <= 24;
}

function isValidMinute(minute) {
  return parseInt(minute) >= 0 && parseInt(minute) <= 59;
}

function extractHourFromTime(time) {
  return time.split(':')[0];
}

function extractMinuteFromTime(time) {
  return time.split(':')[1];
}

function isWorkHoursNotContainsFakeTime(wh) {
  if (!isValidHour(extractHourFromTime(wh.startTime))) return false;
  if (!isValidHour(extractHourFromTime(wh.endTime))) return false;
  if (!isValidMinute(extractMinuteFromTime(wh.startTime))) return false;
  if (!isValidMinute(extractMinuteFromTime(wh.endTime))) return false;
  return true;
}

function isAllWorkHoursNotContainsFakeTime(workHours) {
  return workHours.every(isWorkHoursNotContainsFakeTime)
}

function isNoOverlappingTime(workHours) {
  let isHasOverlappingTime = false;
  workHours.forEach((baseWh, currentBaseIndex) => {
    workHours.slice(currentBaseIndex + 1).forEach((otherWh) => {
      const isBaseStartTimeOverlapping =
      calculateMinutesFromMidnight12ClockUntil(otherWh.startTime) <
      calculateMinutesFromMidnight12ClockUntil(baseWh.startTime) &&
      calculateMinutesFromMidnight12ClockUntil(otherWh.endTime) >
      calculateMinutesFromMidnight12ClockUntil(baseWh.startTime);

      const isBaseEndTimeOverlapping =
      calculateMinutesFromMidnight12ClockUntil(otherWh.startTime) <
      calculateMinutesFromMidnight12ClockUntil(baseWh.endTime) &&
      calculateMinutesFromMidnight12ClockUntil(otherWh.endTime) >
      calculateMinutesFromMidnight12ClockUntil(baseWh.endTime);

      const isBaseEqualToOtherWorkHour =
      calculateMinutesFromMidnight12ClockUntil(otherWh.startTime) ===
      calculateMinutesFromMidnight12ClockUntil(baseWh.startTime) &&
      calculateMinutesFromMidnight12ClockUntil(otherWh.endTime) ===
      calculateMinutesFromMidnight12ClockUntil(baseWh.endTime);

      const isOverlapping = isBaseStartTimeOverlapping || isBaseEndTimeOverlapping || isBaseEqualToOtherWorkHour
      if (isOverlapping) {
        isHasOverlappingTime = true;
      }
    })
  });
  return !isHasOverlappingTime;
}

function validateWorkHours(workHours) {
  function passing() {
    return workHours;
  }
  function rejectInputBecauseInvalid() {
    throw new InvalidInputException();
  }

  if (!isAllWorkHoursOrderCorrect(workHours)) {
    rejectInputBecauseInvalid();
  }
  if (!isAllWorkHoursNotContainsFakeTime(workHours)) {
    rejectInputBecauseInvalid();
  }
  if (!isNoOverlappingTime(workHours)) {
    rejectInputBecauseInvalid();
  }

  return passing();
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

const parse = pipe(
  whitespaceToSpace,
  removeMultiplespace,
  validateInputFormat,
  parseWorkHourToObjects,
  validateWorkHours
);

module.exports = { parse };
