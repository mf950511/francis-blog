---
title: "BOM —— window对象"
date: "2020-12-16"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# window对象

- BOM的核心是window对象，表示浏览器的实例。window在浏览器中有两重身份，一个是ECMAScript中的Global对象，一个是浏览器窗口中的JavaScript接口。
- 意味着网页中定义的所有对象、变量、函数都以window作为其Global对象
- 所有通过var声明的全局变量或函数都会成为window对象的属性和方法

## 窗口关系

- top对象指向最外层窗口，即浏览器本身。
- parent对象指向当前窗口的父窗口。如果当前窗口是最上层窗口，则parent等于top（都等于window）
- 还有self属性，它是终极的window属性，始终指向window。这些都是window的属性，可以通过window.top的方式来访问
- window对象的位置可以通过不同的属性跟方法确定，现代浏览器提供了screenLet跟screentTop属性，用于确定窗口相对于屏幕左侧跟顶部的位置，返回值的单位是css像素
- 可以使用moveTo跟moveBy来移动窗口，都接收两个参数
- moveTo接收要移动到的位置的绝对坐标x很y
- moveBy接收相对于当前位置在两个方向上的像素数
- 这两个方法在不同的浏览器中可能会被部分或全部禁用

```js
window.moveTo(0, 0) // 移动到左上角
window.moveTo(200, 300) // 移动到坐标 200， 300
window.moveBy(0, 100) // 向下移动100
window.moveBy(-50, 0) // 向左移动50
```
<!--more-->
- css像素是web开发中的统一像素单位。如果屏幕距离人眼是一臂长，那计算的css像素大小大概是1/96英寸。定义像素大小是为了不同设备统一标准。
- 低分辨力平板设备上12像素（css像素）应该跟高清4k屏幕上12像素（css像素）的文字有同样的大小，这就让不同像素密度屏幕下有不同的缩放系数，以便将物理像素转为css像素
- 例如：手机屏幕的物理分辨率为1920 * 1080，因为其像素非常小，所以浏览器要将其分辨率将为较低的逻辑分辨率，比如640 * 320。这个物理像素与css像素之间转换比率由window.devicePixelRatio提供。对于分辨率1920 * 1080 转换为640 * 320的设备，window.devicePixelRatio值为3。这样12像素（css像素的文字）就会实际以36像素的物理像素展示

## 窗口大小

- 所有现代浏览器支持的4个属性：innerHeight、innerWidth、outerHeight、outerWidth
- outerWidth跟outerHeight返回浏览器窗口自身的大小（不管在外层window还是窗口frame中）。innerHeight跟innerWidth返回浏览器窗口中页面视图的大小
- document.documentElement.clientHeight和document.documentElement.clientWidth返回页面视口宽度和高度
- 浏览器窗口的精确尺寸不好确定，但可以确定页面视口的大小

```js
let pageWidth = window.innerWidth, pageHeight = window.innerHeight
if(typeof pageWidth !== number) {
  if(document.compatMode == 'CSS1Compat') {
    pageWidth = document.documentElement.clientWidth
    pageHeight = document.documentElement.clientHeight
  } else {
    pageWidth = document.body.clientWidth
    pageHeight = document.body.clientHeight
  }
}
```

- 上面我们先设置为innerWidth跟innerHeight，然后再检查是否是数值决定有没有拿到，之后再通过document.compatMode来检查是否是标准模式，如果是就使用document.documentElement的方式来获取，不是就采用document.body的形式
- 移动设备上，window.innerWidth和window.innerHeight也是返回视口的大小，也就是屏幕上可视区域的大小。Mobile Internet Explorer支持这些属性，但在document.documentElement.clientHeight和document.documentElement.clientWidth中提供了相同的信息。放大缩小页面时，这些值也会变化
- 其他移动浏览器中，document.documentElement.clientWidth和document.documentElement.clientHeight返回的布局视口的大小，即渲染页面的实际大小。布局视口是相对于可见视口的一个概念，可见视口只能显示整个页面的一小部分。Mobile Internet Explorer把布局视口的信息保存在document.body.clientWidth和document.body.clientHeight中。放大缩小页面时，这些值也会变。
- 可以使用resizeTo()和resizeBy()方法调整窗口大小。接收两个参数，resizeTo接收新的宽度和高度，resizeBy接收宽度和高度各缩放多少

```js
window.resizeTo(100, 100)
window.resizeBy(100, 50)
```

- 与移动窗口的方法一致，缩放的方法也可能被浏览器禁用，并且部分浏览器默认禁用。缩放方法只能应用到最上层window
- 浏览器窗口尺寸通常无法满足完整显示页面，因此用户需要滚动查看。度量文档相对于视口滚动距离的属性有两对，返回相等的值：window.pageXoffset/window.scrollX和window.pageYoffset/scrollY
- 可以使用scoroll()、scrollTo()、scrollBy()滚动页面。三个方法都接收相对视口距离的x和y坐标，前两个方法表示要滚动到的坐标，最后一个方法表示滚动的距离

```js
// 相对当前视口向下滚动100像素跟向右40像素
window.scrollBy(0, 100)
window.scrollBy(40, 0)
//滚动到页面左上角
window.scrollTo(0, 0) 
window.scroll(0, 0)
```

- 这几个方法都接收一个ScrollToOptions字典，除了提供偏移值，还可以通过beghavior属性告诉浏览器是否平滑滚动。

```js
// 正常滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'auto'
})

// 平滑滚动
window.scrollTo({
  left: 100,
  top: 100,
  behavior: 'smooth'
})
```

## 导航与打开新窗口

- window.open()可以用于导航到指定url，也可以用于打开新的浏览器窗口。接收4个参数：要加载的url、目标窗口、特性字符串和表示新窗口在浏览器历史记录中是否代替当前加载页面的布尔值。通常只传前3个参数，最后一个参数只有不打开新窗口才会使用。
- 如果第二个参数已经是一个存在的窗口或窗格（frame）的名字，则会在对应的窗口或窗格中打开URL。

```js
window.open('http://www.wrox.com/', 'topFrame')
```

- 上面代码跟点击链接的形式一致，如果已经有一个窗口名叫'topFrame'，则这个窗口会打开这个URL，否则就新打开一个窗口并命名为'topFrame'，第二个参数也可以是特殊的窗口名，比如_self、_parent、_top、_blank
- 如果第二个参数不是已有窗口就会打开新的窗口或标签页。
- 第三个窗口为特性字符串，用于指定新窗口的配置。要是不传第三个参数，则带有所有默认的浏览器特性。打开的不是新窗口就忽略第三个参数。
- 特性选项表
  - fullscreen: "yes" 或 "no"，表示窗口是否最大化
  - height: 数值，新窗口高度，不小于100
  - left: 数值，窗口x坐标，不能是负值
  - location: "yes"或"no"，是否显示地址栏
  - Menubar: "yes"或"no"，是否显示菜单栏
  - resizable: "yes"或"no"，是否可以拖动改变新窗口大小
  - scrollbars: "yes"或"no"，内容过长时是否可以滚动
  - status: "yes"或"no"，是否显示状态栏
  - toolbar: "yes"或"no"，是否显示工具栏
  - top: 数值，新窗口的y值，不能为负值
  - width: 数值，新窗口宽度，不能小于100
- 这些设置需要以逗号分割的键值对出现，特性字符串不能有空格

```js
window.open('http://www.wrop.com/', 'wroxWindow', 'height=400,width=300,top=10,left=10,resizable=yes')
```

- 上面会打开一个可缩放的窗口，大小为400 * 300，位于屏幕左边即上面各10像素
- window.open返回一个对新窗口的引用。这个对象跟普通window对象一样，只是为控制新窗口提供了便利。某些浏览器不允许缩放跟移动主窗口，但是允许缩放和移动通过open打开的新窗口。

```js
let worxWin1 = window.open('http://www.wrop.com/', 'wroxWindow1', 'height=400,width=300,top=10,left=10,resizable=yes')
worxWin1.resizeTo(500, 500)
worxWin1.moveTo(100, 100)
worxWin1.close()
console.log(worxWin1.closed) // true
```

- 还可以使用close关闭open创建的窗口，关闭窗口后，窗口引用还在，但只能检查closed属性了
- 新创建窗口的window对象有一个opener指向打开它的窗口。这个属性只在弹出窗口的最上层window对象有定义，指向调用window.open打开它的窗口的指针
- 某些浏览器标签页在独立进程中运行，如果一个标签页打开了另一个，而window对象需要跟另一个标签页通信，那标签便不能运行在独立的进程中。这些浏览器中可以将打开标签页的opener设为null，表示新打开的标签页可以运行在独立的进程中。
- 把opener设置为null表示新打开的标签页不需要与打开它的标签页通信，因此可以独立进程运行。这个链接一旦切断无法恢复

## 安全限制

- 弹出窗口刚开始被在线广告给滥用，将广告伪装成系统对话框，诱导用户点击。为了让用户区分，浏览器对弹窗做了限制
- IE7开始，地址栏不能隐藏了，弹窗默认不可缩放不可移动。Firefox禁用了隐藏状态栏的功能，Firefox强制弹窗始终显示地址栏。Opera只能在主窗口打开新窗口，不允许它们出现在系统对话框内。
- 浏览器需要在用户允许时才能创建弹窗。网页加载中创建弹窗无效还可能报错。要点击或者按下键才可以打开弹窗
- 现在浏览器内置了屏蔽程序，如果屏蔽程序屏蔽了弹窗，那window.open会返回null，可以通过这个来判断弹窗是否被屏蔽

```js
let wroxWin = window.open('http://www.wrox.com', "_blank")
if(wroxWin === null) {
  console.log('the popup was blocked')
}
```

- 浏览器拓展或者其他程序屏蔽弹窗时，window.open通常会抛出错误，因此要准确检测弹窗是否被屏蔽，除了检测window.open的返回值，还要将它用try/catch包裹

```js
let blocked = false
try {
  let wroxWin = window.open('http://www.wrox.com', "_blank")
  if(wroxWin === null) {
    console.log('the popup was blocked')
    blocked = true
  }
} catch(e) {
  blocked = true
}

blocked && console.log(blocked)
```

## 定时器

- setTimeout的第二个参数是告诉JavaScript引擎在指定的毫秒数后将任务添加到任务队列，任务队列如何是空的，会立即执行，如果不是空的，需要等前面的任务执行完才能执行
- 所有setTimeout执行的代码都会在全局作用域的一个匿名函数中执行，因此函数中的this在非严格模式下都是window，在严格模式下是undefined。要是提供的是箭头函数，this会保留它定义时所在的作用域
- setInterval的第二个参数是向队列添加新任务前的等待时间。它不关心任务什么时候执行或者执行花多长时间，是否有阻塞，只会往队列内添加任务
- setInterval在实践中很少会在生产环境下使用，因为一个任务跟下一个任务之间的时间间隔是无法确定的，有些循环定时任务就可能会被跳过。setTimeout就能确保不出现这种情况
- 所以一般来说最好不要用setInterval。我们可以使用setTimeout来替换

## 系统对话框

- alert接收一个字符串并弹出一个只有确认按钮的弹窗，只接受字符串，非字符串会使用toString转为字符串
- confirm确认框，有两个按钮，取消和确认。返回值为按钮的点击情况，true表示点击了确认，false表示点击了取消

```js
if(confirm('Are you sure')) {
  console.log('I am sure')
} else {
  console.log('I am sorry')
}
```

- prompt提供一个供用户输入的提示框，也有取消和确认的按钮，还有一个输入文本框。prompt()接收两个参数：要显示给用户的文本，以及文本框的默认值。
- 点击确认按钮，该方法返回文本框中的值，点击取消按钮，或者被关闭，该方法返回null

```js
let result = prompt("What is your name ?", "")
if(result !== null) {
  console.log(`welcome ${ result }`)
}
```

- 很多浏览器对系统对话框加了特殊功能。如果网页中的脚本生成了两个或更多的对话框，则除第一个外的对话框都展示一个复选框，用户选中就会禁用后续的弹窗，直到页面刷新。
- 用户选中复选框，那在页面刷新之前，所有系统对话框都被拼比，开发者无法获取弹窗是否显示了。要是用户两次独立的操作产生的警告框，不会显示复选框，要是一次操作产生的就会产生复选框
- find()是异步显示，跟用户在浏览器菜单选择查找时一致
- print()也是异步显示，跟用户在浏览器选择打印时显示的一致，不受用户禁用弹窗的限制