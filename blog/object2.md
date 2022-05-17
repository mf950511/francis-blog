---
title: "对象基本概念"
date: "2020-10-23"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 对象基本概念

- ECMA-262定义的对象是一组属性的无序集合。就是说对象是一组没有顺序的值
- 可以将对象想象为散列表，内容就是一组名/值对
- 对象实例通常都有属性跟方法

## 属性类型

- ECMA-262使用内部特性来描述属性的特质。这些特性都由javascript实现引擎的规范定义的。
- 因此开发者不能在javascript中直接访问这些特性。为了将某个特性标志为内部特征，规范会用两个中括号包裹，比如[[Enumerable]]
- 属性分为数据属性和访问器属性

### 数据属性

- 数据属性包含一个保存数据值得位置。值会从这个位置读取，也会写到这个位置，有4个特性描述它的行为
  - [[Configurable]]: 表示属性是否可以通过delete删除并重新定义，是否可以修改它的特性，以及是否可以把它改为访问器属性。默认情况下，直接定义在对象上的属性，这个值都是true
  - [[Enumberable]]: 表示属性是否可以通过for-in循环返回。默认情况下，直接定义在对象上的属性，这个值都是true
  - [[Writable]]: 表示属性的值是否可以被修改。默认情况下，直接定义在对象上的属性，这个值都是true
  - [[Value]]: 包含属性实际的值，读取和写入属性值的位置。默认值为undefined
- 当我们显式的将属性添加到对象之后，[[Configurable]],[[Enumberable]],[[Writable]]都被设为true，[[Value]]被设为指定值
<!--more-->
```js
let person = {
  name: 'Nicholas'
}
```

- 这里我们创建该属性后， [[Value]]会被设置为'Nicholas'，之后对这个name的修改都会放到这个位置
- 修改属性的默认特性，要使用Object.defineProperty()方法。接收三个参数：添加属性的对象，属性名称和描述符对象。最后一个参数描述符对象属性包括：configurable、writable、enumerable、value，跟特性名称一一对应。根据要修改的特性，设置一个或多个值。

```js
let person = {}
Object.defineProperty(person, "name", {
  value: 'Nicholas',
  writable: false
})
console.log(person.name) // Nicholas
person.name = 'zhangsan'
console.log(person.name)// Nicholas
```

- 这里我们设置了writable为false就是表明它制度，就不可以修改，非严格模式下赋值会被忽略，严格模式下报错

```js
let person = {}
Object.defineProperty(person, "name", {
  value: 'Nicholas',
  configurable: false
})
delete person.name
console.log(person.name) // Nicholas

// 尝试再次修改
Object.defineProperty(person, "name", {
  value: 'Nicholas',
  configurable: true
})
// VM68586:8 Uncaught TypeError: Cannot redefine property: name

```

- 设置configurable之后删除该属性无效，在严格模式下删除该属性会报错
- 设置configurable之后这个属性就被改为不可再配置得了，再次调用Object.defineProperty()并修改非writable的属性会导致报错
- 在调用Object.defineProperty时，configurable、enumerable、writable如果不指定则都默认为false

### 访问器属性

- 访问器属性不包含数据值。相反，它包含一个获取（getter）函数和一个设置（setter）函数，这两个函数都是非必须的。
- 在读取访问器属性时，会调用获取函数，该函数的责任是返回一个有效的值。在写入访问器属性时，会调用设置函数并传入新值，这个函数必须决定对数据做出什么修改。
- 访问器属性也有4个特性描述它们的行为
  - [[Configurable]]: 表示属性是否可以通过delete删除并重新定义，是否可以修改它的特性，是否可以把它改为数据属性。默认情况下，直接定义在对象上的属性的这个特性值都是true
  - [[Enumerable]]: 表示属性是否可以通过for-in循环返回。默认情况下，直接定义在对象上的属性的这个特性值都是true
  - [[Get]]: 获取函数，读取属性时调用。默认值为undefined
  - [[Set]]: 设置函数，写入属性时调用。默认值为undefined
- 访问器属性也需要使用defineProperty来定义

```js
let book = {
  year_: 2017,
  edition: 1
}
Object.defineProperty(book, 'year', {
  get(){
    return this.year_
  },
  set(newValue){
    if(newValue > 2017) {
      this.year_ = newValue
      this.edition += newValue - 2017
    }
  }
})
console.log(book.year) // 2017
book.year = 2018
console.log(book.edition) // 2
```

- 这个例子中book有两个默认属性year_跟edition。year_中的下划线表示该属性不想在对象方法的外面被访问。
- 另一个属性year被定义为访问器属性，其中获取函数简单地返回year_的值，而设置函数会计算决定正确的版本。因此把year变为2018会导致year_变为2018，edition变为2。
- 获取属性跟设置属性不一定都要定义。只定义获取属性意味属性是只读的，尝试修改会忽略。严格模式下会报错
- 只有一个设置函数的属性是不可读取的，非严格模式返回undefined，严格模式报错
- 在不支持Object.defineProperty()的浏览器中没法修改[[Configurable]]或[[Enumerable]]
- ECMAScript5之前，开发者通过非标准的访问器属性访问创建访问器属性：__defineGetter__()和__defineSetter__()。

### 定义多个属性

- ECMAScript提供了Object.defineProperties()方法。该方法可以通过多个描述符一次性定义多个属性。
- 接收两个参数：要为之添加或修改属性的对象和另一个描述符对象，属性与要添加或修改的属性一一对应。

```js
let book = {}
Object.defineProperties(book, {
  year_: {
    value: 2017
  },
  edition: {
    value: 1,
  },
  year: {
    get(){
      return this.year_
    },
    set(newValue){
      if(newValue > 2017) {
        this.year_ = newValue
        this.deition += newValue - 2017
      }
    }
  }
})
```

- 这段代码定义了两个数据属性year_跟edition，还有一个访问器属性year。最终的效果跟之前实现的效果一样。
- 区别就是所有属性都是同时定义的，并且数据属性configurable、enumerable、和writable特性值都是false

### 读取属性特性

- 使用Object.getOwnPropertyDescriptor()方法可以读取指定属性的属性描述符。
- 该方法接收两个参数：属性所在的对象和要取得的属性名。
- 返回值是一个对象，对于数据属性包含configurable、enumerable、writable、value属性。对于访问器属性包含configurable、enumerable、get和set属性

```js
let book = {}
Object.defineProperties(book, {
  year_: {
    value: 2017
  },
  edition: {
    value: 1,
  },
  year: {
    get(){
      return this.year_
    },
    set(newValue){
      if(newValue > 2017) {
        this.year_ = newValue
        this.edition += newValue - 2017
      }
    }
  }
})
let descriptor = Object.getOwnPropertyDescriptor(book, "year_")
console.log(descriptor)
// {
//   configurable: false
//   enumerable: false
//   value: 2017
//   writable: false
// }
let descriptor1 = Object.getOwnPropertyDescriptor(book, "year")
console.log(descriptor1)
// {
//   configurable: false
//   enumerable: false
//   get: ƒ get()
//   set: ƒ set(newValue)
// }
```

- ECMAScript2017中新增了Object.getOwnPropertyDescriptors()静态方法。该方法会在每个自有属性上调用Object.getOwnPropertyDescriptor()方法，并在一个新对象中返回。

```js
let book = {}
Object.defineProperties(book, {
  year_: {
    value: 2017
  },
  edition: {
    value: 1,
  },
  year: {
    get(){
      return this.year_
    },
    set(newValue){
      if(newValue > 2017) {
        this.year_ = newValue
        this.edition += newValue - 2017
      }
    }
  }
})
console.log(Object.getOwnPropertyDescriptors(books))
// {
//     "year_":{
//         "value":2017,
//         "writable":false,
//         "enumerable":false,
//         "configurable":false
//     },
//     "edition":{
//         "value":1,
//         "writable":false,
//         "enumerable":false,
//         "configurable":false
//     },
//     "year":{
//         "enumerable":false,
//         "configurable":false,
//         "get": ƒ get(),
//         "set": ƒ set(newValue)
//     }
// }
```

- ES6新增了Object.assign方法来实现对象的合并。这个方法接收一个目标对象和多个源对象作为参数，然后将每个源对象中可枚举（Object.propertyIsEnumerable()返回true）和自有（Object.hasOwnProperty()返回true）的属性复制到目标对象.
- 以字符串跟符号为键的属性会被复制。对符合条件的属性，这个方法会使用源对象上的[[Get]]取得属性的值，然后使用目标对象上的[[Set]]设置属性的值

```js
let dest = {
  set a(val) {
    console.log(`Invoke dest setter with param ${val}`)
  }
}
let src = {
  get a(){
    console.log('Invoke src getter')
    return 'foo'
  }
}
Object.assign(dest, src)
// 调用src的获取方法  Invoke src getter
// 调用dest的设置方法并传入参数‘foo’   Invoke dest setter with param foo
console.log(dest)
// 因为dest的设置函数并没有执行赋值操作，所以值并没有过来
// { ser a()}
```

- 该方法采用的是浅复制。如果多个源对象有相同的属性，则以最后一次为准。
- 从源对象访问器属性获取的值，比如获取函数会作为一个静态值赋给目标对象。也就是说，不能在两个对象之间转移获取函数和设置函数
- 如果赋值期间出错，操作会终止并退出，同时抛出错误。但是并不能回滚之前的操作，因此它是一个尽力而为、可能只完成部分复制的方法

```js
let desc,src,result
desc = {}
src = {
  a: 'foo',
  get b(){
    throw new Error()
  },
  c: 'bar'
}
try {
  Object.assign(desc, src)
} catch(e) {}
// 出错了，但无法回滚
console.log(desc) // {a: "foo"}

```

### 对象标识与相等判断

- ES6之前，有些特殊情况 === 也无法判断大小，如下

```js
console.log(+0 === -0) // true
console.log(+0 === 0) // true
console.log(-0 === 0) // true
console.log(NaN === NaN) // false
// 判断NaN必须使用isNaN
console.log(isNaN(NaN)) // true
```

- ES6新增了Object.is()方法，接收两个值，作用跟 === 相似

```js
console.log(Object.is(+0, -0)) // false
console.log(Object.is(+0, 0)) // true
console.log(Object.is(-0, 0)) // false
console.log(Object.is(NaN, NaN)) // true
```

- 递归调用可以检查多个值

```js
function recursivelyCheckEqual(x, ...rest) {
  return x === rest[0] && (rest.length < 2 || recursivelyCheckEqual(...rest))
}
recursivelyCheckEqual(1, 1, 1) // true
recursivelyCheckEqual(1, 1, 2) // false

```