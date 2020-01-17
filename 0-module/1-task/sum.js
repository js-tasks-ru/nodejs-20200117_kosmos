function sum(a, b) {
  const check = [a, b].every((arg) => typeof arg === 'number');

  if (check) {
    return a + b;
  } else {
    throw new TypeError('Only numbers allowed');
  }
}

module.exports = sum;
