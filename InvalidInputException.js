class InvalidInputException extends Error {
  constructor(msg) {
    super();
    this.name = 'InvalidInput';
    this.message = msg;
  }
}

module.exports = InvalidInputException;
