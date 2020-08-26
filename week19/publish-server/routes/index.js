var express = require('express');
const fs = require('fs');
var router = express.Router();

/* GET home page. */
router.post('/', function (request, res, next) {
  // let body = []
  // request.on('data', chunk => {
  // console.log("chunk", chunk)
  //   body.push(chunk);
  // }).on('end', () => {
  //   body = Buffer.concat(body).toString();
  // })
  let body = [];
  req.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log('body', body.toString())
    fs.writeFileSync(`../server/public/${request.query.filename}`, body)
  })

  // console.log("request.body", request)
  // fs.writeFileSync(`../server/public/${request.query.filename}`, request.body.content);
  res.send('');
  res.end('')
});

module.exports = router;
