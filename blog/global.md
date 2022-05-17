---
title: "Global对象"
date: "2020-10-13"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# Global对象及方法

## encodeURI、encodeURIComponent

- 这两个方法都是用于编码统一资源标识符（URI），以传给浏览器
- 区别是encodeURI不会编码属于URL组件的特殊字符，如冒号、斜杠、问号、井号，而encodeURIComponent会编码所有的非标准字符
- 所以一般我们会使用encodeURIComponent
- 它们分别对应的解码方法时decodeURI与decodeURIComponent

## eval

- eval接收一个完整的要执行的ECMAScript字符串，当解释器发现eval()方法时会将其解释为真实的ECMAScript语句
- 然后将其插入当前位置，插入的语句属于该调用的执行上下文，被执行语句与该上下文有同样的作用域链

```js
let msg = 'hello'
eval("console.log(msg)") // 'hello'
```
<!--more-->
- 可以在eval中定义函数或变量，然后在外面引用

```js
eval("function sayHi(){ console.log('hi')}")
sayHi() // hi

eval("let msg = 'world'")
console.log(msg) // msg is not defined
```

- 这是因为eval中的变量跟函数都无法被提升，只有到执行之后才会被创建，所以函数可以正常执行，但是变量在编译阶段就会报错
- 在严格模式下使用eval会报错

## Math对象

- Math.E,自然对数的基数e的值
- Math.LN10，10为底的自然对数
- Math.LN2，2为底的自然对数
- Math.LOG2E，以2为底e的对数
- Math.LOG10E，以10为底e的对数
- Math.PI，数字π
- Math.SQRT1_2，1/2的平方根
- Math.SQRT2，2的平方根

### min和max方法

- min，确定一组数值的最小值
- max，确定一组数值的最大值

```js
console.log(Math.min(3, 8, 4, 12, 66,44, 66, 77)) // 3
console.log(Math.max(3, 8, 4, 12, 66,44, 66, 77)) // 77
```

- 由接受参数形式可以对数组解构来获取最大最小值

```js
let arr = [3, 8, 4, 12, 66,44, 66, 77]
console.log(Math.min(...arr)) // 3
console.log(Math.max(...arr)) // 77
```

- 其他方法
- Math.abs()，返回绝对值
- Math.exp(x)，返回MATH.E的x次幂
- Math.expm1(x)，Math.exp(x) - 1
- Math.log(x)，返回x的自然对数
- Math.log1p(x)，等于1 + Math.log(x)
- Math.pow(x, power)，返回x的power次幂
- Math.hypot(...nums)，返回nums中每个数平方和的平方根
- Math.clz32(x)，返回32位整数x的前置0的数量
- Math.sign(x)，返回表示x符号的1，0，-0，-1
- Math.trunc(x)，返回x的整数部分，删除所有小数部分
- Math.sqrt(x)，返回x的平方根
- Math.cbrt(x)，返回x的立方根
- Math.acos(x)，返回x的反余弦
- Math.acosh(x)，返回x的反双曲余弦
- Math.asin(x)，返回x的反正弦
- Math.asinh(x)，返回x的双反曲正弦
- Math.atan(x)，返回x的反正切
- Math.atanh(x)，返回x的双反曲正切
- Math.atan2(y, x)，返回y/x的反正切
- Math.cos(x)，返回x的余弦
- Math.sin(x)，返回x的正弦
- Math.tan(x)，返回x的正切