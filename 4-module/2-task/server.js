const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const pulicDir = path.join(__dirname, "files");
  const filepath = path.join(pulicDir, pathname);

  if (path.parse(filepath).dir !== pulicDir) {
    res.statusCode = 400;
    res.end("Bad path");
    return;
  }

  switch (req.method) {
    case "POST":
      {
        const writeStream = fs.createWriteStream(filepath, { flags: "wx" });
        const limitStream = new LimitSizeStream({ limit: 1e6 });

        req.pipe(limitStream).pipe(writeStream);

        req.on("aborted", () => {
          limitStream.destroy();
          writeStream.destroy();

          fs.unlink(filepath, err => {
            //console.log(err);
          });

          res.end();
        });
        // .on("close", () => {
        //   console.log("close req");
        // })
        // .on("open", () => {
        //   console.log("open req");
        // })
        // .on("data", () => {
        //   console.log("data req");
        // })
        // .on("end", () => {
        //   console.log("end req");
        // });

        limitStream.on("error", err => {
          //console.log("limit error");
          if (err.code === "LIMIT_EXCEEDED") {
            res.statusCode = 413;
          } else {
            res.statusCode = 500;
          }

          if (!res.headersSent) {
            res.setHeader("connection", "close");
          }
          res.end("limit error");

          writeStream.destroy();
          fs.unlink(filepath, err => {
            //console.log(err);
          });
        });

        writeStream
          .on("error", err => {
            //console.log("ws error");
            if (err.code === "EEXIST") {
              res.statusCode = 409;
            } else {
              res.statusCode = 500;
            }

            if (!res.headersSent) {
              res.setHeader("connection", "close");
            }

            res.end("ws error");
          })
          .on("close", () => {
            //console.log("ws close");
            res.statusCode = 201;
            res.end("ok");
          });
      }

      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
