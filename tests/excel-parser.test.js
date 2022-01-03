const InvalidInputException = require("../InvalidInputException");
const { parse } = require("../excel-parser");

function expectThrowInvalidInput(callbackForParse) {
  expect(callbackForParse).toThrow(InvalidInputException);
}

test('given emptiness return empty array', () => {
  expect(parse('')).toEqual([]);
  expect(parse(' ')).toEqual([]);
  expect(parse('\n')).toEqual([]);
});

test('given singleline cell return correct parsed work hour', () => {
  expect(parse(`09:00 - 10:00`)).toEqual(['09:00 - 10:00']);
  expect(parse(`
    09:00 - 10:00
    12:00 - 13:00
  `)).toEqual(['09:00 - 10:00', '12:00 - 13:00']);
});

test('given unbalanced quote throw error', () => {
  expectThrowInvalidInput(() => parse(`"`));
  expectThrowInvalidInput(() => parse(`
    "10:00 - 11:00
    12:00 - 15:00
  `));
  expectThrowInvalidInput(() => parse(`
    10:00 - 11:00
    12:00 - 15:00"
  `));
});

test('given empty multiline cell then ignores it', () => {
  expect(parse(`""`)).toEqual([]);
  expect(parse(`" "`)).toEqual([]);
});

test('given singleline cell formated as multiline cell then parse it correctly', () => {
  expect(parse(`"09:00 - 10:00"`)).toEqual(['09:00 - 10:00']);
});

test('given normal multiline cell then parse it correctly', () => {
  expect(parse(`
    "09:00 - 10:00
    12:00 - 13:00"
  `)).toEqual([
    `09:00 - 10:00
12:00 - 13:00`
]);
  expect(parse(
    `"09:00 - 10:00
    12:00 - 13:00"

    "15:00 - 17:00
    18:00 - 19:00"`
  )).toEqual([
    `09:00 - 10:00
12:00 - 13:00`,

    `15:00 - 17:00
18:00 - 19:00`,
  ]);
})

test('given multiline cell with quote placed randomly then parse it correctly', () => {
  expect(parse(`
  "
  09:00 - 10:00
  12:00 - 13:00
  "
  `)).toEqual([
  `09:00 - 10:00
12:00 - 13:00`
  ]);
  expect(parse(`
  "
  09:00 - 10:00
  12:00 - 13:00
  "
  `)).toEqual([
    `09:00 - 10:00
12:00 - 13:00`
  ]);
expect(parse(`
  "09:00 - 10:00
  12:00 - 13:00
  "
`)).toEqual([
  `09:00 - 10:00
12:00 - 13:00`
]);
expect(parse(`
  "
  09:00 - 10:00
  12:00 - 13:00"
`)).toEqual([
  `09:00 - 10:00
12:00 - 13:00`
]);
});

test('given singleline and multiline cell then parse it correctly', () => {
  expect(parse(`
    09:00 - 10:00

    "10:00 - 11:00
    11:00 - 12:00
    12:00 - 15:00"

    13:00 - 15:00

    "16:00 - 17:00
    20:00 - 21:00"
  `)).toEqual([
    '09:00 - 10:00',

    `10:00 - 11:00
11:00 - 12:00
12:00 - 15:00`,

    '13:00 - 15:00',

    `16:00 - 17:00
20:00 - 21:00`
  ]);
});