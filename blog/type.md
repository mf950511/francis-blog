---
title: 你不知道的javascript-类型
date: "2019-01-03"
tags: [JavaScript, 入门]
categories: JavaScript
---

# 类型

## 内置类型

- 内置类型有哪些？如何校验？
- 特殊类型有哪些？注意事项是？

## 问题解释

- 内置类型为空值`(null)`，未定义`(undefined)`，布尔值`(boolean)`，数字`(number)`，字符串`(string)`，对象`(object)`，符号`(symbol,ES6新增)`
- 特殊类型为空值(特殊对象)，数组(特殊对象)，函数(特殊对象)
<!--more-->
- 类型校验

```js
typeof undefined === 'undefined' //true
typeof true === 'boolean' //true
typeof 42 === 'number' //true
typeof '42' === 'string' //true
typeof {a:2} === 'object' //true
typeof Symbol() === 'symbol' //true
// 特殊情况
typeof null === 'object' //true
typeof [1,2,3] === 'object' //true
typeof function(){} === 'function' // true
```

## 校验方式

- 校验null (!a && typeof a ==='object') //true
- 校验数组 arr.constructor === Array 或 arr instanceof Array

## 数组

- 数组可以容纳任何类型的值，无需设定大小
- delete运算符可以将单元从数组中删除，但，删除后，数组length属性不会发生变化
- 数组通过数组进行索引，但因为它是对象的本质，所以也可以包含字符串键值与属性`(但并不计算在数组长度内)`

```js
    var a = []
    a[0] = 1
    a['foo'] = 2
    a.length; // 1
    a['foo']; // 2
    a.foo;    // 2
```

- 注意点：若字符串键值能强制转换为数字的话，会被当作数字索引来处理

```js
      var a = []
      a['13'] = 42
      a.length; // 14
```

- Array.from()可将类数组对象转为数组对象，例（arguments,dom列表）

## 字符串与字符串数组

- 都具有`length`属性与`indexOf`方法和`concat`方法

```js 
    var a = 'foo'
    var b = ['f','o','o']

    a.length; // 3
    b.length; //3

    a.indexOf('o') // 1
    b.indexOf('o') // 1
    var c = a.concat('bar') //foobar
    var d = b.concat(['b', 'a', 'r']) // ['f', 'o', 'o', 'b', 'a', 'r']
```

- 字符串没有数组函数，但可以借用数组的非变更方法来处理

```js
    var c = Array.prototype.join.call(a, '-')
    var d = Array.prototype.map.call(a, function(v) {
      return v.toUpperCase() + '.'
    }).join("")
    c; //"f-o-o"
    d: //"f.o.o"
```

- 不可借用数组的可变成员函数reverse,因为字符串是不可变的`Array.prototype.reserve.call(a)`无效
- 处理方法：

```js
    var c = a.split("").reverse().join("")
```

## 数字

- 检测是否是整数 `Number.isInteger()`
- 检测是狗是安全整数 `Number.isSafeInteger()`
- 检测是否是NaN `Number.isNaN()`
- 检测两个值是否绝对相等 `Object.is(a, b)`

## 奇特的小技巧

- ~运算符可将结果强制类型转换为真值/假值

```js
    var a = "Hello world"
    if(~a.indexOf('lo')) { // true
      // 找到匹配
    }
    // 相应的 !~a.indexOf('lo')为未找到匹配

```


