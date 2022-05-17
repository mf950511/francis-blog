---
title: 'ES2015迭代器'
date: "2019-03-12"
name: 'Francis'
tags: [JavaScript, ES2015, 进修]
categories: JavaScript
---

# 一脸懵逼的迭代器

## 迭代器

- 迭代器：`迭代器`是一个结构化的模式，用于从一个源一次一个的方式获取数据
- `JavaScript`开发中从来不缺乏它的出现，总有各种各样的方法来实现它
- `ES6`中为`迭代器`提供了一个`隐式的标准化接口`，并在一些内建数据结构中都实现了它

<!--more-->


# 内置数据结构迭代器

## 数组

- `数组`中的迭代器

```js
  let arr = [1,2,3]
  let it = arr[Symbol.iterator]()
  it.next() // { value: 1, done: false }
  it.next() // { value: 2, done: false }
  it.next() // { value: 3, done: false }
  it.next() // { value: undefined, done: true }
```

- 每次在数祖上调用`Symbol.iterator`方法时都会产生一个新的迭代器
- 当数组迭代完成并不会立即将`done`设置为`true`,而是在迭代完所有之后再迭代一次才会将其改变

## 字符串

- `字符串`中的迭代器

```js
  let str = 'hello'
  let it = arr[Symbol.iterator]()
  console.log(it.next()) // { value: 'h', done: false }
  console.log(it.next()) // { value: 'e', done: false }
  console.log(it.next()) // { value: 'l', done: false }
  console.log(it.next()) // { value: 'l', done: false }
  console.log(it.next()) // { value: 'o', done: false }
  console.log(it.next()) // { value: undefined, done: true }
```

- 严格来说`字符串`本身并不是`iterator`,但是这里被强制转换为`String对象`封装形式，从而变成一个`iterator`

## map

- `map`中的迭代器

```js
  let map = new Map()
  map.set({name: '张三'}, {age: 24})
  map.set('foo', 42)
  let it = map[Symbol.iterator]()
  console.log(it.next()) // { value: [ { name: '张三' }, { age: 24 } ], done: false }
  console.log(it.next()) // { value: [ 'foo', 42 ], done: false }
  console.log(it.next()) // { value: undefined, done: true }
  let arr = [1,2,3]
  let str = 'hello'
  let map = new Map()
  map.set({name: '张三'}, {age: 24})
  map.set('foo', 42)
  for(let v of map) {
    console.log(v)
  }
```

## for...of循环迭代器

- `for...of`可用于消耗迭代器，也就是`循环调用迭代器`，形式如下

```js
  let map = new Map()
  map.set({name: '张三'}, {age: 24})
  map.set('foo', 42)
  for(let v of map) {
    console.log(v)
  }
  // [ { name: '张三' }, { age: 24 } ], [ 'foo', 42 ]
```

- `for...of`会将迭代器中的内容返回

# 自定义迭代器

- 利用`Symbol.itertor`我们可以构造可以与`ES6`交互的属于自己的`迭代器`
- 下面是构造一个`无限斐波纳契序列`

```js
  var Fib = {
    [Symbol.iterator](){
      let n1 = 1, n2 = 1
      return {
        [Symbol.iterator](){return this},
        next(){
          let current = n2
          n2 = n1
          n1 = current + n1
          return {value: current, done: false}
        },
        return (v){
          console.log(
          "Fibonacci sequence abandoned."
          );
          return { value: v, done: true }; 
        }
      }
    }
  }
  for(let v of Fib) {
    console.log(v)
    if(v > 500) break
  }
  // 1 1 2 3 5 8 13 21 34 55 89 144 233 377 610
```

- 这里当我们调用`Fib`的`Symbol.iterator`方法会返回一个带有`next`跟`return`方法的迭代器
- 通过闭包里面的`n1`与`n2`来维护数据

# 迭代器其他用法

## 模拟事件队列机制
- 下面实现一个`运行一系列事件`的迭代器

```js
  let tasks = {
    [Symbol.iterator](){
      let steps = this.options.slice()
      return {
        [Symbol.iteratro](){return this},
        next(...args){
          if(steps.length > 0) {
            let res = steps.shift()(...args)
            return {value: res, done: false}
          } else {
            return { done: true }
          }
        }
      }
    },
    options: []
  }
  tasks.options.push(
    function(x){
      return x * 2
    },
    function(x, y){
      return x + y * 2
    },
    function(x, y, z) {
      return x * y + z
    }
  )
  let it = tasks[Symbol.iterator]()
  console.log(it.next(10)) //{ value: 20, done: false } 
  console.log(it.next(10, 20)) //{ value: 50, done: false }
  console.log(it.next(10, 20, 30)) //{ value: 230, done: false }
  console.log(it.next()) //{ done: true }
```

- 其中可以看到，我们将要运行的事件都传入我们的`数组集合options`中，然后便可以迭代运行了

## 模拟数字生成数组

- 我们可以将数字构造为一个迭代器，使其拥有迭代器的一些操作，用来`生成数组`或`一定次数的循环`

```js
  if(!Number.prototype[Symbol.iterator]){
    Object.defineProperty(
      Number.prototype,
      Symbol.iterator,
      {
        writable: true,
        configurable: true,
        enumerable: false,
        value: function iterator(){
          var i, inc, done = false, top = +this
          inc = 1 * (top < 0 ? -1 : 1)
          return {
            [Symbol.iterator](){return this},
            next(){
              if(!done) {
                if(i == null) {
                  i = 0
                } else if (top >= 0) {
                  i = Math.min(top, i + inc)
                } else {
                  i = Math.max(top, i + inc)
                }
                if(i == top) {done = true}
                return {value: i, done: false}
              } else {
                return {done: true}
              }
            }
          }
        }
      }
    )
  }
  for(let v of 3) {
    console.log(v)
  }
  // 0 1 2 3

  [...3] // [0,1,2,3]
```

- 第一个`for...of`循环可以使我们循环指定次数来完成我们的操作
- 因为我们`ES6`的`解构符`本来就可以`消耗`或者说是`解读`我们的迭代器，所以会帮助我们直接生成指定长度的纯数字数组


