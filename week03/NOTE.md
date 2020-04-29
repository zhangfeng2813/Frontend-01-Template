# 第三周总结

### Javascript

  - Atom
    - Grammar
        - 简单语句
        	- ExpressionStatement
        		- a = 1 + 2;
			- EmptyStatement
				- ;
			- DebuggerStatement
				- debugger;
			- ThrowStatement
				- throw a;
			- ContinueStatement
				- continue label1;
			- BreakStatement
				- break label2;
			- ReturnStatement
				- return 1;
        - 组合语句
			- BlockStatement
```
{
...
...
}
```
			- IfStatement
			- SwitchStatement
			- IterationStatement
```
while()
do...while
for
for...in...
for...of...
for await(of)
```
			- WithStatement
			- LabelledStatement
			- TryStatement
```
try {

} catch () {

} finally {

}
```
        - 申明
			- FunctionDeclaration
```
function foo() {} //函数声明
var o = function foo() {} // 函数表达式
```
			- GeneratorDeclaration
```
function* foo() {
	yield 1;
}
let g = foo();
g.next().value;
```
			- AsyncFunctionDeclaration
```
async function foo() {
  await xxx;
}
```
			- AsyncGeneratorDeclaration
```
async function* gen() {
  await xxx;
}
```
			- VariableStatement
```
var let const
```
			- ClassDeclaration
			- LexicalDeclaration
    - Runtime
        - Completion Record
        	- `[[type]]`: normal, break, continue, return, or throw
        	- `[[value]]`: Types
        	- `[[target]]`: label
        - Lexical Environment
	- Types
		- Number
		- String
		- Boolean
		- Object
		- Null
		- Undefined
		- Symbol

### Javascript对象机制

- Object
```
三只一模一样的鱼，其实是三个对象。
其中一只鱼发生了状态改变，失去了尾巴。
其它两只鱼并不受到影响。
因此，当我们在计算机中描述这三只鱼时，必须把相同的数据存储三份。
```
	- 任何一个对象都是唯一的，这与它本身的状态无关。
	- 即使状态完全一致的两个对象。也并不相等。
	- 我们用状态来描述对象。
	- 状态的改变即是行为。
	- 标示性（Identifier）指针（state）行为（behavior）
	- 三要素
		- state
		- identifier
		- behavior
- Object-Class 基于类的面向对象
	- 类是一种常见的描述对象的方式。而“归类”和“分类”则是两个主要的流派。
	- 对于“归类”方法而言，多继承是非常自然的事情。如C++。
	- 而采用分类思想的计算机语言，则是单继承结构。并且会有一个基类Object。
	- 原型是一种更接近人类原始认知的描述对象的方法。
	- 我们并不试图做严谨的分类，而是采用“相似”这样的方式去描述对象。
	- 任何对象仅仅需要描述它自己与原型的区别即可。
- Object-Prototype 基于原型的面向对象
	- 原型是一种更接近人类原始认知的描述对象的方法。
	- 我们并不试图做严谨的分类，而是采用“相似”这样的方式去描述对象。
	- 任何对象仅仅需要描述它自己与原型的区别即可。
- Object Exercise
	- 狗咬人
	- "咬"这个行为该如何使用对象抽象?
```
class Human {
	hurt(damage) {
		//……
	}
}
```
	- 我们不应该受到语言描述的干扰。
	- 在设计对象的状态和行为时，我们总是遵循。
	- “行为改变状态”的原则。
- Object in Javascript
	- 在Javascript运行时，原生对象的描述方式非常简单。我们只需要关心原型和属性两个部分。
	- 它的原型实际上就是一个KV对。
	- Javascript用属性来统一抽象对象状态和行为。
	- 一般来说，数据属性用于描述状态，访问器属性则用于描述行为。
	- 数据属性中如果存储函数，也可以用于描述行为。
	- 当我们访问属性时，如果当前对象没有，则会沿着原型找原型对象是否有此名称的属性，而原型对象还可能有原型，因此，会有"原型链"这一说法。
	- 这一算法保证了，每个对象只需要描述自己和原型的区别即可。
- Function Object
	- 前面讲述了JavaScript中的一般对象。
	- 但JavaScript 中 还 有一些特殊的对象，比如函数对象。
	- 除了一般对象的属性和原型，函数对象还有一个行为[[call]]。
	- 我们用JavaScript中的function关键字、箭头运算符或者Function构造器创建- 的对象，会有[[call]]这个行为。
	- 我们用类似f()这样的语法把对象当做函数调用时，会访问到[[call]]这个行为。
	- 如果对应的对象没有[[call]]行为则会报错。
- Special Object

##### Object in JavaScript

- Property
  - Key
    - Symbol
    - String
  - Value
    - Data Property
      - [[value]]
      - writable
      - emumerable
      - configurable
    - Accessor Property
      - get
      - set
      - emumerable
      - configurable
- `[[Prototype]]`
  原型链

##### Object API

- 基础API
  `{} . [] Object.defineProperty`
- 原型API
  `Object.create  Object.setPrototypeOf  Object.getPrototypeOf`
- 基于类的面向对象API(模拟)
  `new class extends`
- 基于原型的面向对象API
  `new function prototype`


##### js中特殊的对象

- Function Object
  - [[call]]  视为函数Function
  - [[Constructor]] 可以被new 操作符调用，根据new的规则返回对象。

- Array Object
  - [[DefineOwnProperty]]
    - Property == length
		- 设置对象的length属性，根据length的变化对对象进行操作
		- newLength > length 用空扩充数组
		- newLength < length 截取数组

- String Object
  - string的length是不可写不可配的。

- Arguments Object
  - [[callee]] 视为函数参数对对象，伪数组 caller

- Object
	- `[[Get]]` property被访问时调用  get
	- `[[Set]]` property被赋值时调用 set
	- `[[GetPrototypeOf]]` 对应getPrototypeOf方法 获取对象原型
	- `[[SetPrototypeOf]]` 对应setPrototypeOf方法 设置对象原型
	- `[[GetOwnProperty]]` getOwnPropertyDescriptor 获取对象私有属性的描述列表
	- `[[HasProperty]]` hasOwnProperty 私有属性判断
	- `[[IsExtensible]]` isExtensible对象是否可扩展
	- `[[PreventExtensions]]` preventExtension控制对象是否可以添加属性
	- `[[DefineOwnProperty]]` defineProperty 定义对象属性
	- `[[Delete]]` delete 操作符
	- `[[OwnPropertyKeys]]` Object.keys() Object.entries() Object.values()
	- `[[Call]]` 能够调用call

- Module Namespece
	- `[[Module]]` 视为一个引入的模块
	- `[[Exports]]` 视为一个导出的模块