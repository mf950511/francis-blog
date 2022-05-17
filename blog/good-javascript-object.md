---
title: 'JavaScript语言精粹-对象'
name: 'Francis'
age: 24
date: "2019-03-14"
tags: [JavaScript, 进修]
categories: JavaScript
---

# JavaScript中的对象

## 原型

- 每个对象都连接到一个原型对象，并且可以继承原型对象的属性
- 通过字面量创建的对象都会连接到Object.prototype，它是JavaScript中的标配对象
- 我们可以在创建对象的时候选择另一个对象作为它的原型
- ES5中提供的Object.create可以帮我们实现原型对象的绑定（绑定至指定对象）
<!--more-->

# 原型绑定

- 下列代码就实现了对象stog绑定原型至stooge的过程

```js
  var stooge = {
    a: 1,
    b: 2
  }
  var stog = Object.create(stooge)
  console.log(stog.a)   // 1
  console.log(stog.b)   // 2
  stooge.c = 3
  console.log(stog.c)   // 3
  stog.d = 4
  console.log(stooge.d) // 4
```

- 这里我们就实现了将stog的原型绑定至stooge，所以当从自身没找到改属性值时会沿原型链往上找，找到原型对象中的属性值
- 若原型对象中也没有，则会返回undefined

## 手动实现Object.create

```js
  Object.createPrototype = function(o){
    var F = function(){}
    F.prototype = o
    return new F()
  }
  var stooge = {
    a: 1
  }
  var stog = Object.createPrototype(stooge)
  console.log(stog.a) // 1
```

- 这里我们自己构造一个对象属性，接受一个对象作为参数，并在函数内部新建一个构造函数
- 将改构造函数的原型指定为我们传入的对象实现原型绑定，并将新对象返回

## 属性枚举

- 有时候我们需要获取一个对象的私有属性，而不是其原型链上的属性
- 这时我们就需要使用for...in循环跟hasOwnProperty函数来进行筛选

```js
  var obj1 = {
    a: 1,
    b: 2
  }
  var obj2 = Object.create(obj1)
  obj2.c = 3
  for(var key in obj2) {
    console.log(key) // c a b
    if(obj2.hasOwnProperty(key)) {
      console.log(key) // c
    }
  }
```

- 这里for...in会获取对象及其原型链上的属性值，所以我们需要hasOwnProperty()来获取独属于它的属性

## 删除对象属性

- 删除对象的制定属性需要使用delete操作符
- delete 对象.属性即可删除该属性

```js
  var testDelete = {
    canDelete: '我是原型属性'
  }
  var testDelete1 = Object.create(testDelete)
  testDelete1.canDelete = '我是私有属性'
  console.log(testDelete1.canDelete) // 我是私有属性
  delete testDelete1.canDelete
  console.log(testDelete1.canDelete) // 我是原型属性
```

- 这里删除之前打印的为我们展示的是该对象的私有属性
- 删除之后对象本身找不到该属性，便回到原型链查找，从而返回原型对象的该属性