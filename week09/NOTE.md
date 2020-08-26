# 重学CSS

[CSS属性脑图]

## 渲染和颜色

CMYK

C：Cyan ＝ 青色，常被误称为“天蓝色”或“湛蓝”
M：Magenta ＝ 洋红色，又称为“品红色”
Y：Yellow ＝ 黄色
K：blacK ＝ 黑色

RGB

R: red
G: green
B: blue

HSL HSV

H: hue 色调
S: saturation 饱和度: 100% 是满饱和度，而 0% 是一种灰度。
L: lightness 亮度: 100% 亮度是白色， 0% 亮度是黑色，而 50% 亮度是“一般的”。
V: value

color: <关键字> | rgb() | rgba() | hsl() | hsla()

## 形状

* border
* box-shadow
* border-radius

矢量图

栅格化

data: uri + svg

svg 实现任何形状的矢量图

> 建议使用svg做任何形状，而不是用border模拟

# 重学HTML

> 定义 XML 和 SGML

DTD

XHTML2.0

whatwg

> SGML用DTD描述

> DTD 以实体方式（&符号开始）定义

https://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd

&nbsp;non-breaking space 不建议当作空格

在html中使用多个空格方法：
1. `<pre>`
2. white-space: pre-wrap (容许换行) | pre (一般不用);

# HTML标签-语义

[论文](http://static001.geekbang.org/static/time/quote/World_Wide_Web-Wikipedia.html)

* aside 描述非主体部分的内容。
* main 主体文章内容。seo找main的核心内容
* article
* hgroup: h1 h2
* hr 元素表示段落级元素之间的主题转换
* abbr 缩写
* time
* samp
* address 本篇作者的联系地址例如邮箱地址

> 完善知识体系中的HTML语义部分

# 合法元素

* Element
* Text
* Comment
* DocumentType
* ProcessingInstruction: <?a 1?>
* CDATA: <!CDATA[]>

# 重学Document

DocumentFragment: 文档片段

用于批量添加元素

## 导航类操作

* parentNode
* childNodes
* firstChild
* lastChild
* nextSibling
* previousSibling

## 修改操作

* appendChild
* insertBefore
* removeChild
* replaceChild

> element insert到a位置，再insert到b位置，实际流程是：先insert到a位置，再a 中remove，再insert到b

> childNodes 是 living colection 会实时的变化

## 高级操作

* compareDocumentPosition

## Event

EventTarget

once: 一次
passive : 不会preventDefault，阻止滚动需要加上

> 第二个参数可以为对象： addEventListenter('click', { handleEvent: () => {} })