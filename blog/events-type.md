---
title: "JavaScript中的事件-事件类型"
date: "2021-02-01"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# JavaScript中的事件-事件类型

- Web浏览器定义很多事件，所发生事件类型决定了事件对象会保存什么信息，DOM3 Events定义了如下事件类型
  - 用户界面事件（UIEvent）: 涉及与BOM交互的通用浏览器事件
  - 焦点事件（FocusEvent）: 在元素获得和失去焦点时触发
  - 鼠标事件（MouseEvent）: 使用鼠标执行操作时触发
  - 滚轮事件（WheelEveny）: 使用鼠标滚轮或类似设备触发
  - 输入事件（InputEvent）: 向文档中输入文本时触发
  - 键盘事件（KeyboardEvent）: 使用键盘执行操作时触发
  - 合成事件（CompositionEvent）: 在使用某种IME（Input Method Editor,输入法编辑器）输入字符时触发
- 所有主流浏览器都支持DOM2 Events 跟DOM3 Events
- 用户界面事件或UI事件，主要有以下几种
  - DOMActivate: 元素被用户通过鼠标或键盘操作激活时触发(比click或keydown)更常用，在DOM3 Events飞起，因为浏览器实现有差异
  - load: 在window上页面加载完成后触发，在窗套（<frameset>）上所有窗格(frame)加载完成后触发，img元素上当图片加载完成后触发，在<object>上对应对象加载完成后触发
  - unload: window上页面完全卸载后触发，窗套上所有窗格卸载后触发，object上的对应对象卸载后触发
  - abort: 在object元素上对应的对象加载完成前被用户提前终止时触发
  - error: window上当JavaScript报错时触发，img元素当图片无法加载时触发，object元素无法加载相应对象时触发，窗套上当一个或多个窗格无法完成加载时触发
  - select: 文本框（input或textarea）上用户选了一个或多个字符时触发
  - resize: window或窗格上被缩放时触发
  - scroll: 用户滚动包含滚动条的元素时在元素上触发。body包含已加载页面的滚动条
- 除DOMActivate，这些事件在DOM2 Events被称为HTML Events
- load在window对象上load事件会在整个页面（所有外部资源如图片、css、js）加载完成后触发
- 使用addEventListener添加load事件时，事件处理程序会收到一个event对象，DOM合规的浏览器中，event.target会设置为document，但在IE8之前的版本中，不会设置这个对象的srcElement属性
- load用于图片时，可以按照下方式动态添加图片

```js
window.addEventListener('load', () => {
  let image = document.createElement('img')
  image.addEventListener('load', (event) => {
    console.log(event.target.src)
  })
  document.body.appendChild(image)
  image.src = 'smile.jpg'
})
```
<!--more-->
- 这里注意，图片的下载不一定要把元素添加到页面，只要给他设置了src属性就开始下载
- 可以使用这种形式来进行图片的预加载

```js
window.addEventListener('load', () => {
  let image = new Image()
  image.addEventListener('load', (event) => {
    console.log(event.target.src)
  })
  image.src = 'smile.jpg'
})
```

- IE8及早期版本，图片没有添加到DOM文档中，load事件发生时不会生成event对象，IE9修复了这个问题
- script元素也可以以非标准的方式支持load事件。script元素会在javascript元素加载完成后触发load，与图片不同，下载JavaScript文件必须要指定src并且添加到文档中才可以，IE8及以下不支持script触发load事件
- IE和Opera支持link元素触发load事件，跟script一样，指定href跟插入文档后才会下载样式表

```js
window.addEventListener('load', () => {
  let link = document.createElement('link')
  link.type = 'text/css'
  link.rel = 'stylesheet'
  link.addEventListener('load', (event) => {
    console.log('css load')
  })
  link.href = 'example.css'
  document.getElementByTagName('head')[0].appendChild(link)
})
```

- load相对的是unload事件，会在文档卸载完成后触发，一般在一个页面导航到另一个页面时触发，常用语清理内存，避免内存泄漏
- resize事件，浏览器窗口被缩放到新高度或宽度就会触发resize事件，不同浏览器触发resize方法存在差异。IE、Safari、Chrome、Opera会在窗口缩放超过1像素时触发resize事件，然后随用户缩放浏览器窗口不断触发。Firefox早期只在用户停止缩放时触发resize事件。无论如何都应该避免在这个过程执行过多计算。否则可能导致浏览器明显变慢
- scrolls事件，虽然scroll事件发生在window上，但实际反应页面相应元素的变化。混杂模式下可以通过body来检测scrollLeft和scrollTop属性的变化。标准模式下，这些变化都发生在html元素上

```js
window.addEventListener('scroll', (event) => {
  if(document.compatMode == 'CSS1Compat') {
    console.log(document.documentElement.scrollTop)
  } else {
    console.log(document.body.scrollTop)
  }
})
```

## 鼠标事件

- 焦点事件在元素获得或失去焦点时触发。可以与document.hasFocus跟document.activeElement一起给用户提供导航信息
  - blur: 元素失去焦点时触发，事件不冒泡，所有浏览器支持
  - DOMFocusIn: 当前元素获得焦点触发，是focus的冒泡版。DOM3 Events废弃了该事件，推荐focusin
  - DOMFocusOut: 元素失去焦点时触发，是blur的通用版。DOM3 Events废弃了该事件，推荐focusout
  - focus: 当元素获取焦点时触发，事件不冒泡，所有浏览器支持
  - focusin: 元素获得焦点时触发。是事件focus的冒泡版
  - focusout: 元素失去焦点时触发。是blur的冒泡版
- 当焦点从一个元素移动到另一个元素时，会依次触发
  - focusout在失去焦点的元素上触发
  - focusin在获得焦点的元素上触发
  - blur在失去焦点的元素触发
  - DOMFocusOut在失去焦点的元素上触发
  - focus在获取焦点的元素触发
  - DOMFocusIn在获取焦点的元素上触发
- blur、focusout、DOMFocusOut事件目标是失去焦点的元素，focus、focusin、DOMFocusIn目标是获得焦点元素
- DOM3 Events定义了9种鼠标事件
  - click: 用户单击鼠标主键或按键盘回车时触发，主要是考虑到无障碍访问
  - dbclick: 用户双击鼠标主键触发，DOM3 Events进行了标准化
  - mousedown: 用户按下任意鼠标键触发，不能通过键盘触发
  - mouseenter: 用户把鼠标从元素外移到元素内触发。不冒泡，不会在光标经过后代元素时触发，DOM3 Events新增
  - mouseleave: 用户把光标从元素内部移到元素外部时触发。事件不冒泡，也不会在经过后代元素时触发
  - mousemove: 光标在元素上移动时反复触发，不可通过键盘触发
  - mouseout: 用户把鼠标光标从一个元素移到另一个元素时触发。移到的元素可以是外部元素，也可以是元素的子元素，不能通过键盘触发
  - mouseover: 用户把光标从元素外部移到元素内部时触发
  - mouseup: 用户释放鼠标时触发
- 所有元素都支持鼠标事件。除mouseenter跟mouseleave之外的鼠标事件都会冒泡，都可以被取消
- 取消事件可能影响其他鼠标事件
  - click触发前提是mousedown触发，然后同一个元素触发mouseup，如果这两个元素任意一个被取消，click就不会被触发。
  - 两次连续的click会触发dbclick，要是任何一个click事件被取消，dbclick就不会发生
- 这四个事件的顺序永远如下
  - mousedown -> mouseup -> click -> mousedown -> mouseup -> click ->dbclick
- IE8及更早版本实现有问题，会导致双击事件跳过第二次mousedown和click事件，顺序就成了下面
  - mousedown -> mouseup -> click -> mouseup -> dbclick
- 鼠标事件在DOM3 Events中对应的类型是"MouseEvent"而不是"MouseEvents"
- 鼠标事件还有一个滚轮事件的子类别，只有一个事件mousewheel，反应鼠标滚轮或类似设备滚轮的交互
- 客户端坐标：鼠标事件都是在浏览器视口的某个位置发生，这些信息保存在事件对象的clientX和clientY属性中，表示事件发生时鼠标在视口中的坐标，所有浏览器支持
- 客户端坐标不考虑页面滚动，所以不代表鼠标在页面中的位置
- 页面坐标：页面坐标是事件发生时相对页面的坐标，可以通过pageX跟pageY获取
- IE8及更早没有在事件对象暴露页面坐标，所以需要通过客户端坐标跟滚动信息计算出来，计算方式如下

```js
let div = document.getElementById('myDiv')
div.addEventListener('click', (event) => {
  let pageX = event.pageX,
  pageY = event.pageY
  if(pageX === undefined) {
    pageX = event.clientX + (document.body.scrollLeft || document.documentElement.scrollLeft)
  }
  if(pageY === undefined) {
    pageY = event.clientY + (document.body.scrollTop || document.documentElement.scrollTop)
  }
})
```

- 屏幕坐标：鼠标事件不光在浏览器发生，也在屏幕上发生，通过event的screenX和screenY可以获取鼠标在屏幕上的坐标
- 鼠标有时候会跟键盘按键一起触发，键盘的Shift、Ctrl、Alt和Meta经常用于修改鼠标事件的行为，DOM规定了四个属性来表示修饰键状态
  - shiftKey、ctrlKey、altKey、metaKey
- 这几个属性会在各自的修饰键按下时包含布尔值true，没有被按下时包含false

```js
div.addEventListener('click', (event) => {
  let keys = new Array()
  if(event.shiftKey) {
    keys.push('shift')
  }
  if(event.ctrlKey) {
    keys.push('ctrl')
  }
  ...
})
```

- 这里每个对应属性为true的修饰键都会添加到keys，最后就能得到所有键名称
- IE8及更早不支持metaKey属性
- mouseover跟mouseout事件还涉及其他相关元素，都涉及从一个元素到另一个元素的边界内。mouseover事件主要关联元素时获得光标的元素，相关元素是失去光标的元素
- DOM通过event对象的relatedTarget提供了相关元素的信息，只有mouseover与mouseout事件时才能发生，其他事件都是null
- IE8及更早版本不支持relatedTarget属性，但是在mouseover时提供了fromElement属性，mouseout发生时提供了toElement元素来表示相关元素，可根据这个规则扩充相关方法

```js
var EventUtil = {
  getRelatedTarget: function(event){
    if(event.relatedTarget) {
      return event.relatedTarget
    } else if(event.toElement) {
      return event.toElement
    } else if(event.fromElement) {
      return event.fromElement
    } else {
      return null
    }
  }
}
```

- 在元素上单击鼠标主键（或按下回车）时click才会触发，因此按键信息不是必须的。对mousedown跟mouseup事件，event对象有一个button属性表示按下哪个键。
- DOM 为button属性定义了3个值：0表示主键、1表示中键、2表示副键，通常主键是左键，副键是右键
- IE8也提供了button属性，但是跟上面完全不一样
  - 0: 没有任何按键
  - 1: 鼠标主键
  - 2: 鼠标副键
  - 3: 同时按下主键副键
  - 4: 鼠标中键
  - 5: 同时按下鼠标中键跟主键
  - 6: 同时按下鼠标副键和中键
  - 7: 同时按下3个键
- DOM2 Events在event对象提供了detail属性，给出事件的更多信息
- 对鼠标而言，detail包含一个数值，表示给定位置发生了多少次单击，detail从1开始，每次单击加1，要是在mousedown跟mouseup之间移动了，detail重置为0
- IE给鼠标事件提供了额外的信息
  - altLeft，布尔值，是否按下左Alt()
  - ctrlLeft，布尔值，是否按下左Ctrl
  - offsetX，光标相对于元素边界的x坐标
  - offsetY，光标相对于元素边界的y坐标
  - shiftLeft，布尔值，表示是否按下了左shift键
- mousewheel会在用户使用鼠标滚轮触发，可在任何元素触发，在（IE8）冒泡到document跟（所有现代浏览器）window，mousewheel的event对象包含鼠标事件的所有标准信息，还有wheelDelta的新属性，向前滚wheelDelta每次都是+120，向后滚，每次都是-120
- 触摸屏不支持鼠标操作，所以有以下注意事项
  - 不支持dbclick事件，双击窗口会放大浏览器窗口，并且这个行为无法覆盖
  - 单指点击屏幕上的可点击元素会触发mousemove事件。如果操作导致内容变化，则不会触发其他事件。如果屏幕没有变化，会相继触发mousedown、mouseup、click事件。点触不可点击的元素不会触发事件。可点击元素是指点击时有默认动作的元素（如链接）或指定了onclick事件处理程序的元素
  - mousemove事件会触发mouseover和mouseout事件
  - 双指点触屏幕并滑动会导致页面滚动时会触发mousewheel和scroll事件
- 如果网站考虑残障人士，特别是屏幕阅读器的用户，鼠标事件要小心使用。按回车可以触发click事件，其他鼠标事件无法通过键盘触发。所以不要使用click之外的鼠标事件向用户提示功能。下面是相应的建议
  - 使用click事件执行代码，因为mousedown无法在屏幕阅读器触发
  - 不要使用mouseover向用户展示新选项，建议使用对应的键盘快捷键
  - 不要使用dbclick事件，因为键盘无法触发


## 键盘与输入事件

- 键盘事件是用户操作键盘触发的，DOM2 Events定义了键盘事件，但是最终在发布前删除了，所以大多数还是基于原始的DOM0 
- 键盘事件包含下面三个事件
  - keydown: 用户按下键盘某个键，持续按住会重复触发
  - keypress: 用户按下某个键并产生字符时触发，持续按住重复触发。Esc也会触发这个事件，DOM3 Events废弃该方法，推荐textInput事件
  - keyup: 用户释放某个键时触发
- 输入事件只有textInput事件，是对keypress事件的拓展，用于在文本显示给用户之前更好地截获文本输入，textInput会在文本插入到文本框之前触发。
- 用户按下键时会先触发keydown，然后是keypress，然后是keyup事件
- 其中keydown跟keypress会在文本框出现变化之前触发，keyup在文本框出现变化后触发。一直按住某个键，则keydown跟keypress会一直重复触发
- 对于非字符键，会先触发keydown事件，然后触发keyup事件。
- 键盘事件与鼠标事件相同的修饰键。shiftKey、ctrlKey、altKey和metaKey在键盘事件中都是可用的
- 在keydown跟keyup事件中，event对象中的keyCode都会保存一个键嘛，对应键盘上的一个键。字母与数字键，keyCode键码与小写字母和数字的ASCII编码一致，例如数字7键码为55，字母A键keyCode为65，跟是否按了shift键无关。DOM和IE的event对象都支持keyCode属性，下面为非字符键的键码值
  - BackSpace: 8
  - Tab: 9
  - Enter: 13
  - Shift: 16
  - Ctrl: 17
  - Alt: 18
  - Pause/Break: 19
  - Caps Lock: 20
  - Esc: 27
  - Page Up: 33
  - Page Down: 34
  - End: 35
  - Home: 36
  - 左箭头: 37
  - 上箭头: 38
  - 右箭头: 39
  - 下箭头: 40
  - Ins: 45
  - Del: 46
  - 左Windows: 91
  - 数字键8: 104
  - 数字键9: 105
  - 数字键盘+: 107
  - 减号(数字与非数字键盘): 109
  - 数字键盘.: 110
  - 数字键盘/: 111
  - F1: 112
  - F2: 113
  - F3: 114
  - F4: 115
  - F5: 116
  - F6: 117
  - F7: 118
  - F8: 119
  - F9: 120
  - F10: 121
  - F11: 122
  - F12: 123
  - Num Lock: 144
  - Scroll Lock: 145
  - 右Windows： 92
  - Context Menu: 93
  - 数字键盘0: 96
  - 数字键盘1: 97
  - 数字键盘2: 98
  - 数字键盘3: 99
  - 数字键盘4: 100
  - 数字键盘5: 101
  - 数字键盘6: 102
  - 数字键盘7: 103
  - 分号(IE/Safari/Chrome): 186
  - 分号(Opera/FF): 59
  - 小于号: 188
  - 大于号: 190
  - 反斜杠: 191
  - 重音符(\`): 192
  - 等于号: 61
  - 左中括号: 219
  - 反斜杠(\\): 220
  - 右中括号: 221
  - 单引号: 222
- keypress事件发生时，意味着按键影响屏幕中显示的文本，插入与删除文本的键，所有浏览器都会触发keypress事件，其他键取决于浏览器
- 浏览器在event对象上支持charCode属性，只有发生keypress事件时才会被设置值，通常，charCode值为0，keypress事件发生时则是对应键的键码。IE8及更早版本和Opera使用keyCode传达ASCII编码，要以跨浏览器的方法获取字符编码，首先检查charCode属性是否有值，没有再使用keyCode

```js
function getCharCode(event){
  if(typeof event.charCode === 'number') {
    return event.charCode
  } else {
    return event.keyCode
  }
}
```

- DOM3 Events做了一些调整，DOM3 Events并未规定charCode属性，而是定义了key和char属性
- key用于取代keyCode，且包含字符串，按下字符键时，key的值等于文本字符（如"k"）；在按下非字符键时，key值时键名（如"Shift"），char属性在按下字符键时与key类似，按下非字符时为null
- IE支持key属性，不支持char属性。Safari和Chrome支持keyIdentifier属性，按下非字符串时返回月key一样的值("Shift")，对于字符键，返回以"U+0000"形式表示Unicode值的字符串形式的字符编码
- 由于缺乏跨浏览器支持，不建议使用key、keyIdentifier、char
- DOM3 Events支持一个location属性，属性是一个数值，表示在哪里按得键：0为默认键，1是左边（如左边的alt），2是右边，3是数字键盘，4是移动设备，5是游戏手柄。IE9支持这些属性。Safari和Chrome支持等价的keyLocation，但由于实现有问题，这个值始终为0，除非是数字键盘（3），值永远不会是1、2、4、5
- 最后给event增加了getModifierState()方法，这个方法接受一个参数，一个等于Shift、Control、Alt、AltGraph或Meta的字符串，表示要检测的修饰键，如果给定的修饰键处于激活状态，返回true，否则返回false
- DOM3 Events增加了一个textInput事件，在文本被输入到可编辑区域时触发，作为keypress的替代，textInput有下面的区别：
- keypress会在所有可以获得焦点的元素上触发，textInput只在可编辑区域触发。
- textInput只会在新字符插入时触发，keypress对任何影响文本的键都会触发
- textInput主要关注字符，所以在event对象上提供一个data属性，包含要插入的字符。data的值始终是要被插入的字符，因此按S没有按shift，data的值就是s，按了shift，data值就是S
- event上还有一个inputMethod属性，表示向控件中输入文本的字段，值如下
  - 0: 不确定什么输入手段
  - 1: 表示键盘
  - 2: 表示粘贴
  - 3: 表示拖放操作
  - 4: 表示IME
  - 5: 表示表单选项
  - 6: 表示手写
  - 7: 表示语音
  - 8: 表示组合方式
  - 9: 表示脚本
- 这些属性可以确定用户如何输入文本的，从而辅助验证

## 合成事件

- 合成事件时DOM3 Events中新增事件，用于处理使用IME输入时的复杂输入序列。IME可以让用户输入物理键盘不存在的字符，比如可以使用拉丁文字母键盘输入日文
- IME通常需要使用多个键才能输入一个字符。所以由合成事件检测与控制该输入
  - compositionstart: IME文本合成系统打开触发
  - compositionupdate: 新字段插入式触发
  - compositionend: IME文本合成系统关闭时触发，恢复正常键盘输入
- 合成事件与输入事件很像，合成事件触发时，事件目标是接收文本的输入字段。唯一增加的事件属性是data，包含的值如下
  - compositionstart：包含正在编辑的文本
  - compositionupdate: 包含要插入的新字符
  - compositionend: 包含合成过程中输入的全部目标

## HTML5事件

- DOM规范并没有涵盖浏览器都支持的所有事件，HTML5尽可能的列出了浏览器支持的所有事件，下面我们讨论html5中支持比较好的事件
- contextmenu事件: contextmenu用于表示合适显示默认右键鼠标触发的上下文菜单，从而用于开发者取消默认的上下文菜单并自定义
- contextmenu事件冒泡，所以只需要给document指定一个事件处理程序就可以处理页面上的所有同类事件。
- 这个事件在所有浏览器都可以取消，DOM合规浏览器中使用event.preventDefault()，IE8及更早将event.returnValue设为false
- beforeunload事件：该事件会在window上触发，给开发者阻止页面被卸载的机会，该事件会在页面即将从浏览器被卸载时触发。该事件默认行为不可取消，会向用户展示一个确认框，并请用户确认是希望关闭页面还是继续停留
- DOMContentLoaded: window的load事件会在页面完全加载后触发，而DOMContentLoaded会在DOM树完全构建后即触发，不需要等待其他的js、css、图片资源等加载。DOMContentLoaded可以让开发者在资源下载期间就能指定事件处理程序，从而让用户更快的与页面交互
- 处理DOMContentLoaded事件，需要给document或window添加事件处理程序（实际事件目标是document，但会冒泡到window）
- readystatechange事件：IE首先在DOM文档定义了readystatechange事件，为了提供文档或元素加载的信息，行为不是很稳定。支持readystatechange事件的对象都由一个readyState属性，对应值如下
  - uninitialized: 对象存在未初始化
  - loading: 对象正在加载数据
  - loaded: 对象加载数据完成
  - interactive: 对象可以交互，但未加载完成
  - complete: 对象加载完成
- 文档说有些对象会完全跳过某个阶段，但并未说明哪些阶段适用哪些对象，意味着readystatechangez经常会触发不到4次，readyState也未必会依次呈现上述值
- 在document上使用时，值为"interactive"的readyState首先触发readystatechange，时机类似于DOMContentLoaded
- Firefox跟Opera开发了往返缓存的功能，用于使用浏览器前进和后退时加快页面的切换
- pageshow会在页面展示时触发，无论是否来自缓存，新页面会在load事件后触发。注意：虽然该事件目标是document，但是处理程序必须加到window
- pageshow的event对象中有一个persisted的属性，如果页面存在缓存该值就是true，否则就是false
- 与pageshow类似的是pagehide，该方法会在页面从浏览器卸载，unload之前触发。同样，该事件处理程序必须被添加到window上，pagehide同样有persisted属性，但是用法不同，pagehide中persisted为true表示页面将会存在于缓存中
- 第一次触发pageshow是persisted始终是false，第一次触发pagehide时persisted始终是true（除非页面不符合往返缓存）
- 注册了onunload事件（哪怕是空函数）的页面自动排除在往返缓存之外。因为onunload就是用来撤销onload事件发生的事，如果使用往返缓存，那下次页面不会触发onload，可能导致页面无法使用
- hashchange事件：html5新增hashchange事件，用于在URL散列值发生变化时通知开发者。onhashchange必须添加给window，每次URL散列值发生变化都会触发它。event有两个新属性:oldUrl跟newUrl，分别保存变化前后的url值，而且是包含了散列值的完整URL

## 设备事件

- 手机平板的出现导致了新的交互事件，所以产生了新的事件。设备设备用于确定用户使用设备的方式
- orientationchange事件：苹果公司在Safari浏览器创造了orientationchange事件，用于确认设备是垂直模式还是水平模式。在window上暴露了window.orientation属性，值如下
  - 0: 垂直模式
  - 90: 左转水平模式
  - -90: 右转水平模式
- 用户设备发生变化会触发orientationchange事件，但是事件本身没有有用的信息，都需要从window.orientation上拿（所有ios设备都支持该事件）
- deviceorientation事件：该事件是DeviceOrientationEvent事件规范定义的事件。如果可以获取设备的加速计信息，并且数据发生了变化，该事件就会在window触发，该事件只反映设备在空间中的朝向，不涉及移动的信息
- deviceorientation事件触发时，event对象包含各个轴相对于设备静置时的变化，主要是5个属性
  - alpha: 0-360范屋内浮点数，表示围绕z轴旋转y轴的度数（左右转）
  - beta: -180-180范围内的浮点数，表示围绕x轴旋转时z轴的度数（前后转）
  - gamma: -90-90范围内的浮点数，表示围绕y轴旋转时z轴的度数（扭转）
  - absolute: 布尔值表示设备是否返回绝对值
  - compassCalibrated: 布尔值，表示设备的指南针是否正确校准
- devicemotion事件：这个事件用于提示设备实际上的移动，可用于确认设备正在掉落或正在一个行走的人手中，事件触发时event对象包含的额外属性
  - acceleration: 对象，包含x,y和z属性，反应不考虑重力下各个维度的加速信息
  - accelerationIncludingGravity: 对象，包含x,y和z属性，反应各个维度的加速信息，包含z轴重力加速度
  - interval: 毫秒，距离下次devicemotion事件的事件。该值在事件中应该是常量
  - rotationRate: 对象，包含alpha、beta和gamma属性，表示设备朝向
- 无法提供acceleration、accelerationIncludingGravity、rotationRate时为null，所以使用前先检测是否为null

## 触摸及手势事件

- 触摸事件：手指放在屏幕上、在屏幕上滑动或从屏幕一开，触摸事件会触发
  - touchstart: 手指放到屏幕上触发
  - touchmove: 手指在屏幕上滑动时连续触发。在这个事件中调用preventDefault可以阻止滚动
  - touchend: 手指从屏幕移开时触发
  - touchcancel: 系统停止跟踪触摸时触发。文档并未明确什么情况下停止追踪
- 这些事件都可以冒泡，也都可以被取消
- 触摸事件不属于DOM规范，但是浏览器还是以DOM兼容的方式实现。因此，每个触摸事件都提供了鼠标事件的公共属性：bubbles、cancelable、view、clientX、clientY、screenX、screenY、detail、altKey、shiftKey、ctrlKey、metaKey
- 除了上述的DOM属性，还新增了3个属性用于追踪触电
  - touches: Touch对象的数组，表示当前屏幕上的每个触点
  - targetTouches: Touch对象的数组，表示特定于事件目标的触点
  - changedTouches: Touch对象的数组，表示自上次用户动作之后变化的触点
- 每个Touch对象自动包含下属性
  - clientX: 触点在视口中的x坐标
  - clientY: 触点在视口中的y坐标
  - identifier: 触点ID
  - pageX: 触点在页面上的x坐标
  - pageY: 触点在页面上的y坐标
  - screenX: 触点在屏幕上的x坐标
  - screenY: 触点在屏幕上的y坐标
  - target: 触发事件的事件目标
- 这些事件会在文档的所有元素上触发，手指点击屏幕会依次触发下事件
  - touchstart
  - mouseover
  - mousemove
  - mousedown
  - mouseup
  - click
  - touchend
- 手势事件会在两个手指触摸屏幕且相对距离或者旋转角度时触发，事件如下
  - gesturestart: 一个手指已经在屏幕上，另一个手指放到屏幕上触发
  - gesturechange: 任何一个手指在屏幕上的位置发生变化时触发
  - gestureend: 其中一个手指离开屏幕触发
- 只有两个手指同接触事件接受者时才会触发，在一个元素设置就要保证两个手指都在元素内。该事件可以冒泡，所以可以在文档进行事件处理，此时，事件的目标就是两个手指均位于其边界内的元素
- 与触摸事件类似，每个手势事件都有event包含的所有标准鼠标事件。新增了两个event属性rotation和scale。rotation表示手指旋转的度数，负数表示逆时针旋转，正数表示顺时针旋转（从0开始）。scale表示两指间距离变化的成都，开始为1，后续随距离增大或缩小

## 内存与性能

- 过多事件处理程序可以使用事件委托来进行优化。事件委托利用事件冒泡，只用一个事件处理程序就可以管理一种类型的事件
- 事件委托的优势如下
  - document对象随时可用，任何时间都可以给他添加事件处理程序（不用等onload或DOMContentLoaded），只要元素渲染就可以起作用
  - 节省花在设置页面处理程序上的时间，只需要指定一个事件处理程序可以节省DOM一弄，也能节省时间
  - 减少整个页面所需的内存，提升整体性能
- 适合使用事件委托的事件有：click、mousedown、mouseup、keydown、keypress。mouseover跟mouseout经常冒泡，但是很难处理
- 事件处理程序指定给元素后，在浏览器代码和负责页面交互的JavaScript代码之间就建立了联系，联系越多，页面性能就越差。导致这个问题的原因主要有两个：
  - 一个是删除带有事件处理程序的元素，这个时候被删除元素上有事件处理程序，就不会被垃圾收集程序正常清理
  - 另一个就是页面卸载，如果页面卸载后事件处理程序没有被清理，则会存在与内存中，每次加载或卸载程序都会导致残留的数据，所以在onunload事件中要清理注册的事件处理程序

## 模拟事件

- DOM3增加了自定义事件类型，自定义事件不会触发原生DOM事件，可以让开发者定义自己的事件，需要调用createEvent('CustomEvent')，返回的对象包含initCustomEvent()方法，该方法包含四个参数：
  - type: 要触发的事件类型，如"myEvent"
  - bubbles: 布尔值，表示是否冒泡
  - cancelable: 布尔值，表示事件是否可取消
  - detail: 对象，任意值，作为event对象的detail属性

```js
let div = document.getElementById('myDiv'), event;
div.addEventListener('myEvent', (event) => {
  console.log(`div:${ event.detail }`)
})
document.addEventListener('myEvent', (event) => {
  console.log(`document:${ event.detail }`)
})
if(document.implementation.hasFeature('CustomEvents', "3.0")) {
  event = document.createEvent("CustomEvent")
  event.initCustomEvent('myevent', true, false, 'Hello world')
  div.dispatchEvent(event)
}
```

- IE8及更早版本中模拟事件过程与DOM相似，创建event对象，指定信息，然后使用对象触发。不过IE中的实现步骤不一样
- 首先使用document的createEventObject()方法创建event对象。与DOM不同，该方法不接受参数，返回一个通用的event对象。
- 然后可以手动的给返回的对象指定希望该对象具有的属性。
- 最后在事件目标上调用fireEvent()方法，该方法接受两个参数：事件处理程序的名字和event对象。调用fireEvent时，srcElement和type属性会自动指派到event对象（其他属性需要手动指定）。

```js
var div = document.getElementById('myBtn')
var event = document.createEventObject()
event.screenX = 100
event.screenY = 0
event.clientX = 0
event.clientY = 0
event.ctrlKey = false
event.altKey = false
event.shiftKey = false
event.button = 0
btn.fireEvent('onclick', event)
```