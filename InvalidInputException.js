class InvalidInputException extends Error {
  constructor(msg) {
    super();
    this.name = 'InvalidInput';
    this.message = msg || 'Input is Invalid';
  }
}

module.exports = InvalidInputException;
