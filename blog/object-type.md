---
title: "遗忘的对象基本属性"
date: "2020-09-17"
name: 'francis'
age: '24'
tags: [JavaScript回顾]
categories: JavaScript
---

# 对象类型与基本方法

- 对象的创建我们可以采用 new 关键字加对象类型的名称来进行创建，比如创建一个基本对象，就是

```js
let o = new Object()
```

- 需要注意的是，后面的括号并不是必须的，当我们创建对象不需要传参则不需要后面的括号也不会报错，但是不推荐，如下

```js
let o = new Object // 不推荐
```

- Object类型是所有其他对象类型的基础，其他对象类型都基于它进行的衍生，所以所有的对象都具有下面这些Object的基本方法

```js
isPropertyof(object) // 决定一个对象是否是另一个对象的原型
propertyIsEnumerable(propertyName) // 决定一个对象属性是否可枚举
```
