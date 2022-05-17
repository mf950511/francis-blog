---
title: "JavaScript中的事件"
date: "2021-01-29"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# JavaScript中的事件

- JavaScript与HTML的交互是通过事件实现，事件代表文档或浏览器中某个有意义的时刻。可以使用仅在事件发生时执行的监听器（也叫处理程序）订阅事件。传统软件领域叫做“观察者模式”，能做到页面行为（JavaScript中定义）与页面展示（在HTML与CSS定义）的分离
- DOM2开始以符合逻辑的方式来标准化DOM事件API，目前所有现代浏览器都支持了DOM2 Events的核心部分。IE8是最后一个使用专有事件系统的主流浏览器
- 在定义事件时有一个有趣的问题，当你点击按钮的时候，不光点击了按钮，而且点击了它的容器跟整个页面，所以为解决这个问题就有了事件流
- 事件流描述了页面接收事件的顺序。结果就是，IE和Netscape提出了相反的事件流方案，IE支持事件冒泡，Netscape支持事件捕获流

## 事件冒泡

- IE事件称为事件冒泡，事件被定义为从最基本的元素开始触发，然后向上传播至没那么具体的元素（文档）比如页面点击div，click触发顺序为： div -> body -> html -> document
- 所有现代浏览器都支持事件冒泡，只是实现有点变化。IE5.5及更早会跳过html，从body直接到document，现代浏览器会一直到window对象


## 事件捕获

- 事件捕获是从最不具体的节点最先收到事件，最具体的最后收到事件。实际上就是为了在事件到达目标前拦截事件，前面的例子在事件捕获中为： document -> html -> body -> div
- 事件捕获也得到所有现代浏览器的支持，所有浏览器都是从window开始捕获事件，而DOM2 Evenets规定的是从document开始
- 旧版本不支持，所以实际几乎不会使用事件捕获，建议使用事件冒泡，特殊情况下可以使用
<!--more-->
## DOM事件流

- DOM2 Events规范规定事件流分为三个阶段：事件捕获、到达目标和事件冒泡。事件捕获最先发生，提供了提前拦截事件的可能。然后实际目标接收到事件。最后一个阶段是冒泡，最迟要在这个阶段响应事件
- DOM事件流中，实际目标在捕获阶段不会接受到事件。然后在下一阶段触发事件的“到达目标”阶段，通常认为是冒泡的一部分。然后就开始冒泡阶段
- 大多数DOM都进行了一个小拓展，虽然DOM2 Events规范明确捕获阶段不命中事件目标，但现代浏览器都会在捕获阶段在事件目标上触发事件。最终在事件目标上有两个机会来处理事件
- 可以直接在元素标签上指定事件，但是注意不能在未转义的情况下使用HTML标签，这样指定的事件可以访问全局作用域中的一切
- 这样指定的事件处理程序有一些特殊的地方，会创建一个函数来封装属性的值。函数有一个特殊的局部变量event，保存的就是event对象
- 在这个函数中，this值相当于事件的目标元素
- 动态创建的包装函数作用域链被拓展了，document和元素自身成员都可以当局部变量来访问，也就是可以更方便的访问自己的属性
- 如果元素是一个表单输入框，作用域中还会包含表单元素，这样事件处理程序就能不必引用表单元素直接访问同一表单的其他成员

```js
// 获取event对象
<input type="button" value="click me" onclick="console.log(event.type)"/>
// this就是自己，所以可以获取value
<input type="button" value="click me" onclick="console.log(this.value)"/>
// 这个与上面的功能一样，采用with实现的
<input type="button" value="click me" onclick="console.log(value)"/>
// 可以直接获取同意表单的其他成员
<form method="post">
  <input type="text" name="username" value=""/>
  <input type="button" value="Echo Username" onclick="console.log(username.value)"/>
</form>
// 静默错误
<input type="button" value="click me" onclick="try{showMessage()}catch(ex){}"/>
```

- HTML直接处理事件会有一些时机问题，有可能元素展示了，但是事件处理程序的事件还没加载完成，所以需要加一个try/catch来进行静默错误

## DOM0 事件处理程序

- JavaScript中传统的事件处理程序就是讲一个函数赋值给DOM元素的事件处理程序，直到现在所有现代浏览器都支持此方法。
- 每个元素（包括window与document）都有通常小写的事件处理程序属性

```js
let btn = document.getElementById('myBtn')
btn.onclick = function(){
  console.log('Clicked')
}
```

- 这样实现如果代码出现在按钮之后，可能用户点击按钮无反应
- 这样实现函数中的this等于元素本身
- 这样注册的事件注册在事件流的冒泡阶段
- 将事件处理程序属性的值设为null可以移除通过DOM0方式添加的事件处理程序

## DOM2事件处理程序

- DOM2 Events定义了两个方法来为事件处理程序赋值跟移除：addEventListener()和removeEventListener()。这两个方法暴露在所有DOM节点上。接收三个参数：事件名、事件处理函数和一个布尔值，true表示在捕获阶段调用事件处理程序，false（默认）表示在冒泡阶段调用

```js
let btn = document.getElementById('myBtn')
btn.addEventListener('click', () => {
  console.log(this.id)
}, false)
```

- 上述代码添加了会在事件冒泡阶段触发的onclick事件处理程序。与DOM0方式，这个处理程序同样被附加到元素的作用域中运行
- DOM2 Events优势就是可以添加多个事件处理程序

```js
let btn = document.getElementById('myBtn')
btn.addEvenetListener('click', () => {
  console.log(this.id)
})
btn.addEvenetListener('click', () => {
  console.log('Hello world')
})
```

- 多个事件处理程序以添加顺序来触发
- 通过addEventListener添加的事件只能用removeEventListener()并传入与添加同样的参数来移除，所以添加匿名函数无法移除

```js
let btn = document.getElementById('myBtn')
btn.addEvenetListener('click', () => {
  console.log(this.id)
}, false)
btn.removeEventListener('click', () => {
  console.log(this.id)
}, false)
```

- 大多数情况下，事件处理程序会添加到事件流的冒泡阶段，主要是跨浏览器兼容性好。捕获阶段通常用于拦截事件
- IE实现了与DOM类似的方法，attachEvent和detachEvent，两个方法接收两个同样的参数：事件处理程序的名称和事件处理函数

```js
var btn = document.getElementById('myBtn')
btn.attachEvent('onclick', function(){
  console.log('clicked')
})
```

- attachEvent第一个参数是"onclick"，而不是addEventListener中的click
- 使用DOM0方式时，事件处理程序中的this为目标元素，使用attachEvent时，this等于window
- attachEvent也可以给元素添加多个事件处理程序

```js
var btn = document.getElementById('myBtn')
btn.attachEvent('onclick', function(){
  console.log('clicked')
})

btn.attachEvent('onclick', function(){
  console.log('Hello world')
})
```

- 不过与DOM方法不同，这里的触发顺序会以它们添加的顺序反向触发
- 可以使用detachEvent移除添加的处理程序
- 结合上面的两种方法，我们编写一个兼容浏览器的方式处理，保证最大的兼容性，让代码在冒泡阶段运行即可

```js
var EventUtil = {
  addHandler: function(element, type, handler){
    if(element.addEventListener){
      element.addEventListener(type, handler, false)
    } else if(element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  },
  removeHandler: function(element, type, handler){
    if(element.removeEventListener){
      element.removeEventListener(type, element, false)
    } else if(element.detachEvent) {
      element.detach('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  }
}

```

- DOM事件发生时，所有先关信息都会收集并存储到event对象中，比如导致事件的元素、发生的事件类型等
- DOM合规的浏览器中，event对象是传给事件处理程序的唯一参数。DOM0跟DOM2形式添加的事件处理程序都一样
- 所有事件对象都包含下列公共属性与方法
  - bubbles: 布尔值，事件是否冒泡
  - canclable: 布尔值，表示是否可以取消事件的默认行为
  - currentTarget: 元素，当前事件处理程序所在的元素
  - defaultPrevented: 布尔值，true表示已经调用preventDefault方法（DOM3 Events新增）
  - detail: 整数，事件相关的其他信息
  - eventPhase: 整数，表示调用事件处理程序阶段，1代表捕获阶段，2代表到达阶段，3代表冒泡阶段
  - preventDefault(): 函数，用于取消事件的默认行为。只有canclable为true才能调用
  - stopImmediatePropagation(): 函数，用于取消后续事件捕获或事件冒泡，并阻止调用任何后续事件处理程序（DOM3 Events新增）
  - stopPropagation(): 函数，用于取消后续事件冒泡或事件捕获，只有bubbles为true才能调用
  - target: 元素，事件目标
  - trusted: 布尔值，true表示由浏览器生成，false表示由开发者通过JavaScript创建（DOM3 Events新增）
  - type: 字符串，触发的事件类型
  - View: AbstractView.与事件相关的抽象视图，等于事件所发生的window对象
- 事件处理程序内部，this对象始终等于currentTarget的值，target只包含事件的实际目标。如果事件处理程序直接添加到了意图的目标，那this、currentTarget、target值一样

```js
let btn = document.getElementById('myBtn')
btn.onclick = function(event) {
  console.log(event.currentTarget === this) // true
  console.log(event.target === this) // true
}

// 添加到父元素
document.body.onclick = function(event){
  console.log(event.currentTarget === document.body) // true
  console.log(this === document.body) // true
  console.log(event.target === document.getElementById('myBtn')) // true
}
```

- preventDefault用于阻止跳转链接等默认行为
- stopPropagation()用于阻止事件流在DOM结构中传播，取消后续的事件捕获或冒泡

## IE事件对象

- 与DOM事件对象不同，IE事件对象可以基于事件处理程序被指定的方式以不同方式访问。如果以DOM0方式制定，event就是window的一个属性

```js
let btn = document.getElementById('myBtn')
btn.onclick = function() {
  const event = window.event
  console.log(event.type)
}
```

- 如果是以attachEvent()方式指定的，event对象会作为唯一参数传递给处理函数，但是event对象也仍然是window对象的属性
- 所有IE事件对象都会包含下列属性和方法
  - cancelBubble: 布尔值，默认为false，设置为true可以取消冒泡（等同于DOM的stopPropagation）
  - returnValue: 布尔值，默认为true，设置为false可以取消事件的默认行为（与DOM的preventDefault相同）
  - srcElement: 元素，事件目标（与DOM的target属性相同）
  - type: 字符串，触发的事件类型
- 由于事件处理程序的作用域取决于指定它的方式，因此this值不总等于事件目标，所以更好地方式是使用srcElement替代this
- returnValue等价于preventDefault()方法，只不过需要将returnValue设置为false才阻止默认行为

```js
var link = document.getElementById('myLink')
link.onclick = function(){
  window.event.returnValue = false
}
```

- 与DOM不同，没有办法通过JavaScript确认事件是否可以被取消
- cancelBubble属性与DOMstopPropagation()方法用途一样，用于阻止事件冒泡。IE8及更早不支持捕获阶段，所以只会取消冒泡。stopPropagation()既取消捕获也取消冒泡

```js
var btn = document.getElementById('myBtn')
btn.onclick = function(){
  console.log('clicked')
  window.event.cancelBubble = true
}
document.body.onclick = function(){
  console.log('body click')
}
```

- 有了上面特性，我们可以拓展一下EventUtil对象

```js
var EventUtil = {
  addHandler: function(element, type, handler){
    if(element.addEventListener){
      element.addEventListener(type, handler, false)
    } else if(element.attachEvent) {
      element.attachEvent('on' + type, handler)
    } else {
      element['on' + type] = handler
    }
  },
  removeHandler: function(element, type, handler){
    if(element.removeEventListener){
      element.removeEventListener(type, element, false)
    } else if(element.detachEvent) {
      element.detach('on' + type, handler)
    } else {
      element['on' + type] = null
    }
  },
  getEvent: function(event){
    return event ? event : window.event
  },
  getTarget: function(event){
    return event.target || event.srcElement
  },
  preventDefault: function(event){
    if(event.preventDefault) {
      event.preventDefault()
    }else {
      event.returnValue = false
    }
  },
  stopPropagation: function(event){
    if(event.stopPropagation) {
      event.stopPropagation()
    } else {
      event.cancelBubble = true
    }
  }
}
```
