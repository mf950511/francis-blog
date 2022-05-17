---
title: "代理"
date: "2020-12-09"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 代理

- ECMAScript 6新增了代理与反射为开发者提供了拦截并向基本操作嵌入额外行为的能力
- 就是可以给目标对象定义一个关联的代理对象，代理对象可以作为抽象的目标对象来使用，在对目标对象实行的各种操作影响目标对象之前，都可以在代理对象中对这些操作加以控制
- 代理是新的基础性语言能力，所以转移程序无法将其转为之前的ECMAScript代码，因为代理是无可替代的，所以在使用前要检测平台是否支持

## 代理基础

- 代理使用Proxy构造函数来创建，接收两个参数： 目标对象和处理程序对象，缺少任何一个参数都会报错，创建一个空代理只需要将对象字面量作为处理程序传递即可，如下
<!--more-->
```js
const target = {
  id: 'target'
}
const handler = {}
const proxy = new Proxy(target, handler)
console.log(target.id) // target
console.log(proxy.id)   // target 

target.id = 'foo'
console.log(target.id) // foo
console.log(proxy.id)  // foo

proxy.id = 'bar'
console.log(target.id) // bar
console.log(proxy.id)  // bar

console.log(target.hasOwnProperty('id')) // true
console.log(proxy.hasOwnProperty('id'))  // true

console.log(target instanceof Proxy) // Uncaught TypeError: Function has non-object prototype 'undefined' in instanceof check
console.log(proxy instanceof Proxy)  // Uncaught TypeError: Function has non-object prototype 'undefined' in instanceof check

console.log(target === proxy) // false
```

- 这里属性会访问同一个值，对目标属性赋值会反映在两个对象，因为它们访问的是一个值
- 对代理赋值会反应在两个对象，因为赋值会转移到目标对象
- hasOwnProperty()在两个地方都会应用到目标对象
- Proxy.prototype是undefined，所以不能使用instanceof
- 目标跟代理对象不是严格相等

## 定义捕获器

- 捕获器就是处理程序对象中定义的“基本操作的拦截器”。每个处理程序对象可以包含任意个捕获器，每个捕获器都对应一个基本操作，可以直接或间接在代理对象上调用。
- 每次在代理上调用这些基本操作，代理都可以在这些操作到达目标对象前调用捕捉器函数，从而拦截并修改相应的行为
- 如下就是定义了一个get()捕捉器

```js
const target = {
  foo: 'bar'
}
const handler = {
  get () {
    return 'handler override'
  }
}

const proxy = new Proxy(target, handler)
console.log(target.foo) // bar
console.log(proxy.foo)  // handler override
```

- 当通过代理对象触发get操作时就会触发定义的get()捕获器，get()方法不是ECMAScript对象可以调用的方法，而是通过其他形式触发被捕获的
- proxy[property]、proxy.property 或者 Object.create(proxy)[property]等操作都会触发get()方法
- 在目标对象上执行这些操作仍然是正常的行为

## 捕获器参数与反射API

- 捕获器都可以访问相应的参数，基于这些参数可以重建被捕获方法的原始行为。例如get()捕获器可以收到目标对象、要查询的属性和代理对象三个参数

```js
const target = {
  foo: 'bar'
}
const handler = {
  get (tarpTarget, property, receiver) {
    console.log(tarpTarget === target)  // true
    console.log(property)  // 'foo'
    console.log(receiver === proxy) // true
  }
}

const proxy = new Proxy(target, handler)
proxy.foo
```

- 有了这些参数我们就可以重建被捕获方法的原始行为

```js
const target = {
  foo: 'bar'
}
const handler = {
  get (tarpTarget, property, receiver) {
    return tarpTarget[property]
  }
}

const proxy = new Proxy(target, handler)
console.log(target.foo) // bar
console.log(proxy.foo)  // bar
```

- 所有的捕获器都可以基于自己的参数重建原始操作，但是有些原始操作很复杂，手写太麻烦，所以我们可以调用全局Reflect（封装了原始行为）对象上的同名方法来重建
- 处理程序对象中的所有可以捕获的方法都由对应的反射（Reflect）API方法。这些方法与捕获器拦截的方法有相同的名称和函数签名，与被拦截方法有相同的行为，所以可以使用如下方式定义

```js
const target = {
  foo: 'bar'
}
const handler = {
  get () {
    return Reflect.get(...arguments)
  }
}

const proxy = new Proxy(target, handler)
console.log(target.foo) // bar
console.log(proxy.foo)  // bar

// 或者
const target = {
  foo: 'bar'
}
const handler = {
  get: Reflect.get
}

const proxy = new Proxy(target, handler)
console.log(target.foo) // bar
console.log(proxy.foo)  // bar
```

- 如果只是想捕获所有方法，然后转发给对应的反射API的空代理，都不需要定义处理程序对象

```js
const target = {
  foo: 'bar'
}

const proxy = new Proxy(target, Reflect)
console.log(target.foo) // bar
console.log(proxy.foo)  // bar

const target = {
  foo: 'bar',
  bar: 'baz'
}
const handler = {
  get(tarpTarget, property, receiver) {
    let decoration = ''
    if(property === 'foo') {
      decoration = '!!!'
    }
    return Reflect.get(...arguments) + decoration
  }
}

const proxy = new Proxy(target, handler)
console.log(proxy.foo) // bar!!!
console.log(proxy.bar)  // baz
```

- 捕获器可以改变几乎所有的基本方法，但是有限制，每个捕获的方法都知道目标对象上下文、捕获函数签名，捕获函数处理程序的行为必须遵循“捕获器不变式”
- 比如目标对象有一个不可配置不可写的数据属性，那么捕获器返回一个与该属性不同的值会报错

```js
const target = {}
Object.defineProperty(target, 'foo', {
  configurable: false,
  wirtable: false,
  value: 'bar'
})
const handler = {
  get(){
    return 'qux'
  }
}
const proxy = new Proxy(target, handler)
console.log(proxy.foo) // Uncaught TypeError: 'get' on proxy: property 'foo' is a read-only and non-configurable data property on the proxy target but the proxy did not return its actual value (expected 'bar' but got 'qux')
```

### 可撤销代理

- 对使用new Proxy创建的代理会在代理对象的生命周期中一直存在，有时候我们需要终端代理对象与目标对象的联系，这个时候就要用到Proxy暴露的revocable()方法
- 这个方法支持撤销目标对象跟对象的关联，是不可逆的，调用多次结果都是一样，撤销之后在调用代理会抛错

```js
const target = {
  foo: 'bar'
}
const handler = {
  get () {
    return "interceped"
  }
}

const { proxy, revoke } = Proxy.revocable(target, handler)
console.log(proxy.foo)  // interceped

revoke()
console.log(proxy.foo) // Uncaught TypeError: Cannot perform 'get' on a proxy that has been revoked
```

- 特定情况下应该优先使用反射API，理由如下
- 反射API不限于捕捉处理程序
- 大多数反射API方法在Object类型上有对应的方法
- 通常Object上的方法是用于通用程序，而反射方法适用于细粒度的对象控制
- 很多反射方法会返回“状态标记”的布尔值，表示该操作是否成功，很多时候，状态标记比返回修改后的对象或错误更有用，看以下对比

```js
const o = {}
try {
  Object.defineProperty(o, 'foo', 'bar')
  console.log('success')
} catch(e){
  console.log('failuer')
}

// 重构后
const o = {}
if(Reflect.defineProperty(o, 'foo', { value: 'bar' })) {
  console.log('success')
} else {
  console.log('failure')
}
```

- 以下方法会提供状态标记
  - Reflect.defineProperty()
  - Reflect.preventExtensions()
  - Reflect.setPrototypeOf()
  - Relfect.set()
  - Relfect.deleteProperty()
- 用一等函数替代操作符，以下反射方法只有通过操作符才可以完成
  - Reflect.get(): 可以替代对象属性访问操作符
  - Reflect.set(): 可以替代=赋值操作符
  - Reflect.has(): 可以替代in操作符
  - Reflect.deleteProperty(): 可以替代delete操作符
  - Reflect.construct(): 可以替代new操作符
- 安全的使用函数
  - 通过apply方法调用函数时，被调用函数可能定义了自己的apply属性。为了绕过这个问题，可以使用定义在Function原型上的apply方法
  - 但是调用Function原型上的方法会很难读，所以可以使用Reflect.apply来替代

```js
Function.prototype.apply.call(muFunc, thisVal, argumentList)

// 用Reflect.apply替代
Reflect.apply(myFunc, thisVal, argumentList)
```

- 代理另一个代理，代理可以拦截反射API的操作，所以我们可以创建一个代理，利用它去代理另一个代理，就构建了多层拦截网

```js
const target = {
  foo: 'bar'
}
const firstProxy = new Proxy(target, {
  get() {
    console.log('first proxy')
    return Reflect.get(...arguments)
  }
})

const secondProxy = new Proxy(firstProxy, {
  get() {
    console.log('seond proxy')
    return Reflect.get(...arguments)
  }
})
console.log(secondProxy.foo)

// seond proxy
// first proxy
// bar
```

## 代理的问题与不足

- 代理中的this，方法中的this通常指向调用这个方法的对象，如果目标依赖于对象表示，可能会出问题，如下用WeakMap报错私有变量的例子，简化版

```js
const wm = new WeakMap()

class User{
  constructor(userid){
    wm.set(this, userid)
  }
  set id(userid){
    wm.set(this, userid)
  }
  get id(userid) {
    return wm.get(this)
  }
}

const user = new User(123)
console.log(user.id)  // 123

const userInstanceProxy = new Proxy(user, {})
console.log(userInstanceProxy.id) // undefined
```

- 这里User实例使用目标对象作为WeakMap的键，但是代理对象却从自身取这个实例，所以就出问题了
- 解决问题就是将代理User实例改为代理User类本身，之后在创建代理实例就会以代理实例作为WeakMap的值了

```js
const UserClassProxy = new Proxy(User, {})
const proxyUser = new UserClassProxy(456)
console.log(proxyUser.id)
```

- 代理与内置类型（如Array）的实例可以很好地协作，但有些ECMAScript内置类型可能会导致代理某些方法出错，比如Date类型
- Date类型依赖this值上的[[NumberDate]]槽位，这个槽位无法通过get()跟set()方法访问到，所以代理拦截后转发给目标对象的方法会报错

```js
const target = new Date()
const proxy = new Proxy(target, {})
console.log(proxy instanceof Date) // true
proxy.getDate() // Uncaught TypeError: this is not a Date object.
```

## 代理捕获器与反射方法

- 代理可以捕获13中不同的基本操作。这些操作有各自不同的反射API方法、参数、关联的ECMAScript方法与不变式
- 不同的JavsScript操作可以出发同一个捕获器处理。但是对于在代理对象上的任何操作，都只会有一个捕获处理程序被调用，不存在重复捕获的情况

### get()

- get()捕获器会在获取属性值的操作被调用，对应的反射API为Reflect.get()
- 返回值无限制
- 拦截的操作： 
  - proxy.property
  - proxy[property]
  - Object.create(proxy)[Property]
  - Reflect.get(proxy, property, receiver)
- 捕获器处理程序参数
  - target: 目标对象
  - property: 引用目标对象上的字符串属性（也有可能是符号键）
  - receiver: 代理对象或继承代理对象的对象
- 捕获器不定式
  - 如果target.property不可写切不可配置，则返回的值必须跟target.property一致
  - 如果target.property不可写且[[Get]]特性为undefined，处理程序的返回值也必须是undefined

### set()

- set()会在设置属性值的操作中被调用，对应的反射API为Reflect.set()
- 返回值为true表示成功；为false表示失败，严格模式下抛错
- 拦截的操作
  - proxy.property = value
  - proxy[property] = value
  - Object.create(proxy)[property] = value
  - Reflect.set(proxy, property, value, receiver)
- 捕获器处理程序参数
  - target: 目标对象
  - property: 引用目标对象的字符串健属性
  - value: 要赋给属性的值
  - receiver: 接收最初赋值的对象
- 捕获器不定式
  - 如果target.property不可写且不可配置，则不能修改目标属性的值
  - 如果target.property不可配置且[[Set]]特性为undefined，则不可修改目标属性的值
  - 严格模式下，处理程序返回false会报错

### has()

- has()捕获器在in操作符中被调用，对应的反射API为Reflect.has()
- 返回值必须式布尔值，表示属性是否存在。非布尔值会被转为布尔值
- 拦截的操作
  - property in proxy
  - property in Object.create(proxy)
  - with(proxy){(property)}
  - Reflect.has(proxy, property)
- 捕获器处理程序参数
  - target: 目标对象
  - property: 引用的目标对象上的字符串键属性
- 捕获器不定式
  - 如果target.property存在且不可配置，则处理程序必须返回true
  - 如果target.property存在目标且目标对象不可拓展，则处理程序必须返回true

### defineProperty

- defineProperty()捕获器会在Object.defineProperty()中被调用，对应的反射API为Reflect.defineProperty()
- 返回值必须为布尔值，表示属性是否定义成功。返回非布尔值会被转为布尔值
- 拦截的操作
  - Object.defineProperty(proxy, property, descriptor)
  - Reflect.defineProperty(proxy, property, descriptor)
- 捕获器处理程序参数
  - target: 目标对象
  - property: 引用目标对象上的字符串键属性
  - descriptor: 包含可选的enumerable、configuable、writable、value、get、set定义的对象
- 捕获器不定式
  - 如果目标对象不可拓展，则无法定义属性
  - 如果目标对象有一个可配置的属性，则不能添加同名的不可配置的属性
  - 如果目标对象有一个不可配置的属性，则不能添加同名的可配置属性

### getOwnPropertyDescriptor()

- getOwnPropertyDescriptor()捕获器会在Object.getOwnPropertyDescriptor中被调用，对应的反射API为Reflect.getOwnPropertyDescriptor
- 返回值必须返回对象，如果在属性不存在时返回undefined
- 拦截的操作
  - Object.getOwnPropertyDescriptor(proxy, property)
  - Reflect.getOwnPropertyDescriptor(proxy, property)
- 捕获器处理程序参数
  - target: 目标对象
  - property: 引用的目标对象上的字符串键值
- 捕获器不变式
  - 如果自有的target.property存在且不可配置，则处理程序必须返回一个表示该属性存在的对象
  - 如果自有的target.property存在且target可拓展，则处理程序必须返回一个表示该属性可配置的对象
  - 如果自有的target.property存在且target不可拓展，则处理程序必须返回一个表示该属性存在的对象
  - 如果自有的target.property不存在且target不可拓展，则处理程序必须返回undefined表示该属性不存在
  - 如果target.property不存在，则处理程序不能返回表示该属性可配置的对象

### deleteProperty

- deleteProperty会在delete操作符中被调用，对应的反射API为Reflect.deleteProperty()
- 返回值必须为布尔值，表示删除属性是否成功。返回非布尔值会被转为布尔值
- 拦截的操作
  - delete proxy.property
  - delete proxy[property]
  - Reflect.deleteProperty(proxy, property)
- 捕获器处理程序参数
  - target: 目标对象
  - property: 引用的目标对象上的字符串键值
- 捕获器不变式
  - 如果自有的target.property存在且不可配置，则处理程序不能删除这个属性

### ownKeys

- ownKeys会在Object.keys()及类似方法中被调用，对应的反射API为Reflect.ownKeys()
- 返回值必须返回包含字符串或符号的可枚举对象
- 拦截的操作
  - Object.getOwnPropertyNames(proxy)
  - Object.getOwnPropertySymbols(proxy)
  - Object.keys()
  - Reflect.ownKeys(proxy)
- 捕获器处理程序参数
  - target: 目标对象
- 捕获器不定式
  - 返回的可枚举对象必须包含target的所有不可配置的自有属性
  - 如果target不可拓展，则返回可枚举对象必须军却包含自有属性键

### getPrototypeOf()

- getPrototypeOf()会在Object.getPrototypeOf()中被调用，对应的反射API为Reflect.getPrototypeOf()
- 返回值必须返回对象或者null
- 拦截的操作
  - Object.getPrototypeOf(proxy)
  - Reflect.getPrototypeOf(proxy)
  - proxy.__proto__
  - Object.prototype.isPrototypeOf(proxy)
  - proxy instanceof Object
- 捕获器处理程序参数
  - target: 目标对象
- 捕获器不定式
  - 如果target不可拓展，则Object.getPrototypeOf(proxy)唯一有效的返回值就是Object.getPrototypeOf(target)的返回值

### setPrototypeOf()

- setPrototypeOf()会在Object.setPrototypeOf()中被调用，对应的反射API为Reflect.setPrototypeOf()
- 返回值必须返回布尔值，表示原型赋值是否成功，非布尔值会被转为布尔值
- 拦截的操作
  - Object.setPrototypeOf(proxy)
  - Reflect.setPrototypeOf(proxy)
- 捕获器处理程序参数
  - target: 目标对象
  - prototype: target的替代原型，如果是顶级原型则为null
- 捕获器不定式
  - 如果target不可拓展，则唯一有效的prototype参数就是Object.getPrototypeOf(target)的返回值

### isExtensible()

- isExtensible()会在Object.isExtensible()中被调用，对应的反射API为Reflect.isExtensible()
- 返回值必须为布尔值，表示target是否可拓展，非布尔值会转为布尔值
- 拦截的操作
  - Object.isExtensible(proxy)
  - Reflect.isExtensible(proxy)
- 捕获器处理程序参数
  - target: 目标对象
- 捕获器不定式
  - 如果target可拓展，处理程序必须返回true
  - 如果target不可拓展，处理程序必须返回false

### preventExtensions()

- preventExtensions()捕获器会在Object.preventExtensions()中被调用，对应的反射API为Reflect.preventExtensions()
- 返回值必须为布尔值，表示target是否已经不可拓展，返回非布尔值会被转为布尔值
- 拦截的操作
  - Object.preventExtensions(proxy)
  - Relfect.preventExtensions(proxy)
- 捕获器处理程序参数
  - target: 目标对象
- 捕获器不定式
  - 如果Object.isExtensible(proxy)返回false，则处理程序必须返回true

### apply()

- apply()会在调用函数时被调用，对应的反射API为Reflect.apply()
- 返回值无限制
- 拦截的操作
  - proxy(...argumentsList)
  - Function.prototype.apply(thisArg, argumentsList)
  - Function.prototype.call(thisArg, ...argumentsList)
  - Reflect.apply(target, thisArgument, argumentsList)
- 捕获器处理程序参数
  - target: 目标对象
  - thisArg: 调用此函数时的this参数
  - argumentsList: 调用函数时的参数列表
- 捕获器不定式
  - target必须是函数对象

### construct()

- construct()捕获器会在new操作符中被调用，对应的反射API为Reflect.construct()
- 返回值必须返回一个对象
- 拦截的操作
  - new Proxy(...argumentsList)
  - Reflect.construct(target, argumentsList, newTarget)
- 捕获器处理程序参数
  - target: 目标构造函数
  - argumentsList: 传给构造函数的参数列表
  - 最初被调用的构造函数
- 捕获器不定式
  - target必须可以用作构造函数

## 代理模式

- 利用代理可以做一些有用的编程模式
- 可以捕获get、set、has等操作，知道对象属性什么时候被访问

```js
const user = {
  name: 'jack'
}

const proxy = new Proxy(user, {
  get (target, property, receiver){
    console.log(`Getting ${property}`)
    Reflect.get(...arguments)
  },
  set (target, property, value, receiver){
    console.log(`Setting ${property}=${value}`)
    Reflect.set(...arguments)
  }
})

proxy.name  // Getting name
proxy.age = 27 // Setting age=27
```

- 可以用于隐藏属性

```js
const hiddenProperties = ['foo', 'bar']
const targetObject = {
  foo: 1,
  bar: 2,
  baz: 3
}
const proxy = new Proxy(targetObject, {
  get(target, property) {
    if(hiddenProperties.includes(property)) {
      return undefined
    } else {
      return Reflect.get(...arguments)
    }
  },
  has(target, property){
    if(hiddenProperties.includes(property)) {
      return false
    } else {
      return Reflect.has(...arguments)
    }
  }
})

console.log(proxy.foo) // undefined
console.log(proxy.bar) // undefined
console.log(proxy.baz) // 3
console.log('foo' in proxy) // false
console.log('bar' in proxy) // false
console.log('baz' in proxy) // true
```

- 可以根据所赋的值决定是否允许赋值

```js
const target = {
  onlyNumbersGoHere: 0
}

const proxy = new Proxy(target, {
  set (target, property, value, receiver){
    if(typeof value !== 'number') {
      return false
    } else {
      return Reflect.set(...arguments)
    }
  }
})

proxy.onlyNumbersGoHere = 1
console.log(proxy.onlyNumbersGoHere) // 1

proxy.onlyNumbersGoHere = '2'
console.log(proxy.onlyNumbersGoHere) // 1
```

- 函数跟构造函数参数验证，指定函数只接受某种类型的值

```js
function median(...nums){
  return nums.sort()[Math.floor(nums.length / 2)]
}
const proxy = new Proxy(median, {
  apply(target, thisArg, argumentsList) {
    for(const arg of argumentsList) {
      if(typeof arg !== 'number') {
        throw 'Non-number argument provided'
      }
    }
    return Reflect.apply(...arguments)
  }
})

console.log(proxy(4, 7, 1)) // 4
console.log(proxy(4, '7', 1)) // Uncaught Non-number argument provided
```

- 通过代理可以把原来不关联的部分联系到一起。这样就能实现各种模式，让不同的代码互操作
- 例如，可以将被代理的类放到一个全局实例集合

```js
const userList = []
class User{
  constructor(name){
    this._name = name
  }
}

const proxy = new Proxy(User, {
  construct(){
    const newUser = Reflect.construct(...arguments)
    userList.push(newUser)
    return newUser
  }
})

new proxy('John')
new proxy('Jacob')
new proxy('Jing')
console.log(userList) // [User, User, User]
```

- 可以把集合绑定到一个事件分配程序，每次插入新实例都会发送消息

```js
const userList = []
function emit(newValue) {
  console.log(newValue)
}

const proxy = new Proxy(userList, {
  set(target, property, value, receiver) {
    const result = Reflect.set(...arguments)
    if(result) {
      emit(Reflect.get(target, property, receiver))
    }
    return result
  }
})
proxy.push('John') // John
proxy.push('Jacob') // Jacob
proxy.push('Jing') // Jing
```
