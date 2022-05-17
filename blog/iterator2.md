---
title: "再读迭代器"
date: "2020-10-22"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 迭代器

- 迭代器模式描述了一个方案，将某些结构称为“可迭代对象”，因为它们都实现了正式的Iterable接口，而且可以通过迭代器Iterator消费
- 可迭代对象：数组或集合这样的集合类型的对象。特点：包含元素有限，具有无歧义的遍历顺序
- 任何实现Iterable接口的数据结构都可以被实现Iterator接口的结构“消费”
- 迭代器是按需生成的一次性对象。每个迭代器都会关联一个可迭代对象，迭代器暴露了与之关联的可迭代对象的api
- 迭代器不关心与它关联的可迭代对象数据结构，只关心如何取得连续的值

## 可迭代协议

- 实现Iterable(可迭代协议)要求两种能力：支持迭代的自我识别能力与创建实现Iterator接口的对象的能力。
- ECMAScript中暴露一个属性值作为“默认迭代器”，而且该属性用特殊的Symbol.iterator作为键。
- 这个默认迭代器必须引用一个迭代器工厂函数，调用工厂函数必须返回一个新迭代器
- 实现Iteratable的内置类型
  - 字符串
  - 数组
  - 映射
  - 集合
  - arguments对象
  - NodeList等DOM集合
- 可以通过检查是否存在默认迭代器属性来暴露工厂函数
- 调用工厂函数可以生成一个迭代器
<!--more-->
```js
let num = 1
let str = 'abc'
let arr = [1, 2, 3]
console.log(num[Symbol.iterator]) // undefined
console.log(str[Symbol.iterator]) // [Symbol.iterator]() { [native code] }
console.log(arr[Symbol.iterator]) // values() { [native code] }

console.log(str[Symbol.iterator]()) // StringIterator {}
console.log(arr[Symbol.iterator]()) // Array Iterator {}
```

- 实际代码中不需要显式调用工厂函数来生成迭代器。实现可迭代协议的所有类型会自动兼容接收可迭代对象的任何语言特性。
- 接收可迭代对象的原生语言特性有：
  - for-of循环
  - 数组解构
  - 拓展操作符
  - Array.from()
  - 创建集合
  - 创建映射
  - Promise.all()接收由期约组成的可迭代对象
  - Promise.race()接收由期约组成的可迭代对象
  - yield* 操作符，在生成器中使用
- 这些语言结构会在后台调用提供的可迭代对象的工厂函数，从而创建迭代器

```js
let arr = ['a', 'b', 'c']
for(let el of arr) {
  console.log(el) // a, b, c
}

let [a, b, c] = arr
console.log(a, b, c) // a, b, c

let arr2 = [...arr]
console.log(arr2) // ["a", "b", "c"]

let arr3 = Array.from(arr)
console.log(arr3) // ["a", "b", "c"]

let set = new Set(arr)
console.log(set) // Set(3) {"a", "b", "c"}

let pairs = arr.map((x, i) => [x, i])
let map = new Map(pairs)
console.log(map) // Map(3) {"a" => 0, "b" => 1, "c" => 2}
```

## 迭代器协议

- 迭代器是一次性使用的对象，用于迭代与其关联的可迭代对象。
- 迭代器api使用next()方法可以遍历迭代器中的数据。
- 每次调用next都会返回一个IteratorResult对象，其中包含迭代器返回的下一个值
- 不调用next无法知道迭代器的当前位置
- IteratorResult包含两个属性，done跟value，done为布尔值，表示是否可以调用next获取下一个值，value包含可迭代对象的下一个值（done为false），或者undefined（done为true）

```js
// 可迭代对象
let arr = ['foo', 'bar']

// 迭代器工厂函数
console.log(arr[Symbol.iterator]) // ƒ values() { [native code] }

// 迭代器
let iter = arr[Symbol.iterator]() // Array Iterator {}

// 执行迭代
console.log(iter.next()) // {value: "foo", done: false}
console.log(iter.next()) // {value: "bar", done: false}
console.log(iter.next()) // {value: undefined, done: true}
console.log(iter.next()) // {value: undefined, done: true}
```

- 迭代器并不知道怎么从可迭代对象取下一个值，也不知道可迭代对象多大，只要迭代器到达done:true的状态，后续调用netx()就一直返回同样的值
- 每个迭代器都表示对可迭代对象的一次遍历，不同迭代器实例没有联系，只会独立的遍历

```js
let arr2 = ['foo', 'bar']
let iter1 = arr2[Symbol.iterator]()
let iter2 = arr2[Symbol.iterator]()

console.log(iter1.next()) // {value: "foo", done: false}
console.log(iter2.next()) // {value: "foo", done: false}
console.log(iter1.next()) // {value: "bar", done: false}
console.log(iter2.next()) // {value: "bar", done: false}
```

- 迭代器不会与可迭代对象的某个时刻绑定，而是记录遍历可迭代对象的过程，如果遍历中可迭代对象变了，那迭代器会反应相应的变化

```js
let arr = ['foo', 'bar']
let iter = arr[Symbol.iterator]() // Array Iterator {}
console.log(iter.next()) // {value: "foo", done: false}
arr.splice(1, 0, 'baz')
console.log(iter.next()) // {value: "baz", done: false}
console.log(iter.next()) // {value: "bar", done: false}
console.log(iter.next()) // {value: undefined, done: true}
```

- 迭代器维护着可迭代对象的引用，所以迭代器会阻止垃圾回收程序回收可迭代对象

## 自定义迭代器

- 与Iterable接口类似，实现了Iterator接口的对象都可以作为迭代器使用。

```js
class Counter{
  constructor(limit){
    this.count = 1
    this.limit = limit
  }
  next(){
    if(this.count <= this.limit) {
      return {
        done: false,
        value: this.count++
      }
    } else {
      return {
        done: true,
        value: undefined
      }
    }
  }
  [Symbol.iterator](){
    return this
  }
}

let counter = new Counter(3)
for(let i of counter) {
  console.log(i) // 1, 2, 3
}

for(let i of counter) {
  console.log(i) // 没有值
}

```

- 这样实现了Iterator接口，但是每个实例只能被迭代一次，所以我们把计数器变量放到闭包中

```js
class Counter{
  constructor(limit) {
    this.limit = limit
  }

  [Symbol.iterator](){
    let count = 1,limit = this.limit
    return {
      next(){
        if(count <= limit) {
          return {
            done: false,
            value: count++
          }
        } else {
          return {
            done: true,
            value: undefined
          }
        }
      }
    }
  }
}

let counter = new Counter(3)
for(let i of counter) {
  console.log(i) // 1, 2, 3
}

for(let i of counter) {
  console.log(i) // 1, 2, 3
}
```

- 每个以这种方式创建的迭代器都实现了Iterator接口。Symbol.iterator属性引用的工厂函数会返回相同的迭代器
- 因为每个迭代器也实现了Iterable接口，所以可以再任何期待可迭代对象的地方使用，比如for-of循环

```js
let arr = [3, 1, 4]
let iter = arr[Symbol.iterator]()
for(let item of arr) {
  console.log(item) // 3, 1, 4
}

for(let item of iter) {
  console.log(item) // 3, 1, 4
}
```

## 提前终止迭代器

- 可选的return方法用于指定在迭代器提前关闭时执行的逻辑。执行迭代的结构在想让迭代器知道它不想遍历到可迭代对象耗尽时，可以关闭迭代器。情况有：
  - for-of循环通过break、continue、return、或者throw提前退出
  - 结构操作并未消费所有值
- return方法必须返回一个幼小的IteratorResult对象，可以只返回{done: true}
- 下面代码所示，内置语言结构发现还有值可以迭代，但不会消费这些值时，会自动调用return

```js
class Counter{
  constructor(limit) {
    this.limit = limit
  }

  [Symbol.iterator](){
    let count = 1,limit = this.limit
    return {
      next(){
        if(count <= limit) {
          return {
            done: false,
            value: count++
          }
        } else {
          return {
            done: true,
            value: undefined
          }
        }
      },
      return (){
        console.log('exit early')
        return { done: true }
      }
    }
  }
}

let counter1 = new Counter(5)
for(let i of counter1) {
  if(i > 2) {
    break
  }
  console.log(i)
}
// 1
// 2
// exit early

let counter2 = new Counter(5)
try {
  for(let i of counter1) {
    if(i > 2) {
      throw 'err'
    }
    console.log(i)
  }
} catch(e) {}
// 1
// 2
// exit early

let counter3 = new Counter(5)
let [a, b] = counter3
// exit early
```

- 如果迭代器没有关闭，就可以从上次离开的地方继续迭代，比如数组的迭代不可关闭

```js
let arr3 = [1, 2, 3, 4, 5]
let iter1 = arr3[Symbol.iterator]()
for(let i of iter1) {
  console.log(i)
  if(i > 2) {
    break
  }
}
// 1
// 2
// 3


for(let i of iter1) {
  console.log(i)
}
// 4
// 5
```

- return方法是可选的，所以并非所有迭代都可以关闭，可以通过测试迭代器的return属性是不是方法确定是否可关闭。
- 仅仅给给不可关闭的迭代器加return方法并不能使其变成可关闭的。这是因为调用return并不会强制迭代器进入关闭状态。但是return方法仍然会调用

```js
let arr4 = [1, 2, 3, 4, 5]
let iter4 = arr4[Symbol.iterator]()
iter4.return = function(){
  console.log('exit early')
  return { done: true }
}

for(let i of iter4) {
  console.log(i)
  if(i > 2) {
    break
  }
}
// 1
// 2
// 3
// exit early


for(let i of iter4) {
  console.log(i)
}
// 4
// 5
```

## 小结

- 迭代器是一个由任意对象实现的接口，支持连续获取对象产出的每一个值。任何实现Iterable接口的对象都有一个Symbol.iterator属性，这个属性引用默认迭代器。默认迭代器就像一个迭代器工厂，也就是一个函数，调用之后会产生一个实现Iterator接口的对象
- 迭代器必须通过next方法才能连续取到值，这个方法返回IteratorObject。包含一个done属性跟value属性。这个借口可以通过手动反复调用next消费，也可以通过for-of这样的原生消费者消费