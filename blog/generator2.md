---
title: "再读生成器"
date: "2020-10-22"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 生成器

- 生成器是ECMAScript 6新增的拥有在一个函数块内暂停和恢复代码执行的能力
- 使用该能力可以自定义迭代器和实现协称
- 生成器是一个函数，函数名前加一个 * 表示它是一个生成器
- 可以定义函数的地方都可以定义生成器
- 箭头函数不可以定义生成器函数

```js
function *generatorFn(){}
let generatorFn = function* () {}
let foo = {
  *generatorFn(){}
}
class Foo{
  *generatorFn(){}
}
class Bar{
  static *generatorFn(){}
}

```

- 生成器函数的 * 不受两侧空格影响

```js
// 等价的生成方式
function *generatorFn(){}
function* generatorFn(){}
function * generatorFn(){}
```
<!--more-->
- 调用生成器函数会生成一个生成器对象。
- 生成器对象开始处于暂停状态
- 与迭代器相似，生成器对象也实现了Iterator接口，因此也有next方法。调用这个方法可以开始或恢复执行

```js
const generatorFn = function* (){}
const g = generatorFn()
console.log(g) // generatorFn {<suspended>}
console.log(g.next) // ƒ next() { [native code] }
console.log(g.next()) // {value: undefined, done: true}
```

- next返回的值类似于迭代器，有一个done跟value属性。函数体为空的生成器函数中间不会停留，调用一次就会让生成器到达done: true的状态
- value属性是生成器函数的返回值，默认为undefined，可以通过生成器函数的返回值指定

```js
const generatorFn1 = function* (){
  return 'bar'
}
const g1 = generatorFn1()
console.log(g1.next()) // {value: "bar", done: true}
```

- 生成器函数只会在初次调用next方法后开始执行，如下所示

```js
const generatorFn2 = function* (){
  console.log('foobar')
}
const generatorObject2 = generatorFn2()
generatorObject2.next() // 'foobar'
```

- 生成器对象实现了Iterator接口，它们默认的迭代器是自引用的

```js
const generatorFn3 = function* (){
}
console.log(generatorFn3)  // ƒ* (){}
console.log(generatorFn3()) // generatorFn3 {<suspended>}
console.log(generatorFn3()[Symbol.iterator]) // ƒ [Symbol.iterator]() { [native code] }
console.log(generatorFn3()[Symbol.iterator]()) // generatorFn3 {<suspended>}

const g3 = generatorFn3()
console.log(g3 === g3[Symbol.iterator]()) // true
```

## yield

- yield关键字可以让生成器停止和开始执行
- 生成器函数再遇到yield之前正常执行，遇到这个关键字会停止执行，函数作用域状态保留
- 停止执行的生成器函数只能通过在生成器对象上调用next方法恢复执行

```js
const generatorFn4 = function* (){
  yield
}
const generatorObject4 = generatorFn4()
console.log(generatorObject4.next()) // {value: undefined, done: false}
console.log(generatorObject4.next()) // {value: undefined, done: true}
```

- yield关键字类似于函数中的中间返回语句，生成的值会在next方法返回的对象里，通过yield退出的生成器函数会处在done: false的状态，通过return方法退出的生成器函数会处在 done: true的状态

```js
const generatorFn5 = function* (){
  yield 'foo'
  yield 'bar'
  return 'baz'
}
const generatorObject5 = generatorFn5()
console.log(generatorObject5.next()) // {value: "foo", done: false}
console.log(generatorObject5.next()) // {value: "bar", done: false}
console.log(generatorObject5.next()) // {value: "baz", done: true}
```

- 生成器函数内部的执行流程会对每个生成器对象区分作用域。在一个生成器上调用next不会影响其他生成器

```js
const generatorFn6 = function* (){
  yield 'foo'
  yield 'bar'
  return 'baz'
}
const generatorObject6 = generatorFn6()
const generatorObject61 = generatorFn6()
console.log(generatorObject6.next()) // {value: "foo", done: false}
console.log(generatorObject61.next()) // {value: "foo", done: false}
console.log(generatorObject6.next()) // {value: "bar", done: false}
console.log(generatorObject61.next()) // {value: "bar", done: false}
```

- yield关键字只能在生成器函数内部使用，其他地方会报错。类似return语句，yield必须直接位于生成器函数定义中，出现在嵌套的非生成器函数会抛错

```js
// 有效
function* validGeneratorFn(){
  yield
}

// 无效
function* invalidGeneratorFn(){
  function a(){
    yield
  }
}

// 无效
function* invalidGeneratorFn(){
  const b = () => {
    yield
  }
}

// 无效
function* invalidGeneratorFn(){
  (() => {
    yield
  })()
}

```

## 生成器作为可迭代对象

- 可以把生成器当做可迭代对象使用

```js
function* generatorFn7(){
  yield 1
  yield 2
  yield 3
}
for(const x of generatorFn7()) {
  console.log(x) // 1, 2, 3
}
```

- 在需要自定义迭代对象时我们可以使用生成器对象。比如，当我们需要定义一个可迭代对象，它会产生一个迭代器，迭代器会执行指定的次数
- 使用生成器可以用一个简单地循环实现

```js
function* generatorFn8(n){
  while(n--) {
    yield
  }
}
for(let _ of generatorFn8(3)) {
  console.log('foo') // 'foo', 'foo', 'foo'
}
```

## yield实现输入输出

- 除了作为函数的中间返回语句，yield还可以作为函数的中间参数使用。上一次让生成器函数暂停的yield关键字会接收到传给next的第一个值。
- 第一次调用next方法传入的值不会被使用，因为第一次是为了开始执行生成器函数

```js
function* generatorFn9(initial){
  console.log(initial)
  console.log(yield)
  console.log(yield)
}
let generatorObject9 = generatorFn9('foo')

generatorObject9.next('bar') // foo
generatorObject9.next('baz') // baz
generatorObject9.next('qux') // qux

```

- yield还可以同时用于输入输出

```js
function* generatorFn10(){
  return yield 'foo'
}
let generatorObject10 = generatorFn10()

console.log(generatorObject10.next()) // {value: "foo", done: false}
console.log(generatorObject10.next('bar')) // {value: 'bar', done: true}
```

- 因为函数必须要对整个表达式求值才可以返回，再遇到yield时暂停并计算返回的值'foo'。下一次调用next()传入了'bar'，作为交给同一个yield的值。然后这个值被定为生成器函数要返回的值
- yield关键字可以多次使用
- 如果我们定义一个生成器函数，根据配制的值迭代相应次数，并产生迭代索引。初始化一个数组可以实现，不用数组也可以

```js
function* nTimes(n){
  for(let i = 0; i < n; ++i) {
    yield i
  }
}

// 或者用while实现
function* nTimes(n){
  let i = 0
  while(n--) {
    yield i++
  }
}
```

- 使用生成器可以填充范围数组

```js
function* range(start, end) {
  while(end > start) {
    yield start++
  }
}
for(let x of range(4, 7)) {
  console.log(x) // 4, 5, 6
}

function* zeroes(n) {
  while(n--) {
    yield 0
  }
}
console.log(Array.from(zeroes(8))) // [0, 0, 0, 0, 0, 0, 0, 0]
```

## 产生可迭代对象

- 可以使用 * 加强yield的行为，让它迭代一个可迭代对象，从而一次产出一个值

```js
function* generatorFn11(){
  yield* [1, 2, 3]
}
for(let x of generatorFn11()) {
  console.log(x)
}

// 等价于
function* generatorFn11(){
  for(const x of [1, 2, 3]) {
    yield x
  }
}
```

- yield星号两侧也不受空格影响
- yield* 其实只是将一个可迭代对象序列化为一串可以单独产出的值，跟放在循环里没有什么不同
- yield* 的值是关联迭代器返回done:true时的value属性。对于普通迭代器来说，这个值是undefined

```js
function* generatorFn12(){
  console.log('iter value:', yield* [1, 2, 3])
}
for(const x of generatorFn12()) {
  console.log('value: ', x)
}
// value:  1
// value:  2
// value:  3
// iter value: undefined
```

- 对于生成器函数产生的迭代器来说，这个值就是生成器函数返回的值

```js
function* generatorFn13(){
  yield 'foo'
  return 'bar'
}
function* othergeneratorFn13(genObj){
  console.log('iter value:', yield* generatorFn13())
}
for(const x of othergeneratorFn13()) {
  console.log('value: ', x)
}

// value:  foo
// iter value: bar
```

## yield*实现递归

- 这也是yield*最有用的地方

```js
function* nTimes(n) {
  if(n > 0) {
    yield* nTimes(n - 1)
    yield n - 1
  }
}
for(const x of nTimes(3)) {
  console.log(z)
}
// 0
// 1
// 2
```

- 这里每个生成器都会从新创建的生成器对象产出值，然后再产生一个整数。
- 下面是一个图的实现，生成一个随机的双向图

```js
class Node {
  constructor(id){
    this.id = id
    this.neighbors = new Set()
  }
  connect(node){
    if(node !== this) {
      this.neighbors.add(node)
      node.neighbors.add(this)
    }
  }
}
class RandomGraph {
  constructor(size) {
    this.nodes = new Set()
    for(let i = 0; i < size; ++i) {
      this.nodes.add(new Node(i))
    }
    const threshold = 1 / size
    for(const x of this.nodes) {
      for(const y of this.nodes) {
        if(Math.random() < threshold) {
          x.connect(y)
        }
      }
    }
  }

  print(){
    for(const node of this.nodes) {
      // console.log([...node.neighbors])
      const ids = [...node.neighbors].map((n) => n.id).join(',')
      console.log(`${ node.id }: ${ ids }`)
    }
  }
}

const gra = new RandomGraph(6)
gra.print()
// 0: 1,5
// 1: 0,2,5
// 2: 1,3,5
// 3: 2
// 4: 5
// 5: 0,2,1,4
```

- 图结构数据适合递归遍历，而递归生成器可以实现这个需求。生成器函数必须包含一个可迭代对象，产出该对象的每个值，并对值进行递归。如此可以测试是否有某个点不可到达。

```js
class Node {
  constructor(id){
    this.id = id
    this.neighbors = new Set()
  }
  connect(node){
    if(node !== this) {
      this.neighbors.add(node)
      node.neighbors.add(this)
    }
  }
}
class RandomGraph {
  constructor(size) {
    this.nodes = new Set()
    for(let i = 0; i < size; ++i) {
      this.nodes.add(new Node(i))
    }
    const threshold = 1 / size
    for(const x of this.nodes) {
      for(const y of this.nodes) {
        if(Math.random() < threshold) {
          x.connect(y)
        }
      }
    }
  }

  print(){
    for(const node of this.nodes) {
      // console.log([...node.neighbors])
      const ids = [...node.neighbors].map((n) => n.id).join(',')
      console.log(`${ node.id }: ${ ids }`)
    }
  }

  isConnect(){
    let visitedNode = new Set()
    function* traverse(nodes){
      for(let node of nodes) {
        if(!visitedNode.has(node)) {
          yield node
          yield* traverse(node.neighbors)
        }
      }
    }
    const firstNode = this.nodes[Symbol.iterator]().next().value
    for(const node of traverse([firstNode])) {
      visitedNode.add(node)
    }
    return visitedNode.size === this.nodes.size
  }
}
```

- 因为生成器对象实现了Iterable接口，而且生成器函数和默认迭代器对象调用之后都会产生迭代器，所以生成器格外适合做为默认迭代器，下面是一个简单地例子

```js
class Foo{
  constructor(){
    this.values = [1, 2, 3]
  }
  * [Symbol.iterator]() {
    yield* this.values
  }
}

const f = new Foo()
for(const x of f) {
  console.log(x)
}
// 1, 2, 3
```

- for-of循环调用默认迭代器（刚好也是一个生成器函数）并产生一个生成器对象，生成器对象是可迭代的，所以可以在迭代中使用

## 提前终止生成器

- 生成器支持“可关闭”的概念。一个实现Iterator接口的对象一定有next方法，还有一个可选的return方法用于提前终止迭代器。生成器对象除了这两个方法，还有第三个方法： throw

```js
function* generatorF(){}
const ge = generatorF()
console.log(ge) // generatorF {<suspended>}
console.log(ge.next) // ƒ next() { [native code] }
console.log(ge.return) // ƒ return() { [native code] }
console.log(ge.throw) // ƒ throw() { [native code] }
```

- return与throw都可以强制生成器进入关闭状态
- return 方法强制生成器进入关闭状态，提供给return的值就是终止迭代器对象的值

```js
function* generatorF1(){
  for(const x of [1,2,3]) {
    yield x
  }
}
const ge1 = generatorF1()
console.log(ge1) // generatorF1 {<suspended>}
console.log(ge1.return(3)) // {value: 3, done: true}
console.log(ge1) // generatorF1 {<closed>}
```

- 跟迭代器不一样，生成器对象一旦进入关闭状态就无法恢复了。后续调用next会显示done: true的状态，而且这个值不会被存储或传播

```js
function* generatorF2(){
  for(const x of [1,2,3]) {
    yield x

const ge2 = generatorF2()
console.log(ge2.next()) // {value: 1, done: false}
console.log(ge2.return(4)) // {value: 4, done: true}
console.log(ge2.next()) // {value: undefined, done: true}
console.log(ge2.next()) // {value: undefined, done: true}  }
}
```

- for-of循环等内置语言结构会忽略状态为done: true的IteratorObject内部的值

```js
function* generatorF3(){
  for(const x of [1,2,3]) {
    yield x
  }
}
const ge3 = generatorF3()
for(const x of ge3) {
  if(x > 1) {
    ge3.return(4)
  }
  console.log(x)
}
// 1
// 2
```

- throw方法会在暂停时讲一个提供的错误注入到生成器对象中，要是错误没有被处理，生成器就会关闭

```js
function* generatorF4(){
  for(const x of [1,2,3]) {
    yield x
  }
}
const ge4 = generatorF4()
console.log(ge4) // generatorF4 {<suspended>}
try {
  ge4.throw('foo')
} catch(e) {
  console.log(e) // foo
}
console.log(ge4) // generatorF4 {<closed>}
```

- 要是生成器内部处理了这个值，那生成器就不会关闭，而且可以恢复执行。错误处理会跳过对应的yield，因此下例中会跳过一个值

```js
function* generatorF5(){
  for(const x of [1,2,3]) {
    try {
      yield x
    } catch (e) {
      console.log(e)
    }
  }
}
const ge5 = generatorF5()
ge5.throw('foo') // 'foo'
console.log(ge5.next()) // {value: 3, done: false}
```

- 上面生成器在try/catch块中的yield关键字暂停执行。暂停期间throw向生成器对象内部注入了一个错误：字符串"foo"。因为错误是在生成器的try/catch抛出，仍然在生成器内部捕获。
- 由于yield抛出了错误，生成器不会产出2.此时，生成器函数继续执行，下一次迭代再次遇到yield关键字时产出了3
- 如果生成器还没有开始执行，那么调用throw抛出的错误不会在函数内部被捕获，因为这相当于在函数外部抛出了错误

## 小结

- 生成器是一种特殊的函数，调用返回一个生成器对象。生成器对象实现了Iterable接口，因此能用在任何消费可迭代对象的地方。
- 生成器支持yield关键字，该关键字可以暂停执行生成器函数。yield关键字可以通过next接收输入和输出。
- yield加上 * 后可以将后面的可迭代对象序列化为一串值