# 第五周总结

### Javascript

  - JavaScript对象：你知道全部的对象分类吗？
    - realM
    - 浏览器里面只有Promise和MutationObserver会产生微任务

  - JS执行粒度（由大至小）
	- JS Context => Realm
	- 宏任务
	- 微任务 (Promise)
	- 函数调用 （Execution Context Stack 调用执行栈）
		- code evaluation state (用于async generator函数)
		- Function
		- Script or Module
		- Generator （generator函数特有)
		- Realm
		- LexicalEnvironment (词法环境)
			- this
			- new.target
			- super
			- 变量
		- VariableEnvironment （变量环境）
	- 语句/声明
	- 表达式
	- 直接量/变量/this

### 笔记
	- 其实所有(有待考证)的JS代码都是一个微任务，只是哪些微任务构成了一个宏任务；执行在JS引擎里的就是微任务，执行在JS引擎之外的就是宏任，循环宏任务的工作就是事件循环。
	- 拿浏览器举例：setTimeout、setInterval 这种其实不是 JS 语法本身的 API，是 JS 的宿主浏览器提供的 API， 所以是宏任务。 而 Promise 是 JS 本身自带的 API，这种就是微任务。
	- 总结：宿主提供的方法是宏任务，JS 自带的是微任务
	- “，” 是所有运算里 优先级最低的
	- promise shim 就是用MutationObserver实现的
	- 李兵老师的小册子（浏览器底层原理）
	- https://dev.to/lydiahallie/javascript-visualized-event-loop-3dif
	- setTimeout与setInterval是浏览器的timer负责来处理的
	- script,UI交互，setTimeout,setInterval都是宏任务
	- 一个宏任务中，只存在一个微任务队列，根据入队时间决定个微任务执行顺序吗，当前宏任务内微任务执行完之后才会执行下个宏任务
	- 所以说一个宏任务里的同步代码也可以理解为微任务  只不过比宏任务里异步代码微任务先入队
	- 所有同步代码归属于一个微任务