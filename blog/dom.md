---
title: "DOM--高程4"
date: "2020-12-28"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# DOM

- 文档对象类型（DOM,Document Object Model）是HTML和XML文档的编程接口。DOM表示由多层节点构成的文档，通过它开发者可以添加、删除、修改页面部分。DOM现在是真正跨平台、语言无关的表示和操作王爷的方式。
- IE8及以下的DOM都是通过COM对象实现的，也就是这些版本中的DOM对象与原生JavaScript具有不同的行为和功能。
- document为每个文档的根节点。根节点的唯一子节点是html，我们成为文档元素(documentElement)，每个文档只能有一个文档元素。HTML页面中，文档元素始终是<html>元素，XML文档中就没有这个限制。
- DOM中有12中节点类型，这些类型都继承一种基本类型。

## Node类型

- DOM Level 1描述了名为Node的接口，这个接口是所有DOM节点类型都必须实现的。Node接口在JavaScript中被实现为Node类型，除IE外的所有浏览器都可以直接访问这个类型。所有节点类型都继承Node类型，因此所有类型都共享相同的基本属性和方法
- 每个节点都有nodeType属性，表示该节点的类型，类型值如下
  - Node.ELEMENT_NODE (1)
  - Node.ATTRIBUTE_NODE (2)
  - NODE.TEXT_NODE (3)
  - NODE.CDATA_SECTION_NODE (4)
  - NODE.ENTITY_REFERENCE_NODE (5)
  - NODE.ENTITY_NODE (6)
  - NODE.PROCESSING_INSTRUCTION_NODE (7)
  - NODE.COMMENT_NODE (8)
  - NODE.DOCUMENT_NODE (9)
  - NODE.DOCUMENT_TYPE_NODE (10)
  - NODE.DOCUMENT_FRAGMENT_NODE (11)
  - NODE.NOTATION_NODE (12)
- 节点类型可以与这些常量对比
<!--more-->
```js
if(someNode.nodeType == NODE.ELEMENT_NODE) {
    console.log("Node is an element")
}
```

- nodeName与nodeValue保存节点的相关信息，使用前最好先检测节点类型，对元素而言，nodeName始终为元素的标签名，nodeValue则为null

```js
if(someNode.nodeType == 1) {
    value = someNode.nodeName // 元素的标签名
}
```

- 每个节点都有一个childNodes属性，包含一个NodeList的实例。NodeList是一个类数组对象那个，用于存储按位置存储的有序节点。
- NodeList是对DOM的查询，DOM的变动会自动在NodeList中反映出来，我们说的NodeList是实时的活动对象，不是第一次访问时所获得内容的快照
- 可以使用中括号或者使用item()方法访问NodeList中的元素

```js
let firstChild = someNode.childNodes[0]
let secondChild = someNode.childNodes.item(1)
```

- 每个节点都有一个parentNode属性，指向DOM树中的父元素。childNodes所有节点都有一个父元素，所以它们的parentNode都指向同一个节点，而且childNodes列表中的每个节点都是其他节点的同胞节点，可以使用previousSibling和nextSibling可以用来在其中导航。列表第一个元素的previousSibling跟最后一个节点的nextSibling属性都是null
- 父节点的firstChild属性与lastChild属性分别指向它的第一个和最后一个子节点。只有一个子节点，firstChild与lastChild指向同一个节点，没有子节点就都是null
- 一个节点可以调用hasChildNodes()返回true说明节点有一个或多个子节点。
- 所有节点都共享的关系。ownerDocument属性是指向整个文档的文档节点的指针。

## 操纵节点

- appendChild()用于在childNodes列表尾部添加节点，并更新相关的关系指针（如firstChild等），返回值为新添加的节点

```js
let returnNode = someNode.appendChild(newNode)
console.log(returnNode === newNode) // true
console.log(someNode.lastChild === newNode) // true
```

- 如果把文档中已经存在的节点传入appendChild中，那这个节点会被移动到新位置。如果传入了这个节点的第一个子节点，那这个子节点就会变成最后一个子节点
- 可以使用insertBefore()将节点放到childNodes中的特定位置，接受两个参数：要插入的节点和参照节点，调用方法后，插入的节点变成参照节点的前一个节点，并被返回，如果参照节点为null，那调用效果与appendChild相同
- replaceChild()接受两个参数：要插入的节点和要替换的节点，要替换的节点会被返回并从文档中移除。
- removeChild()可以移除节点，接收一个参数：要移除的节点，被移除的节点会被返回
- 所有节点类型还共享了两个方法
- cloneNode()会返回一个与节点一样的节点。接收一个参数表示是否深复制。为true时执行深复制，即复制节点与整个子DOM树。为false时只会复制调用该方法的节点。返回的节点属于文档所有，但没有指定父节点，也叫做孤儿节点

```js
<ul>
    <li>item 1</li>
    <li>item 2</li>
    <li>item 3</li>
</ul>

// Mylist保存对上面元素的引用
let deepList = Mylist.cloneNode(true)
console.log(deepList.childNodes.length) // 3
let deepList = Mylist.cloneNode(false)
console.log(deepList.childNodes.length) // 0
```

- cloneNode不会复制添加到DOM节点的JavaScript属性（事件处理程序等），指挥复制HTML属性以及可选的复制子节点。IE在很长时间内会复制事件处理程序，所以推荐在复制前先删除事件处理程序
- 另一个是normalize()方法，唯一的作用就是处理文档子树中的文本节点。由于解析器或者DOM等操作导致出现不包含文本的文本节点或者两个相邻的文本节点。调用normalize()方法后会检测这个节点的所有后代，发现空文本节点就删除，相邻文本节点就合并

## Document类型

- Document类型是JavaScript中表示文档类型的类型。浏览器中，文档对象document是HTMLDocument的实例（HTMLDocument继承Document），表示整个HTML页面。document是window对象的属性，因此是全局对象，有以下特征
  - nodeType等于9
  - nodeName为"#document"
  - nodeValue为null
  - ownerDocument值为null
  - 子节点可以为DocumentType(最多一个)、Element(最多一个)、ProcessingInstruction或Comment类型
- Document类型可以表示HTML页面或其他XML文档，最常用的还是通过HTMLDocument取得document对象，document对象可以用于获取页面信息和操纵其外观和底层结构
- document.documentElement属性始终指向HTML中的html元素
- document.body始终指向body元素
- Document类型另一种可能的子节点DocumentType，<!doctype>标签是文档中独立部分，信息可以通过document.doctype访问
- document.title可用于读写页面的标题
- document.URL包含页面的完整URL
- document.domain获取当前页面的域名
- document.referrer包含链接到当前页面的那个页面的URL，如果当前页面没有来源，那document.referrer包含空字符串。所有这些信息都可以在HTTP头部信息获取。
- 这些属性中只有域名是可设置的，出于安全考虑，给domain设置的值有限制，如果URL包含子域名如p2p.wrox.com，则可以设置为"wrop.com"，不能设置URL中不包含的值。
- 当页面中包含来自不同子域的窗格（<frame>）或内嵌窗格(<iframe>)时，可以设置document.domain来绕过浏览器跨域通信的限制，实现JavaScript通信。在每个页面上把document.domain设置为相同的值，那就可以互相访问对方的JavaScript对象了。比如，一个加载自www.wrox.com的页面包含内嵌窗格，其中页面加载自p2p.wrox.com。两个页面的document.domain包含不同的字符串，内部与外部不能相互访问。要是把document.domain都设为wrox.com后就可以通信了
- 浏览器对domain还有一个限制，将document.domain设置为"wrox.com"后就不能设置回"p2p.wrox.com"

## 定位元素

- document.getElementById()接收一个参数，获取元素的id，找到了返回元素，没找到返回null，参数区分大小写，有多个相同id时返回文档中出现的第一个元素
- document.getElementsByTagName()接收一个元素的标签名，返回包含一个或多个元素的NodeList。在HTML文档中，返回一个HTMLCollection对象，也是一个实时列表。可以使用中括号或者item()方法取值。
- HTMLCollection对象有一个额外的方法namedItem()，可通过标签的name取得某一项的引用。比如
- 对于name属性的元素，也可以直接通过中括号来获取

```js
<img src="a.gif" name="myImage"/>

let images = document.getElementsByTagName('img')
let myImage = images.namedItem('myImage')
let myImage = images['myImage']
```

- 对HTMLCollection对象，中括号可接受数值索引，也可以接受字符串索引，在后台，数值索引会调用item()，字符串索引调用namedItem()
- 匹配所有元素可以传入*
- document.getElementsByName()接收一个字符串，返回具有给定name属性的元素
- document对象还暴露了几个特殊集合，这些集合也都是HTMLCollection的实例，如下
  - document.authors包含文档中所有带name属性的<a>元素
  - document.applets包含文档中的所有<applet>元素（applet元素不推荐使用，所以集合已经废弃）
  - document.forms包含文档中的所有<form>元素
  - document.images包含文档中的所有<img>元素
  - document.links包含文档中的所有带href属性的<a>元素
- 这些特殊集合都存在与HTMLDocument对象上，内容也都是实时更新的

## DOM兼容性测试

- 由于DOM有多个Level和多个部分，所以需要确定浏览器实现了哪些DOM。
- document.implementation属性是一个对象，提供了浏览器DOM实现的信息与能力。DOM Level 1在document.implementation只定义了一个方法hasFeature()，接受两个参数：特性名称和DOM版本。如果浏览器支持特性和版本就返回true

```js
let hasXmlDom = document.implementation.hasFeature('XML', '1.0')
```

- 可以用hasFeature()方法检测的特性及版本如下
  - Core: 1.0、2.0、3.0，定义属性文档结构的基本DOM
  - XML: 1.0、2.0、3.0,Core的XML拓展，增加了对CDATA区块、处理指令和实体的支持
  - HTML: 1.0、2.0，XML的HTML拓展，增加了HTML特定的元素和实体
  - Views: 2.0，文档基于某些样式的实现格式
  - StyleSheets: 2.0，文档的相关样式表
  - CSS: 2.0，Cascading Style Sheets Level 1
  - CSS2: 2.0，Cascading Style Sheets Level 1
  - Events: 2.0、3.0， 通用DOM事件
  - UIEvents: 2.0、3.0，用户界面事件
  - TextEvents: 3.0，文本输入设备触发的事件
  - MouseEvents: 2.0、3.0，鼠标触发的事件
  - MutationEvents: 2.0、3.0，DOM树变化时触发的事件
  - MutationNameEvents: 3.0，DOM元素或元素属性被重命名时触发的事件
  - HTMLEvents: 2.0，HTML 4.01事件
  - Range: 2.0，在DOM树中操作一定范围的对象和方法
  - Traversal: 2.0，遍历DOM树的方法
  - LS:3.0，文件与DOM树之间的同步加载与保存
  - LS-Async: 3.0，文件与DOM树之间的异步加载与保存
  - Validation: 3.0，修改DOM树并保证其继续有效的方法
  - XPath: 3.0，访问XML文档不同部分的语言
- 由于实现不一致，hasFeature()返回值并不可靠，方法现在已经被废弃。为了向后兼容，目前主流浏览器仍然支持这个方法，但不论检测什么都返回true

## 文档写入

- document对象早期留存了一个可以向网页输出流写入内容的能力。对应方法：write()、writeln()、open()、close()。
- write与writeln都接受一个字符串参数，可将此字符串写入网页中，write只是写入，writeln写入后还会在字符串尾部加一个换行符。

```js
document.write("<strong>" + (new Date()).toStirng() + '</strong>')
```

- write写入html标签时要注意对字符串的转义
- write在页面加载完成后调用会重写整个页面
- open跟close方法用于打开和关闭网页输出流。
- 严格的XHTML文档不支持文档写入。对于内容类型为 application/xml+xhtml的页面，这些方法无用

## Element类型

- Element表示XML或HTML元素，对外暴露访问元素标签名、子节点和属性的能力，特征如下
  - nodeType为1
  - nodeName值为元素的标签名
  - nodeValue为null
  - parentNode值为Document或Element对象
- 子节点可以使Element、Text、Comment、ProcessingInstruction、CDATASection、EntityReference类型
- 通过nodeName或tagName获取元素的标签名，两个属性返回同样的值
- HTML中，元素标签名始终以全大写表示；在XML（XHTML）中，标签名始终与源代码中的一致。所以在比较时最好将签名转为小写模式
- 所有HTML元素都通过HTMLElement类型表示，包括直接实例跟间接实例。HTMLElement直接继承Element并增加了下列属性之一，它们是所有HTML元素上都有的标准属性
  - id，元素在文档中的唯一标识符
  - title: 元素的额外信息，一般以提示条形式展示
  - lang: 元素内容的语言代码
  - dir:语言的书写方向（"ltr"表示左到右，"rtl"表示右到左）
  - className: 相当于class属性，用于指定元素的CSS类（class为关键字，不能直接用）
- 每个元素都有零个或多个属性，与属性相关的DOM方法主要有下三个
- getAttribute()、setAttribute()、removeAttribute()

```js
let div = document.getElementById('myDiv')

console.log(div.getAttribute('id'))
console.log(div.getAttribute('class'))
```

- 这里传给getAttribute的属性名与实际的属性名是一致的，所以这里传class而不是className，如果属性不存在，返回null
- getAttribute可以获取自定义的属性，在html5规范中，自定义属性名前缀应该是data-的形式
- 元素的所有属性也可以通过相应DOM元素对象的属性来获取。包括HTMLElement上得直接映射对象和所有公认的属性（不包括自定义属性）
- 通过DOM对象访问的属性中有两个属性的返回值跟使用getAttribute获取到的值不一致
  - 一个是style属性，使用getAttribute获取到的是字符串，通过DOM访问到的是一个（CSSStyleDeclaration）对象。
  - 第二个属性是事件处理程序，比如onclick，在元素上使用事件属性时，属性值是一段JavaScript代码。使用getAttribute获取到的是字符串形式的源码；通过DOM对象的属性访问事件属性时返回的是一个JavaScript函数。这是因为onclick等事件属性是可以接收函数值的
- 考虑到上面的差异，开发者一般都会放弃使用getAttribute来获取值，只使用对象属性。getAttribute主要用来获取自定义属性的值。
- setAttribute接收两个参数：要设置的属性名及属性值。属性值已存在会替换原来的值，属性不存在，就会以指定的值进行创建
- 使用setAttribute设置的属性名会规范为小写形式，所以"ID"会变成"id"
- 在DOM对象上设置自定义属性，不会自动让它变成元素的属性

```js
div.mycolor = 'red'
console.log(div.getAttribute('mycolor')) // null
```

- removeAttribute用于从元素中删除属性，将整个属性完全从元素中去掉
- Element是唯一使用attributes属性的DOM节点类型，attributes属性包含一个NamedNodeMap实例，是一个实时的集合。元素的每个属性都表现为一个Attr节点，并保存在这个NamedNodeMap对象中，NamedNodeMap对象包含下方法
  - getNamedItem(name)， 返回nodeName属性等于name的节点
  - removeNamedItem(name)，删除nodeName属性等于name的节点
  - setNamedItem(node)，向列表中添加node节点，以其nodeName作为索引
  - item(pos)，返回索引pos处的节点
- attributes属性中的每个节点的nodeName是对应属性的名字，nodeValue是属性的值。比如要取元素id属性的值

```js
let id = element.attributes.getNamedItem('id').nodeValue

// 中括号简写
let id = element.attributes['id'].nodeValue
element.attribute['id'].nodeValue = 'someOtherId'
element.attributes.removeNamedItem('id')
```

- 可以使用createElement()方法创建新元素，接收一个参数，即要创建的元素的标签名，使用createElement的同时也会把ownerDocument属性设为document
- 元素可以拥有任意多个子元素和后代元素，childNodes包含元素所有的子节点，可能是其他元素、文本节点、注释或处理命令

```js
<ul>
  <li>Item 1</li>
  <li>Item 2</li>
  <li>Item 3</li>
</ul>

<ul><li>Item 1</li><li>Item 2</li><li>Item 3</li></ul>
```

- 不同浏览器识别上面的节点时有不同的差异，有些浏览器会返回七个子节点，三个li元素，4个Text节点，要是下面的格式，就统一返回一样的3个节点数。
- 所以这种情况下我们会先检查一下节点的nodeType，在执行操作

```js
for (let i = 0; i < element.childNodes.length; i++) {
  if(element.childNodes[i].nodeType === 1) {}
}
```

- 要取得某个元素的子节点可以在元素上调用getElementsByTagName()方法，跟在document上的调用形式是一致的，只不过搜索范围变成了当前节点下

## Text类型

- Text节点由Text类型表示，包含按字面展示的纯文本，也有可能是转义后的HTML字符串，但不含有HTML代码
  - nodeType为3
  - nodeName为"#text"
  - nodeValue值为节点中包含的文本
  - parentNode值为Element对象
  - 不支持子节点
- Text节点中的文本可以用nodeValue访问，也可以通过data属性访问，修改任意一个值都会反映到另一个值上面，暴露了以下方法
  - appendData(text)，向节点末尾加text
  - deleteData(offset, count),从offset位置删除count个字符
  - insertData(offset, text)，从offset位置插入text
  - replaceData(offset, count, text)，用text文本替换从位置offset到offset + count位置的文本
  - splitText(offset)，在offset位置将文本拆为两个节点
  - substringData(offset, count)，提取从offset到offset + count的文本
  - 还可以通过length获取文本节点中包含的字符数量
- 默认情况下，包含文本内容的每个元素最多只能有一个文本节点
- 修改文本值时注意HTML或XML代码会被转为实体编码，即小于号、大于号或引号会被转义，如下

```js
div.firstChild.nodeValue = "some <strong>other</strong> message"
// 输出为 "some &lt;strong&gt;other&lt;/strong&gt;message"

```

- document.createTextNode()可以用来创建文本节点，接受一个参数，就是要插入节点的文本，跟上面的规则一样，这些要插入的值也会被转义

## Comment类型

- DOM中的注释通过Comment类型实现，特征如下
  - nodeType为8
  - nodeName值为"#comment"
  - nodeValue的值为注释的内容
  - parentNode值为Document或者Element对象
  - 不支持子节点
- Comment类型与Text类型继承自同一个基类(CharacterData)，所以有除了splitText方法外的所有Text节点操作字符串方法
- 可以使用createComment方法创造注释节点，参数为注释文本

## CDATASection类型

- CDATASection类型表示XML中特有的CDATA区块。CDATASection类型继承Text类型，因此有包括splitText方法在内的所有字符串操作方法，特点如下
  - nodeType为4
  - nodeName为"#cdata-section"
  - nodeValue值为CDATA区块的内容
  - parentNode值为Document或Element对象
  - 不支持子节点
- CDATA只会在XML文档中有效，有些旧的浏览器会将CDATA区块解析为Comment或Element

```js
<div id="myDiv"><![CDATA[This is some conent.]]></div>
```

- 这里div的第一个子节点应该是CDATASection节点，但主流的浏览器没有一个将其识别为CDATASection。在有效的XHTML文档中，这些浏览器也不能恰当的支持嵌入的CDATA区块

## DocumentType类型

- DocumentType类型的节点包含文档的文档类型(doctype)信息，特征如下
  - nodeType为10
  - nodeName值为文档类型的名称
  - nodeValue值为null
  - parentNode值为Document对象
  - 不支持子节点
- DocumentType在DOM Level 1中不支持动态创建，只能在解析文档时创建。对于支持此类型的浏览器，DocumentType对象保存在document.doctype中
- DOM Level 1规定了DocumentType类型的三个属性：name、entities、notations。
  - name为文档类型的名称
  - entities是文档类型描述的实体的NamedNodeMap
  - notations是文档类型描述的表示法的NamedNodeMap。
- 因为浏览器中文档类型通常为HTML或者XHTML类型，所以entities跟notations列表为空
- 所以只有name属性是有用的，这个属性包含文档类型的名称，即紧跟<!DOCTYPE 后面的文本

```js
<!DOCTYPE HTML PUBLIC "-//W3C// DTD HTML 4.01// EN" "http:// www.w3.org/TR/html4/strict.dtd">
console.log(document.doctype.name)  // 'html'
```

## DocumentFragment类型

- DocumentFragment类型是唯一在标记中没有对应表示的类型。DOM将文档片段定义为"轻量级"文档，能够包含和操作节点，却没有完整文档那样的消耗，特点如下
  - NodeType为11
  - nodeName值为"#document-fragment"
  - nodeValue值为null
  - parentNode值为null
  - 子节点可以是Element、ProcessingInstruction、Comment、Text、CDATASection或EntityReference
- 不能直接将文档碎片添加到文档。文档碎片充当其他要被添加到文档的节点的仓库。
- 可以使用document.createDocumentFragment()方法创建文档
- 文档类型从Node继承了所有文档类型具备的可以执行DOM操作的方法。如果文档中一个节点被添加到文档片段，那该节点会从文档树删除，不在被渲染
- 添加到文档片段的新节点也不属于文档数，也不会被渲染，可以使用appendChild方法将文档片段内容添加到文档，将文档片段当做参数传给这些方法时，文档片段的所有子节点都会被添加到文档数

```js
let fragment = document.createDocumentFragment()
for(let i = 0; i < 3; i++){
  let li = document.createElement('li')
  li.appendChild(document.createTextNode(`Item ${ i }`))
  fragment.appendChild(li)
}
document.body.appendChild(fragment)
```

## Attr类型

- 元素数据在DOM中通过Attr类型表示。Attr类型构造函数和原型在所有浏览器都可以直接访问。技术上来说，属性是存在于元素attributes属性中的节点，特征如下
  - nodeType为2
  - nodeName等于属性名
  - nodeValue为属性值
  - parentNode值为null
  - HTML中不支持子节点
  - XML中子节点可以是Text或EntityReference
- 属性节点虽然是节点，但不被认为是DOM文档树的一部分，Attr节点很少被直接引用，一般更喜欢getAttribute、removeAttribute、setAttribute方法
- Attr对象有三个属性：name、value和specified。name包含属性名，value包含属性值，specified是布尔值，表示属性使用的是默认值还是指定值
- 可以使用document.createAttribute()方法创建新的Attr节点，参数为属性名。
  
```js
let attr = document.createAttribute('align')
attr.value = 'left'
element.setAttributeNode(attr)

console.log(element.attributes['align']) // left
console.log(element.attributeNode('align').value)  // left
console.log(element.getAttribute('align')) // left
```