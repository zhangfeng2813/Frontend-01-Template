const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const archiver = require('archiver');
const child_process = require('child_process');
const public_path = path.resolve(__dirname, './');
let filename = public_path + '/cat.jpg';

let packname = './package';

let url = 'https://github.com/login/oauth/authorize?';
let params = {
  client_id: 'Iv1.beca133037ec18ad',
  redirect_uri: 'http://localhost:8081/auth?id=123',
  scope: 'read:user',
  state: '123abc',
};
url += Object.keys(params)
  .map(key => `${key}=${encodeURIComponent(params[key])}`)
  .join('&');

// 1. 打开授权页并启动一个服务接收token，授权成功会回调到publish-server服务中进行换取token
child_process.exec(`open ${url}`);

// 5. 收到了token后，将package打包传输回publish-server
const server = http.createServer((req, res) => {
  let tokenRes = req.url.match(/token=([^&]+)/);
  console.log('real publish');
  if (tokenRes) {
    let token = tokenRes[1];
    console.log('token', token);

    const options = {
      host: 'localhost',
      port: 8081,
      method: 'POST',
      path: '/?filename=' + 'package.zip',
      headers: {
        token,
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
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('publish success!!');
      server.close();
    });
  }
});

server.listen(8080);
