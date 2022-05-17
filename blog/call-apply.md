---
title: "javascript回顾"
date: "2019-02-27"
name: 'francis'
age: '24'
tags: [JavaScript回顾,回顾,入门]
categories: JavaScript
---

# call,apply,bind详解

## call,apply,bind的使用

- call,apply,bind的作用是什么？用法是什么？
- call,apply,bind之间有什么联系？区别是什么？

## 问题详解

- 功能上，call，apply，bind都可以用来改变函数内部this的指向
- 用法上，三者都是函数调用对应的call,apply,bind方法，传入不同的参数实现函数内部this指向改变

<!--more-->
## apply与call

- `call`与`apply`在功能上是完全一致的，都是为了改变函数运行的上下文，即this的指向
- 用法上，`apply`接受两个参数，第一个是重新定义的this对象，第二个则是想要传递给函数的参数列表的集合，是一个数组
- `call`接受多个参数，第一个参数为重新定义的this对象，第二个及以后的各个参数即为传递给函数的参数列表
- 综上，当函数的参数数量确定的情况下，可以使用`call`，当函数参数数量不确定的情况下应该使用`apply`,可以将参数push进数组，然后将数组作为第二个参数，或者可以在函数内部通过`arguments`来获取所有参数列表

## apply与call妙用

- 当我们一个对象没有某个方法，但是别的对象有的情况下我们就可以使用call或者apply来“借用”别的对象的方法，例：

```js
  
var apple = {
  color: 'red',
  say: function(){
    console.log(this.color)
  }
}
var banana = {
  color: 'yellow'
}
apple.say.call(banana) // yellow

```
- 这里banana本来是没有say这个方法的，但是apple有这个方法，所以我们暂时借用他的方法来说出自己的颜色

- call与apply的常用妙法
   - 数组之间追加

```js
  var arr1 = [12,'foo',{a:1}]
  var arr2 = ['a', 23, {b:2}]
  Array.prototype.push.apply(arr1, arr2)
  console.log(arr1) // [ 12, 'foo', { a: 1 }, 'a', 23, { b: 2 } ]
```
   - 这里利用了`apply`会将数组分解为各个参数的效果配合数组的push方法，将第二个数组分别添加到第一个数组实现数组的追加
  
   - 获取数组的最大值

```js
  var numbers = [13, 14,5,34,-38,56]
  var maxNumbers = Math.max.apply(Math, numbers)
  console.log(maxNumbers)
```

   - 这里数组本身没有max方法，但是Math对象有，所以我们就通过apply将其借用

   - 伪类数组调用数组方法实现自定义log方法，代理consolelog方法，并在每个打印之前添加一个（app）前缀
   
```js
  function log(){
    var args = Array.prototype.slice.apply(arguments)
    args.unshift('(app)')
    console.log.apply(console, args) 
  }
  log(1) // (app) 1
  log(1,2,3) // (app) 1 2 3
```

   - 这里的话可能有点难懂，其实实现这个功能我们先是获取到我们需要打印的数据，因为`console.log()`可以接受多个参数，所以我们采用`arguments`来获取所有参数，因为要在打印之前添加前缀,其实就是添加一个打印内容，所以我们要在传递给`console.log`的参数列表里面新增一个，但因为参数列表是一个类数组对象，并没有数组方法，所以我们通过借用数组的slice方法将类数组对象转为数组对象，然后再传递给`console.log`

## bind方法

- bind方法其实会创建一个新的函数，称为绑定函数，当调用这个函数的时候，绑定函数会以创建它时传入的第一个参数作为this，第二个及以后的参数按顺序作为原函数的参数来调用原函数
- bind常用用法
- 改变系统函数this指向

```js
var foo = {
  bar: '哈哈',
  eventBind: function(){
    setTimeout(function(){
      console.log(this)
      console.log(this.bar)
    }, 20)
  }
}
foo.eventBind() // window对象   undefined
var foo1 = {
  bar: '哈哈',
  eventBind: function(){
    setTimeout(function(){
      console.log(this)
      console.log(this.bar)
    }.bind(this), 20)
  }
}
foo1.eventBind() // 对象foo1   '哈哈'
```

   - 这里我们想要的是打印出对象`foo`与它下面`bar`的值，但是在`setTimeout`里面，定时器函数内部的this是指向window对象的，所以`this.bar`会是一个`undefined`，所以在这里我们可以使用`bind`来改变`this`的指向，当我们在函数后面挂载`bind`并传递当前`this`进入时，函数内部的`this`就被我们偏转回了我们想要的对象`foo1`,所以正确的输出了我们想要的结果

   - 那如果我们联系bind会发生什么呐？
   
```js
  var bar = function(){
    console.log(this.x)
  }
  var foo = {
    x:3
  }
  var sed = {
    x: 4
  }
  var func = bar.bind(foo).bind(sed)
  func() // ?
  var fiv = {
    x: 5
  }
  var func1 = bar.bind(foo).bind(sed).bind(fiv)
  func() // ?
```
   - 答案其实是两个3，并不是我们想象的4，5原因是在javascript中，多次bind是无效的。

## apply,call,bind比较

- 看下面代码

```js
  var obj = {
    x: 81
  }
  var foo = {
    getX: function(){
      return this.x
    }
  }
  console.log(foo.getX.bind(obj)()) // 81
  console.log(foo.getX.call(obj)) // 81
  console.log(foo.getX.apply(obj)) // 81
```
- 虽然三个都输出81，但是注意，bind方法之后我们又加了一个括号对其调用，所以这里bind在改变this之后并没有马上执行，而是在执行的时候才使用bind方法，而call与apply则是会立即执行






