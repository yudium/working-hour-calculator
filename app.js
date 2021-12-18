const readline = require('readline');
const calculator = require('./calculator');
const inputParser = require('./input-parser');
const InvalidInputException = require('./InvalidInputException');

function main(userInput) {
  try {
    const workHours = inputParser.parse(userInput);
    const duration = calculator.calculateWorkDuration(workHours);
    console.log('\nThe duration in hour:', duration);
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
console.log('Paste working hour here:');

const input = [];
rl.on('line', function (line) {
  input.push(line);
});

rl.on('close', function () {
  main(input.join('\n'));
  process.exit(0);
});
