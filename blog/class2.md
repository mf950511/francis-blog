---
title: "类--高程4"
date: "2020-12-08"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 类

- ECMAScript 6 引入了class关键字来实现正式定义类的能力
- 类定义也是两种方法：声明类与类表达式

```js
// 类声明
class Person {}

// 类表达式
const Person = class {}
```

- 类定义不可变量提升，声明前不可使用
- 函数受函数作用域限制，类受块作用域限制
- 类可以包含构造函数方法、实例方法、获取函数、设置函数与静态类方法
<!--more-->
## 构造函数

- 构造函数非必须，不定义则默认为空
- 默认情况下，构造函数会在执行后返回this对象。构造函数返回的对象会被用作实例化对象，如果没有引用新创建的this对象，则对象会被销毁
- 如果返回的不是this对象，而是其他对象，那么这个对象不回通过instanceof操作符检测出与类有关联，因为对象的原型指针没有被修改

```js
class Person{
  constructor(override){
    this.foo = 'foo'
    if(override) {
      return { bar: 'bar' }
    }
  }
}

let p1 = new Person()
let p2 = new Person(true)
console.log(p1) // Person {foo: "foo"}
console.log(p1 instanceof Person) // true

console.log(p2) // {bar: "bar"}
console.log(p2 instanceof Person) // false
```

- 类中定义的constructor不会被当做构造函数，对它使用instanceof会返回false

```js
class Person{
  constructor(){
    this.foo = 'foo'
  }
}

let p1 = new Person()
console.log(p1 instanceof Person) // true
console.log(p1 instanceof Person.constructor) // false
```

- 类也可以立即被实例化

```js
let p = new class Foo{
  constructor(x){
    console.log(x)
  }
}('foo') // 'foo'
```

## 实例、原型和类成员

- 定义在构造函数内的属性为实例属性，实例独享
- 定义在类块中的方法为原型方法，所有实例共享，可以在类块中定义方法，但不能定义属性

```js
class Person {
  name: 'Jack' // Uncaught SyntaxError: Unexpected token
}
```

- 类上定义静态方法，一般用于执行不特定于市里的操作，不要求存在类的实例，使用static修饰

## super

- 派生类可以通过super关键字引用他们的原型。只能在派生类中使用，而且仅限于类构造函数、实例方法、静态方法内部。
- 构造函数中使用super可以调用父类构造函数（这种情况下super之前不允许出现this）
- ES6给类构造函数与静态方法添加了内部特征[[HomeObject]]，是一个指针，指向定义该方法的对象。只能在javascript引擎内部访问。
- super始终会定义为[[HomeObject]]的原型
- super不可单独使用，要么用它调用构造函数，要么引用静态方法

```js
class Vehicle {

}
class Bus extends Vehicle{
  constructor(){
    console.log(super)  // SyntaxError: 'super' keyword unexpected here
  }
}
```

- 调用super会调用父类构造函数，并将返回的实例赋值给this
- 如果没有定义类构造函数，实例化派生类时会调用super，并传入所有给派生类的参数
- 如果派生类定义了构造函数，那么要么在其中调用super，要么必须在其中返回一个对象

## 抽象基类

- 基类就是可供继承但不可被实例化的类，ECMAScript没有单独实现，但是可以使用new.target来实现，new.target保存了通过new调用的类或者函数。所以可以如下实现

```js
class Vehicle {
  constructor(){
    if(new.target === Vehicle) {
      throw new Error('Vehicle cannot be directly instantiated')
    }
  }
}
new Vehicle() // Error: Vehicle cannot be directly instantiated
```

## 类混入

- 将不同类集中到一个类中

```js
class Vehicle {}
let FooMixin = (Superclass) => class extends Superclass {
    foo() {
      console.log('foo')
    }
  }

  let BarMixin = (Superclass) => class extends Superclass {
    bar() {
      console.log('bar')
    }
  }

  let BazMixin = (Superclass) => class extends Superclass {
    baz() {
      console.log('baz')
    }
  }

  class Bus extends FooMixin(BarMixin(BazMixin(Vehicle))) {}
  let b = new Bus()
  b.foo()  // 'foo'
  b.bar()  // 'bar'
  b.baz()  // 'baz'
```

- 很多javascript已经放弃混入模式，转为组合模式，也就是著名的“组合胜过继承”