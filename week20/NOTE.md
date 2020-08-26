# 每周总结可以写在这里

# 无头浏览器

phantomjs

puppetter

# eslint

# 利用github来做发布验证权限

## 1. 请求用户的GitHub身份

创建 GET 请求

```
GET https://github.com/login/oauth/authorize
client_id
redirect_uri 需要encode
login
scope
state
```

https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/

打开授权页并启动一个服务接收token，授权成功会回调到publish-server服务中进行换取token

## 2. 获取code换取token

在回调地址中获取`code`后发起一个换取token的请求

```
POST https://github.com/login/oauth/access_token

client_id
client_secret
code
redirect_uri
state
```

将token给会tool客户端（如果有界面流程则渲染或者直接发起请求）

## 3. 拿到token后就能请求github的其他接口了

publish客户端收到了token后，将package打包传输回publish-server

publish-server请求github的user api，拿到github用户信息后验证用户信息

