---
title: "继承--高程4"
date: "2020-12-08"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# JS中的继承-（高程4）

## 原型链继承

- 基本思想为：每个构造函数都有一个原型对象，原型有一个属性指回构造函数，实例有一个内部指针指向原型。
- 如果一个原型是另一个原型的实例，就是说这个原型内部有一个内部指针指向另一个原型，相应的另一个原型也有一个指针指向另一个构造函数。
- 这样就在原型和实例间构造了原型链
<!--more-->
```js
function SuperType(){
  this.property = true
}

SuperType.prototype.getSuperValue = function(){
  console.log(333)
  return this.property
}

function SubType (){
  this.subproperty = false
}

SubType.prototype = new SuperType()

SubType.prototype.getSubValue = function(){
  return this.subproperty
}

var instance = new SubType()
console.log(instance.getSuperValue()) // true
```

- 这里SubType没有用默认的原型对象，用了SuperType的实例。这样SubType与SuperType就挂上了构，所以instance内部的[[Prototype]]指向了SubType.prototype，而SubType.prototype内部的[[Prototype]]指向了SuperType.prototype。这样就通过原型链查找实现了继承
- 因为SubType.prototype的constructor属性被重写为指向了SuperType，所以instance.constructor也指向了SuperType
- isPrototypeOf方法，用于判断一个原型是否在手里的原型链上，每个原型都可以调用，只要在原型链就返回true

```js
console.log(Object.prototype.isPrototypeOf(instance)) // true
```

### 原型继承现存问题

- 原型包含引用值时，会在所有实例共享
- 子类型在实例化时无法给父类型的构造函数传参

## 经典继承或对象伪装

- 基本思路：在子类的构造函数中调用父类的构造函数。然后使用call或者apply方法以新创建的对象作为上下文执行构造函数

```js
function SuperType (){
  this.colors = ['red', 'blue']
}
function SubType(){
  // 继承实现
  SuperType.call(this)
}

let instance1 = new SubType()
instance1.colors.push('black')
console.log(instance1.colors) // ['red', 'blue', 'black']
let instance2 = new SubType()
console.log(instance2.colors) // ['red', 'blue']
```

- 盗用构造函数还可以向父类构造函数传递参数

```js
function SuperType (name){
  this.name = name
  this.age = 28
}
function SubType(name){
  // 继承实现
  SuperType.call(this, name)
}

let instance1 = new SubType('张三')
console.log(instance1.name) // '张三'
let instance2 = new SubType('李四')
console.log(instance2.name) // '李四'
```

### 经典继承现存问题

- 必须在构造函数中定义方法，函数无法重用
- 子类型无法访问父类原型上的方法，所有类型都只能用构造函数模式

## 组合继承（伪经典继承）

- 将原型链与盗用构造函数结合起来，使用原型链继承原型上的属性和方法，通过盗用构造函数继承实例属性。

```js
function SuperType (name){
  this.name = name
  this.colors = ['red', 'blue']
}
SuperType.prototype.sayName = function(){
  return this.name
}

function SubType(name, age){
  SuperType.call(this, name)
  this.age = age
}
SubType.prototype = new SuperType()
SubType.prototype.constructor = SubType
SubType.prototype.sayAge = function(){
  return this.age
}

let instance1 = new SubType('张三', 27)
instance1.colors.push('black')
instance1.sayName() // '张三'
console.log(instance1.colors) // ['red', 'blue', 'black']
instance1.sayAge() // 27



let instance2 = new SubType('李四', 28)
instance2.sayName() // '李四'
console.log(instance2.colors) // ['red', 'blue']
instance2.sayAge() // 28
```

- 组合继承弥补了原型继承与盗用构造函数的不足，是javascript中使用最多的继承，而且也保留了instanceof与isPrototypeOf的识别能力

### 组合式继承问题

- 组合继承存在效率问题，主要问题便是父元素构造函数会被调用两次，一次是创建子类型时调用，另一次是子类构造函数中使用。

## 原型式继承

- 原型式继承是不自定义类型也能通过原型实现对象之间的信息共享，原理就一个函数

```js
function object(o) {
  function F(){}
  F.prototype = o
  return new F()
}
```

- 创建一个临时的构造函数，原型指向传入的对象，然后再返回这个临时类型的实例

```js
function object(o) {
  function F(){}
  F.prototype = o
  return new F()
}
let person = {
  name: 'Nick',
  friends: ['Shel', 'Court']
}

let anotherPerson = object(person)
anotherPerson.name = 'Greg'
anotherPerson.friends.push('Rob')

let yetAnotherPerson = object(person)
yetAnotherPerson.name = 'Linda'
yetAnotherPerson.friends.push('Barieb')

console.log(person.friends) // ["Shel", "Court", "Rob", "Barieb"]
```

- 这里的原型式继承适用于：你有一个对象，在现有基础上创建一个新对象。
- ECMAScript 5 增加了Object.create()来将原型式继承规范化了。接收两个参数：作为新对象原型的对象，给新对象定义额外属性的对象。

```js
let person = {
  name: 'Nick',
  friends: ['Shel', 'Court']
}

let anotherPerson = Object.create(person)
anotherPerson.name = 'Greg'
anotherPerson.friends.push('Rob')

let yetAnotherPerson = Object.create(person)
yetAnotherPerson.name = 'Linda'
yetAnotherPerson.friends.push('Barieb')

console.log(person.friends) // ["Shel", "Court", "Rob", "Barieb"]

let morePerson = Object.create(person, { name: { value: 'Francis' } })
morePerson.name // Francis
```

- 这里Object.create方法第二个参数跟Object.defineProperties方法第二个参数一样，都需要通过各自的描述符来描述。

## 寄生式继承

- 寄生式继承的原理：创建一个实现继承的函数，以某种方式增强对象，然后返回对象

```js
function object(o){
  function F(){}
  F.prototype = o
  return new F()
}

function createAnother(original) {
  let clone = object(original)
  clone.sayHi = function(){
    console.log('Hi')
  }
  return clone
}


let person = {
  name: 'Nick',
  friends: ['Shel', 'Court']
}
let another = createAnother(person)
another.sayHi() // 'Hi'
```

### 问题

- 通过寄生式继承给对象添加函数难以复用，与构造函数模式类似

## 寄生式组合继承

- 前面说到组合继承存在效率问题，本质上子类原型只需要包含超类对象的所有实例属性，子函数在执行时重写自己的原型就可以了

```js
function SuperType (name){
  this.name = name
  this.colors = ['red', 'blue']
}
SuperType.prototype.sayName = function(){
  return this.name
}

function SubType(name, age){
  // 第二次调用
  SuperType.call(this, name)
  this.age = age
}
SubType.prototype = new SuperType() // 第一次调用
SubType.prototype.constructor = SubType
SubType.prototype.sayAge = function(){
  return this.age
}

let instance1 = new SubType('张三', 27)
```

- 寄生式组合继承通过盗用构造函数继承属性，但是使用混合式原型链集成方法。
- 基本思路就是不通过调用父类构造函数给子类原型赋值，而是取得父元素原型的一个副本。
- 就是使用寄生式继承继承父类原型，然后将获取到的新对象赋值给子类原型。

```js
function object(o) {
  function F(){}
  F.prototype = o
  return new F()
}
function inheritPrototype(subType, superType) {
  let prototype = object(superType)
  // 解决由于原型重写导致的默认constructor丢失问题
  prototype.constructor = subType
  subType.prototype = prototype
}

function SuperType (name){
  this.name = name
  this.colors = ['red', 'blue']
}
SuperType.prototype.sayName = function(){
  return this.name
}

function SubType(name, age){
  SuperType.call(this, name)
  this.age = age
}
inheritPrototype(SubType, SuperType)
SubType.prototype.sayAge = function(){
  return this.age
}
```

- 这里只调用了一次SuperType的构造函数，避免了SubType上用不到的属性，所以效率更高。
- 而且原型链也保持不变，可以说是引用类型继承的最佳模式