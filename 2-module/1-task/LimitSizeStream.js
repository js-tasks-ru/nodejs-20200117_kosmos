const stream = require("stream");
const fs = require("fs");
const LimitExceededError = require("./LimitExceededError");

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this.limit = options.limit;
    this.dataSize = 0;
  }

  _transform(chunk, encoding, callback) {
    if (this.dataSize + chunk.length > this.limit) {
      callback(new LimitExceededError());
    } else {
      this.dataSize += chunk.length;
      callback(null, chunk);
    }
  }
}

module.exports = LimitSizeStream;
