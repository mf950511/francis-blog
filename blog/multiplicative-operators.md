---
title: "常用计算符独特的计算属性"
date: "2020-09-23"
name: 'francis'
age: '24'
tags: [JavaScript回顾]
categories: JavaScript
---


# 乘、除、取余、指数、加法、减法、比较、相等操作符

## 乘

- 乘法的计算遵循下面的原则
- 如果结果超出ECMAScript所表示的范围，那么最终会得到 Infinity 或者 -Infinity
- NaN参与运算，得到NaN
- Infinity 与 0 相乘得 NaN 
- Infinity 与 非 0 数相乘得 Infinity 或者 -Infinity ，由非 0 数决定符号
- 如果其中一个是非数值，将会被Number()强制转为数值参与计算

## 除

- 除法的计算遵循下原则
- 如果结果超出ECMAScript所表示的范围，那么最终会得到 Infinity 或者 -Infinity
- NaN参与运算，得到NaN
- Infinity 除以 Infinity 得到 NaN
- 0 除以 0 得 NaN
- Infinity 除以 任何数都得 Infinity 或者 -Infinity ，符号由除数决定
- 如果其中一个操作符为非数值，则被Number()转为数值参与计算
<!--more-->
## 取余

- 取余的计算规则如下
- 如果被除数是 Infinity ，除数是有限值，那么结果为 NaN
- 如果被除数是 有限值，除数为 0，那么结果为 NaN
- 除数跟被除数都是Infinity,则结果为NaN
- 被除数是有限值，除数是Infinity,结果是被除数
- 被除数是0，除数是非0，结果是0
- 如果其中一个操作符为非数值，则被Number()转为数值参与计算

## 指数操作符

- 指数被用来表示某个数的多少次方，用`Math.pow()`来计算，在ECMAScript 7中可以使用 `**` 来表示

```js
console.log(Math.pow(3, 2)) // 9
console.log(3 ** 2) // 9
```

- 有了 `**`操作符自然也就有了对应的速写计算符`**=`，如下

```js
let square = 3
square **= 2
console.log(square) // 9
```

## 加法操作符

- 加法操作符比较特殊，对应不同的数据状态会发生不同的数据类型转换，规则如下

### 两个数都是数值的计算规则

- 如果两个数都是数值类型，那么对应规则如下
- 有NaN参与计算，则值为NaN
- Infinity 加 -Infinity，结果为NaN
- -0 加 +0，结果为+0
- -0 加 -0，为-0， +0 加 +0，为+0
- Infinity 加 Infinity为Infinity，-Infinity 加 -Infinity 为 -Infinity

### 字符串参与计算的规则如下

- 其中一个值为字符串，则另一个值会被转为字符串然后进行拼接

## 减法操作符

- 减法操作符的计算规则
- NaN参与运算结果为NaN
- Infinity 减 Infinity ,结果为NaN
- -Infinity 减 -Infinity，结果为NaN
- Infinity 减 -Infinity，结果为Infinity
- -Infiniy 减 Infinity，结果为 -Infinity
- +0 减 +0 结果为 +0
- -0 减 +0 结果为 -0
- -0 减 -0 结果为 +0
- 如果其中一个是 字符串、布尔值、null或者undefined，会使用Number()转为数值参与计算
- 如果其中一个是对象，则会调用该对象的 valueOf() 方法来获取数值进行计算，如果对象没有valueOf方法，那么会调用toString()方法来获取值并转为对象参与计算

## 比较运算符

- 比较运算法有 >, <, <=, >=
- 用来比较两个变量的大小关系，会返回一个布尔值
- 针对不同数据类型，比较规则如下
- 数值则直接比较大小
- 都是字符串则依次比较每个字符对应的字符编码
- 其中一个是数值则把另一个转为数值进行比较
- 如果是对象，则调用 valueOf() 获取值参与比较，没有该属性就获取 toString()方法获取值参与比较
- 如果其中一个是布尔值，则把它转为数值参与计算
- 字符串比较时，所有的小写字母都要大于大写字母，所以要是想按字母顺序比较的话需要同时转为大写或者小写，如下

```js
let result = "Brick" < "alphabet"
console.log(result) // true，并不是我们的预期

let result = "Brick".toLowerCase() < "alphabet".toLowerCase()
console.log(result) // false
```

- NaN参与比较运算符永远都得false，哪怕是比较两个 NaN

```js
let result = NaN > 3 // false
let result = NaN <= 3 // false

let result = NaN > NaN // false
let result = NaN <= NaN // false
```

## 相等运算符

- 相等运算符分为全等与不全等运算符，不全等运算符不会比较类型，而是在比较时进行类型转换

### 不全等运算符规则

- null 跟 undefined 相等
- null 跟 undefined 不会被转为其他类型进行比较
- NaN 参与比较永远返回false
- 两个对象比较则对比是否两个是同一个对象，是就返回true，不是就返回false
- 
