---
title: "函数--高程4"
date: "2020-12-10"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 函数

- 函数实际上是对象，每个函数都是Function类型的实例
- 函数通常以函数声明的方式定义

```js
function sum(num1, num2) {
  return num1 + num2
}
```

- 还能以函数表达式来定义
<!--more-->
```js
let sum = function (num1, num2) {
  return num1 + num2
}
```

- 箭头函数定义

```js
let sum = (num1, num2) => {
  return num1 + num2
}
```

- 最后一种以Function构造函数定义函数。此构造函数接收任意个字符串参数，最后一个参数会被当做函数体，前面的参数都是新函数的参数
- 此方法不推荐，因为这样会解释两次，第一次是将它当做常规的ECMAScript代码，第二次会解释传给构造函数的字符串

```js
let sum = new Function('num1', 'num2', 'return num1 + num2')
```

- ECMAScript 6的所有函数对象会暴露一个只读的`name`属性，包含函数的信息。一般情况下保存的就是一个字符串化的变量名
- 及时函数没有名称也会变成空字符串，如果是用`Function`创建的，就会标识成`"anonymous"`
- 如果函数是一个获取函数、设置函数或者使用bind实例化，name会加上一个前缀

```js
function foo(){}
let bar = function(){}
let baz = () => {}

console.log(foo.name) // foo
console.log(bar.name) // bar
console.log(baz.name) // baz
console.log((() => {}).name) // ''
console.log((new Function()).name) // anonymous


let dog = {
  years: 1,
  get age(){
    return this.year
  },
  set age(newVal){
    this.years = newVal
  }
}
let propertyDescriptor = Object.getOwnPropertyDescriptor(dog, 'age')
console.log(foo.bind(null).name) // bound foo
console.log(propertyDescriptor.get.name) // get age
console.log(propertyDescriptor.set.name) // set age
```

- 函数默认值定义时，参数是按照顺序初始化的，所以后定义的默认值参数可以引用前面定义的参数

```js
function makeKing(name = 'Henry', numerals = name) {
  return `King ${name} ${numerals}`
}
console.log(makeKing()) // King Henry Henry
```

- 参数初始化顺序遵循“暂时性死区”规则，前面定义的参数，不能引用后面定义的参数，如下就会报错

```js
function makeKing(name = numerals, numerals = 'Henry') {
  return `King ${name} ${numerals}`
}
console.log(makeKing()) // Uncaught ReferenceError: Cannot access 'numerals' before initialization
```

## 箭头函数

- 可以使用函数表达式的地方都可以使用箭头函数
- 箭头函数不能使用arguments、super和new.target，也不能用作构造函数，并且没有prototype

## arguments

- arguments是一个类数组对象，包含函数调用传入的全部参数，这个函数只有一function关键字定义函数时才有 （箭头函数就没有）
- arguments有一个callee属性，始终指向arguments对象所在的函数的指针

```js
function factorial(num){
  if(num <=1) {
    return 1
  } else {
    return num * factorial(num - 1)
  }
}

let trueFactorial = factorial
factorial = function(){
  return 0
}
trueFactorial(5) // 0
factorial(5) // 0
```

- 这是一个经典的阶乘函数，上面函数要保证正确执行就得保证函数名一定是factorial，一旦我们将函数赋给别的值，就能发现出现问题了，这就导致了紧密耦合，可以使用arguments.callee解耦

```js
function factorial(num){
  if(num <=1) {
    return 1
  } else {
    return num * arguments.callee(num - 1)
  }
}


let trueFactorial = factorial
trueFactorial(5) // 120
factorial = function(){
  return 0
}
factorial(5) // 0
```

- 这样就实现了解耦，修改factorial的引用不会影响递归函数
- arguments对象始终会与对应的命名参数同步

```js
function doAdd(num1, num2) {
  arguments[1] = 10
  console.log(arguments[0] + num2)
}
doAdd(10, 30) // 20
```

- 这里doAdd函数会把第二个参数的值重写为10。因为arguments对象的值会自动同步到对应的命名参数，所以修改arguments[1]也就是修改了num2
- 并不意味着arguments[1]跟num2是同一个内存地址，内存是分开的，但是会同步
- 如果只传了一个参数，然后把arguments[1]改为某个值，那这个值并不会反映到第二个命名参数，因为arguments对象的长度是根据传入的参数个数确定，而非定义函数时给出的命名参数确定的
- 严格模式下，arguments[1]修改后不再影响num2的值，其次，在函数内重写arguments对象会导致语法错误

## this

- this在标准函数与箭头函数中行为不一致
- 标准函数中，this引用的是把函数当成方法调用的上下文对象，这时候称其为this值（网页全局调用时，this指向window）

```js
window.color = 'red'
let o = {
  color: 'blue'
}
function sayColor(){
  console.log(this.color)
}
sayColor() // 'red'
o.sayColor = sayColor
o.sayColor() // 'blue'
```

- 定义在全局上下文的sayColor引用了this对象。这个this是那个对象要到函数调用时才能知道。
- 全局调sayColor输出red因为this指向window，this.color相当于window.color。
- 把sayColor赋值给o再调用，this指向了o，this.color相当于o.color，所以显示"blue"
- 箭头函数中的this引用的是定义箭头函数的上下文

```js
window.color = 'red'
let o = {
  color: 'blue'
}
let sayColor = () => console.log(this.color)
sayColor() // 'red'
o.sayColor = sayColor
o.sayColor() // 'red'
```

- 所以当我们在事件回调或者定时回调中调用某个函数时，this指向并非我们想要的对象时，我们就可以把函数改为箭头函数即可，因为箭头函数中的this会保留定义该函数的上下文

```js
function King(){
  this.royaltyName = 'Henry'
  setTimeout(() => {
    console.log(this.royaltyName)
  }, 1000)
}

function Queen(){
  this.royaltyName = 'Elizabeth'
  setTimeout(function (){
    console.log(this.royaltyName)
  }, 1000)
}
new King() // Henry
new Queen() // undefined
```

## caller

- ECMAScript 5会给函数对象加一个属性： caller，这个属性引用调用当前函数的函数，如果在全局作用域中调用则为null

```js
function outer(){
  inner()
}
function inner(){
  console.log(inner.caller)
}
outer()  // ƒ outer(){
  inner()
}

// 降低耦合度的写法
function inner(){
  console.log(arguments.callee.caller)
}
```

- 严格模式下访问arguments.callee会报错，访问arguments.caller也会报错，非严格模式下访问arguments.caller是undefined，这样是为了分清arguments.caller和函数的caller而做的
- 严格模式下不可给caller赋值，否则会报错

## new.target

- 函数始终可以作为构造函数实例化一个对象，ECMAScript新增了 new.target 检测函数是否使用new关键字调用。函数是正常调用，那new.target就是undefined，如果是new调用，那new.target将引用被调用的构造函数

```js
function King(){
  if(!new.target) {
    throw 'King must be instantiated using "new"'
  }
  console.log('King instantiated using "new"')
}
new King() // King instantiated using "new"
King() // Uncaught King must be instantiated using "new"
```