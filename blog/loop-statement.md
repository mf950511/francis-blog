---
title: "常用循环语句的基本属性"
date: "2020-09-23"
name: 'francis'
age: '24'
tags: [JavaScript回顾]
categories: JavaScript
---

# 循环语句

## for-in 循环语句

- for-in是严格迭代语句，会迭代一个对象中非Symbol的其他属性值，语法如下

```js
for(const prop in obj) {
  console.log(prop)  
}
```

- for-in迭代对象是无序的，各浏览器下返回的顺序可能不一致
- const并不是必须的，但建议使用，避免影响外界变量
- 迭代null或undefined则迭代内的表达式不会被执行

## for-of 循环语句

- for-of也是迭代语句，只能迭代一个可迭代对象，语法如下

```js
for(const value in obj) {
  console.log(value)  
}
```

- 迭代是有序的，由对象内部的next()方法决定
- 迭代一个非迭代器对象会抛出错误
<!--more-->
## 标记语法

- 用来标记一个表达式，用于在后续使用，一般用于配合break、continue打破循环使用
- 标记语法如下

```js
label: statement
```

- break用于结束这个循环体，执行循环体后的语句
- continue用于结束单次循环，进行该循环体的下一次循环
- 配合标记语法如下

```js
let num = 0
outermost: for(let i = 0; i < 10; i++) {
  for(let j = 0; j < 10; j++) {
    if(i === 5 && j === 5) {
      break outermost
    }
    num++
  }
}

console.log(num) // 55
```

- 这里当执行到i跟j都是5的时候，我们的break将外层循环结束了，导致后续的4次大循环与当次剩余的5次小循环无法继续，所以导致最终的输出为55

```js
let num = 0
outermost: for(let i = 0; i < 10; i++) {
  for(let j = 0; j < 10; j++) {
    if(i === 5 && j === 5) {
      continue outermost
    }
    num++
  }
}

console.log(num) // 95
```

- 这里的continue跳过了外层循环，导致子循环后续的5次没法执行直接到了下一个循环，所以最终次数会少5，变成了95

## with语法

- with语法用于将一个代码执行块与一个变量绑定，语法如下

```js
with (expression) statement;
```

- 当一个对象被一次又一次的引用执行的时候就可以使用with语法来简化，比如下场景

```js
let qs = location.search.substring(1)
let hostname = location.hostname
let url = location.href
```

- 这里我们的location对象被多次重复引用，我们可以使用with进行简化

```js
with(location){
  let qs = search.substring(1)
  let hostname = hostname
  let url = href
}
```

- with工作原理会在当前的作用域内查找是否有对应的变量，如果没有就会从对应location对象上面查找对应的同名属性
- 在严格模式下with语法会报错
- with语法会降低代码性能与导致一些奇怪的bug，所以不推荐使用