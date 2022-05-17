---
title: "DOM2跟DOM3-DOM范围"
date: "2021-01-19"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# DOM2跟DOM3-DOM范围

- DOM2 Traversal and Range 模块定义了范围接口。范围可用于在文档中选择内容，而不用考虑节点之间的接线。
- DOM2 在Document类型上定义了createRange()方法，暴露在document对象上。可用此方法创建一个DOM范围对象

```js
let range = document.createRange()
```

- 这个创建的范围对象关联到创建它的文档，不能在其他文档使用。
- 每个范围都是Range类型的实例，拥有相应的方法与属性。
  - startContainer，范围起点躲在的节点（选区中第一个子节点的父节点）
  - startOffset，范围起点在startContainer中的偏移量。如果startContainer是文本节点、注释节点或CData节点，则startOffset指范围起点之前跳过的字符数；否则表示范围中第一个节点的索引
  - endContainer，范围终点所在的节点（选区中最后一个子节点的父节点）
  - endOffset，范围终点在startContainer中的偏移量
  - commonAncestorContainer，文档中以startContainer和endContainer为后代的最深的节点
- 这些属性在范围放到文档中特定位置时获得相应的值
- selectNode()与selectNodeContents()方法可用于选中文档中的某个部分，接收一个节点为参数，并将该节点信息添加到调用它的范围。selectNode选择整个节点，包括后代节点，selectNodeContents只选择节点的后代
<!--more-->
```js
<!DOCTYPE html>
<html lang="en">
<body>
  <p id="p1"><b>Hello</b> world</p>
</body>
</html>

let range1 = document.createRange()
let range2 = document.createRange()
let p1 = document.getElementById('p1')
range1.selectNode(p1)
range2.selectNodeContonts(p1)
```

- selectNode时，startContainer、endContainer和commonAncestorContainer都等于传入节点的父节点，startOffset等于传入接点在父节点childNodes集合中的索引（这里startOffset等于1，DOM合规把空格当成文本节点），而endOffset等于startOffset + 1
- selectNodeContents是，startContainer、endContainer、commonAncestorContainer是传入的节点。startOffset始终为0，因为范围从传入节点的第一个子节点开始，而endOffset等于传入节点的子节点数量（node.childNodes.length），这里等于2
- 像上面一样选中节点后，可以使用下方法实现更准确地控制
  - setStartBefore(refNode)，把范围的起点设置到refNode之前，让refNode称为选区的第一个子节点。startContainer属性设置为refNode.parentNode，而startOffset设置为refNode在父元素中的索引
  - setStartAfter(refNode)，把范围起点设置到refNode之后，让refNode排除在选区之外，让它的下一个同胞节点成为选区的第一个子节点。startContainer设置为refNode.parentNode，startOffset设置为refNode在其父节点childNode中的索引加一
  - setEndBefore(refNode)，将范围终点设置到refNode之前，让refNode排除在选区外，让它上一个同胞节点变成选区最后一个子节点。endContainer设置为refNode.parentNode，endOffset设置为refNode在其父元素childNodes中的索引
  - setEndAfter(refNode)，把范围的终点设置到refNode之后，让refNode称为选区的最后一个子节点。endContainer属性设置为refNode.parentNode，而startOffset设置为refNode在父元素中的索引+1
- 调用这些方法，所有的属性都会自动重新赋值。
- setStart()与setEnd()方法都接受两个参数：参照节点与偏移量。setStart，参照节点会成为startContainer，偏移量成为startOffset。setEnd中，参照节点成为endContainer，偏移量赋值给endOffset。可以使用这两个方法模拟selectNode与selectNodeContents方法

```js
let range1 = document.createRange()
let range2 = document.createRange()
let p1 = document.getElementById('p1')
let p1Index = -1
let i
let len
for(let i = 0, len = p1.parentNode.childNodes.length; i < len; ++i) {
  if(p1.parentNode.childNode[i] === p1){
    p1Index = i
    break
  }
}
range1.setStart(p1.parentNode, p1Index)
range1.setEnd(p1.parentNode, pIndex + 1)
range2.setStart(p1, 0)
range2.setEnd(p1, p1.childNodes.length)
```

- 选中节点必须先确定节点在父元素中的索引。选择节点的内容就不许要这样计算了
- setStart与setEnd真正的能力还是选取节点中的某个部分，假设我们想从前面案例中选中"Hello"中的"llo"到" world"中的"o"部分。如下

```js
let p1 = document.getElementById('p1')
let helloNode = p1.firstChild.firstChild
let worldNode = p1.lastChild
let range = document.createRange()
range.setStart(helloNode, 2)
range.setEnd(worldNode, 3)
```

- 因为起点在"Hello"中的字母"e"之后，所以给setStart传入helloNode跟偏移量2。设置选区终点，给setEnd传入worldNode和偏移量3
- 因为helloNode与worldNode都是文本节点，所以会成为范围的startContainer与endContainer，这样startOffset与endOffset实际上表示每个节点中文本字符的位置，而不是子节点的位置（传入元素节点时的情形）。而commonAncestorContainer是<p>元素，包含这两个节点的第一个祖先节点
- 创建范围后，浏览器在内部会创建一个文档片段节点，用于包含选区中的节点。为操作的内容，选区中的内容必须格式完好，前面的例子中，并不是完好的DOM结构，所以无法在DOM中表示。范围能够确认缺失的开始与结束标签，从而重构出有效的DOM结构
- 上面的例子中，范围发现缺少开始<b>与结束<b>，就会自动补齐，就成了

```js
<p><b>He</b><b>llo</b> world</p>
```

- 并且world也会被拆成两个文本节点
- 创建完范围，可以使用方法来操作范围内容（范围对应文档片段中的所有节点，都是文档中响应节点的指针）
- 第一个方法deleteContents()，会从文档中删除范围包含的节点

```js
let p1 = document.getElementById('p1')
let helloNode = p1.firstChild.firstChild
let worldNode = p1.lastChild
let range = document.createRange()
range.setStart(helloNode, 2)
range.setEnd(worldNode, 3)
range.deleteContents()

// 执行后，页面变成
<p><b>He</b>rld</p>
```

- extractContents()与deleteContents类似，也会从文档中移除范围选区，不同点是，extractContents()返回范围对应的文档片段，这样就可以将范围中的内容插入其他地方

```js
let p1 = document.getElementById('p1')
let helloNode = p1.firstChild.firstChild
let worldNode = p1.lastChild
let range = document.createRange()
range.setStart(helloNode, 2)
range.setEnd(worldNode, 3)

let fragment = range.extractContents()
p1.parentNode.appendChilld(fragment)
// 执行后，页面变成，因为文档片段传给appendChild时只会添加子树，不包含片段本身
<p><b>He</b>rld</p>
<b>llo</b> wo
```

- 不想把范围从文档删除，可以使用cloneContents()创建一个副本，然后再把副本插入

```js
let p1 = document.getElementById('p1')
let helloNode = p1.firstChild.firstChild
let worldNode = p1.lastChild
let range = document.createRange()
range.setStart(helloNode, 2)
range.setEnd(worldNode, 3)

let fragment = range.cloneContents()
p1.parentNode.appendChilld(fragment)
// 执行后，页面变成，因为文档片段传给appendChild时只会添加子树，不包含片段本身
<p><b>Hello</b> world</p>
<b>llo</b> wo
```

- insertNode方法可以向范围选区的开始位置插入一个节点

```js
let p1 = document.getElementById('p1')
let helloNode = p1.firstChild.firstChild
let worldNode = p1.lastChild
let range = document.createRange()
range.setStart(helloNode, 2)
range.setEnd(worldNode, 3)

let span = document.createElement("span")
span.style.color = 'red'
span.appendChild(document.createTextNode('Inserted text'))
range.insertNode(span)

// 运行得到，span刚好插入到"llo"之前
<p><b>He<span style="color: red">Inserted text</span>llo</b> world</p>
```

- 原始的HTML并没有添加或删除<b>元素，并没有使用之前提到的管理方法。利用这个方法可以插入有用的信息，比如在外链插入一个小图标
- surroundContents()插入包含范围的内容，接受一个参数，既包含范围的节点，调用方法后，后台执行操作
  - 提取范围内容
  - 在原始文档中范围之前所在位置插入给定的节点
  - 将范围对应文档片段的内容添加到给定节点
- 这个适合在网页中高亮显示某些关键字，比如

```js
let p1 = document.getElementById('p1')
let helloNode = p1.firstChild.firstChild
let worldNode = p1.lastChild
let range = document.createRange()
range.selectNode(helloNode)
let span = document.createElement("span")
span.style.backgroundColor = "yellow"
range.surroundContents(span)

// 运行后
<p><b><span style="background-color: yellow">Hello</span></b> world</p>
```

- 为了插入<span>元素，范围中必须包含完整DOM结构。如果范围中包含部分选择的非文节点，操作会失败并报错。如果给定的节点是Document、DocumentType或DocumentFragment类型，也会报错
- 如果范围并没有选择文档的任何部分，则称为折叠。折叠范围类似于文本框：如果文本框有文本，那可以用鼠标选中以亮度显示全部文本。这时候再点击鼠标，选区会移除，光标落在两个字符中间。折叠范围时，位置会设置为范围与文档交界的地方，可能是范围选区的开始，也可能是结尾
- 折叠范围可以用collapse()方法，接受一个参数：布尔值，表示折叠到哪一端。true表示折叠到起点，false表示折叠到终点。要确定是否被折叠，检测collapsed属性

```js
range.collapse(true)
console.log(range.collapsed) // true
```

- 测试范围是否能折叠，可以确定范围中的两个节点是否相邻

```js
<p id="p1"></p><p id="p2"></p>

// 这里假如我们不知道标记的结构
let p1 = document.getElementById('p1')
let p2 = document.getElementById('p2')
let range = document.createRange()
range.setStartAfter(p1)
range.setStartBefore(p2)
console.log(range.collapsed) // true
```

- 如果有多个范围，可以用compareBoundarPoints()确定范围是否有公共边界。接收两个参数：要比较的范围和一个常量值，表示要比较的方式，常量值如下
  - Range.START_TO_START(0),比较两个范围的起点
  - Range.START_TO_END(1)，比较第一个范围的起点和第二个范围的终点
  - Range.END_TO_END(2)，比较两个范围的终点
  - Range.END_TO_START(3)，比较第一个范围的终点和第二个范围的起点
- 此方法在第一个范围的边界点位于第二个范围的边界点之前返回-1，在两个范围的边界点相等返回0，在第一个范围的边界点位于第一个边界点之后返回1

```js
let range1 = document.createRange()
let range2 = document.createRange()
let p1 = document.getElementById('p1')
range1.selectNodeContents(p1)
range2.selectNodeContents(p1)
range2.setEndBefore(p1.lastChild)
console.log(range1.compareBoundaryPoints(Range.START_TO_START, range2)) // 0
console.log(range1.compareBoundaryPoints(Range.END_TO_END, range2)) // 1
```

- 调用范围的cloneRange()可以复制范围。这个方法会创建调用它的范围的副本

```js
let newRange = range.cloneRange()
```

- 新范围包含与原始范围相同的属性，修改边界值不会影响原始范围
- 使用完范围后，最好调用detach()方法将范围从创建它的文档中剥离。调用detach()后，就可以放心解除对范围的引用，以便垃圾回收程序释放它所占用的内存

```js
range.detach()
range = null
```

- 这样就合理的结束了范围的使用