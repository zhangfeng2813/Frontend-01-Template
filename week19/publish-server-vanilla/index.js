const http = require('http');
const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');

// Create an HTTP server
const server = http.createServer((req, res) => {
  let matched = req.url.match(/filename=([^&]+)/);

  let filename = matched && matched[1];
  console.log("filename", filename)

  if (!filename) {
    return;
  }

  // const writeStream = unzip.Extract({ path: '../server/public/' + filename });
  // const writeStream = fs.createWriteStream("../server/public/" + filename);
  const writeStream = unzip.Extract({ path: '../server/public/' + filename })
  req.pipe(writeStream); // 等价与 req.on('data', chunk => writeStream.write(chunk))
  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  });
});

server.listen(8081);
