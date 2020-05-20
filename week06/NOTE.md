# 每周总结可以写在这里

### Javascript

  - 有限状态机（英语：finite-state machine，缩写：FSM）
  - 又称有限状态自动机（英语：finite-state automation，缩写：FSA）

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

### 状态机
  - 有限状态机（英语：finite-state machine，缩写：FSM）
  - 又称有限状态自动机（英语：finite-state automation，缩写：FSA）
  - 简称状态机，是表示有限个状态以及在这些状态之间的转移和动作等行为的数学计算模型。
  - 状态存储关于过去的信息，就是说：它反映从系统开始到现在时刻的输入变化。
    - 进入动作（entry action）：在进入状态时进行
    - 退出动作（exit action）：在退出状态时进行
    - 输入动作：依赖于当前状态和输入条件进行
    - 转移动作：在进行特定转移时进行

### 有限状态机
  - 每一个状态都是一个机器
    - 在每一个机器里，我们可以做计算、存储、输出...
    - 所有的这些机器接受的输入是一致的
    - 状态机的每一个机器本身没有状态，如果我们用函数来表示的话，它应该是纯函数(无副作用)
  - 每一个机器知道下一个状态
    - 每个机器都有确定的下一个状态(Moore)
    - 每个机器根据输入决定下一个状态(Mealy)

### 随堂笔记
  - https://html.spec.whatwg.org/multipage/parsing.html#data-state
  - npmjs.com/npm/css
  - 编译原理 LL LR
  - https://github.com/wintercn/JSinJS
  - who what when how
  - star: situation -> task -> action -> result