---
title: "DOM拓展"
date: "2021-01-08"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# DOM拓展

## Selectors API

- jQuery可以根据CSS选择符查询获取DOM元素，所以Selector API规定了浏览器原生支持的CSS查询API
- Selector API Level 1核心方法是 querySelector()跟querySelectorAll()，兼容浏览器中，Document类型跟Element类型的实例都会暴露这两个方法
- Selector API Level 2在Element类型上新增了matches()、find()、findAll()等方法，目前还没有浏览器实现find()跟findAll()
- querySelector()接收CSS选择符，返回匹配该模式的第一个后代元素，没有匹配项就返回null

```js
let body = document.querySelector('body')
let div = document.querySelector('#div')
let img = document.querySelector('img.button')
```

- 在Document上使用querySelector会从文档元素开始搜索，在Element元素上使用会从当前元素的后代开始查询
- 查询的CSS繁琐度由用户决定，如果选择符有错误或碰到不支持的选择符，querySelector会抛错
- querySelectorAll()跟querySelector接收参数一致，但是会返回所有的匹配项，返回的是NodeList的静态实例，也就是只是静态的快照，不是实时的查询，这么做是为了避免NodeList可能造成的性能问题
- 用有效的CSS选择符调用该方法都会返回NodeList，无论匹配多少个，没有匹配项，返回空NodeList实例

```js
let ems = document.getElementById('div').querySelectorAll('em')
let selecteds = document.querySelectorAll('.selected')
let strongs = document.querySelectorAll('p strong')
```

- 返回的NodeList可以通过for-of循环，item()方法或中括号取得个别元素
<!--more-->
```js
let strongElement = document.querySelectorAll('strong')
// 下面的三种循环效果一样
for(let strong of strongElement) {
  strong.className = 'important'
}
for(let i = 0; i < strongElement.length; ++i) {
  strongElement.item(i).className = 'important'
}
for(let i = 0; i < strongElement.length; ++i) {
  strongElement[i].className = 'important'
}
```

- 跟querySelector方法一样，碰到不支持的或者错的选择符会报错

## matches()

- matches()方法（规范中叫matchesSelector()）接受一个CSS选择符，如果元素匹配该选择符，返回true，否则返回false

```js
if(document.body.matches('body.page1')) {
  // true
}
```

- 这个方法可以方便的检测元素会不会被querySelector或querySelectorAll()返回
- 所有主流浏览器都支持matches()。Egde、Chrome、Firefox、Safari和Opera完全支持，IE9-11及移动浏览器支持带前缀的方法
- IE9之前的版本不会把元素键的空格当成空白节点，其他浏览器会。导致了childNodes跟firstChild等属性的差异，为了弥补这个差异，W3C通过新的Element Traversal规范定义了一组新属性
- Element TraversalAPI为DOM添加了5个属性
  - childElementCount，返回子节点数量（不包含文本节点和注释）
  - firstElementChild，指向第一个Element类型的子元素
  - lastElementChild，指向最后一个Element类型的子元素
  - previousElementSibling，指向前一个Element类型的同胞元素
  - nextElementSibling，指向后一个Element类型的同胞元素
- 在支持的浏览器中，所有DOM都会有这些属性，这样就不会担心空白蚊子节点的问题
- 比如以前跨浏览器遍历元素特定所有子元素，代码如下

```js
let parentElement = document.getElementById('parent')
let currentChildNode = parentElement.firstChild
while(currentChildNode) {
  if(currentChildNode.nodeType === 1) {
    processChild(currentChildNode)
  }
  if(currentChildeNode === parentElement.lastChild){
    break
  }
  currentChildNode = currentChildNode.nextSibling
}
```

- 使用Element Traversal后，代码如下

```js
let parentElement = document.getElementById('parent')
let currentChildElement = parentElement.firstElementChild
while(currentChildElement) {
  process(currentChildElement)
  if(currentChildElement == parentElement.lastElementChild) {
    break
  }
  currentCHildElement = currentChildElement.nextElementSibling
}
```

- IE9及以上版本，以及所有现代浏览器都支持Element Traversal属性

## HTML5

- HTML5规范包括了与标记有关的JavaScript API定义，有的API与DOM重合，定义了浏览器应该提供的DOM扩展
- CSS类拓展，新增了下特性方便使用CSS类
- getElementsByClassName()，是HTML5新增的最受欢迎的方法，暴露在document对象及所有HTML元素上，提供了性能更好地原生实现
- 该方法接受一个参数，既包含一个或多个类名的字符串，返回类名中包含对应类的元素的NodeList。提供了多个类名，顺序就无所谓了

```js
let allCurrentUsernames = document.getElementsByClassName('username current')
let selected = docuement.getElementById('myDiv').getElementsByClassName('selected')
```

- 该方法返回以调用它的对象为根元素的子树中所有匹配的元素
- 因为返回的是NodeList，所以会有跟getElementsByTagName还有其他返回的NodeList对象的DOM方法同样的问题 （DOM节点是实时查询的，可能出现死循环）
- IE9及以上浏览器及所有现代浏览器都支持getElementsByClassName方法
- 操作类名可以使用className属性实现添加、删除和替换。由于它是一个字符串，所以操作完都要重新设置这个值，如下

```js
<div class="bd user disabled"></div>
// 删除user类
let targetClass = 'user'
let classNames = div.className.split(/\s+/)
let idx = classNames.indexOf(targetClass)
if(idx > -1) {
  classNames.splice(i, 1)
}
div.className = classNames.join(' ')
```

- 这里就是对类名字符串做操作的步骤，替换跟检测类名也要有类似的操作
- 所以classList提供了更安全简单地实现方式，classList是一个新的集合类型DOMTokenList的实例。DOMTokenList也有length属性标识自己多少项，也能通过item()或中括号取得个别元素，DOMTokenList还增加了以下方法
  - add(value)，向类名中添加指定的字符串值value，若已经存在就什么都不做
  - contains(value)，返回布尔值，表示指定的value是否存在
  - remove(value)，从类名列表中删除指定的字符串值
  - toggle(value)，如果类名中存在就删除，不存在就添加

```js
// 上面的删除一行代码就可以
div.classList.remove('user')
if(div.classList.contains('bd') && !div.classList.contains(disbaled)) {
  // 操作
}
for(let class of div.classList) {
  doStuff(class)
}
```

- 添加了classList属性后，除非完全删除或完全重写class属性，否则就不再使用className属性了。IE10及以上版本（部分）跟主流浏览器（全部）都实现了classList属性
- HTML5新增了辅助DOM焦点管理的功能，document.activeElement始终包含当前拥有焦点的元素

```js
let button = document.getElementById('btn')
button.focus()
console.log(document.activeElement === button)
```

- 默认情况下，页面加载完成时document.activeElement设置为document.body。页面加载完成之前，document.activeElement是null
- document.hasFocus()方法，该方法返回布尔值，表示文档是否拥有焦点

```js
let button = document.getElementById('btn')
button.focus()
console.log(document.hasFocus()) // true
```

- 确定文档是否获取焦点，就可以帮助确定用户是否在操作界面
- HTML5拓展了HTMLDocument类型，增加了以下功能
- readyState是IE4早期添加到document对象上的属性，document.readyState属性有两个可能的值
  - loading，文档正在加载
  - complete，文档加载完成
- 开发中，最好将document.readyState当做指示器，判断文档是否加载完成，在这个属性得到支持之前，需要使用onLoad来添加标记，表示加载完成了

```js
if(document.readyState === 'complete') {
  // 操作
}
```

- IE6提供了以标准或混杂模式渲染页面的功能后，检测页面渲染模式就是一个必要的需求。IE为document添加了compatMode属性，该属性唯一的作用就是指示当前浏览器出于什么渲染模式下
- 标准模式下，document.compatMode值时"CSS1Compat"，混杂模式下值为"BackCompet"

```js
if(document.competMode === 'CSS1Compat') {
  console.log('standard mode')
} else {
  console.log('quirk mode')
}

```

- 新增了document.head属性指向文档的head元素
- HTML5新增了characterSet属性来表示文档实际使用的字符集，也可以用来指定新的字符集。默认值是"UTF-16"，可以通过\<meta>元素或响应头，以及新增的characterSet属性来修改

```js
let head = document.head
console.log(document.characterSet) // 'UTF-16'
document.characterSet = 'UTF-8'
```

- HTML5允许给元素指定非标准的属性，但是要用data-前缀告诉浏览器，这些属性不包含预渲染有关的信息，也不包含元素的语义信息。除了前缀，没有限制
- 定义了自定义数据后，可以通过元素的dataset属性来访问。dataset属性是一个DOMStringMap实例，包含键值对映射
- 元素的每个data-name的属性在dataset中都可以通过data-后面的字符串作为键来访问（例如，属性data-myName、data-myname可以通过myname访问，注意：data-my-name、data-My-Name要通过myName来访问）

```js
<div id="myDiv" data-appId="123" data-myname="Nicholas" data-my-data="23"></div>
let div = document.getElementById('myDiv')
console.log(div.dataset.appId) // undefined
console.log(div.dataset.appid) // 123
console.log(div.dataset.myname) // Nicholas
console.log(div.dataset.myName) // undefined
console.log(div.dataset.mydata) // undefined
console.log(div.dataset.myDame) // 23
```

- DOM提供了便利的操作节点的API，但是一次性插入大量节点还是很麻烦，所以HTML5实现了将一个HTML字符串插入的能力
- innerHTML，读取innerHTML时，会返回元素所有后代的HTML字符串，包括元素、注释和文本节点。写入时会根据提供的字符串值以新的DOM完全替代元素中的所有节点
- 读取innerHTML时，返回的文本内容根据浏览器返回的值也不同，IE和Opera会把所有元素标签转为大写，而Safari、Chrome和Firefox则会按照源码返回，包含空格与锁紧。
- 写入时，赋给innerHTML的值会被解析为DOM树，并替代之前的所有节点。因此所赋的值默认都是HTML，所有的标签都会以浏览器处理HTML的形式转为元素（转换结果也会因浏览器而不同）。赋值中没有HTML就直接生成文本节点
- 因为浏览器会解析设置的值，所以innerHTML设置包含HTML的字符串时，结果会不一样

```js
dib.innerHTML = 'Hello & welcome,<b>\"reader\"!</b>'
// 结果相当于

<div>Hello &amp; welcome, <b>&quot;reader$quot;!</b></div>
```

- 设置完innerHTML就可以访问对应的新节点了
- 现代浏览器通过innerHTML插入script标签是不会执行的，在IE8之前，要是插入的script标签设置了defer属性，且script之前是“受控元素”，那就可以执行。script跟style或注释都是非受控元素，页面看不到它们。
- 读取outerHTML属性会返回调用它的元素（及所有后代元素）的HTML字符串，写入outerHTML时，调用它的元素会被传入的HTML字符串经解释后生成的DOM子树替代
- insertAdjacentHTML()与insertAdjacentText()都接受两个参数，要插入标记的位置和要插入的HTML或文本。第一个参数必须是下列值之一
  - "beforebegin": 插入当前元素前面，作为前一个同胞节点
  - "afterbegin":插入当前元素内部，作为新的子节点或放在第一个子节点之前
  - "beforeend": 插入当前元素内部，作为新的子节点或放在最后一个子节点之后
  - "afterend": 插入当前元素后面，作为下一个同胞节点
- 这几个值是不区分大小写的，第二个参数会作为HTML字符串解析或作为纯文本解析，如果是HTML，就会在解析出错时抛出错误
- HTML5标准化了控制页面滚动的方法：scrollIntoView()
- scrollIntoView方法存在于所有HTML元素上，可以滚动浏览窗口或视图容器元素方便包含元素进入视口，参数如下
  - alignToTop是一个布尔值
    - true: 窗口滚动后元素的顶部与视口顶部对齐
    - false: 窗口滚动后元素底部与视口底部对齐
  - scrollIntoViewOptions是可选对象
    - behavior: 定义过渡动画，可取值为"smooth"和"auto"，默认为"auto"
    - block:定义垂直方向的对齐，可取值为"start"，"center","end","nearest"，默认为"start"
    - inline: 定义水平方向的对齐，可取值为"start"，"center","end","nearest"，默认为"start"
  - 不传参数等价于alignToTop为true

```js
// 元素可见
document.forms[0].scrollIntoView()
document.forms[0].scrollIntoView(true)
document.forms[0].scrollIntoView({ block: 'start', behavior: 'smooth' }) // 平滑滚动
```

## 专有拓展

- 浏览器也实现了一些专有拓展，这些拓展有可能以后会被标准化，只是在这个阶段还是专有的
- IE9之前的版本与其他浏览器处理空白节点的不一致导致了children属性的出现，children是一个HTMLCollection，只包含元素的Element类型的自己诶单
- IE引入了contains()方法用于让开发者在不便利DOM的情况下知道一个元素是否是另一个元素的后代，在要被搜索的祖先元素上调用，如果目标节点是被搜索节点的后代，就返回true，否则返回false

```js
console.log(document.documentElement.contains(document.body))
```

- DOM Level 3中的compareDocumentPosition()方法也可以确定节点间的关系，返回关系的位掩码
  - 0x1: 断开，传入接点不在文档中
  - 0x2: 领先（传入接点在DOM树中位于参考节点之前）
  - 0x4: 落后（传入接点在DOM树中位于参考节点之后）
  - 0x8: 包含（传入接点是参考节点的祖先）
  - 0x10: 被包含（传入接点是参考节点的后代）
- 可以使用compareDocumentPosition()来模仿contains

```js
let result = document.documentElement.compareDocumentPosition(document.body)
console.log(!!(result & 0x10))
```

- 上面代码执行后result值为20（或0x14，0x4表示随后，加上0x10“被包含”）。对result和0x10应用按位与会返回非零值，然后将其转为对应布尔值
- IE9及以后版本以及现代浏览器都支持contains跟compareDocumentPosition方法
- innerText与outerText未进入标准，innerText属性对应元素中包含的所有文本内容，无论文本在子树中哪个层级。在取值时都会按照深度优先的方式把子树中的所有文本节点的值拼起来
- 写入时，会移除元素的所有后代并插入一个包含该值的文本节点

```js
div.innerText = div.innerText // 可用于去除所有html标签
```

- innerText获得所有浏览器的支持，取得或设置文本内容时应该作为首选采用
- outerText在取值时跟innerText返回值一样，但是在写入时，outerText不止移除所有后代，还会替换整个元素
- outerText是一个非标准化的属性，不推荐使用这个属性，除Firefox外所有主流浏览器都支持outerText
- HTML5实现了scrollIntoView()方法，但其他浏览器也有专有方法，比如scrollIntoViewIfNeeded()作为HTMLElement类型的拓展在所有元素上使用。
- scrollIntoViewIfNeeded(alingCenter)会在元素不可见得情况下将其滚动到窗口或者包含窗口中，使其可见，如果已经在可见窗口就什么都不会做。如果将可选的参数alingCenter设为true，浏览器会尝试将它放到视口中央，Safari、Chrome、Opera都实现了这个方法

## 内存与性能

- 本节介绍的方法替换子节点可能在浏览器（IE）中导致内存问题，比如被移除的字数元素中有关联的事件处理程序或其他JavaScript对象（作为元素的属性），那它们的存在关系就会留在内存中。这种操作频繁发生，页面的内存就会飙升，所以使用innerHTML、outerHTML、inertAdjacentHTML之前最好手动删除要替换的元素上关联的事件处理程序与JavaScript对象
- 使用inerHTML比DOM操作更快是因为HTML解析器会解析设置给innerHTML的值，解析器一般在浏览器中是底层代码，比JavaScript要快很多
- 但是使用innerHTML也是有代价的，所以最好限制使用innerHTML的次数，将批量的操作统一处理
- 尽管innerHTML不会执行自己创建的script标签，但仍然向恶意用户暴露了很大的攻击面，通过它可以毫不费力的创建元素并执行click等属性，如果页面要使用用户提供的信息，建议不使用innerHTML。防止XSS攻击，所以需要隔离插入的数据，插入页面前使用相关库进行转义
