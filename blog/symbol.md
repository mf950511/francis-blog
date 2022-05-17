---
title: "符号类型(symbol)"
date: "2020-09-23"
name: 'francis'
age: '24'
tags: [JavaScript回顾]
categories: JavaScript
---

# 符号类型(symbol)

- Symbol是ES6新增的一种数据类型，用以标识独一无二的类型，所有的Symbol实例都是独一无二的

## Symbol的使用方式

- Symbol跟其他类不同，生成实例不需要使用 new 关键字，使用 new 关键字会报错，可以接受一个字符串作为Symbol的入参，也可以不传参直接生成，如下

```js
let sm = new Symbol() // TypeError: Symbol is not a constructor

let sm1 = Symbol()
console.log(sm1) // Symbol()
console.log(typeof sm1) // symbol
let sm2 = Symbol('test')
console.log(sm2) // Symbol('test')
```
<!--more-->
- 每一个Symbol实例都不相同，如下实验

```js
let sm = Symbol()
let sm1 = Symbol()
console.log(sm === sm1) // false

let sm2 = Symbol('test')
let sm3 = Symbol('test')
console.log(sm2 === sm3) // false
```

- 这也是Symbol最显著的特殊，可以让我们无后顾之忧的拓展对象属性，而不用担心会跟其现有的属性或方法冲突

## Symbol.for()

- 如果都是使用上面的Symbol()来给对象赋值的的话我们就没法读取到该属性值了，如下

```js
let a = {}
a[Symbol('test')] = 123
console.log(a[Symbol('test')]) // undefined
```

- 因为在这里我们赋值跟取值的Symbol是完全不同的，为了避免这种情况，且能获取到对应的值我们需要使用Symbol.for()
- Symbol.for()方法的使用跟Symbol()的使用是一致的，可以接收一个字符串来做Symbol的唯一表示，调用该方式时，会从全局运行注册对象中查找有没有该Symbol，如果没有找到，就会生成一个Symbol对象并注册到全局运行注册对象中，然后返回该对象，如果查到了该Symbol，则直接返回该对象，所以看下示例：
  
```js
let a = Symbol.for('test') // 没找到，创建实例
let b = Symbol.for('test') // 找到，直接返回实例
console.log(a === b) // true

let c = {}
c[Symbol.for('foo')] = 123
console.log(c[Symbol.for('foo')]) // 123
```

- 使用Symbol()给对象赋值的方式，如下

```js
let s1 = Symbol('foo'),
  s2 = Symbol('bar'),
  s3 = Symbol('baz'),
  s4 = Symbol('qux')
let o = {
  [s1]: 'foo val'
}
console.log(o) // {Symbol(foo): "foo val"}
Object.defineProperty(o, s2, { value: 'bar val' })
console.log(o) // {Symbol(foo): "foo val", Symbol(bar): "bar val"}
Object.defineProperties(o, {
  [s3]: { value: 'baz val' },
  [s4]: { value: 'qux val' }
})
console.log(o) // {Symbol(foo): "foo val", Symbol(bar): "bar val", Symbol(baz): "baz val", Symbol(qux): "qux val"}
```

## Symbol.keyFor()

- 我们可以使用 Symbol.keyFor() 来检查一个Symbol实例是否存在与全局运行注册表中，该方法接收一个Symbol实例，如果全局注册表中存在该实例，则返回对应的key值，如果不存在，就会返回一个undefined，如下

```js
Symbol.keyFor(Symbol.for('test')) // 'test'，通过Symbol.for()创建的Symbol实例会自动在注册表中注册
Symbol.keyFor(Symbol('test')) // undefined 通过Symbol()方式创建的不会在注册表中注册，所以会返回undefined

```

## Object.getOwnPropertyNames() 跟 Object.getOwnPropertySymbols()

- 然后我们尝试使用 Object.getOwnPropertyNames 跟 Object.getOwnPropertySymbols 来获取一下对象o的值来看一下

```js
Object.getOwnPropertyNames(o) // []
Object.getOwnPropertySymbols(o) // [Symbol(foo), Symbol(bar), Symbol(baz), Symbol(qux)]
```

- 这里我们能看到使用 Object.getOwnPropertyNames 好像并不能获取到我们Symbol实例键，我们再给o拓展几个普通属性试试

```js
o['baz'] = '123'
o['foo'] = '234'

Object.getOwnPropertyNames(o) // ["baz", "foo"]
Object.getOwnPropertySymbols(o) // [Symbol(foo), Symbol(bar), Symbol(baz), Symbol(qux)]
```

- 看到上结果我们也能知道，Object.getOwnPropertyNames 用于获取我们的常规除Symbol外的常规键值，Object.getOwnPropertySymbols 用于获取我们的Symbol键值

## Object.getOwnPropertyDescriptors() 跟 Reflect.ownKeys()

- 然后我们再使用 Object.getOwnPropertyDescriptors() 跟 Reflect.ownKeys()来获取一下o的属性

```js
Object.getOwnPropertyDescriptors(o) // {baz: {…}, foo: {…}, Symbol(foo): {…}, Symbol(bar): {…}, Symbol(baz): {…},Symbol(qux): {...}}
Reflect.keys(o) // ["baz", "foo", Symbol(foo), Symbol(bar), Symbol(baz), Symbol(qux)]
```

- 从中我们能看到 Object.getOwnPropertyDescriptors() 可以获取对象的常规值跟Symbol对应的值，Reflec.ownKeys() 可以获取对象的常规键跟Symbol键