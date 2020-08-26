# 每周总结可以写在这里

# 设计 TabPanel

0. 预期结构

```
 <TabPanel title="this is my Panel">
    <span>This is content1</span>
    <span>This is content2</span>
    <span>This is content3</span>
    <span>This is content4</span>
  </TabPanel>
```

1. 给 TabPanel 的每个 children 包裹一个元素

```
{this.children.map(child => (
    <div>{child}</div>
))}
```

# 设计 ListView

采用了一种类似 render props

# 自定义 cssloader

接着上一次写的 loader，使用 css 库来处理 css 文件。

用`css.parse`方法将 source 抽象为 styleSheet 格式，然后处理 selectors 来避免样式污染。

用 this.resourcePath 的属性来获得 css 文件名（兼容 window 系统）

```
 let name = this.resourcePath.match(/([^/\\]+).css$/)[1];
```

根据文件名和样式名进行判断，没有在样式前写文件名的 class 时自动补全。

最后使用`css.stringify`方法来解析 styleSheet 对象，并使用 appendChild 将 style 元素插入 dom 中。

注意：需要将 css.stringify 的结果再次 JSON.stringify

# 工具链

## 注意阶段

初始化

开发/调试

测试

代码审查

发布

> 初始化很大程度上决定了之后的阶段，像vue-cli会提问你的开发需求和测试工具。

https://www.yuque.com/docs/share/b6c40320-6290-498d-89b0-48d5878a6597?# 《工具》

# 没有名字的函数如何实现递归

https://gist.github.com/wintercn
