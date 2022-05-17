---
title: "DOM2跟DOM3-命名空间及元素属性"
date: "2021-01-16"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# DOM2跟DOM3-命名空间及元素属性

- DOM1定义了HTML与XML文档的底层结构。DOM2跟DOM3在结构之上加了交互能力，提供了更高级的XML特性。DOM2跟DOM3按照模块化来制定标准，模块间有关联。模式如下
  - DOM Core: 在DOM1核心基础上为节点增加属性和方法
  - DOM Views: 定义基于样式的不同视图
  - DOM EEvents: 定义通过事件实现DOM文档交互
  - DOM Style: 定义以编程方式访问与修改CSS样式
  - DOM Traversal And Range: 新增遍历DOM文档及选择文档内容的接口
  - DOM HTML: 在DOM1HTML部分基础上，增加属性、方法和接口
  - DOM Mutation Observers: 定义基于DOM变化触发回调的接口。这个模块是DOM4级模块，用于取代Mutation Events
- DOM2跟DOM3 COre模块目的是拓展DOM API，满足XML的需求并提供更好的错误处理和特性检测。

## XML命名空间

- XML空间文档可以实现在一个格式规范的文档中混用不同的XML语言，而不必担心元素命名冲突。严格说XML命名空间在XHTML中才支持，HTML不支持，所以需要使用XHTML做势力
- 命名空间是使用xmlns指定的。XHTML的命名空间是"http://www.w3.org/1999/xhtml"，应该包含在任何格式规范的XHTML页面的<html>元素中
<!--more-->
```js
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example XHTML page</title>
  </head>
  <body> Hello World!</body>
</html>
```

- 这里所有元素都默认属于XHTML命名空间，可以使用xmlns给命名空间加一个前缀，格式为"xmlns:前缀"
- 这里为XHTML命名空间定义了一个前缀xhtml，同时所有XHTML元素都要加一个前缀。避免混淆，属性也可以加空间命名前缀

```js
<xhtml:html xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <xhtml:head>
    <xhtml:title>Example XHTML page</xhtml:title>
  </xhtml:head>
  <xhtml:body xhtml:class="home"> Hello World!</xhtml:body>
</xhtml:html>
```

- 这里class属性被加上了xhtml前缀。文档中只有一种XML语言，那就没必要使用空间前缀，只有文档中使用多个XML语言时才有必要

```js
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example XHTML page</title>
  </head>
  <body>
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="width:100%; height: 100%">
      <rect x="0" y="0" width="100" height="100" style="fill:red"></rect>
    </svg>
  </body>
</html>
```

- 这里给svg加了命名空间将其标识为外来元素，这样svg元素及其属性以及它的后代都会认为属于"https://www.w3.org/2000/svg"命名空间。虽然这个文档是XHTML文档，但是命名空间的存在使其SVG代码也有效
- 这样的文档，调用方法与节点交互，就会出现一个问题：创建的元素属于哪个命名空间？查询特定标签名是，结果应包含那个命名空间下的元素？DOM2 Core为解决这个问题，给大部分的DOM1方法提供了特定命名空间的版本
- DOM2中，Node类型包含以下命名空间的属性
  - localName:不包含空间命名前缀的节点名
  - namespaceURI:节点的空间命名URL，未指定就是null
  - prefix:命名空间前缀，未指定就是null
- 使用空间命名前缀下，nodeName等于prefix + ':' + localName

```js
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>Example XHTML page</title>
  </head>
  <body>
    <s:svg xmlns:s="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 100 100" style="width:100%; height: 100%">
      <s:rect x="0" y="0" width="100" height="100" style="fill:red"></s:rect>
    </s:svg>
  </body>
</html>
```

- 上面<html>元素的localName跟tagName都是"html"，namespaceURI是"http://www.w3.org/1999/xhtml"，prefix是null。对<s:svg>元素，localName是"svg"，tagName是"s:svg"，namespaceURI是"https://www.w3.org/2000/svg"，prefix是"s"
- DOM3进一步加强了与命名空间相关的方法
  - isDefaultNamespace(namespaceURI)
  - lookupNamespaceURI(prefix),返回给定prefix的命名空间URI
  - lookupPrefix(namespaceURI)，返回给定namespaceURI的前缀

```js
console.log(document.body.isDefaultNamespace("http://www.w3.org/1999/xhtml")) // true
console.log(svg.lookupPrefix('http://www.w3.org/2000/svg')) // s
console.log(svg.lookupNamespaceURI('s')) // http://www.w3.org/2000/svg
```

- Document的变化
- DOM2在Document类型上新增了下命名空间特定方法
  - createElementNS(namespaceURI, tagName),以指定的tagName创建指定命名空间namespaceURI的元素
  - createAttributeNS(namespaceURL, attributeName),以指定的属性名attributeName创建指定命名空间namespaceURI的一个新属性
  - getElementsByTagNameNS(namespaceURI, tagName),返回指定命名空间namespaceURI中所有标签为tagName的元素的NodeList
- 使用这些方法都要传入相应的命名空间URI(不是命名空间前缀)

```js
let svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
let att = document.createAttributeNS('http://www.somewhere.com', 'random')
let elems = document.getElementsByTagNameNS('http://www.w3.org/1999/xhtml', '*')
```

- 这些特性都只有在文档包含两个以上命名空间时才有用
- DOM2 Core对Element类型的更新主要为属性操作，新增方法如下
  - getAttributeNS(namespaceURI, localName),取得指定命名空间namespaceURI中名为localName的属性
  - getAttributeNodeNS(namespaceURI, localName),取得指定命名空间中名为localName的属性节点
  - getElementsByTagNameNS(namespaceURI,tagName)，取得指定命名空间中tagName为tagName的元素的NodeList
  - hasAttributeNs(namespaceURI, localName),返回布尔值，表示元素中是否有命名空间namespaceURI下名为localName的属性（DOM2 Core也添加了不带命名空间的hasAttribute方法）
  - removeAttributeNS(namespaceURI, localName)，删除指定命名空间namespaceURI中名为localName的属性
  - setAttributeNS(namespaceURI, qualifiedName, value),设置指定命名空间namespaceURI中名为qualifiedName的属性为value
  - setAttributeNodeNS(attNode),为元素设置包含命名空间信息的属性节点attNode
- NamedNodeMap也增加了一下处理命名空间的方法，因为NamedNodeMap主要表示属性，所以这些方法大都适用于属性
  - getNamedItemNS(namespaceURI, localName),取得指定命名空间namespaceURI中名为localName的项
  - removeNamedItemNS(namespaceURI, localName),删除指定命名空间namespaceURI中名为localName的项
  - setNameItemNS(node),为元素添加包含命名空间信息的节点

## 其他变化

- 除了命名空间，DOM2 Core还对DOM其他部分做了更新，这些更新与XML命名空间无关，主要关注DOM API的完整性与可靠性
- DocumentType的变化
- DocumentType新增了3个属性：publicId, systemId和internalSubset。publicId、systemId属性表示文档类型声明中有效但无法使用DOM1 API访问的数据，如下

```js
<!DOCTYPE HTML PUBLIC "-//W3C// DTD HTML 4.01// EN" "http://www.w3.org/TR/html4/strict.dtd" [<!ELEMENT name (#PCDATA)>]>
// 支持DOM2的浏览器可以运行下代码
console.log(document.systemId) // http://www.w3.org/TR/html4/strict.dtd
console.log(document.publicId) // -// W3C// DTD HTML 4.01// EN
console.log(document.internalSubset) // [<!ELEMENT name (#PCDATA)>]
```

- publicId是"-// W3C// DTD HTML 4.01// EN"，而systemId是"http://www.w3.org/TR/html4/strict.dtd"
- internalSubset用于访问文档类型声明中可能包含的额外定义
- Document的变化中唯一跟命名空间无关的方法是importNode()，这个方法目的是从其他文档获取一个节点并导入到新文档，以便将其插入新文档。每个节点都有一个ownerDocument属性，表示所属的文档。如果调用appendChild方法时传入节点的ownerDocument不是指向当前文档，就会报错。调用importNode()导入其他文档的节点会返回一个新节点，这个节点的ownerDocument属性是正确的
- importNode方法跟cloneNode方法类似，也是接受两个参数：要复制的节点和表示是否同时复制子节点的布尔值，返回适合在当前文档中使用的节点

```js
let newNode = document.importNode(oldNode, true)
document.body.appendChild(newNode)
```

- DOM2 View给Document类型增加了新属性defaultView，是一个指向拥有当前文档的窗口（或窗格<frame>）的指针。这个规范中没有明确视图何时可用，因此这是添加的唯一一个属性。defaultView属性得到了除IE8及更早之前版本所有浏览器的支持。IE8及更早版本支持等价的parentWindow属性，Opera也支持这个属性
- DOM2 Core还针对document.implementation对象新增了两个新方法：createDOcumentType()和createDocument()，前者用于创建DocumentType类型的新节点，接受3个参数：文档类型名称、publicId、systemId

```js
let doctype = document.implementation.createDocumentType("html", "-// W3C// DTD HTML 4.01// EN", "http://www.w3.org/TR/html4/strict.dtd")
```

- 已有的文档类型不可变，只有在创建新文档时才能用到，创建新文档要使用createDocument方法，createDocument接受3个参数：文档元素的namespaceURI、文档元素标签名、文档类型

```js
let doctype = document.implementation.createDocumentType("html", "-// W3C// DTD HTML 4.01// EN", "http://www.w3.org/TR/html4/strict.dtd")
let doc = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "root", doctype)
```

- 这里就创建了一个XHTML文档，文档只有html，其他都需要自己添加
- DOM2 HTML模块也为document.implementation对象新增了createHTMLDocument()方法，这个方法可以创建一个完整的HTML文档，包含html、head、title和body元素。只接受一个参数，创建的文档的标题，返回一个新的HTML文档
- DOM3新增了两个用于比较节点的方法：isSameNode()跟isEqualNode()。这两个方法都接收一个节点参数，节点与参考节点相同或相等，就返回true。节点相同，意味着引用同一个对象；节点相等，意味着类型相同，拥有相等的属性，并且attributes和childNodes也相等
- DOM3新增了给DOM节点添加额外数据的方法。setUserData()方法接受3个参数：键、值、处理函数，用于给节点添加数据。

```js
document.body.setUserData('name', 'Nicholas', function(){})
document.body.getUserData('name')
```

- setUserData处理函数会在包含数据的节点被复制、删除、重命名或导入其他文档时执行，可以在这是决定如何处理用户数据。
- 处理函数接收5个参数：表示操作类型的数值(1:复制,2:导入,3:删除,4:重命名)、数据的键、数据的值、源节点和目标节点。删除节点时，源节点时null，除复制外，目标节点都是null

```js
let div = document.createElement('div')
div.setUserData('name', 'Nicholas', function(operation, key, valuem src, dest){
  if(operation === 1) {
    dest.setUserData(key, value, function(){})
  }
})
let newDiv = div.cloneNode(true)
console.log(newDiv.getUserData('name')) // Nicholas
```

- 这样，在第一个div被复制时，就会调用处理函数，然后把对应的数据附加到目标节点。
- DOM2 HTML给HTMLIFrameElement(即<iframe>，内嵌表格)类型新增了一个属性，叫contentDocument。这个属性包含代表子内嵌窗格中内容的document对象的指针

```js
let iframe = document.getElementById('myIframe')
let iframeDoc = iframe.contentDocument
```

- contentDocument属性是Document的事例，拥有所有文档属性和方法。还有一个属性contentWindow，返回相应窗格的window对象，这个对象上有一个document属性。所有现代浏览器都支持contentDocument和contentWindow属性
- 跨源访问子内嵌窗格的document对象会收到安全限制。如果内嵌窗格加载了不同域名（或子域名）的页面，或者该页面使用不同协议，则访问其document对象会报错