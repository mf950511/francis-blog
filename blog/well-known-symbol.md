---
title: "Well-Known Symbols"
date: "2020-09-23"
name: 'francis'
age: '24'
tags: [JavaScript回顾]
categories: JavaScript
---

# Well-Known Symbols

- well-known symbols 是es6引入的在整个javascript中使用的一系列方法，用于直接访问、重写、模拟语言内部的一系列行为。这些方法或者说符号以字符串属性存在于Symbol的工厂函数上。
- 这些符号存在的主要意义就是重新定义它们用于修改原生语言中的构造函数表现形式。例如，for of 循环其实是依靠于对象原型提供的 Symbol.iterator 属性，所以我们可以通过重新定义对象的 Symbol.iterator 属性来控制它的for of 表现。
- well-known symbols 这些符号就是Symbol对象上的一些字符串属性，定义良好的符号都具有不可写入、不可重复、不可配置的特性。

## Symbol.asyncIterator 

- ECMAScript规范中，此符号用于描述一个对象返回默认异步迭代对象的方法属性。当对象具有该属性则该对象是异步可迭代的，可以被 for await of 表达式调用。
- 语言构造器例如 for await of 利用该符号对应的方法来实现异步迭代。
- 所以我们可以对一个自定义对象添加该符号方法实现其可被for await of 调用
- for await of 的调用必须在async 函数下才可以
<!--more-->
```js
var a = { a :1, b: 2 }
async function b(){
  for await(var value of a) {
    console.log(a)
  }
}
b() // TypeError: a is not async iterable

var a = {
  a :1,
  b: 2,
  *[Symbol.asyncIterator](){
  }
}
async function b(){
  for await(var value of a) {
    console.log(a)
  }
}
b() // Promise {<resolved>: undefined}
```

- 可以看出只要我们实现了符号对应的异步方法，就可以正常调用，下面我们可以自定义我们想要的表现形式

```js
class Emitter {
  constructor(max) {
    this.max = max
    this.asyncIdx = 0
  }
  async*[Symbol.asyncIterator] () {
    while(this.asyncIdx < this.max) {
      if(this.asyncIdx % 2 === 0) {
        yield new Promise(resolve => resolve(this.asyncIdx++))
      } else {
        yield new Promise(resolve => {
          setTimeout(() => {
            resolve(this.asyncIdx++)
          }, 1000)
        })
      }
    }
  }
}
var a = new Emitter(6)
async function b(){
  for await(let value of a) {
    console.log(value)
  }
}
b() // 0 1 2 3 4 5 
```

## Symbol.hasInstance

- 在ECMAScript标准中，该符号用做决定对象是否为构造器的实例。也就是“一个方法用来决定构造函数是否识别一个对象为它的实例。在语法上由instanceof方法调用”。instanceof操作符提供了一个方法判断一个对象实例在其原型链中是否有该原型。
- instanceof使用如下

```js
function Foo(){}
let f = new Foo()

console.log(f instanceof Foo) // true

```

- 在ES6中，instanceof 操作使用 SYmbol.hasInstance 来衡量这个关系。该键对应一个函数具有跟instanceof相同的表现，但是操作方式相反，如下

```js
function Foo(){}
let f = new Foo()
console.log(Foo[Symbol.hasInstance](f)) // true
```

- 该属性被定义到了函数原型上面，所以所有的函数跟类都自动具有了该方法，因为instanceof操作符会在原型链上查找这个属性值，所以我们可以在一个继承类上来重新定义该属性。

```js
class Bar{}
class Baz extends Bar{
  static [Symbol.hasInstance] (){
    return false
  }
}

let b = new Baz()
console.log(Bar[Symbol.hasInstance](b)) // true
console.log(b instanceof Bar) // true
console.log(Baz[Symbol.hasInstance](b)) // false
console.log(b instanceof Baz) // false
```

- 我们能看到，当我们查找是否是Bar的实例时，因为我们的构造函数就是继承自Bar，并且没有修改Bar的相关属性，所以能正常返回true。但是当我们修改了Baz的构造函数之后，再次调用Baz返回的就是我们修改后的函数值了

## Symbol.isConcatSpreadable

- 在ECMAScript标准中，此符号用来决定一个对象在被Array.prototype.concat()方法调用的时候是否要被扁平化。Array.prototype.concat()方法在ES6中将会基于传入的类数组对象来决定如何将其与数组实例拼接。符号Symbol.isConcatSpreadable将允许你重写这个方法。
- 数组对象在默认情况下将会被扁平化处理到当前数组中，当对应实例的Symbol.isConcatSpreadable属性为false或者falsy数据时，则数组对象会被整个塞到当前数组中。如下

```js
let initial = ['foo']
let array = ['baz']
console.log(initial.concat(array)) // ["foo", "baz"]

let initial = ['foo']
let array = ['baz']
array[Symbol.isConcatSpreadable] = false
console.log(initial.concat(array)) // ["foo", Array(1)]
```

- 类数组对象在默认情况下会被整个塞到当前数组中，类似于append表现，当我们修改其Symbol.isConcatSpreadable属性为true或者truthy时，这个对象将会被扁平化处理，然后拼接到数组中。
- 类数组对象有两个特征，一个是length属性值为数值，一个是有数字键值，看以下表现

```js
// 默认值
let arrayLikeObject = { length: 1, 0: 'baz'}
let initial = ['foo']
console.log(initial.concat(arrayLikeObject)) // ["foo", {…}]

// 修改后
let arrayLikeObject = { length: 1, 0: 'baz'}
let initial = ['foo']
arrayLikeObject[Symbol.isConcatSpreadable] = true
console.log(initial.concat(arrayLikeObject)) // ["foo", "baz"]
```

- 其他的非数组或者类数组对象在设置了Symbol.isConcatSpreadable为true时都会被忽略，并不会被添加进去

```js
let otherObject = new Set().add('qux')
let initial = ['foo']
console.log(initial.concat(otherObject)) // ["foo", Set(1)]

let otherObject = new Set().add('qux')
let initial = ['foo']
otherObject[Symbol.isConcatSpreadable] = true
console.log(initial.concat(otherObject)) // ["foo"]
```

## Symbol.iterator

- 在ECMAScript标准中，该符号用于描述一个对象返回默认迭代器对象的方法属性。当对象具有该属性则该对象是可迭代的，可以被for of 循环调用。
- for of 语句就是利用此符号来执行迭代，该语句将会调用Symbol.iterator对应的函数，并期望它返回一个实现了迭代器的对象，在很多场景下会返回一个生成器(一个实现了Iterator api的对象。)

```js
class Foo{
  *[Symbol.iterator](){}
}
let f = new Foo()
console.log(f[Symbol.iterator]()) // Generator {<suspended>}
```

- 需要注意的是，通过Symbol.iterator生产的对象需要能够连续生产对象凭借 next() 方法。这可以通过显示声明next方法或者通过生成器函数生成。

```js
// 显式定义next
class Emitter{
  constructor(max){
    this.max = max
    this.idx = 0
  }
  [Symbol.iterator](){
    return {
      next:() => {
        if(this.idx < this.max) {
          return { value: this.idx++, done: false}
        } else {
          return { done: true }
        }
      }
    }
  }
}
function count(){
  let emitter = new Emitter(6)
  for(let x of emitter) {
    console.log(x)
  }
}
count() // 0 1 2 3 4 5

// 生成器函数生成
class Emitter{
  constructor(max){
    this.max = max
    this.idx = 0
  }
  *[Symbol.iterator](){
    while(this.idx < this.max) {
      yield this.idx++
    }
  }
}

function count(){
  let emitter = new Emitter(5)
  for(const x of emitter) {
    console.log(x)
  }
}

count()  // 0 1 2 3 4
```

## Symbol.match

- ECMAScript标准中，此符号是用于描述一个字符串与正则表达式的匹配关系的方法属性。被String.prototype.match()方法调用，String.prototype.match()方法会调用Symbol.match对应的函数去计算表达式，因为正则表达式的原型上有该方法属性，所以所有的正则表达式都可以被String.prototype.mactch()方法调用。
- 如果提供其他的非正则表达式参数给String.prototype.match()将会把参数转为正则表达式。
- 如果要避免此行为并且想要将参数直接使用，我们可以通过为参数指定 Symbol.match 属性为函数来绕过这个限制，该函数只接受一个参数，参数为调用match方法的字符串实例，返回值为任意类型。

```js
// 正常情况
var a = {}
'123123'.match(a) // null

// 添加值
var a = {}
Object.prototype[Symbol.match] = string => string.includes('123')
'123123'.match(a) // true
```

- 上面我们就是为对象指定了Symbol.match属性，所以但我们传递进去对象值时都会返回true

## Symbol.replace

- ECMAScript标准中，此符号是用于描述“替换字符串中匹配到的子字符串的一个正则表达式方法，被String.prototype.replace()方法调用”
- String.prototype.replace将会调用参数上的Symbol.replace对应的方法来进行表达式计算
- 正则表达式原型有Symbol.replace方法，所以所有的正则表达式都可以被replace方法调用。
- 同样的，如果传入的是非正则类型，则会被强制转为正则类型。我们可以通过为入参定义Symbol.replace方法来绕过并重新定义行为
- 定义的方法有两个参数，一个是原始字符串，一个是要替换的字符串

```js
// 原表现形式
class Test{
  constructor(str){
    this.str = str
  }
}
"aaasdasddd".replace(new Test('asd'), '123') // 'aaasdasddd'

// 重新定义属性
class Test{
  constructor(str){
    this.str = str
  }
  [Symbol.replace] = (str, replaceStr) => str.split(this.str).join(replaceStr)
}
"aaasdasddd".replace(new Test('asd'), '123') // 'aa123123dd'
```

- 上面我们就实现了传递一个非正则对象给replace方法并成功完成我们想要的展示形式

## Symbol.search

- 在ECMAScript规范中，该符号用来描述“一个用来返回字符串中符合对应正则表达式的字符串的位置，被String.prototype.search()方法调用”
- String.prototype.search将会调用参数上的Symbol.search对应的方法来进行表达式计算
- 正则表达式原型有Symbol.search方法属性，所以所有的正则表达式都可以被search方法调用。
- 同样的，如果传入的是非正则类型，则会被强制转为正则类型。我们可以通过为入参定义Symbol.search方法来绕过并重新定义行为
- 定义的方法只有一个参数，就是对应的字符串实例，返回值为任意类型

```js
// 原表现形式
class Search{
  constructor(str){
    this.str = str
  }
}
"hahaha".search(new Search('ha')) // -1

// 重新定义属性
class Search{
  constructor(str){
    this.str = str
  }
  [Symbol.replace] = (str) => str.indexOf(this.str)
}
"hahaha".replace(new Search('ha')) // 0
```

## Symbol.species

- 该符号被构建函数调用创造派生实例
- 在构造类中声明静态getter方法Symbol.species将会覆盖新创建实例原型的构建函数
- 当我们调用map方法或者concat方法时会默认返回对应实例的默认构造函数，如果我们这里通过声明getter方法Symbol.species来将其修改为其他构建对象，那在map或concat方法后返回的对象类型就会发生变化

```js
class Bar extends Array {}
var b = new Bar(1, 2, 3)
console.log(b instanceof Array) // true
console.log(b instanceof Bar) // true

// 添加getter方法
class Baz extends Array {
  static get [Symbol.species] () {
    return Number
  }
}
var c = new Baz(1, 2, 3)
console.log(c instanceof Array)   // true
console.log(c instanceof Baz)     // true
console.log(c instanceof Number)  // false

console.log(c.concat(c) instanceof Array)   // false
console.log(c.concat(c) instanceof Baz)     // false
console.log(c.concat(c) instanceof Number)  // true

```

- 从上面我们可以看出，声明getter方法Symbol.species后，对单独的实例不会有影响，但是当返回默认的构造函数时，就会使用我们Symbol.species中返回的构造函数了

## Symbol.split

- 该符号用于描述“一个用于在匹配正则表达式的位置进行字符串分割的正则表达式方法，被String.prototype.split()方法调用”
- String.prototype.split将会调用入参对象的Symbol.split属性方法来进行表达式计算。
- 正则表达式原型有Symbol.split方法属性，所以所有的正则表达式都可以被split方法调用。
- 同样的，如果传入的是非正则类型，则会被强制转为正则类型。我们可以通过为入参定义Symbol.split方法来绕过并重新定义行为
- 定义的方法只有一个参数，就是对应的字符串实例，返回值为任意类型

```js
// 原表现形式
class Split{
  constructor(str){
    this.str = str
  }
}
"123hahaha123".split(new Split('ha')) // ["123hahaha123"]

// 重新定义属性
class Split{
  constructor(str){
    this.str = str
  }
  [Symbol.split](target){
    console.log(123, target, this.str)
    return target.split(this.str)
  }
}
"123hahaha123".split(new Split('ha')) // ["123", "", "", "123"]
```

## Symbol.toPrimitive

- 该符号用于描述“一个将对象转换为常规数据类型的方法，被强制类型操作符所调用”。很多内置操作符都会尝试将对象转为基本数据类型，例如：string类型、number类型、number类型，或者其他的基本类型。
- 对一个自定义的对象，我们可以通过定义它的Symbol.toPrimitive属性来决定它的强制类型转换方式。该方法接收一个它原本会被转换为的数据类型的类型字符串名称，所以我们根据这个情况构造我们想要的形式

```js
// 原始类型
class Foo{}
let foo = new Foo()
console.log(3 + foo) // "3[object Object]"
console.log(3 - foo)  // NaN
console.log(String(foo))  // "[object Object]"

// 自定义表现形式
class Bar {
  constructor(){
    this[Symbol.toPrimitive] = function (hint){
      switch(hint) {
        case 'string':
          return 'string bar'
        case 'number':
          return 3
        case 'default':
        default:
          return 'default bar'
      }
    }
  }
}
let bar = new Bar()
console.log(3 + bar) // 3default bar
console.log(3 - bar)  // 0
console.log(String(bar))  // string bar
```

- 上面我们可以看到，当对象遇到 + 操作符时它无法确定要执行字符串拼接的 + 操作还是数值的相加 + 操作，所以就返回了默认的 default bar;当对象遇到 - 操作时明确的知道自己要被转为数值类型，所以走了 case 'number' ，返回了3，然后被执行操作；当预定String()方法时也明确的知道自己要返回字符串类型，所以返回了 string bar

## Symbol.toStringTag

- 该符号用于描述“一个对象的创建对象类型的默认字符串描述，被Object.prototype.toString所调用”，该创建对象的字符串描述会依靠Symbol.toStringTag方法来获取，默认为"Object"
- 内置类型都有声明这个属性方法，但是自定义对象就需要我们显式声明了

```js
// 内置对象
var s = new Set()
console.log(s)                      // Set(0) {}
console.log(s.toString())           // [object Set]
console.log(s[Symbol.toStringTag])  // Set
// 自定义对象
class Foo{}
var f = new Foo()
console.log(f)                      // Foo {}
console.log(f.toString())           // [object Object]
console.log(f[Symbol.toStringTag])  // undefined

// 修改后的自定义对象
class Bar{
  constructor(){
    this[Symbol.toStringTag] = 'Bar'
  }
}
var b = new Bar()
console.log(b)                      // Bar {Symbol(Symbol.toStringTag): "Bar"}
console.log(b.toString())           // [object Bar]
console.log(b[Symbol.toStringTag])  // Bar
```

## Symbol.unscopables

- 该符号用于描述“防止被width操作绑定到该对象的自有属性或者继承属性”，设置这个属性将指定键值改为true则with方法将无法在该对象上查找指定属性

```js
// 正常形式
var o = { foo: 'asd' }
with(o) {
  console.log(foo) // 'asd'
}

// 自定义后
var o = { foo: 'asd' }
o[Symbol.unscopables] = {
  foo: true
}
with(o) {
  console.log(foo)  // Uncaught ReferenceError: foo is not defined
}
```

- 新的ECMAScript规范中已经不推荐使用with方法了，所以，我们的Symbol.unscopables也不再推荐使用