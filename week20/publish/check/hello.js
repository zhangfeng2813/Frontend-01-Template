// 启动local server

// 对元素断言

var page = require('webpage').create();
page.open('https://www.baidu.com/', function(status) {
  var title = page.evaluate(function() {
    console.log("document", document.body)
    return document.title;
  });
  console.log('Page title is ' + title);
  phantom.exit();
});