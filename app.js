const readline = require('readline');
const calculator = require('./calculator');
const inputParser = require('./input-parser');
const excelParser = require('./excel-parser');
const InvalidInputException = require('./InvalidInputException');

function main(userInput) {
  try {
    const workHours = inputParser.parse(userInput);
    const duration = calculator.calculateWorkDuration(workHours);
    console.log('The duration in hour:', duration);
  } catch (e) {
    if (e instanceof InvalidInputException) {
      console.log('Validation error:', e.message);
    } else {
      throw e;
    }
  }
}

function mainExcel(userInput) {
  try {
    const workHourCells = excelParser.parse(userInput);
    workHourCells.forEach((userInputWorkHours) => {
      const workHours = inputParser.parse(userInputWorkHours);
      const duration = calculator.calculateWorkDuration(workHours);
      console.log('The duration in hour:', duration);
    });
  } catch (e) {
    if (e instanceof InvalidInputException) {
      console.log('\nValidation error:', e.message);
    } else {
      throw e;
    }
  }
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log('Hint: Control-C to process or exit.\n\n');

console.log('Available types:');
console.log('0. Manual typing');
console.log('1. Paste from excel\n');
console.log('Please select your type:');

const USER_INPUT = '0';
const EXCEL_INPUT = '1';

function isInputTypeExists(inputType) {
  return [USER_INPUT, EXCEL_INPUT].includes(inputType);
}

const input = [];
let selectedInputType = null;

rl.on('line', function (line) {
  if (selectedInputType === null) {
    const inputType = line.trim();
    if (!isInputTypeExists(inputType)) {
      console.error('\nInvalid type');
      process.exit(0);
    }
    selectedInputType = inputType;
    console.log('\nPaste working hour here:');
  } else {
    input.push(line);
  }
});

rl.on('close', function () {
  console.log('\n');
  if (selectedInputType === EXCEL_INPUT) {
    mainExcel(input.join('\n'));
  }
  if (selectedInputType === USER_INPUT) {
    main(input.join('\n'));
  }
  process.exit(0);
});
