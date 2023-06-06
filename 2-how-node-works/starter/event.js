const http = require("http");
const url = require("url");
const fs = require("fs");
const server = http.createServer();

// server.on("request", (req, res) => {
//   console.log(req.url);
//   res.end("here is the response");
// });

server.on("request", (req, res) => {
  const readable = fs.createReadStream("./test-file.txt");
  readable.pipe(res);
});

server.listen(8000, "127.0.0.1", () => {
  console.log("waiting for server request...");
});
