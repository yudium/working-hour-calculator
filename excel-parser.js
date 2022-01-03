const InvalidInputException = require('./InvalidInputException');

function isTotalQuoteNotBalanced(input) {
  const matches = input.match(/"/g);
  const totalQuote = matches === null ? 0 : matches.length;
  return totalQuote % 2 !== 0;
}

function isSinglelineCellButFormatedAsMultiline(line) {
  return /^".*"$/.test(line.trim());
}

function isMultilineCellBegin(line, isOnMultilineCell) {
  return !isOnMultilineCell && line.trim().startsWith('"');
}

function isMultilineCellEnd(line , isOnMultilineCell) {
  return isOnMultilineCell && line.trim().endsWith('"');
}

function getLastElementArray(arr) {
  return arr[arr.length - 1];
}

function getCopyArrayWithLastElementExcluded(arr) {
  return arr.slice(0, arr.length - 1);
}

function parse(input) {
  if (isTotalQuoteNotBalanced(input)) {
    throw new InvalidInputException('Multiline cell format is incorrect');
  }

  const lines = input.split('\n');

  let cells = [];
  let isOnMultilineCell = false;
  lines.map((line) => line.trim()).forEach((line) => {
    if (isSinglelineCellButFormatedAsMultiline(line)) {
      cells.push(line.replace(/"/g, ''));
    } else if (isMultilineCellEnd(line, isOnMultilineCell)) {
      isOnMultilineCell = false;

      const lastCellContent = getLastElementArray(cells);
      cells = [
        ...getCopyArrayWithLastElementExcluded(cells),
        lastCellContent + '\n' + line.replace(/"/g, '')
      ]
    } else if (isMultilineCellBegin(line, isOnMultilineCell)) {
      isOnMultilineCell = true;

      cells = [
        ...cells,
        line.replace(/"/g, '')
      ]
    } else if (isOnMultilineCell) {
      const lastCellContent = getLastElementArray(cells);
      cells = [
        ...getCopyArrayWithLastElementExcluded(cells),
        lastCellContent + '\n' + line
      ]
    } else {
      cells.push(line);
    }
  })

  return cells
    .map((value) => value.trim())
    .filter((value) => value !== '');
}

module.exports = { parse }