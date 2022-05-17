---
title: "DOM编程--高程4"
date: "2020-12-28"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# DOM编程

- 下面是我们常见的DOM编程方法
- 动态插入script标签

```js
function loadScript(code){
  var script = document.createElement('script')
  try {
    // 旧版本IE中有问题，IE对script做了特殊处理，不允许常规DOM访问子节点，所以可以在
    script.appendChild(document.createTextNode(code))
  } catch () {
    script.text = code
  }
  document.body.appendChild(script)
}
loadScript('function sayHi(){alert("hi")}')
```

- 这种方法会在返回后立即生效，通过innerHTML创建的 script 元素不会执行，会创建但不会执行
- 动态插入CSS样式
<!--more-->
```js
// 所有主流浏览器都支持
function loadStyles(url) {
  let link = document.createElement('link')
  link.rel = 'stylesheet'
  link.type = 'text/css'
  link.href = url
  let head = document.getElementsByTagName('head')[0]
  head.appendChild(link)
}

// 插入动态语句
function loadStyleString(css) {
  let style = document.createElement('style')
  style.type = 'text/css'
  try{
    style.appendChild(document.createTextNode(css))
  } catch() {
    style.styleSheet.cssText = css
  }
  let head = document.getElementsByTagName('head')[0]
  head.appendChild(style)
}

loadStyleString("body{background:#fff}")
```

- 这样添加也会立即生效，在IE中要注意使用styleSheet.cssText，如果重用同一个 style 元素并设置该属性超一次，会导致浏览器奔溃，设置cssText为空也会导致奔溃

## 操作表格

- 下面是按常规DOM形式创建的表格

```js
// 创建表格
let table = document.createElement('table')
table.border = 1
table.width = '100%'
// 创建表体
let tbody = document.createElement('tbody')
table.appendChild(tbody)

// 创建行
let row1 = document.createElement('tr')
tbody.appendChild(row1)
let cell_1 = document.createElement('td')
cell_1.appendChild(document.createTextNode('Cell_1'))
row1.appendChild(cell_1)

let cell_2 = document.createElement('td')
cell_2.appendChild(document.createTextNode('Cell_2'))
row1.appendChild(cell_2)

document.body.appendChild(table)

```

- 上面创建的形式太过繁琐，所以新增了以下属性
- table新增的属性
  - caption，指向<caption>元素的指针
  - tBodies，包含<tbody>的HTMLCollection
  - tFoot，指向<tfoot>元素
  - tHead，指向<thead>元素
  - rows：包含所有行的HTMLCollection
  - createTHead()：创建<thead>标签，插入表格，返回引用
  - createTFoot()：创建<tfoot>元素，插入表格，返回引用
  - createCaption()：创建<caption>元素，插入表格，返回引用
  - deleteTHead()：删除<thead>元素
  - deleteTFoot()：删除<tfoot>元素
  - deleteCaption()：删除<caption>元素
  - deleteRow(pos): 删除给定的行
  - insertRow(pos)，在给定位置插入一行
- tbody元素添加以下方法
  - rows，包含<tbody>中所有行的HTMLCollection
  - deleteRow(pos)，删除指定位置行
  - insertRow(pos)，指定位置插入一行，返回改行的引用
- tr元素新增以下属性和方法
  - cells，包含<tr>元素所有表元的HTMLCollection
  - deleteCell(pos)，删除指定位置表元
  - insertCell(pos)，指定位置插入表元返回引用
- 重写上面代码

```js
let table = document.createElement('table')
table.border = 1
table.width = '100%'
// 创建表体
let tbody = document.createElement('tbody')
table.appendChild(tbody)

tbody.insertRow(0)
tbody.rows[0].insertCell(0)
tbody.rows[0].cells[0].appendChild(document.createTextNode('Cell_1'))
tbody.rows[0].insertCell(1)
tbody.rows[0].cells[1].appendChild(document.createTextNode('Cell_2'))
```

- NodeList、NamedNodeMap、HTMLCollection三个集合类型都是实时的，文档结构变化会实时反应，所以下面代码会死循环

```js
let divs = document.getElementsByTagName('div')
for(let i = 0 ; i < divs.length; i++) {
  let div = document.createElement('div')
  document.body.appendChild(div)
}
```

## MutationObserver接口

- DOM规范中的MutationObserver接口可以在DOM被修改时异步执行回调，使用它能够观察整个文档、DOM树的一部分，或某个元素。还能观察元素属性、子节点、文本或者它们的任意组合
- MutationObserver是为了替代废弃的MutationEvent
- 基本用法如下

```js
let observer = new MutationObserver(() => {
  console.log('<body> attributes changed')
})

observer.observe(document.body, { attributes: true })
document.body.className = 'foo'
console.log('Changed body')

// Changed body
// <body> attributes changed
```

- 创建后使用observer()方法关联DOM对象，接收两个参数为：要观察变化的DOM节点，以及一个MutationObserverInit对象
- MutationObserverInit对象用于控制观察哪些方面的变化，是一个键/值形式配置选项的字典。上述代码就是观察body上attributes的变化
- 从上面能看出来，观察的回调执行在后面，所以是一个异步函数
- 每个回调都会收到一个MutationRecord实例的数组，实例包含的信息包括发生了什么变化，以及DOM的哪一部分受影响了。回调执行之前可能同时发生多个满足条件的事件，所以每次执行回调都会传入一个包含按顺序入队的MutationRecord实例的数组

```js
let observer = new MutationObserver((mutationRecord) => { console.log(mutationRecord) })
observer.observe(document.body, { attributes:true })
document.body.setAttribute('foo', 'bar')
// [
//   {
//     addedNodes: NodeList []
//     attributeName: "foo"
//     attributeNamespace: null
//     nextSibling: null
//     oldValue: null
//     previousSibling: null
//     removedNodes: NodeList []
//     target: body.page-v3.eye-protector-processed
//     type: "attributes"
//   }
// ]
document.body.setAttributeNS('baz', 'foo', 'bar')
// [
//   {
//     addedNodes: NodeList []
//     attributeName: "foo"
//     attributeNamespace: "baz"
//     nextSibling: null
//     oldValue: null
//     previousSibling: null
//     removedNodes: NodeList []
//     target: body.page-v3.eye-protector-processed
//     type: "attributes"
//   }
// ]

```

- 连续修改会生成多个MutationRecord实例，下次回调就会收到所有包含这些实例的数组，顺序为变化事件发生的顺序

```js
let observer = new MutationObserver((mutationRecords) => { console.log(mutationRecords) })
observer.observe(document.body, { attributes:true })
document.body.className = 'foo'
document.body.className = 'bar'
document.body.className = 'baz'
// [MutationRecord, MutationRecord, MutationRecord]
```

- 下面是MutationRecord实例的属性
  - target: 被修改影响的目标节点
  - type: 字符串，表示变化的类型："attributes"、"characterData"、"childList"
  - oldValue: 如果在MutationObserverInit中启用（attributeOldValue或characterData oldValue为true）"attributes"或"characterData"的事件变化会设置这个属性为被替代的值，"childList"类型的变化始终将这个属性设置为null
  - attributeName: 对于"attributes"类型的变化，这里保存被修改属性的名字，其他变化事件为null
  - attributeNameSpace: 对于使用命名空间的"attributes"类型变化，这里保存被修改属性的名字，其他事件为null
  - addedNodes: 对于"childList"类型的变化，返回包含变化中添加节点的NodeList，默认为空NodeList
  - removeNodes: 对于"childList"类型的变化，返回包含变化中删除节点的NodeList，默认为空NodeList
  - previousSibling: 对于"childList"类型的变化，返回变化节点的前一个同胞Node，默认为null
  - nextSibling: 对于"childList"类型的变化，返回变化后节点的后一个同胞Node，默认为null
- 传给回调的第二个参数是观察变化的MutationObserver的实例

```js
let observer = new MutationObserver((mutationRecords, mutationObserver) => { console.log(mutationRecords, mutationObserver) })
observer.observe(document.body, { attributes:true })
document.body.className = 'foo'
//[MutationRecord] MutationObserver {}
```

- disconnect()方法：默认情况下，只要被观察的元素不被垃圾回收，MutationObserver回调就会响应DOM变化，从而被执行。要提前终止执行回调，调用disconnect()方法。

```js
let observer = new MutationObserver((mutationRecords, mutationObserver) => { console.log(mutationRecords, mutationObserver) })
observer.observe(document.body, { attributes:true })
document.body.className = 'foo'
observer.disconnect()
document.body.className = 'bar'
// 没有输出日志
```

- 上面可以看出，当调用了disconnect之后，不仅之后变化事件的回调不会执行，已经加入到任务队列的事件也不会执行
- 所以想要被加入的事件可以被执行，在调用disconnect方法的时候加一个setTimeout(() => {}, 0)
- 多次调用observer()方法，可以复用一个MutationObserver对象观察多个不同的目标节点。

```js
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords.map(x => x.target)))

let childA = document.createElement('div'), childB = document.createElement('span')
document.body.appendChild(childA)
document.body.appendChild(childB)

// 观察两个元素
observer.observe(childA, { attributes: true })
observer.observe(childB, { attributes: true })

// 修改子节点属性
childA.setAttribute('foo', 'bar')
childB.setAttribute('foo', 'bar')

// [div, span]

observer.disconnect()
childA.setAttribute('a', 'b')
childB.setAttribute('a', 'b')
// 没有日志
```

- disconnect()方法是一刀切的方案，会停止观察所有目标
- 调用disconnect只是断开连接，没有结束MutationObserver的声明，可以重新用这个观察者关联新的目标节点

```js
let observer = new MutationObserver((mutationRecords) => console.log('<body> attributes changed'))
observer.observe(document.body, { attributes: true })
document.body.setAttribute('foo', 'bar')
setTimeout(() => {
  observer.disconnect()
  document.body.setAttribute('baz', 'baz')
}, 0)
setTimeout(() => {
  observer.observe(document.body, { attributes: true })
  document.body.setAttribute('qux', 'qux')
}, 0)
// <body> attributes changed
// <body> attributes changed
```

- MutationObserverInit用于控制目标节点的观察范围。可观察的值如下
  - subtree: 布尔值，表示除了目标对象，是否观察目标节点的子节点，为true表示观察节点及子节点
  - attributes: 布尔值，表示是否观察目标节点的属性变化
  - attributeFilter: 字符串数组，表示要观察哪些属性的变化，这个值设为true会将attributes也转换为true，默认观察所有属性
  - attributeOldValue: 布尔值，表示MutaionRecord是否记录变化之前的属性值，将这个值设为true也会导致attributes转换为true，默认为false
  - characterData: 布尔值，表示修改字符数据是否触发变化事件，默认false
  - characterDataOldValue: 布尔值，表示MutationRecord是否记录变化之前的字符数据，这个值设为true会将characterData值也转为true，默认false
  - childList: 布尔值，表示修改目标节点的子节点是否触发变化事件，默认false
- 调用observe()时，MutationObserverInit对象中的attribute、characterData、childList必须至少有一项为true（直接设置或者通过设置attributeOldValue等设置）。否则会报错
- MutationObserver可以观察节点属性的添加、移除、修改。为属性注册回调，需要在MutationObserverInit对象中将attributes设为true

```js
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords))
observer.observe(document.body, { attributeFilter: ['foo'] })
document.body.setAttribute('foo', 'bar')
document.body.setAttribute('bar', 'baz')
document.body.setAttribute('baz', 'qux')

// 只记录了foo的属性变化
// [MutationRecord]
```

- 要想在记录中保存属性原来的值，将attributeOldValue属性设为true

```js
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords.map(x => x.oldValue)))
observer.observe(document.body, { attributeOldValue: true })
document.body.setAttribute('foo', 'bar')
document.body.setAttribute('foo', 'baz')
document.body.setAttribute('foo', 'qux')

// [null, "bar", "baz"]
```

- MutationObserver可以观察文本节点（Text、Comment、ProcessingInstruction）中字符串的添加、删除、修改。需要为字符数据注册回调，然后将MutatioObserverInit对象中的characterData属性设置为true

```js
let observer = new MutationObserver((mutationRecord) => console.log(mutationRecord))
document.body.innerText = 'foo'
observer.observe(document.body.firstChild, { characterData: true })

document.body.innerText = 'foo'
document.body.innerText = 'bar'
document.body.innerText = 'baz'

// [MutationRecord, MutationRecord, MutationRecord]
```

- 想要在MutationRecord中保村原始数据可以设置characterDataOldValue为true
- MutationObserver观察子节点

```js
let observer = new MutationObserver((mutationRecord) => console.log(mutationRecord))
document.body.innerText = ''
observer.observe(document.body, { childList: true })
document.body.appendChild(document.createElement('div'))
// [
//   {
//     addedNodes: NodeList [div]
//     attributeName: null
//     attributeNamespace: null
//     nextSibling: null
//     oldValue: null
//     previousSibling: null
//     removedNodes: NodeList []
//     target: body.page-v3.eye-protector-processed
//     type: "childList"
//   }
// ]

let observer = new MutationObserver((mutationRecord) => console.log(mutationRecord))
document.body.innerText = ''
document.body.appendChild(document.createElement('span'))
document.body.appendChild(document.createElement('div'))
observer.observe(document.body, { childList: true })
document.body.insertBefore(document.body.lastChild, document.body.firstChild)

//[MutationRecord, MutationRecord]

```

- 上面进行子节点的交换会发生两次变化，一次是节点被删除，一次是节点被添加
- 将MutationObserverInit对象中的subtree设置为true就能观察节点及其所有子节点

```js
let observer = new MutationObserver((mutationRecord) => console.log(mutationRecord))
document.body.innerText = ''
document.body.appendChild(document.createElement('div'))
observer.observe(document.body, { attributes: true, subtree: true })
document.body.firstChild.setAttribute('foo', 'bar')
// [MutationRecord]
```

- 这里要注意，被观察子树中的节点在被移出子树后仍然能够触发变化事件。
- MutationObserver接口出于性能考虑，核心是异步回调与记录队列模型。为了在大量变化事件发生时不影响性能，每次变化的信息会保存在MutationRecord实例中，然后添加到记录队列，这个队列对每个MutationObserver实例都是唯一的，是所有DOM变化事件的有序列表
- 每次MutationRecord被添加到MutationObserver记录队列时，只有之前没有已排期的微任务回调时，才会将观察者注册的回调作为作为微任务加到任务队列上，这样能保证记录队列的内容不会被回调处理两次
- 在回调的微任务异步执行时，可能发生更多变化事件。因此被调用的回调会接收到一个MutationRecord实例的数组，顺序为它们进入记录队列的顺序。回调负责处理这个数组的没一个实例，函数退出之后这些实现就不存在了，回调执行后，这些MutationRecord就用不到了，记录队列会被清空，内容会被丢弃
- 调用MutationObserver的takeRecords()方法可以清空记录队列，取出并返回所有的MutationRecord实例

```js
let observer = new MutationObserver((mutationRecord) => console.log(mutationRecord))
observer.observe(document.body, { attributes: true })
document.body.className = 'foo'
document.body.className = 'bar'
document.body.className = 'baz'
console.log(observer.takeRecords()) // [MutationRecord, MutationRecord, MutationRecord]
console.log(observer.takeRecords()) // []
```

- 在希望断开与观察目标的联系，但是希望处理由于disconnect而被抛弃的记录队列中的MutationRecord时比较有用

## 性能、垃圾回收

- DOM Level 2中的MutationEvent定义了会在各种DOM变化时触发的事件。由于浏览器的实现机制，接口有严重的性能问题，因此DOM3废弃了这些事件
- 使用MutationObserver将变化回调委托给微任务避免事件同步触发，记录队列可以保证变化事件爆发式的触发时，也不会显著拖慢浏览器，但无论如何，使用MutationObserver都是有代价的
- MutationObserver实例与目标节点是非对称引用，MutationObserver对目标节点是弱引用，所以不会妨碍垃圾回收程序回收节点
- 目标节点对MutationObserver是强引用，如果目标节点从DOM被移除，随后垃圾回收，那关联的MutationObserver实例也被回收
- MutationRecord实例至少包含对已有DOM节点的一个引用。如果变化是childList类型，会包含多个节点的引用。记录队列和回调处理的默认行为是耗尽这个队列，处理每个MutationRecord，然后让它们超出作用域，之后被垃圾回收
- 记录某个观察者的完整变化记录（MutationRecord）时就会保存它们引用的节点，从而妨碍这些节点的回收。如果需要尽快释放内存，建议从每个MutationRecord中抽取有用的信心保存到新对象，然后抛弃MutationRecord