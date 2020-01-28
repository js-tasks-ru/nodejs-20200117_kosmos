const stream = require("stream");
const os = require("os");

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.str = "";
  }

  /**
   * This callback type is called `requestCallback` and is displayed as a global symbol.
   *
   * @callback transformCallback
   * @param {Error} err
   * @param {string} data
   */

  /**
   * Blend two colors together.
   * @param {Buffer} chunk - The first color, in hexadecimal format.
   * @param {string} encoding - The second color, in hexadecimal format.
   * @param {transformCallback} callback - The second color, in hexadecimal format.
   */
  _transform(chunk, encoding, callback) {
    if (chunk.length === 0) {
      callback();
      return;
    }

    const str = chunk.toString(this.encoding);
    const hasEOL = str.includes(os.EOL);
    const startsWithEOL = str.startsWith(os.EOL);
    const endsWithEOL = str.endsWith(os.EOL);

    if (!hasEOL) {
      this.str += str;
      callback();
      return;
    }

    // Будет иметь минимум 2 элемента
    let splited = chunk.toString(this.encoding).split(os.EOL);
    splited[0] = this.str + splited[0];
    this.str = "";

    const last = splited[splited.length - 1];
    if (!endsWithEOL && last.length > 0) {
      this.str = last;
      splited = splited.slice(0, -1);
    }

    splited.forEach(item => {
      if (item.length > 0) {
        this.push(item);
      }
    });

    callback();
  }

  _flush(callback) {
    if (this.str.length) {
      this.push(this.str);
    }
    callback();
  }
}

// const lines = new LineSplitStream({
//   encoding: "utf-8"
// });

// function onData(line) {
//   console.log("data", line);
// }

// lines.on("data", onData);

// lines.write("a");
// lines.write(`b${os.EOL}c`);
// lines.write(`d${os.EOL}e`);
// lines.write("f");

// lines.end();

module.exports = LineSplitStream;
