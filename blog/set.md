---
title: "Set与WeakSet"
date: "2020-10-16"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# Set与WeakSet

## Set

- Set是ES6新增的集合类型，带来了集合数据结构
- 创建方式为 new 关键字加 Set 构造函数
- 可以通过在构造函数内传入可迭代对象来初始化该实例，如下

```js
const s = new Set()
const s1 = new Set(['val1', 'val2', 'val3'])
const s2 = new Set({
  [Symbol.iterator]: function*(){
    yield 'val1'
    yield 'val2'
  }
})
console.log(s1) // {"val1", "val2", "val3"}
console.log(s2) // {"val1", "val2"}

```

- add()方法可以给Set添加新的键值对，has可以判断该Set是否有对应的值
- size可以获取Set的元素数量，delete()用于删除元素，clear()用于清空元素，如下
<!--more-->
```js
const s3 = new Set()
console.log(s3.has('first'))  // false
console.log(s3.size)          // 0

// add方法会返回它自身，所以可以连续add
s3.
add('first').
add('last')
console.log(s3.has('first'))  // true

s3.delete('first')
console.log(s3.has('first'))  // false  
console.log(s3.has('last'))   // true
console.log(s3.size)          // 1

s3.clear()

console.log(s3.has('last'))   // false
console.log(s3.size)          // 0
```

- Set可以使用任何类型作为键，has使用严格相等来判定该值是否存在

```js
const s4 = new Set()
const funcVal = function(){}
const objectVal = {}
const symbolVal = Symbol()

s4.
add(funcVal).
add(objectVal).
add(symbolVal)

console.log(s4.has(funcVal))    // true
console.log(s4.has(objectVal))  // true
console.log(s4.has(symbolVal))  // true

// 全等判断，所以独立实例不冲突
console.log(s4.has(function(){})) // false

```

- 全等判断，所以用作值的对象在自己的内容或属性变更时仍然保持不变

```js
const s5 = new Set()
const objVal = {}

s5.
add(objVal)

objVal.m2 = 'm2'

console.log(s5.has(objVal))    // true
```

- add()跟delete()是幂等的，delete()返回一个boolean，表示是否存在要删除的值

```js
const s6 = new Set()

s6.
add('foo')
console.log(s6.size)  // 1
s6.
add('foo')
console.log(s6.size)  // 1

console.log(s6.delete('foo'))    // true
console.log(s6.delete('foo'))    // false
```

## Set顺序与迭代

- Set维护值插入的顺序，所以是可迭代的，实例提供了一个迭代器，以插入顺序生成集合内容。
- 通过values()方法及其别名keys()(或者Symbol.iterator属性（引用的就是values()）)获取迭代器

```js
const s8 = new Set(['val1', 'val2', 'val3'])
console.log(s8.values === s8[Symbol.iterator]) // true
console.log(s8.keys === s8[Symbol.iterator]) // true

for(let value of s8[Symbol.iterator]()) {
  console.log(value)
}
// 'val1'
// 'val2'
// 'val3'
```

- values()是默认迭代器，所以可以对实例使用拓展操作

```js
const s8 = new Set(['val1', 'val2', 'val3'])

console.log([...s8]) // ['val1', 'val2', 'val3']
```

- 也可以不用迭代器，使用回调方法，用映射的forEach方法并传入回调，依次接受每个键/值对（键跟值都是值）。回调可接受可选的第二个参数，用于重写内部的this值
- forEach中的两个参数都是对应的值。

```js
const s8 = new Set(['val1', 'val2', 'val3'])

s8.forEach((val, key) => { console.log(`${ key } -> ${ val }`) })
// val1 -> val1
// val2 -> val2
// val3 -> val3

s8.forEach(function(val, key){ console.log(`${ key } -> ${ this.name } -> ${ val}`) }, { name: 's8' })
// val1 -> s8 -> val1
// val2 -> s8 -> val2
// val3 -> s8 -> val3
```

## WeakSet

- WeakSet 是 Set 的兄弟类型，API也是 Set 的自己，“weak”描述的时Javascrip垃圾回收程序对待“弱映射”中键的形式
- WeakMap中的键只能是Object或者继承自Object的类型，使用非对象设置键会抛出TypeError，值类型无限制
- 初始化时只要有一个键无效就会抛错，其他的初始化全部失败

```js
const key1 = { id: 1 }

const ws = new WeakSet([key1, 'BADKEY']) // Uncaught TypeError: Invalid value used in weak set

// 要使用非对象的值可以使用构造函数包装再使用
const ws1 = new WeakSet([key1,new String('BADKEY')]) 

```

- 其他的基本方法add、has、delete与Set保持一致
- “weak”表示键不属于正式引用，可以被回收，当键被回收后，键值对消失

```js
const ws2 = new WeakSet()
const container = {
  key:{}
}
ws2.add(container.key)
function removeReference(){
  container.key = null
}
removeReference()
```

- 上例中container对象维护着弱集合值的引用，所以不会被回收，但是要是执行了removeReference方法，那么值的引用就消失了，那么值就会消失
- WeakSet中的键值随时可能消失，所以没有迭代能力，也没有提供clear()清空的方法
- WeakSet之所以限制只能使用对象，是为了保证只有通过键对象的引用才能取到值。要是允许原始值就无法区分初始化时的字符串字面量跟初始化之后使用一个相同的字符串了

### WeakSet的应用

- WeakSet不会阻止垃圾回收，所以适合给对象打标签

```js
const disabledElements = new Set()
const loginButton = document.querySelector('#login')
disabledElements.add(loginButton)
```

- 这样我们查询元素在不在disabledElements就可以知道是否被禁用了。不过上面的实现在登录按钮被DOM树删除了，但因为Set中存在着按钮的引用，垃圾回收不能回收它

```js
const disabledElements = new WeakSet()
const loginButton = document.querySelector('#login')
disabledElements.add(loginButton)
```

- 使用WeakMap后当节点被删除后这里的引用也会消失，内存可直接被回收