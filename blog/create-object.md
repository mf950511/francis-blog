---
title: "对象创建与原型"
date: "2020-10-27"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 创建对象与原型

- 创建普通对象我们使用Object构造函数或者字面量，但是针对多个具有同样接口的对象我们再使用构造函数或者字面量会产生很多重复代码
- ECMAScript5.1并没有正式支持面向对象结构。ES6开始正式支持类和继承。但也仅仅是封装了ES5.1构造函数加原型继承语法糖

## 工厂模式

- 工厂模式就是抽象用于创建特定类型对象的过程，如下

```js
function createPerson(name, age, job) {
  let o = {
    name,
    age,
    job,
    sayName: function(){
      console.log(this.name)
    }
  }
  return o
}

let person1 = createPerson('张三', 24, 'teacher')
person1.sayName() // 张三
let person2 = createPerson('李四', 24, 'doctor')
```
<!--more-->
- 这就是一个简单工厂模式，帮我们简化了每一步赋值对象的过程

## 构造函数模式

- 我们可以自定义构造函数来为对象定义属性和方法

```js
function Person(name, age, job) {
  this.name = name
  this.age = age
  this.job = job
  this.sayName = function(){
    console.log(this.name)
  }
}
let person3 = new Person('张三', 24, 'teacher')
person3.sayName() // 张三
let person4 = new Person('李四', 24, 'doctor')

console.log(person3.constructor === Person) // true
console.log(person4.constructor === Person) // true
```

- 这里我们看到其实就是讲属性和方法给了this，然后使用new关键字创建就可以了。其实这段语句内里的操作是：
  - 在内存中创建一个新对象
  - 将新对象的[[Prototype]]特性赋值为构造函数的prototype属性
  - 构造函数内部的this被赋值为这个新对象
  - 执行构造函数内部的代码（给新对象添加属性）
  - 如果构造函数返回非空对象，就返回该对象；否则返回刚创建的新对象
- 用该方式创建的实例都有一个constructor属性指向Person
- constructor本来是用于标识对象类型的。不过一般用instanceof来确定对象类型更加可靠。

### 构造函数创建的问题

- 定义的方法会在每个实例上都创建一遍，意味着两个实例都是对应的方法属性，而且不是同一个Function实例。
- 我们的实例中的函数属性是做一样的事，所以没必要用两个Function实例。this对象可以吧函数与对象的绑定推迟到运行时

```js
function Person(name, age, job){
  this.name = name
  this.age = age
  this.job = job
  this.sayName = sayName
}
function sayName(){
  console.log(this.name)
}
```

- 这样的实现就让所有的实例都共享了定义在外面的sayName函数。
- 这样虽然解决了问题，但是污染了全局作用域，要是有多个方法属性就要在外面定义多个函数

## 原型模式

- 每个函数都会创建一个prototype属性，这个属性是一个对象，包含应该由特定引用类型的实例共享的属性与方法。
- 这个对象就是通过调用构造函数创建的对象的原型。
- 原型对象上定义的属性和方法可以被对象的实例共享。

```js
function Person(){}
Person.prototype.name = '张三'
Person.prototype.age = 24
Person.prototype.sayName = function(){
  console.log(this.name)
}

let person1 = new Person()
let person2 = new Person()
console.log(person1.sayName === person2.sayName) // true
```

- 使用这样的模式定义的属性与方法都由实例共享

## 原型

- 无论何时，只要创建函数，就会按照一定规则给函数创建一个prototype属性（指向原型对象）。默认情况下，所有原型对象获得一个名为constructor的属性，指回与之关联的构造函数
- 然后就有了 Person.prototype.constructor === Person。
- 在自定义构造函数时，原型对象默认只有constructor属性，其他的所有方法都继承自Object。
- 每次调用构造函数都会创建一个新实例，这个实例内部[[Prototype]]会被赋值为构造函数的原型对象。脚本中没有标准的访问[[Prototype]]的犯法，但是一般浏览器会在对象上暴露__proto__属性来访问对象的原型。
- 实例与构造函数原型有直接联系，但实例与构造函数之间没有，如下代码

```js
function Person(){}
console.log(typeof Person.prototype) // object
console.log(Person.prototype) // 
// {
//   constructor: ƒ Person()
// __proto__: Object
// }

console.log(Person.prototype.constructor === Person) // true

// 正常的原型链都会终止于Object的原型对象，Object的原型的原型是null
console.log(Person.prototype.__proto__ === Object.prototype)   // true
console.log(Person.prototype.__proto__.constructor === Object) // true
console.log(Person.prototype.__proto__.__proto__ === null)     // true
console.log(Person.prototype.__proto__)                        
// {
//   constructor: ƒ Object()
// hasOwnProperty: ƒ hasOwnProperty()
// isPrototypeOf: ƒ isPrototypeOf()
// propertyIsEnumerable: ƒ propertyIsEnumerable()
// toLocaleString: ƒ toLocaleString()
// toString: ƒ toString()
// valueOf: ƒ valueOf()
// __defineGetter__: ƒ __defineGetter__()
// __defineSetter__: ƒ __defineSetter__()
// __lookupGetter__: ƒ __lookupGetter__()
// __lookupSetter__: ƒ __lookupSetter__()
// get __proto__: ƒ __proto__()
// set __proto__: ƒ __proto__()
// }

// 实例与构造函数没有直接联系，与原型对象有直接联系
let person1 = new Person()
console.log(person1.__proto__ === Person.prototype)  //true
console.log(person1.__proto__.constructor === Person) // true

```

- Person.prototype指向原型对象，而Person.prototype.constructor指回Person构造函数。
- 虽然不是所有实现都暴露[[Prototype]]，但可以使用isPrototypeOf()确定两个对象之间的关系。本质上，isPrototypeOf()会在传入参数的[[Prototype]]指向调用它的对象时返回true

```js
console.log(Person.prototype.isPrototypeOf(person1)) // true
```

- ECMAScript的Object类型有一个方法Object.getPrototypeOf()，返回参数内部的特性[[Protptype]]的值

```js
console.log(Object.getPrototypeOf(person1) === Person.prototype) // true
```

- 该方法可以方便的取得一个对象的原型
- Object还有一个setPrototypeOf()方法，可以向实例的私有属性[[Prototype]]写入一个新值。

```js
let biped = {
  numLegs: 2
}
let person = {
  name: 'Matt'
}
Object.setPrototypeOf(person, biped)
console.log(person.name) // Matt
console.log(person.numLegs) // 2
console.log(Object.getPrototypeOf(person) === biped) // true
```

- Object.setPrototypeOf()可能会严重影响代码性能。在所有的JavaScript引擎中，修改继承关系的影响都微妙而深远。这种影响不仅仅是执行Object.setPrototypeOf()语句那么简单，而是涉及所有修改过[[Prototype]]的对象的代码
- 为避免使用Object.setPrototypeOf()导致的性能下降，可以使用Object.create()来创建对象，并指定原型

```js
let biped = {
  numLegs: 2
}
let person = Object.create(biped)
person.name = 'Matt'
console.log(person.numLegs) // 2
console.log(person.name) // Matt
console.log(Object.getPrototypeOf(person) === biped) // true
```

- hasOwnProperty()用于确定某个属性存在于实例还是原型对象上。该方法继承自Object，会在属性存在于调用它的对象时返回true
- ECMAScript中的Object.getOwnPropertyDescriptor()只对实例属性有效。要取原型属性的描述符，就要在原型对象上调用Object.getOwnPropertyDescriptor()

### 原型和in操作符

- in操作符有两种使用，一种是直接使用，一种配合for-in循环使用。
- 单独使用时，in会在可以访问对象指定属性时返回true，无论该属性在实例上还是原型上

```js
function Person(){}
Person.prototype.name = '张三'
let person = new Person()
person.age = 24
console.log("name" in person) // true
console.log("age" in person)  // true
```

- in配合hasOwnProperty()可以实现判断某个属性是否在原型上

```js
function hasPrototypeProperty(object, name){
  return !object.hasOwnProperty(name) && (name in object)
}
```

- 在for-in使用in操作符可以通过对象访问可以被枚举的属性，包括实例属性和原型属性。屏蔽原型中不可枚举（[[Enumerable]]特性设置为false）也会在for-in循环中返回。因为默认情况下开发者定义的属性都是可枚举的
- 可以通过Object.keys()获取对象上的所有可枚举的实例属性。不包含原型上的属性
- Object.getOwnPropertyNames()返回所有的实例属性，无论是否可以枚举。
- ES6新增符号类型后新增方法Object.getOwnPropertyNames()，因为以符号为键的属性没有名称概念。该方法与Object.getOwnPropertyNames()类似，只是针对符号而已

### 属性的枚举顺序

- for-in与Object.keys()枚举顺序不确定，取决于JavaScript引擎
- Object.getOwnPropertyNames()、Object.getOwnPropertySymbols()和Object.assign()的枚举顺序是确定的，先以升序枚举数值键，然后以插入顺序枚举字符串和符号键

```js
let k1 = Symbol('k1'), k2 = Symbol('k2')
let o = {
  1: 1,
  first: 'first',
  [k1]:'sym1',
  second: 'second',
  0: 0
}
o[k2] = 'sym2'
o[3] = 3
o.third = 'third'
o[2] = 2
console.log(Object.getOwnPropertyNames(o))  //  ["0", "1", "2", "3", "first", "second", "third"]
console.log(Object.getOwnPropertySymbols(o))  // [Symbol(k1), Symbol(k2)]
```

### 对象迭代

- ECMAScript2017新增了两个静态方法Object.values()、Object.entries()
- Object.values()返回对象值的数组，Object.entries()返回键/值的数组

```js
const o = {
  foo: 'bar',
  baz: 1,
  qux: {}
}
console.log(Object.entries(o)) //  [["foo", "bar"],  ["baz", 1], ["qux", {…}]]
console.log(Object.values(o)) //  ["bar", 1, {…}]
```

- 符号属性会被忽略

```js
const sym = Symbol()
const o1 = {
  [sym]: 'foo'
}
console.log(Object.entries(o1)) //  []
console.log(Object.values(o1)) //  []
```

- 之前我们看到的原型上定义一个属性或方法都要把Person.prototype重写一遍，所以我们可以通过一个包含所有属性和方法的对象字面量重写原型

```js
function Person(){}
Person.prototype = {
  name: '张三',
  age: 28,
  sayName(){
    console.log(this.name)
  }
}
```

- 这里Person.prototype被设置为跟前面一样的新对象，但是这样有一个问题，Person.prototype的constructor属性就指向Person了。
- 之前创建函数时，也会创建它的prototype对象，并自动为这个原型的constructor属性赋值。
- 字面量方式创建就完全重写了默认的prototype对象，因此其constructor属性也就指向了完全不同的新对象（Object构造函数），不再是原来的构造函数。
- 虽然instanceof依然可以可靠地返回值，但是不能靠constructor属性来识别类型了

```js
function Person(){}
Person.prototype = {
  name: '张三',
  age: 28,
  sayName(){
    console.log(this.name)
  }
}
let person2 = new Person()
console.log(person2 instanceof Person) // true
console.log(person2 instanceof Object) // true
console.log(person2.constructor === Person) // false
console.log(person2.constructor === Object) // true
```

- 如果还是决定要使用constructor，可以专门设置一下它的值

```js
function Person(){}
Person.prototype = {
  constructor: Person,
  name: '张三',
  age: 28,
  sayName(){
    console.log(this.name)
  }
}
```

- 但是要注意，这种方式恢复的constructor属性会创建一个[[Enumerable]]为true的属性。而原生的constructor属性默认不可枚举，所以需要使用Object.defineProperty来进行设置