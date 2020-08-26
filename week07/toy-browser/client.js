const net = require('net');
const utf8 = require('./utf8.js');
const parser = require('./parser.js');
const render = require('./render.js');
const images = require('images')
const path = require('path');

class Request {
  constructor(options) {
    this.method = options.method || 'GET'
    // 解析url
    const url = new URL(options.url || '');
    this.host = url.hostname;
    this.path = url.pathname;
    this.port = url.port || 80;
    this.body = options.body || {};
    this.headers = options.headers || {};

    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/www-form-urlencoded';
    }
    if (this.headers['Content-Type'] === 'applicatin/json') {
      this.bodyText = JSON.stringify(this.body)
    } else if (this.headers['Content-Type'] === 'application/www-form-urlencoded') {
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURI(this.body[key])}`).join('&')
    }

    this.headers['Content-Length'] = this.bodyText.length;
  }

  toMessage() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}
`;
  }

  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (connection) {
        connection.write(this.toMessage())
      } else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          // console.log('Request:')
          // console.log(this.toMessage())
          connection.write(this.toMessage())
        });
      }
      connection.on('data', (data) => {
        parser.receive(data.toString())
        const stateLines = parser.stateLine.split(/\s/);
        const response = {
          status: stateLines[1],
          statusText: stateLines[2],
          headers: parser.headers,
          body: parser.bodyParser.body,
        }
        resolve(response)
        connection.end();
      });
      connection.on('end', () => {
        console.log('disconnected from server');
      });
      connection.on('error', (err) => {
        console.log("err", err)
        reject(err)
      })
    })
  }
}

class Response { }

class ResponseParser {
  constructor() {
    // 在没遇到\r时的状态
    this.WAITING_STATE_LINE = 0;
    // 遇到\n时的状态
    this.WAITING_STATE_LINE_END = 1;

    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_LINE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;

    this.WAITING_BODY = 8;
    this.WAITING_BODY_START = 9;

    // 当前状态
    this.currentState = this.WAITING_STATE_LINE;

    this.stateLine = '';
    this.headers = {};
    this.headerName = '';
    this.headerValue = '';
    this.bodyParser = null;
  }
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string[i])
    }
  }
  receiveChar(char) {
    // 开始组织state line部分
    if (this.currentState === this.WAITING_STATE_LINE) {
      if (char === '\r') {
        // 当state line遇到\r表示结束
        this.currentState = this.WAITING_STATE_LINE_END;
      } else {
        this.stateLine += char;
      }
      return;
    }

    if (this.currentState === this.WAITING_STATE_LINE_END && char === '\n') {
      // 当state line遇到\n表示开始的是header部分
      this.currentState = this.WAITING_HEADER_NAME;
      return;
    }

    // 开始组织header部分
    if (this.currentState === this.WAITING_HEADER_NAME) {
      if (char === ':') {
        this.currentState = this.WAITING_HEADER_SPACE
      } else if (char === '\r') {
        this.currentState = this.WAITING_BODY;
      } else {
        this.headerName += char;
      }
    }

    if (this.currentState === this.WAITING_HEADER_SPACE && char === ' ') {
      this.currentState = this.WAITING_HEADER_VALUE;
      return;
    }

    if (this.currentState === this.WAITING_HEADER_VALUE) {
      if (char === '\r') {
        this.headers[this.headerName] = this.headerValue;
        this.headerName = '';
        this.headerValue = '';
        this.currentState = this.WAITING_HEADER_LINE_END;
      } else {
        this.headerValue += char;
      }
      return;
    }

    // 在header line end中遇到\n重新回到header name 循环
    if (this.currentState === this.WAITING_HEADER_LINE_END && char === '\n') {
      this.currentState = this.WAITING_HEADER_NAME;
      return;
    }

    if (this.currentState === this.WAITING_HEADER_BLOCK_END) {
      this.currentState = this.WAITING_BODY;
      return;
    }

    if (this.currentState === this.WAITING_BODY) {
      // 吞掉body上行的\r\n
      if (char === '\r') return;
      if (char === '\n') return;
      this.currentState = this.WAITING_BODY_START;
    }

    if (this.currentState === this.WAITING_BODY_START) {
      if (this.headers['Transfer-Encoding'] === 'chunked') {
        // this.bodyParser必须是单例
        if (!this.bodyParser) {
          this.bodyParser = new ThunkBodyParser();
        }
        this.bodyParser.receiveChar(char)
      }
    }
  }
}


class ThunkBodyParser {
  constructor() {
    this.WAITING_CHUNK_LENGTH = 0;
    this.WAITING_CHUNK_LENGTH_END = 1;
    this.WAITING_CHUNK_BODY = 2;

    this.currentState = this.WAITING_CHUNK_LENGTH;

    // chunk length 是十六进制
    this.currentChunkLength = '';
    this.body = '';
    this.bodyBuffer = [];
  }
  receiveChar(char) {
    if (this.currentState === this.WAITING_CHUNK_LENGTH) {
      if (char === '\r') {
        // 将ChunkLength转换十进制
        this.currentChunkLength = parseInt(this.currentChunkLength, 16)
        this.currentState = this.WAITING_CHUNK_LENGTH_END;

      } else {
        this.currentChunkLength += '' + char;
      }
      return;
    }

    if (this.currentState === this.WAITING_CHUNK_LENGTH_END && char === '\n') {
      this.currentState = this.WAITING_CHUNK_BODY;
      return;
    }

    if (this.currentState === this.WAITING_CHUNK_BODY) {
      // 当获取hody内容时再次遇到\\n时回到WAITING_CHUNK_LENGTH循环
      if (this.currentChunkLength > 0) {
        // 因为中文最多有4个字节，需要将char转换utf8格式
        const chars = utf8.stringToBytes(char);
        for (let i = 0; i < chars.length; i++) {
          this.bodyBuffer.push(chars[i]);
          this.currentChunkLength--
        }
      } else {
        // 吞掉每行body结束的\r\n  
        if (char === '\r') {
          this.body += utf8.bytesToString(this.bodyBuffer);
          this.bodyBuffer = []
          return;
        };
        if (char === '\n') return;
        this.currentState = this.WAITING_CHUNK_LENGTH
      }
    }
  }
}

void async function () {
  let req = new Request({
    method: 'POST',
    url: 'http://127.0.0.1:8088/',
    body: {
      name: 'jeff',
    }
  })
  const res = await req.send()
  const dom = parser.parserHTML(res.body);

  const viewport = images(800, 600);
  render(viewport, dom)
  viewport.save(path.resolve(__dirname, './viewport.jpg'))
}()