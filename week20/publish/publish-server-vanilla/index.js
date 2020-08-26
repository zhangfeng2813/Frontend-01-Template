const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const unzip = require('unzipper');

const server = http.createServer((req, res) => {
  if (req.url.match(/^\/auth/)) {
    // 2. 发起授权
    return auth(req, res);
  }

  let matched = req.url.match(/filename=([^&]+)/);

  let filename = matched && matched[1];

  if (!filename) {
    return;
  }

  if (!req.url.match(/^\/?/)) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('not found');
    return;
  }

  const options = {
    hostname: 'api.github.com',
    port: 443,
    path: `/user`,
    method: 'GET',
    headers: {
      Authorization: `token ${req.headers.token}`,
      'User-Agent': 'my-publish',
    },
  };
  // 6. 验证用户是否有权限发布
  const request = https.request(options, response => {
    let body = '';
    response.on('data', chunk => {
      body += chunk.toString();
    });
    response.on('end', () => {
      // \r\nRequest forbidden by administrative rules. Please make sure your request has a User-Agent header (http://developer.github.com/v3/#user-agent-required)
      // 出现这个errorMsg时说明少了User-Agent
      const user = JSON.parse(body);
      /**
       * 拿到github用户信息后 验证用户信息
       * {login: '7zf001', id: xxx, node_id: 'xxx', avatar_url: 'https://avatars3.githubusercontent.com/u/24474049?v=4', gravatar_id: ''}
       */
      if (user.login === '7zf001') {
        const writeStream = unzip.Extract({
          path: '../server/public/' + filename,
        });
        req.pipe(writeStream); // 等价与 req.on('data', chunk => writeStream.write(chunk))
        req.on('end', () => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.end('publish success!!');
        });
      }
    });
  });

  request.on('error', err => {
    console.log('err', err);
  });
  request.end();
});

function auth(req, res) {
  let codeRes = req.url.match(/code=([^&]+)/);
  let code = codeRes ? codeRes[1] : null;
  let stateRes = req.url.match(/state=([^&]+)/);
  let state = stateRes ? stateRes[1] : null;

  let params = {
    client_id: 'Iv1.beca133037ec18ad',
    client_secret: '10c09add244e2680f3b5842e4f732070df6bf65b',
    code,
    redirect_uri: 'http://localhost:8081/auth',
    state,
  };
  let paramsString = Object.keys(params)
    .map(key => `${key}=${encodeURIComponent(params[key])}`)
    .join('&');

  const options = {
    hostname: 'github.com',
    port: 443,
    path: `/login/oauth/access_token?${paramsString}`,
    method: 'POST',
  };

  // 3. 换取token步骤，
  const request = https.request(options, response => {
    response.on('data', d => {
      let result = d.toString().match(/access_token=([^&]+)/);
      if (result) {
        let token = result[1];
        // res.writeHead(200, {
        //   'Content-Type': 'text/html; charset=utf-8',
        //   access_token: token,
        // });
        // res.end(
        //   `<a href="http://localhost:8080/publish?token=${token}">发布</a>`
        // );
        let options = {
          hostname: 'localhost',
          port: 8080,
          path: `/publish?token=${token}`,
        };
        // 4. 将token给会tool客户端（如果有界面流程则渲染或者直接发起请求）
        http.get(options, res => {
          console.log('auth -> res', res);
          // res.on('end', () => {
          //   req.on('end', () => {
          //     res.writeHead(200, { 'Content-Type': 'text/plain' });
          //     res.end('okay !!');
          //   });
          // });
        });
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        res.end('授权成功!');
      } else {
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
        });
        res.end('code 已使用');
      }
    });
  });

  request.on('error', e => {
    console.error(e);
  });
  request.end();
}

server.listen(8081);
