---
title: "函数-闭包--高程4"
date: "2020-12-11"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 函数

## 递归

- 递归函数通常是一个函数通过名称自己调用自己

```js
// 耦合性太强
function factorial(num){
  if(num <= 1) {
    return 1
  } else {
    return num * factorial(num - 1)
  }
}

// 严格模式下报错
function factorial(num){
  if(num <= 1) {
    return 1
  } else {
    return num * arguments.callee(num - 1)
  }
}
```

- 这样是我们的第一感觉，但是上一章说过，这样的话如果把它赋值给其他变量就会出问题，所以上一章我们用的是arguments.callee来进行调用，但是这样在严格模式下报错，所以我们可以使用命名函数表达式来完成，如下
<!--more-->
```js
const factorial = (function f(num){
  if(num <= 1) {
    return 1
  } else {
    return num * f(num - 1)
  }
})
```

- 这样就实现了我们的一个通用递归方式

## 尾调用优化

- ECMAScript 6新增了一项内存管理优化机制，让JavaScript引擎在满足条件时可以重用栈帧。这个优化很适合“尾调用”，即外部函数的返回值是内部函数的返回值

```js
function outerFunction(){
  return innerFuntion() // 尾调用
}
```

- ES6优化之前，会有下操作
  - 执行到outerFunction函数体，第一个栈帧被推倒栈上
  - 执行outerFunction函数体，到return语句，需要计算innerFunction
  - 执行到innerFunction函数体，第二个栈帧被推到栈上
  - 执行innerFunction函数体，计算返回值
  - 将返回值传回outerFunction，然后再返回
  - 将栈帧弹出栈
- 优化后
  - 执行到outerFunction函数体，第一个栈帧被推倒栈上
  - 执行outerFunction函数体，到return语句，需要计算innerFunction
  - 引擎发现将第一个栈帧弹出去也不影响，因为outerFunction的返回值跟innerFunction的返回值一直
  - 弹出outerFunction的栈帧
  - 执行到innerFunction函数体，栈帧被推到栈上
  - 执行innerFunction函数体，计算返回值
  - 将innerFunction的栈帧弹出栈外
- 能看出，第一种情况下每多一层嵌套就会多一个栈帧。而第二种情况无论多少次嵌套函数，都只有一个栈帧。
- 这就是ES6尾调用优化的关键：如果函数的逻辑允许尾调用将其销毁，那引擎就会这么干

### 尾调用优化的条件

- 尾调用优化的条件就是确定外部栈帧没必要存在了，条件如下
  - 代码在严格模式下执行
  - 外部函数的返回值是对尾调用函数的调用
  - 尾调用函数返回后不需执行额外操作
  - 尾调用函数不是引用外部函数作用域中自由变量的闭包
- 下面是几个违反上述条件的函数

```js
'use strict'
// 无优化： 尾调用无返回
function outerFunction(){
  innerFunction()
}

// 无优化： 尾调用没有直接返回
function outerFunction(){
  let result = innerFunction()
  return result
}

// 无优化： 尾调用后必须转为字符串
function outerFunction(){
  return innerFunction().toString()
}

// 无优化： 尾调用是个闭包
function outerFunction(){
  let foo = 'bar'
  function innerFunction(){
    return foo
  }
  return innerFunction()
}
```

- 下面是符合条件的例子

```js
'use strict'
// 有优化：栈帧销毁前执行计算
function outerFunction(a, b){
  return innerFunction(a + b)
}

// 有优化：初识返回值不涉及栈帧
function outerFunction(a, b){
  if(a < b) {
    return a
  }
  return innerFunction(a + b)
}

// 有优化：两个内部函数都在尾部
function outerFunction(condition){
  return condition ? innerFunctionA() : innerFunctionB()
}

```

- 差异化尾调用跟递归尾调用容易让人混淆，无论递归尾调用还是非递归尾调用，都可以应用优化。这个优化在递归下最明显，因为递归代码最容易在栈内存中产生大量栈帧
- 之所以要求严格模式是因为非严格模式下函数调用中允许使用f.arguments跟f.caller，而它们都引用外部函数的栈帧。所以无法使用优化了
- 尾调用优化的代码

```js
function fib(n) {
  if(n < 2) {
    return n
  }
  return fib(n - 1) + fib(n - 2)
}
```

- 这里的函数尾部执行了相加操作，所以不符合尾调用优化的原则，所以fib(n)的栈帧数的内存复杂度为o(2^n)，所以简单地调用fib(1000)也会给浏览器带来麻烦
- 所以我们可以对其进行优化让其满足条件，为此使用两个函数，外层函数作为基础框架，内部函数执行递归

```js
'use strict'
function fib(n){
  return fibImpl(0, 1, n)
}

function fibImpl(a, b, n){
  if(n === 0) {
    return a
  }
  return fibImpl(b, a + b, n - 1)
}
fib(1000)
```

- 重构之后在执行就不会有这个问题了，可以正常得出结果

## 闭包

- 闭包是指那些引用了另一个函数作用域中变量的函数，通常是在嵌套函数中使用。
- 闭包形成的原因，在调用一个函数时，会为函数调用创建一个执行上下文，并创建作用域链。
- 然后用arguments和其他参数来初始化这个函数的活动对象。外部函数的活动对象是内部函数作用域链的第二个对象。
- 这个作用域链一直向外串起所有包含函数的活动对象，一直到全局执行上下文才终止
- 函数执行时，每个执行上下文都会有一个包含其中变量的对象，全局上下文中叫变量对象，会在代码执行期间一直存在。函数局部上下文中的叫活动对象，只在函数执行期间存在。

```js
function compare(value1, value2){
  if(value1 < value2) {
    return -1
  } else if (value1 > value2) {
    return 1
  } else {
    return 0
  }
}
let result = compare(5, 10)
```

- compare函数是在全局上下文中调用的。第一次调用会为它创建一个包含arguments、value1、value2的活动对象，这个对象就是它作用域链的第一个对象
- 全局上下文的变量对象则是compare()作用域链上面的第二个对象，包含了this、result、compare
- 定义这个函数时，会先为它创建作用域链，然后预先将全局变量对象，并保存在内部的[[Scope]]中。调用这个函数时，会创建相应的上下文，然后通过复制函数的[[Scope]]来创建器作用域链。
- 接着会创建函数的活动对象（用作变量对象）并把它放到作用域链的前端。上面这个例子意味着compare()函数执行上下文的作用域链中有两个变量对象：局部变量对象和全局变量对象。作用域链其实是一个包含指针的列表，每个指针分别指向一个变量对象。
- 函数内部访问变量时，就会按照给定的名称从作用域中查找变量。函数执行完成后，局部活动对象被销毁，内存中就只剩全局作用域。
- 函数内部定义的函数会把它的包含函数的活动对象添加到自己的作用域链中。然后它就可以访问到包含对象的全部变量，因为它有着包含对象的活动对象的引用，所以包含函数执行完成后不能销毁，只有等函数内部定义的函数被销毁它才能销毁
- 闭包保留了它的包含函数的作用域，所以比其他函数更占内存，所以除非必要，不然不使用闭包

## 内存泄漏

- 由于IE9之前对JScript对象跟COM对象的垃圾回收机制不一致，所以闭包在旧版本可能会出问你。在部分版本下，将html闭包就会导致它不能被销毁

```js
function assignHandler(){
  let element = document.getElementById('someElement')
  element.onclick = () => console.log(element.id)
}
```

- 这里创建了一个闭包，即element元素的事件处理程序。事件处理程序又创建了循环引用。匿名函数引用着assignHandler的活动对象，阻止了对element的引用计数归零。所以只要匿名函数存在，element的引用次数就至少为1，所以内存无法回收

```js
function assignHandler(){
  let element = document.getElementById('someElement')
  let id = element.id
  element.onclick = () => console.log(id)
  element = null
}
```

- 这样我们把element.id替换为一个新的id字段去除了循环引用，但是还不够，因为匿名函数引用着包含对象的活动对象，活动对象包含了element。
- 所以闭包没有直接引用element，但是包含活动对象还存在着它的引用，所以需要把它设为null解除引用

## 私有变量与特权方法

- JavaScript没有私有成员概念，但是有私有变量的概念，在函数内部的变量都是函数私有的，函数外部无法访问。私有变量包含函数参数、局部变量、函数内部定义的其他函数
- 特权方法是能够访问函数私有变量的公有方法。在对象上创建特权方法的方式有两种，一种是构造函数中实现

```js
function MyObject(){
  let privateVariable = 10
  function privateFunction(){
    return false
  }
  this.publicMethod = function(){
    privateVariable++
    return privateFunction()
  }
}
```

- 这是将私有变量跟方法都定义在构造函数中，然后创建一个能访问这些私有成员的特权方法，因为特权方法是一个闭包，可以访问构造函数的所有成员，所以可以使用它来访问
- 每个特权方法都由自己的privateVariable，因为每次调用构造函数都会重新创建一套变量跟方法，也就导致这种模式有一个缺点：每个实例都会重新创建一遍新方法
- 另一种是通过私有作用域定义私有变量跟函数来实现

```js
(function(){
  let privateVariable = 10
  function privateFunction(){
    return false
  }
  MyObject = function(){}
  MyObject.prototype.publicMethod = function(){
    privateVariable++
    return privateFunction()
  }
})()

```

- 这里，匿名函数定义了私有变量和私有方法，然后又定义了构造函数和公有方法。公有方法定义在构造函数原型上。
- 这里生命MyObject没有使用关键字，所以会被创建到全局作用域中，所以MyObject可以在外部被访问（严格模式下不使用关键字声明会报错）
- 这样的话私有变量跟私有方法是全部实例共享了，因为特权方法是在原型上，所以由全部实例共享
- 这样创建的好处就是可以更好地重用代码，但是也导致了每个实例都没有了私有变量
- 闭包跟私有变量会让作用域链变长，作用域链越长，查找变量所需时间越长