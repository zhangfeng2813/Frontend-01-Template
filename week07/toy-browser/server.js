const http = require('http')

// Returns content-type = text/plain
const server = http.createServer((req, res) => {
  console.log('--------------start------------------')
  // console.log("req", req)
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Foo', 'bar');
  res.writeHead(200, { 'Content-Type': 'text/html', 'Charset': 'utf-8' });
  res.end(`<html lang="zh">
  <head>
    <style>
    div {
      width: 100px;
      height: 100px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: space-between;
      background-color: rgb(155, 214, 255);
    }
    
    section {
      width: 30px;
      height: 30px;
      background-color: rgb(107, 255, 133);
    }
    </style>
  </head>
  <body>
  <div>
  <section style="align-self: center;">1</section>
  <section>2</section>
  <section style="align-self: flex-end;">3</section>
  <section>4</section>
  <section style="align-self: flex-end;">5</section>
  <section style="align-self: center;">4</section>
</div>
  </body>
  </html>`);
});

server.listen(8088)

// http client