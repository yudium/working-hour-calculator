const { pipe } = require('./util');

function sum(arr) {
  return arr.reduce((acc, value) => acc + value, 0);
}

function calculateMinutesFromMidnight12ClockUntil(time) {
  const hourClock = parseInt(time.split(':')[0]);
  const minuteClock = parseInt(time.split(':')[1]);
  const MINUTE_IN_ONE_HOUR = 60;
  return hourClock * MINUTE_IN_ONE_HOUR + minuteClock;
}

function calculateTimeDifferenceInMinute(startTime, endTime) {
  return (
    calculateMinutesFromMidnight12ClockUntil(endTime) -
    calculateMinutesFromMidnight12ClockUntil(startTime)
  );
}

function calculateWorkDurationInMinutes(workHours) {
  const workDurations = workHours.map((wh) =>
    calculateTimeDifferenceInMinute(wh.startTime, wh.endTime),
  );
  return sum(workDurations);
}

function convertMinuteToHour(duration) {
  return duration / 60;
}

const calculateWorkDuration = pipe(calculateWorkDurationInMinutes, convertMinuteToHour);

module.exports = { calculateWorkDuration };
