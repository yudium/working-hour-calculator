const { parse } = require('../input-parser');
const InvalidInputException = require('../InvalidInputException');

function expectThrowInvalidInput(callbackForParse) {
  expect(callbackForParse).toThrow(InvalidInputException);
}

test('given arbitrary string throw invalid exception', () => {
  expectThrowInvalidInput(() => parse(''));
  expectThrowInvalidInput(() => parse(' '));
  expectThrowInvalidInput(() => parse('\n'));
  expectThrowInvalidInput(() => parse('abc'));
});

test('given work hours from user input returns correctly parsed work hours', () => {
  expect(parse('10:00 - 11:00')).toEqual([{ startTime: '10:00', endTime: '11:00' }]);
  expect(
    parse(`
      10:00 - 11:00
      12:00 - 15:00
  `),
  ).toEqual([
    { startTime: '10:00', endTime: '11:00' },
    { startTime: '12:00', endTime: '15:00' },
  ]);
});

test('given invalid work hour throw invalid exception', () => {
  const workHourWithInvalidFormat = '9:50 - 15:00';
  const workHourWithUnknownChar = 'a1:50 - 15:00';
  const workHourWithUnknownChar2 = '09:50 - 15:00 abc';
  const wotkHourWithFakeHourOfStartTime = '77:00 - 99:00';
  const wotkHourWithFakeHourOfEndTime = '12:00 - 88:00';
  const workHourWithFakeMinuteOfStarTime = '12:99 - 13:99';
  const workHourWithFakeMinuteOfEndTime = '12:00 - 13:98';
  const workHourWithIncorrectOrder = '11:00 - 10:00';
  expectThrowInvalidInput(() => parse(workHourWithInvalidFormat));
  expectThrowInvalidInput(() => parse(workHourWithUnknownChar));
  expectThrowInvalidInput(() => parse(workHourWithUnknownChar2));
  expectThrowInvalidInput(() => parse(wotkHourWithFakeHourOfStartTime));
  expectThrowInvalidInput(() => parse(wotkHourWithFakeHourOfEndTime));
  expectThrowInvalidInput(() => parse(workHourWithFakeMinuteOfStarTime));
  expectThrowInvalidInput(() => parse(workHourWithFakeMinuteOfEndTime));
  expectThrowInvalidInput(() => parse(workHourWithIncorrectOrder));
});

test('Given overlapping work hour throw invalid exception', () => {
  const overlappingInside = `
  10:00 - 11:00
  10:30 - 10:45
  `;
  const overlappingExactly = `
  10:00 - 11:00
  10:00 - 11:00
  `;
  const overlappingOnStartTime = `
  10:00 - 11:00
  10:59 - 12:00
  `;
  const overlappingOnEndTime = `
  09:30 - 10:01
  10:00 - 11:00
  `;
  const overlappingOnBothStartTimeAndEndTime = `
  09:00 - 10:00
  09:59 - 11:01
  11:00 - 12:00
  `;
  expectThrowInvalidInput(() => parse(overlappingInside));
  expectThrowInvalidInput(() => parse(overlappingExactly));
  expectThrowInvalidInput(() => parse(overlappingOnStartTime));
  expectThrowInvalidInput(() => parse(overlappingOnEndTime));
  expectThrowInvalidInput(() => parse(overlappingOnBothStartTimeAndEndTime));
});

test('Given tight work hour do not mark it as overlapping', () => {
  expect(() =>
    parse(`
      10:00 - 11:00
      11:00 - 12:00
    `),
  ).not.toThrow();
});
