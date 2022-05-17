---
title: "Map与WeakMap"
date: "2020-10-16"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# Map与WeakMap

## Map

- Map是ES6新增的键值存储类型
- 创建方式为 new 关键字加 Map构造函数
- 可以通过在构造函数内传入可迭代对象来初始化该实例，可迭代对象的每一项需要包含键/值对数组，如下

```js
const m = new Map()
const m1 = new Map([['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']])
const m2 = new Map({
  [Symbol.iterator]: function*(){
    yield ['key1', 'value1']
    yield ['key2', 'value2']
  }
})
console.log(m1) // {"key1" => "value1", "key2" => "value2", "key3" => "value3"}
console.log(m2) // {"key1" => "value1", "key2" => "value2"}

// Map会映射它期待的键值对，无论你提供不提供，如下，因为没有提供对应的键值，Map会自动以undefined填充
const m3 = new Map([[]])
console.log(m3) // {undefined => undefined}

```

- set()方法可以给Map添加新的键值对，get可以查询对应键下面的值，has可以判断该Map是否有对应的键
- size可以获取Map的键值对数量，delete()用于删除指定值，clear()用于清空Map，如下
<!--more-->
```js
const m4 = new Map()
console.log(m4.has('first'))  // false
console.log(m4.get('first'))  // undefined
console.log(m4.size)          // 0

// set方法会返回它自身，所以可以连续set
m4.
set('first', 'matt').
set('last', 'kuni')
console.log(m4.has('first'))  // true
console.log(m4.get('first'))  // 'matt'

m4.delete('first')
console.log(m4.has('first'))  // false  
console.log(m4.has('last'))   // true
console.log(m4.get('first'))  // undefined
console.log(m4.get('last'))   // 'last'
console.log(m4.size)          // 1

m4.clear()

console.log(m4.has('last'))   // false
console.log(m4.size)          // 0
```

- Map可以使用任何类型作为键，has与get使用严格相等来判定该键是否存在

```js
const m5 = new Map()
const funcKey = function(){}
const objectKey = {}
const symbolKey = Symbol()

m5.
set(funcKey, 'function').
set(objectKey, 'object').
set(symbolKey, 'symbol')

console.log(m5.get(funcKey))    // function
console.log(m5.get(objectKey))  // object
console.log(m5.get(symbolKey))  // symbol

// 全等判断，所以独立实例不冲突
console.log(m5.get(function(){})) // undefined

```

- 全等判断，所以用作键和值的对象在自己的内容或属性变更时仍然保持不变

```js
const m6 = new Map()
const objKey = {}
const objVal = {}

m6.
set(objKey, objVal)

objKey.m1 = 'm1'
objVal.m2 = 'm2'

console.log(m6.get(objKey))    // {m2: "m2"}


// 全等判断，所以独立实例不冲突
console.log(m6.get({})) // undefined

```

- 全等判断，所以下面情况可能出问题

```js
const m7 = new Map()
const a = 0/'', b = 0/'',pz = +0, nz = -0;
console.log(a === b)
console.log(pz === nz)

m7.set(a, 'foo')  // false
m7.set(pz, 'bar') // true

console.log(m7.get(b))  // 'foo'
console.log(m7.get(nz)) // 'bar'
```

## Map顺序与迭代

- Map维护键值插入的顺序，所以是可迭代的，实例提供了一个迭代器，以插入顺序生成[key, value]形式的数组。
- 通过entries()方法或者Symbol.iterator属性（引用的就是entries()）获取迭代器

```js
const m8 = new Map([['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']])
console.log(m8.entries === m8[Symbol.iterator]) // true

for(let pairs of m8[Symbol.iterator]()) {
  console.log(pairs)
}
// ["key1", "value1"]
// ["key2", "value2"]
// ["key3", "value3"]
```

- entries()是默认迭代器，所以可以对实例使用拓展操作

```js
const m8 = new Map([['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']])

console.log([...m8]) // [["key1", "value1"], ["key2", "value2"], ["key3", "value3"]]
```

- 也可以不用迭代器，使用回调方法，用映射的forEach方法并传入回调，依次接受每个键/值对。回调可接受可选的第二个参数，用于重写内部的this值
- forEach中的第一个参数是对应的值，第二个为对应的键。

```js
const m8 = new Map([['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']])

m8.forEach((val, key) => { console.log(`${ key } -> ${ val }`) })
// key1 -> value1
// key2 -> value2
// key3 -> value3

m8.forEach(function(val, key){ console.log(`${ key } -> ${ this.name } -> ${ val}`) }, { name: 'm8' })
// key1 -> m8 -> value1
// key2 -> m8 -> value2
// key3 -> m8 -> value3
```

- keys()跟values()分别返回以插入顺序生成的键跟值

```js
const m8 = new Map([['key1', 'value1'], ['key2', 'value2'], ['key3', 'value3']])

for(let key of m8.keys()) {
  console.log(key)
}
// key1
// key2
// key3

for(let val of m8.values()) {
  console.log(val)
}

// value1
// value2
// value3
```

- Object与Map的对比
  - 内存情况，Object与Map占用的内存都会随键的数量线性增加。在给定固定大小内存的情况下，Map可以比Object多存储 50% 的键值对
  - 插入性能，Object与Map对插入的消耗差不多，但是Map要快一点，所以大量的插入操作使用Map
  - 查找速度，包含少量的键值时，Object的速度更快，涉及大量的查找操作使用Object更好
  - 删除性能，Object的delete性能很差，Map的delete()比插入和查找更快。所以涉及大量删除使用Map

## WeakMap

- WeakMap是Map的兄弟类型，API也是Map的子集，“weak”描述的时Javascrip垃圾回收程序对待“弱映射”中键的形式
- WeakMap中的键只能是Object或者继承自Object的类型，使用非对象设置键会抛出TypeError，值类型无限制
- 初始化时只要有一个键无效就会抛错，其他的初始化全部失败

```js
const key1 = { id: 1 }
const key2 = { id: 2 }
const key3 = { id: 3 }

const wm = new WeakMap([[key1, 'val1'], ['BADKEY', 'val2']]) // VM648:5 Uncaught TypeError: Invalid value used as weak map key

// 要使用非对象的值可以使用构造函数包装再使用
const wm = new WeakMap([[key1, 'val1'], [new String('BADKEY'), 'val2']]) // {String => "val2", {…} => "val1"}

```

- 其他的基本方法set、get、has与Map保持一致
- “weak”表示键不属于正式引用，可以被回收，当键被回收后，键值对消失

```js
const wm2 = new WeakMap()
const container = {
  key:{}
}
wm2.set(container.key, 'val')
function removeReference(){
  container.key = null
}
removeReference()
```

- 上例中container对象维护着弱映射键的引用，所以不会被回收，但是要是执行了removeReference方法，那么键的引用就消失了，那么键值对就会消失
- WeakMap中的键值随时可能消失，所以没有迭代能力，也没有提供clear()清空的方法
- WeabMap之所以限制只能使用对象，是为了保证只有通过键对象的引用才能取到值。要是允许原始值就无法区分初始化时的字符串字面量跟初始化之后使用一个相同的字符串了

### WeakMap的应用

- 私有变量

```js
const User = (() => {
  const wm = new WeakMap()
  class User {
    constructor(id) {
      this.idProperty = Symbol('id')
      this.setId(id)
    }
    setPrivate(property, value) {
      const propertyMembers = wm.get(this) || {}
      propertyMembers[property] = value
      wm.set(this, propertyMembers)
    }
    getPrivate(property) {
      return wm.get(this)[property]
    }
    setId(id) {
      this.setPrivate(this.idProperty, id)
    }
    getId(){
      return this.getPrivate(this.idProperty)
    }
  }
  return User
})()

const user = new User(123)
console.log(user.getId()) // 123
user.setId(456)
console.log(user.getId()) // 456

```

- DOM节点元数据
- WeakMap不会阻止垃圾回收，适合保存元数据

```js
const m = new Map()
const loginButton = document.querySelector('#login')
m.set(loginButton, { disabled: true })
```

- 上面的实现在登录按钮被DOM树删除了，但因为Map中存在着按钮的引用，所以DOM节点还会在内存中存在

```js
const m = new WeakMap()
const loginButton = document.querySelector('#login')
m.set(loginButton, { disabled: true })
```

- 使用WeakMap后当节点被删除后这里的引用也会消失，内存可直接被回收