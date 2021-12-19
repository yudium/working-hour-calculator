const { calculateWorkDuration } = require('../calculator');

test('given empty work hours returns zero', () => {
  const emptyWorkHours = [];
  expect(calculateWorkDuration(emptyWorkHours)).toBe(0);
});

test('given a work hour returns correct duration in hour', () => {
  expect(calculateWorkDuration([{ startTime: '12:00', endTime: '12:30' }])).toBe(0.5);
  expect(calculateWorkDuration([{ startTime: '12:00', endTime: '12:45' }])).toBe(0.75);
  expect(calculateWorkDuration([{ startTime: '12:00', endTime: '12:48' }])).toBe(0.8);
  expect(calculateWorkDuration([{ startTime: '12:00', endTime: '13:00' }])).toBe(1);
  expect(calculateWorkDuration([{ startTime: '12:00', endTime: '14:00' }])).toBe(2);
  expect(calculateWorkDuration([{ startTime: '00:00', endTime: '24:00' }])).toBe(24);
});

test('given sequence of work hour returns correct duration in hour', () => {
  expect(
    calculateWorkDuration([
      { startTime: '10:00', endTime: '11:00' },
      { startTime: '12:00', endTime: '12:45' },
      { startTime: '13:00', endTime: '15:00' },
    ]),
  ).toBe(3.75);
});
