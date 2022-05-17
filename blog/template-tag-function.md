---
title: "字符串模板标记函数"
date: "2020-09-23"
name: 'francis'
age: '24'
tags: [JavaScript回顾]
categories: JavaScript
---

# 字符串模板标记函数

## 字符串模板

- ES6新增的字符串定义方式，可以通过 `` 配合${} 来进行变量的嵌入，如下示例

```js
let name = '张三'
let age = 24
// 常规定义字符串的方式
let str = '我的名字叫' + name + ', 我今年' + age + '岁了'

// 字符串模板定义
let str1 = `我的名字叫${ name },我今年${ age }岁了`

console.log(str === str1) // true

```
<!--more-->
## 模板标记函数

- 模板标记函数的定义跟普通函数一致，但是在使用它之前要准备一个字符串模板，调用方式也跟常规的函数调用方法不同，不需要使用 functionName() 的形式调用，直接在函数名后面跟模板字符串即可，如下:

```js
let a = 6
let b = 9
let sum = 15
function tagTemplate(strings, aVariable, bVariable, sumVariable) {
  console.log(strings)        // ['', ' + ', ' = ', '']
  console.log(aVariable)      // 6
  console.log(bVariable)      // 9
  console.log(sumVariable)    // 15
}

tagTemplate`${a} + ${b} = ${sum}`

let c = '张三'
let d = 24
function tagTemplate(strings, cVariable, dVariable, notVariable) {
  console.log(strings)        // ['我叫', '，今年', '岁了']
  console.log(cVariable)      // '张三'
  console.log(dVariable)      // 24
  console.log(notVariable)    // undefined
}

tagTemplate`我叫${c}，今年${d}岁了`

```

- 使用标记函数可以看到，参数里面的第一个参数是数组，是由字符串模板被插入变量分割之后剩余字符串组成的数组，之后的参数依次就是按顺序插入变量的值了
- 知道参数的形式后我们就可以用ES6的结构对插入变量进行一个遍历了

```js

let c = '张三'
let d = 24
function tagTemplate(strings, ...variable) {
  console.log(strings)        // ['我叫', '，今年', '岁了']
  for(let i = 0; i < variable.length; i++) {
    console.log(variable[i])
  }
  // '张三'  24
}

tagTemplate`我叫${c}，今年${d}岁了`


```

### 模板标记函数下的raw数组

- 采用模板标记函数后，第一个数组返回的是我们的非变量插入的字符串片段，这里的字符串片段是会转换成我们的实际展示形式的，比如 \u00A9 会转为 ©，\n 会转为一个空格
- 如果我们想要拿到没有经过转换的原版字符串，这里我们就可以使用这个数组上的raw属性来获取原版字符串的数组，我们可以看下代码
  
```js
function tagTest(strings, ...rest){
  for(let value of strings) {
    console.log(value)
  }
  for(let value of strings.raw) {
    console.log(value)
  }
}
let a = '张三'
let b = 24
tagTest`你${ a }\u00A9,哈哈\n${ b }我`
// strings遍历
// 你
// ©,哈哈 
// 我

// strings.raw遍历
// 你
// \u00A9,哈哈\n
// 我
```

- 这就是模板标记函数给我们提供的一些特性，其实归结起来就是插入变量的提取跟原始字符串的收集，方便我们的使用

## String.raw

- String.raw是ES6标准的一个字符串方法，使用方式类似于模板标记函数，后面直接跟一个模板字符串即可，会原样返回该模板字符串的值，不受可编译字符的影响，普通的字符串会返回经过转义的字符串结果，如下

```js
console.log(`\u00A9`)
// ©
console.log(String.raw`\u00A9`)
// \u00A9

console.log(`Hi\n`)
// Hi
console.log(String.raw`Hi\n`)
// Hi\n

console.log(`Hi
张三`)
// Hi
// 张三
console.log(String.raw`Hi
张三`)
// Hi
// 张三
```

- 它只对会被重新编译的字符串生效，实际的回车或者空格是不会被转义回去的
- 其实我也没想好这玩意哪里能用到，既然看到了就记录一下
