---
title: "JavaScript中new的原理与手动实现一个new"
date: "2019-10-14"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---

# new的原理与实现

- 在javascript中我们经常看到在实例化某个类的时候都会在构造函数前面加一个new调用函数来获取我们的实例，但却没有想过new这个操作符在这里面做了什么，是如何生成的实例，所以这段时间我也大概了解了下new的工作原理，并随手写一下自己的感悟

## 原理

- 构造函数实例都具有该构造函数内的共用属性与方法，同时也会拥有构造函数原型对象上的方法，所以构造函数生成实例其实会经历三个步骤
- 第一步，构造一个实例 空对象
- 第二步，将构造函数的this值赋给这个对象，并执行构造函数内的赋值操作，这样该实例就有了构造函数相应的属性值
- 第三步，使实例拥有构造函数原型链上的方法，这就需要我们将该对象的__proto__属性指向我们的构造函数的原型对象上（涉及到对象属性的查找原理，对象查找某方法或属性时，会先在对象自身上找，当自身查找不到时，就会在__proto__指向的对象上面找，如果第一个__proto__对象上面也没有就会继续沿着__proto__往上找，一直到找到该属性或者null为止，对这一块感兴趣的话，可以先了解一下原型与原型链）

<!--more-->

## 实现

- 知道了原理其实实现一个相同的方法也就简单了
  
```js
  // 这里使用ES6的结构来获取构造函数所需的参数
  // 因为结构之后获取的是一个数组结构，所以使用apply来进行构造函数this的赋值
  // 也可以使用arguments来获取，不过ES6中不这么建议了，要用的话进行arguments[0]的提取与裁剪就可以了
  function New(Fn, ...args){
    var obj = {} // 构造空对象
    Fn.apply(obj, args) // 构造函数赋值与this指向的修改
    obj.__proto__ = Fn.prototype // 对该对象赋值构造函数原型对象上的方法
    return obj // 返回该实例
  }

  function Person(name){
    this.name = name
  }
  Person.prototype.showName = function(){
    console.log(this.name)
  }

  var p1 = New(Person, '张三')
  p1.showName() // 张三

```
