---
title: "Number类型"
date: "2020-10-12"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# Number 类型

- Number对象也重写了toString、toLocalString、valueOf方法
- valueOf返回原数值
- toString()接收一个参数用于表示该数字的几进制数，如下

```js
let num = 10
console.log(num.toString()) // '10'
console.log(num.toString(2)) // '1010'
console.log(num.toString(8)) // '12'
console.log(num.toString(10)) // '10'
console.log(num.toString(16)) // 'a'
```

- toExponential()用于表示数值的科学技术法的表示字符串

```js
console.log(num.toExponential()) // 1e+1
```

- toPrecision()会根据你传入的参数决定输出结果，该参数表示结果中的数字的位数，如下
<!--more-->
```js
let num1 = 99
console.log(num1.toPrecision(1)) // 1e+2
console.log(num1.toPrecision(2)) // 99
console.log(num1.toPrecision(3)) // 99.0
```

- ES6新增isInteger()用于判断是否是整数

```js
console.log(Number.isInteger(1)) // true
console.log(Number.isInteger(1.00)) // true
console.log(Number.isInteger(1.01)) // false
```

- 该方法不会受到小数点后都是0的影响
- IEEE 754数值格式有一个特殊的数值范围，此范围内的二进制值可表示一个整数，该范围为Number.MIN_SAFE_INTEGER((-2) ** 53 + 1) 到 Number.MAX_SAFE_INTEGER(2 ** 53 - 1)
- 超出这个范围的值在保存为整数时数值可能会变化，所以我们可以通过 Number.isSafeInteger()来判断一个整数是否在该范围内

```js
console.log(Number.isSafeInteger(-1 * (2 ** 53))) // false
console.log(Number.isSafeInteger(-1 * (2 ** 53) + 1)) // true
```