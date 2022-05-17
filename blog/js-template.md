---
title: 'ES2016字符串模板'
date: "2019-03-11"
name: 'Francis'
tags: [JavaScript, ES2015, 进修]
categories: JavaScript
---

# 深入字符串模板

## 字符串模板

- `ES5`之前我们连接字符串与变量还需要使用js的`+`运算符进行连接
- `ES6`中我们新增了`字符串模板`这个概念，`字符串模板`使用`作为定界符
- 大家对他的认识可能只停留在`拼接字符串与变量`并在调用的地方进行`变量解析`
- 其实`字符串模板`有很多我们还不熟知的强大功能

<!--more-->

# 常用形式

## 插入表达式

```js
  function upper(s) {
    return s.toUpperCase()
  }
  var who = 'reader'

  // 使用字符串模板
  var text = 
  `A very ${upper('warm')} welcome
  to all of you ${upper(`${who}s`)}!
  `
  console.log(text) 
  // A very WARM welcome
  // to all of you READERS!


  // 使用ES5之前
   var text = "A very " + upper('warm') + " welcome \r\n to all of you " + upper(who + "s")
  console.log(text) 

```

- 上面是我们想要实现的字符串片段部分单词转大写需求，可以看出字符串模板帮我们进行了`字符串的解析与换行符的保留`
- 传统的js则需要我们自己对`js表达式`进行拼接

# 高级用法
## 标签模板字面量

- 其实在`你不知道的JavaScript`中将`字符串模板`称为`标签字符串字面量`
- 看一下下面比较酷炫的用法

```js
  function foo(strings, ...values){
    console.log(strings)
    console.log(values)
  }

  var desc = 'awesome'
  foo`Everything is ${desc}!`
  // strings [ 'Everything is ', '!' ]   
  // values  [ 'awesome' ]
```

- 看到这里可能都有点懵，这还是函数吗？又没有函数调用的小括号
- 本质上说这是一类不需要`()`的函数调用，`字符串字面量`之前是一个要调用的函数
- 那二者组合的`字符串字面量作为标签调用的函数`会变成什么？参数又是什么含义？
- 第一个参数`strings`，由所有普通字符串组成的数组，在这里即为： `'Everything is '`跟 `'!'`
- 第二个参数`values`则是使用了`...gather/rest`运算符将其他的所有参数收集到了名为`values`的数组中，所以这里只能是`'awesome'`

## 数字格式化为美元表示

```js
  function dollabillsyall(strings, ...values) {
    return strings.reduce(function (s, v, idx){
      if (idx > 0) {
        if(typeof values[idx - 1] == 'number') {
          s += `$${values[idx - 1].toFixed(2)}`
        } else {
          s += values[idx - 1]
        }
      }
      return s + v
    }, "")
  }

  var amt1 = 11.99, amt2 = amt1 * 1.88, name="Kyle"
  var text = dollabillsyall
  `Thanks for your purchase, ${name}! your product cost was ${amt1}, which with tax comes out to ${amt2}.`
  console.log(text)
  // Thanks for your purchase, Kyle! your product cost was $11.99, which with tax comes out to $22.54.

```
- 这里我们使用`reduce`进行字符串拼接，对每一个数字变量都进行美元符拼接并转化为两位小数保留