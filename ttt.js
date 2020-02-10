const stream = require("stream");
const fs = require("fs");

class MyStream extends stream.Transform {
  _transform(chunck, encoding, callback) {
    this.push(1 + chunck);
    this.push(2 + chunck);
    this.push(3 + chunck);
    callback();
  }
}

const str = new MyStream();

str.on("data", data => {
  console.log("DATA", data.toString());
});

str.write("AAAA");
str.write("BBBB");
