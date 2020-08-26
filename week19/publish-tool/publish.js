const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const archiver = require('archiver');
const public_path = path.resolve(__dirname, './');
let filename = public_path + '/cat.jpg';

let packname = './package';

// fs.stat(filename, (error, stats) => {
const options = {
  host: 'localhost',
  port: 8081,
  method: 'POST',
  path: '/?filename=' + 'package.zip',
  headers: {
    'Content-Type': 'application/octet-stream',
  },
};

var archive = archiver('zip', { zlib: { level: 9 } });

archive.directory(packname, false);

archive.finalize();

const req = http.request(options, res => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
});

req.on('error', e => {
  console.error(`problem with request: ${e.message}`);
});

archive.pipe(req);

archive.on('end', () => {
  console.log('end');
});
