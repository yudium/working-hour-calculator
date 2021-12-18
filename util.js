function pipe(...ops) {
  return ops.reduce((a, b) => (arg) => b(a(arg)));
}

module.exports = { pipe };
