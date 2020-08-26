# 每周总结可以写在这里

# 权重计算规则

* [行内, id, [类, 伪类, 属性], 标签]

* 通配符、连接符号、:not()都不参与权重计算

```selector
div#a.b .c[id=x]: [1, 1, 1, 1];
#a:not(#b): [0, 2, 0,0];
*.a:  [0, 0, 1,1]
div.a: [0, 0, 1, 1]
```

https://developer.mozilla.org/en-US/docs/Web/CSS/Specificity

# 伪类

## 超连接/行为

* :any-link:
* :link
* :visited
* :hover
* :active
* :foucs
* :target

## 树结构

* :empty
* :nth-child
* :nth-last-child
* :first-child :last-child :only-child

> 在startTag调用computeCss的话，:only-child :nth-last-child :last-child 是无法实现的。:empty 如果是自封闭元素在知道是empty元素，否则需要看后一个token，如果是endTag则是empty。

> 引起回溯：nth-last-child :last-child :only-child。少用引起回溯，否则引起多次layout的次数

> 复杂选择器的子代、后代、紧接兄弟、后续兄弟选择器都不会出现回溯。

# 逻辑型

* :not
* :where
* :has

# 伪元素

* ::before
* ::after
* ::firstLine
* ::firstletter

> before和after无中生有的伪元素，在指定位置添加元素。

first-line 可用属性：

* font
* color
* background
* word-spacing
* letter-spacing
* text-decoration
* text-transform
* line-height

first-letter 可用属性:

* font
* color
* background
* word-spacing
* letter-spacing
* text-decoration
* text-transform
* line-height
* float
* vertical-align
* 盒模型系列: margin. padding, border

# 思考

为什么first-letter可以设置float之类的，而first-line不行？

> first-line是选中正常流的第一行，如果设置了float则脱离了文档流，导致一直循环。

# 盒模型

* margin 理解成留白，对margin折叠有比较好的直观理解
* padding
* border
* content

> box-sizing: content-box;修改伪border-box则width是包含border，content width = border + width

# 正常流排版

默认从左到右从上到下并左对齐的排版，如书写方式一直。

* inline formatting content (IFC)：原始的理解就是能够从左到右排的就是IFC

* block formatting content (BFC)：原始的理解就是能够从上到下排的就是BFC

# 正常流的行模型

vertical-align建议只用bottom top middle baseline,不用text-top text-bottom.

* baseline 是专指x英文字的底端

# BFC
创建一个BFC：float不为none，position不为static，overflow不为visable，display为inline-block, table-cell，table-caption等

* 在BFC中的block-level boxes的垂直方向会发生margin折叠。

* 能够容纳正常流都是BFC，特殊是overflow不为visable

https://www.w3.org/TR/CSS2/visuren.html#normal-flow