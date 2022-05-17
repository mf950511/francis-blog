---
title: "深入Promise--高程4"
date: "2020-12-14"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 深入Promise

- Promise中执行resolve会有一个内部值，执行reject会有一个内部理由，默认情况下，这个值跟理由都是undefined
- Promise中使用reject进入拒绝态时没有进行捕获会抛出错误

```js
let p1 = Promise.resolve()
let p = Promise.reject()
setTimeout(console.log, 0, p1) // Promise {<resolved>: undefined}
setTimeout(console.log, 0, p)
// Uncaught (in promise) undefined
// Promise {<rejected>: undefined}
```

- Promise.resolve()可以将任何值转为Promise

```js
setTimeout(console.log, 0, Promise.resolve(3))
// Promise {<resolved>: 3}
```
<!--more-->
- Promise.resolve()是一个幂等方法，这个方法中，传入的参数本身是一个Promise，那么它的行为就是一个空包装

```js
let p2 = Promise.resolve(7)
setTimeout(console.log, 0, p2 === Promise.resolve(p2)) // true
setTimeout(console.log, 0, p2 === Promise.resolve(Promise.resolve(p2))) // true
```

- Promise.resolve可以包裹一个Promise，这样的话会保留原始Promise的状态

```js
setTimeout(console.log, 0, Promise.resolve(new Promise((resolve, reject) => { }) ))   // Promise {<pending>}
setTimeout(console.log, 0, Promise.resolve(Promise.resolve(3))) // Promise {<resolved>: 3}
setTimeout(console.log, 0, Promise.resolve(Promise.reject(4)))  // Promise {<rejected>: 4}
```

- 通过Promise.resolve可以包装任何非Promise值，包括错误对象，并将其转为解决的期约，这样做可能出现不符合预期的行为

```js
let p3 = Promise.resolve(new Error('foo'))
setTimeout(console.log, 0, p3) 
setTimeout(console.log, 0, Promise.resolve(Promise.reject(3))) 
//Promise {<resolved>: Error: foo
//    at <anonymous>:1:26}
```

- Promise.reject实例化一个拒绝Promise并抛出异步错误（此错误不能通过try/catch捕获，只能通过拒绝处理程序捕获）
- Promise.reject没有幂等的概念，给它一个Promise对象，它会自动将该对象变为拒绝的理由

```js
setTimeout(console.log, 0, Promise.reject(new Promise((resolve, reject) => { }) ))   // Promise {<rejected>: Promise}
setTimeout(console.log, 0, Promise.reject(Promise.resolve(3))) // Promise {<rejected>: Promise}
setTimeout(console.log, 0, Promise.reject(Promise.reject(4)))  // Promise {<rejected>: Promise}
```

## Promise.prototype.then

- 接收两个程序处理参数，均为可选，非函数类型的参数会被静默忽略

```js
let p4 = new Promise((res, rej) => {
  rej(4)
})
// 第一个参数被静默，可以捕获到异步报错
p4.then('123', (rej) => {
  console.log(rej)
})
```

- 这里的返回值会通过Promise.resolve()进行包装返回值来生成新的Promise，如果没有显示的返回语句，就包装默认返回值undefined
- 调用then不传处理程序，则原样向后传

```js
let p7 = Promise.resolve('foo')
let p8 = p7.then(() => 6) 
let p9 = p7.then(() => {})
let p10 = p7.then(() => Promise.resolve())
setTimeout(console.log, 0, p8)   // Promise {<resolved>: 6}
setTimeout(console.log, 0, p9) // Promise {<resolved>: undefined}
setTimeout(console.log, 0, p10)  // Promise {<resolved>: undefined}

p7.then().then(res => {
  console.log(res) // 'foo'
})
```

- Promise.prototype.then中的onReject捕获的错误也会通过Promise.resolve包装，这样就可以捕获错误，但是不抛出异常

```js
let p11 = Promise.reject('foo')
let p12 = p11.then(null, () => undefined)
let p13 = p11.then(null, () => {})
let p14 = p11.then(null, () => Promise.resolve())
let p15 = p11.then(null, () => Promise.reject())
setTimeout(console.log, 0, p12)   // Promise {<resolved>: undefined}
setTimeout(console.log, 0, p13) // Promise {<resolved>: undefined}
setTimeout(console.log, 0, p14)  // Promise {<resolved>: undefined}
setTimeout(console.log, 0, p15)  // Promise {<resolved>: undefined}
// Uncaught (in promise) undefined
```

## Promise.prototype.catch

- 该方法用于给Promise添加拒绝处理程序，只接受一个参数，onRejct处理程序
- 此方法是一个语法糖，相当于调用Promise.prototype.then(null, onReject)

## Promise.prototype.finally

- 此方法在Promise取得终态时触发，无论是onResolve或者onReject，但是无法知道Promise的结果
- 所以此代码主要用于清理无用程序，此方法返回一个新的Promise
- 因为它与状态无关，所以它会表现为上一个Promise的状态，无论是拒绝或者解决状态

```js
let p1 = new Promise(() => {})
let p2 = p1.finally()
setTimeout(console.log, 0, p1)  // Promise {<pending>}
setTimeout(console.log, 0, p2)  // Promise {<pending>}
setTimeout(console.log, 0, p1 === p2)  // false

let p3 = Promise.resolve(1)
let p4 = Promise.reject(2)
let p5 = new Promise(() => {})

// 原样后传
let p6 = p3.finally()
let p7 = p3.finally(() => {})
let p8 = p3.finally(() => undefined)
let p9 = p3.finally(() => Promise.resolve(3))
let p10 = p3.finally(() => Error('bar'))
let p11 = p4.finally()
let p12 = p5.finally()

setTimeout(console.log, 0, p6)  // Promise {<resolved>: 1}
setTimeout(console.log, 0, p7)  // Promise {<resolved>: 1}
setTimeout(console.log, 0, p8)  // Promise {<resolved>: 1}
setTimeout(console.log, 0, p9)  // Promise {<resolved>: 1}
setTimeout(console.log, 0, p10)  // Promise {<resolved>: 1}
setTimeout(console.log, 0, p11)  // Promise {<rejected>: 2}
setTimeout(console.log, 0, p12)  // Promise {<pending>}
```

- 如果返回了一个待定的Promise或者在onFinally中抛出了错误（显式抛出或者返回拒绝Promise），则会返回拒绝态的Promise

```js
let p1 = new Promise((resolve) => { resolve('foo') })
let p2 = p1.finally(() => Promise.reject())
let p3 = p1.finally(() => { throw 'bar' })
setTimeout(console.log, 0, p2)  // Promise {<rejected>: undefined}
setTimeout(console.log, 0, p3)  // Promise {<rejected>: "bar"}
```

- Promise获得状态后，与该状态相关的处理程序只是被排期，并非立即执行，跟在添加这个处理程序的代码之后的同步代码一定会在处理程序之前执行

```js
let synchronousResolve
let p = new Promise((resolve) => {
  synchronousResolve = function(){
    console.log('1: invoking resove')
    resolve()
    console.log('2: resolve return')
  }
})
p.then(() => console.log('4 then handler execute'))
synchronousResolve()
console.log('3 synchronousResolve')

// 1: invoking resove
// 2: resolve return
// 3 synchronousResolve
// 4 then handler execute
```

## 串行Promise合成

- Promise主要特征还有：异步产生值并传给处理程序，后续处理程序可以使用这个值，很像函数合成

```js

function addTwo(x){
  return x + 2
}
function addThree(x){
  return x + 3
}
function addFive(x){
  return x + 5
}

function addTen(x) {
  return addFive(addThree(addTwo(x)))
}

addTen(5) // 15

// 使用Promise实现
function addTwo(x){
  return x + 2
}
function addThree(x){
  return x + 3
}
function addFive(x){
  return x + 5
}

function addTen(x) {
  return [addTwo, addThree, addFive].reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
}
addTen(8).then(console.log) // 18


// 拓展实现

function addTwo(x){
  return x + 2
}
function addThree(x){
  return x + 3
}
function addFive(x){
  return x + 5
}
function compose(...fns) {
  return (x) => fns.reduce((promise, fn) => promise.then(fn), Promise.resolve(x))
}
let addTen = compose(addTwo, addThree, addFive)
addTen(10).then(console.log) // 20
```

## async/await

- async关键字用于声明异步函数。使用async可以让函数具有异步特征，但总体上代码仍然是同步求值
- 参数与闭包方面，异步函数跟普通函数有一样的行为

```js
async function foo(){
  console.log(1)
}
console.log(2)

// 1
// 2
```

- 如果异步函数使用return关键字返回了值（没有return会返回undefined），这个值会被Promise.resolve()包装成Promise对象。
- 异步函数始终返回Promise对象，函数外部调用该函数可以得到它返回的Promise

```js
async function foo(){
  console.log(1)
  return 3
}
foo().then(console.log)
console.log(2)

// 1
// 2
// 3

// 跟直接返回一个Promise对象效果一致
async function foo(){
  console.log(1)
  return Promise.resolve(3)
}
foo().then(console.log)
console.log(2)

// 1
// 2
// 3
```

- 异步函数返回值期待（但不要求）一个实现thenable接口的对象，但是常规的值也可以。如果返回的是实现thenable接口的对象，则这个对象可以由提供给then()的处理程序进行解包。如果不是，返回值就被当做已经解决的Promise

```js
async function foo(){
  return 'foo'
}
foo().then(console.log) // foo

async function baz(){
  const thenable = {
    then(callback) {
      callback('baz')
    }
  }
  return thenable
}
baz().then(console.log) // baz
```

- 在与Promise中一样，在异步函数中抛出错误会返回拒绝的Promise

```js
async function foo(){
  console.log(1)
  throw 3
}
foo().catch(console.log)
console.log(2)

// 1
// 2
// 3
```

- 拒绝Promise的错误不会被异步函数捕获（catch跟then中都无法取值）

```js
async function foo(){
  console.log(1)
  Promise.reject(3)
}
foo().catch(console.log).then(console.log)
console.log(2)

// 1
// 2
// VM1328:3 Uncaught (in promise) 3
```

- await可以暂停异步函数代码的执行，等待Promise解决
- await会暂停执行异步函数后面的代码，让出JavaScript运行中的执行线程。这个行为跟生成器函数中的yield关键字是一样的
- await同样会尝试解包对象的值，然后将这个值传给表达式，再异步恢复异步函数的执行

```js
async function foo(){
  console.log(await Promise.resolve('foo'))
}
foo() // foo

async function bar(){
  return await Promise.resolve('bar')
}
bar().then(console.log) // bar
```

- await关键字期待（但不要求）一个实现thenable接口的对象，但常规值也可以
- 如果是实现了thenable接口的对象，await会由await来解包，如果不是，就当做已经解决的Promise

```js
async function bar(){
  console.log(await ['bar'])
}
bar() // ["bar"]

async function baz(){
  const thenable = {
    then(callback){
      callback('baz')
    }
  }
  console.log(await thenable)
}
baz() // baz
```

- 等待会抛出错误的同步操作，返回拒绝的期约

```js
async function foo(){
  console.log(1)
  await (() => { throw 3 })()
}
foo().catch(console.log)
console.log(2)

// 1
// 2
// 3
```

- async中我们说到，单独的Promise.reject()不会被异步函数捕获，而是抛出未捕获错误。不过，对拒绝Promise使用await会释放错误值（将拒绝Promise返回）

```js
async function foo(){
  console.log(1)
  await Promise.reject(3)
  console.log(4) // 这行代码不执行
}
foo().catch(console.log)
console.log(2)

// 1
// 2
// 3
```

- await必须在异步函数中使用，不能在顶级上下文如`<script>`标签或者模块中使用，同步函数中使用await会抛出SyntaxError
- 使用await还有一些细微之处，看下面的例子

```js
async function foo(){
  console.log(await Promise.resolve('foo'))
}
async function bar(){
  console.log(await 'bar')
}
async function baz(){
  console.log('baz')
}
foo()
bar()
baz()

// baz
// bar
// foo
```

- async/await组合中，起作用的都是await，async只是一个标识符
- JavaScript运行时遇到await关键字会记录在哪暂停执行。等待await右边的值可以用了，JavaScript会向消息队列中推送一个任务，任务会恢复异步函数的执行
- 所以await后面哪怕跟了可用的值，函数的其他部分也会被异步求值

```js
async function foo(){
  console.log(2)
  await null
  console.log(4)
}
console.log(1)
foo()
console.log(3)

// 1
// 2
// 3
// 4
```

- 上面的执行过程可以这么解读
  - 打印1
  - 调用异步函数foo
  - 打印2
  - await暂停执行，为立即可用的值null向消息队列添加一个任务
  - foo退出
  - 打印3
  - 同步线程代码执行完成
  - JavaScript运行时从消息队列取出任务，恢复异步执行函数
  - foo中恢复执行，await取得null值
  - 打印4
  - foo返回
- 当await后面是一个Promise的时候会复杂一些。这个时候，为了执行异步函数，实际有两个任务被添加到消息队列并异步求值(11TC39对await后面是Promise的情况做过处理，导致只会生成一个异步任务，因此新版浏览器中会打印 123458967)

```js
async function foo(){
  console.log(2)
  console.log(await Promise.resolve(8))
  console.log(9)
}

async function bar(){
  console.log(4)
  console.log(await 6)
  console.log(7)
}

console.log(1)
foo()
console.log(3)
bar()
console.log(5)

// 1
// 2
// 3
// 4
// 5
// 6
// 7
// 8
// 9
```

- 运行时步骤如下
  - 打印1
  - 调用foo
  - 打印2
  - await暂停执行，向消息队列添加一个Promise在落定后执行的任务
  - Promise立即落定，把给await提供值的任务添加到消息队列
  - foo退出
  - 打印3
  - 调用bar
  - 打印4
  - await关键字暂停执行，为立即可用的值6向消息队列中添加任务
  - bar退出
  - 打印5
  - 顶级线程执行完成
  - JavaScript从消息队列中取出解决awaitPromise的处理程序，将解决值8提供给它
  - JavaScript运行时向消息队列中添加一个恢复foo执行的任务
  - JavaScript运行时从消息队列中取出恢复执行bar的任务及6
  - bar恢复执行，await取得6
  - 打印7
  - bar返回
  - 异步任务完成，JavaScript从消息队列中取出恢复foo的任务及8
  - 打印8
  - 打印9
  - foo返回
- 使用async跟await将上面的串行Promise进行优化

```js
async function addTwo(x){
  return x + 2
}
async function addThree(x){
  return x + 3
}
async function addFive(x){
  return x + 5
}

async function addTen(x) {
  for(const fn of [addTwo, addThree, addFive]) {
    x = await fn(x)
  }
  return x
}
addTen(9).then(console.log) // 19
```

- 在栈管理与内存管理中，Promise会尽可能的保留完整的调用栈，这样在抛出错误时就会更好地找到错误信息位置，但是这也意味着栈追踪信息会占用内存，带来计算与存储成本。
- 而异步函数中JavaScript运行时会简单地在嵌套函数中存储指向包含函数的指针。这个指针存在于内存中，用于出错时追踪信息。这样就不会带来而外的消耗
- 所以在重视性能的应用中优先考虑异步函数