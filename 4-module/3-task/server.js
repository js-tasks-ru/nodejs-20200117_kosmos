const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");

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
    case "DELETE":
      fs.unlink(filepath, err => {
        if (err) {
          if (err.code === "ENOENT") {
            res.statusCode = 404;
            res.end();
          } else {
            res.statusCode = 500;
            res.end();
          }
        } else {
          res.end();
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
