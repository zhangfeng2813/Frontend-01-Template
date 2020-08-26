# 每周总结可以写在这里

# 用 yeoman 实现工具链

## 1. 创建 yeoman 项目

创建项目 generator-toy-tool，并安装依赖

```
npm i -D yeoman-generator
```

创建 app 文件夹，文件夹下创建 index.js 开始编写脚手架相关的逻辑

```index.js
var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
  }
  // 脚本会依照书写方法的顺序依次执行
  method1() {
    this.log('method 1 just ran');
  }
};

```

最后在项目下执行 npm link,在本地创建一个软链接,`.../node/v10.13.0/lib/node_modules/generator-toy-tool` 映射到 `.../generator/toy-tool`

在执行`yo toy-tool`命令时，会找到 node modules 的`generator-toy-tool`指向的地址。

> 如果项目名 yeoman 项目名需要修改，则将 package.json 中的 name 修改成`generator-xxx`再执行 npm lnik，然后`yo xxx`即可

## 2. 初始化依赖

npm install 需要的依赖

有三种安装依赖的方式：

1. this.npmInstall 方法安装

```
installingLodash() {
    this.npmInstall(['lodash'], { 'save-dev': true });
  }
```

2. 创建一个 package.json 并写入依赖

```
writing() {
  const pkgJson = {
    devDependencies: {
      eslint: '^3.15.0'
    },
    dependencies: {
      react: '^16.2.0'
    }
  };

  // Extend or create package.json file in destination path
  this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
}

install() {
  this.npmInstall();
}
```

3. 编写 package.json 的 template

编写好一个 package.json 再用 this.fs.copyTpl 方法来生成 template

```
this.fs.copyTpl(
  this.templatePath('package.json'),
  this.destinationPath('package.json')
);
this.npmInstall();
```

## 3. 生成文件

利用 this.fs.copyTpl 方法生成文件。

# 发布系统

两个服务器 express 服务 和 真正意义上的服务

需要输出三个项目，他们分别的角色是：

- publish-server 接收内网开发的服务

- publish-tool 执行发布的脚本

- server 被部署的环境

> 初级形态：同机发布在 publish-server 中的输出文件到 server 的 public 中

正式生产中，我们需要做到：

- 验证用户
- 版本管理
- 权限管理

## 实现流式传输一个图片

1. 使用`fs.stat`获取一张图片的 size

```
let filename = public_path + '/cat.jpg';
fs.stat(filename, (error, stats) => {

  // ...

})

```

2. 创建可读流(ReadStream)并将其传输到 server

```

fs.stat(filename, (error, stats) => {

  const options = {
    host: 'localhost',
    port: 8081,
    method: 'POST',
    path: '/?filename=cat.jpg',
    headers: {
      'Content-Type': 'application/octet-stream',
      'Content-Length': stats.size,
    },
  };

  // http.request返回一个http.ClientRequest类，这个类是继承着<Stream>所以它能够被pipi管道执行。
  const req = http.request(options, res => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  });

  // 读取文件数据
  let rs = fs.createReadStream(filename); // 返回ReadStream对象

  // 将流数据传入req流中后发起请求
  rs.pipe(req);

  // 监听请求结束
  rs.on('end', () => {
    req.end();
  });
})

```

> readable.pipe https://nodejs.org/docs/latest-v13.x/api/fs.html#stream_class_stream_readable

3. server 接收流数据

```
// 创建服务并监听8081端口
const server = http.createServer((req, res) => {

  // 获取文件名
  let matched = req.url.match(/filename=([^&]+)/);

  let filename = matched && matched[1];

  // 创建一个可写流
  const writeStream = fs.createWriteStream("../server/public/" + filename);

  // 将请求中body chunk写入流中
  req.pipe(writeStream)

  // 等价与 req.on('data', chunk => writeStream.write(chunk))

  req.on('end', () => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('okay');
  });
})

server.listen(8081);
```

### http server 处理 steam 数据

方法一：
监听 data 事件 将 body 数据合并一起，监听 end 事件得到最终全部 steam 合并起来的数据。

方法二：
使用 fs.createWriteStream 创建一个文件流，request.pipe(writeSteam)

### 获取文件 size

fs.stat(filepath, (err, stat) => { stat.size })

## 压缩

1. 使用`archiver`来压缩我们的`package`文件夹

```
let packname = './package';

var archive = archiver('zip', { zlib: { level: 9 } });

// 将archive数据写入package.zip文件中
// archive.pipe(fs.createWriteStream('./package.zip'));

archive.directory(packname, false);

// 必须执行finalize方法，否则无法解压zip
archive.finalize();

```

2. 得到一个 zip 压缩包后，pipe 到请求中

```

const options = {
  host: 'localhost',
  port: 8081,
  method: 'POST',
  path: '/?filename=' + 'package.zip',
  headers: {
    'Content-Type': 'application/octet-stream',
  },
};

const req = http.request(options, res => {});

archive.pipe(req);

archive.on('end', () => {
  console.log('end');
});

```

> 必须执行 archive.finalize 方法，否则无法解压 zip

# server端 解压

1. 使用`unzipper`库来进行解压

```

const writeStream = unzip.Extract({ path: '../server/public/' + filename })
req.pipe(writeStream); // 等价与 req.on('data', chunk => writeStream.write(chunk))

```

