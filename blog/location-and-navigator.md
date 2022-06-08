---
title: "location对象与navigator对象"
date: "2020-12-23"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# location对象与navigator对象

## location对象

- location是常用的BOM对象，提供了当前窗口中加载文档的信息，以及常用的导航功能
- 它既是window属性，也是document属性，window.location跟document.location两个指向同一个对象
- location对象保存着当前加载文档的信息，还有URL解析为离散片段后能够属性访问的信息。
- 以下URL来做实例 "http://ouser:barpassword@www.wrox.com:80/WileyCDA/?q=javascript#contents"
  - location.hash: '#contents',散列值，#后跟零或者多个字符串，没有就是空字符串
  - location.host: 'www.wrox.com:80'，服务器名及端口号
  - locaion.hostname: 'www.wrox.com'，服务器名
  - location.href: 'http://www.wrox.com:80/WileyCDA/?q=javascript#contents', 当前加载页面的完整URL。location.toString就返回这个值
  - location.pathname: '/WileyCDA/'，URL中的路径和（或）文件名
  - location.port: "80"，请求的端口，如果URL中没有端口返回空字符串
  - location.portocol: 'http:'，页面使用协议，一般是"http:"或"https:"
  - location.search: "?q=javascript"，URL的查询字符串，以问号开头
  - location.username: 'ouser'，域名前指定的用户名
  - location.password: 'barpassword'，域名前指定的密码
  - location.origin: 'http://www.wrox.com'，URL的源地址，只读
- URL中的多数信息都能通过以上方法获取，search中的查询字符串就需要我们单独处理了
<!--more-->
```js
function getQueryStringArgs (search){
  let qs = (search.length > 0 ? search.substring(1) : '')
  let args = {}
  for(let item of qs.split('&').map(kv => kv.split('='))) {
    let name = decodeURIComponent(item[0]), value = decodeURIComponent(item[1])
    if(name.length) {
      args[name] = value
    }
  }
  return args
}
let qs = '?q=javascript&num=10'
console.log(getQueryStringArgs(qs)) // {q: "javascript", num: "10"}
```

- URLSearchParams提供了标准API来检查和修改字符串。给URLSearchParams构造函数传入一个查询字符串，就可以创造一个实例，实例暴露了get()、set()、delete()等方法。
- 大多数支持URLSearchParams的浏览器也都支持URLSearchParams作为迭代对象

```js
let qs = '?q=javascript&num=10'
let searchParams = new URLSearchParams(qs)

for(let params of searchParams) {
  console.log(params)
}
// ["q", "javascript"]
// ["num", "10"]

console.log(searchParams.toString()) // q=javascript&num=10
console.log(searchParams.has("num")) // true
console.log(searchParams.get("num")) // 10
searchParams.set("page", "3")
console.log(searchParams.toString()) // q=javascript&num=10&page=3
searchParams.delete("q")
console.log(searchParams.toString()) // num=10&page=3
```

- 可以通过修改location对象修改浏览器地址。常用的是使用assign并传入URL

```js
location.assign('http://www.wrox.com')
```

- 这行代码会启动导航到新URL，同时在浏览器历史记录中加一条。给location.href或window.location设置一个url也会以同一个URL来调用assign方法，下面的方法跟显示调用assign一样

```js
window.location = 'http://www.wrox.com'
location.href = 'http://www.wrox.com'
```

- 修改location对象的属性也会修改当前加载页面。hash、search、hostname、pathname、port设置后都会修改当前URL，如下例所示

```js
// 假设当前URL为 http://www.wrox.com/WileyCDA/
// 修改为 http://www.wrox.com/WileyCDA/#section1
location.hash = '#section1'
// 修改为 http://www.wrox.com/WileyCDA/?q=javascript
location.search = '?q=javascript'
// 修改为 http://www.somewhere.com/WileCDA/
location.hostname = 'www.somewhere.com'
// 修改为 http://www.wrox.com/myDir/
location.pathname = 'myDir'
// 修改为 http://www.wrox.com:8080/WileyCDA/
location.port = 8080

```

- 除hash外，只要修改location的属性，就会导致页面重新加载URL
- 修改hash的值会在浏览器历史中新增一个记录。早期的IE浏览器点击后退跟前进不会更新hash属性，只有点击包含散列的URL才会更新hash值
- 前面的方式修改URL后都会在历史记录中新增URL。点击后退就会返回到前页面，使用replace()方法可以不添加历史记录
- reload()可以重新加载当前的页面，不传参数会议最有效的方式加载，如果页面从上次请求后没有修改过，会从缓存加载。要强制从服务器重新加载，可以传一个true来让它强制从服务器加载，reload之后的代码可能执行可能不执行，取决于当前的网络延迟与系统资源

## navigator对象

- navigator是客户端标识浏览器的标准，浏览器启动JavaScript就会存在navigator对象。
- 每个浏览器都有自己支持的属性。navigator主要实现了下列属性和方法
  - activeVrDisplays: 返回数组，包含ispresenting为true的VRDisplay实例
  - appCodeName: 非Mozilla也会返回"Mozilla"
  - appName: 浏览器全名
  - appVersion: 浏览器版本，一般跟实际版本不符合
  - battery: 返回暴露Battery Status API的BatteryManager对象
  - buildId: 浏览器的构建编号
  - connection: 返回暴露Network Information API的NetworkInformation对象
  - cookieEnable: 布尔值表示是否启用了cookie
  - credentials: 返回暴露Credentials Management API的CredentialsContainer对象
  - deviceMemory: 返回单位为GB的设备内存容量
  - doNotTrack: 返回用户的“不跟踪”(do-not-track)设置
  - geolocation: 返回暴露Gelolocation
  - getVRDisplays(): 返回数组，包含可用的每个VRDisplay实例
  - getUserMedia(): 返回与可用媒体设备硬件关联的流
  - hardwareConcurrency: 返回设备的处理器设备核心
  - javaEnabled: 返回是否启用java的布尔值
  - language: 返回浏览器的主语言
  - languages: 返回浏览器偏好的语言数组
  - locks: 返回暴露 Web Locks API的LockManager对象
  - mediaCapabilities: 返回暴露MediaCapabilities API的MediaCapabilities对象
  - mediaDevices: 返回可用的媒体设备
  - maxTouchPoints: 返回设备触摸屏支持的最大触点数
  - mimeTypes: 返回浏览器注册的MIME类型数组
  - onLine: 返回表示浏览器是否联网的布尔值
  - oscpu: 返回浏览器运行设备的操作系统和CPU
  - permissions: 返回暴露Permissions API的Permissions对象
  - platform: 返回浏览器运行的系统平台
  - plugins: 返回浏览器中安装的插件数组，IE中包含页面中的所有\<embed>元素
  - product: 返回产品名称（一般是"Gecko"）
  - productSub: 返回产品的额外信息（一般是Gecko的版本）
  - registerProtocolHandler(): 讲一个网站注册为特定协议的处理程序
  - requestMediaKeySystemAccess(): 返回一个Promise，解决为MediaKeySystemAccess对象
  - sendBeacon(): 异步传输小数据
  - serviceWorker: 返回用来与ServiceWorker实例交互的ServiceWorkerContainer
  - share(): 返回当前平台的原生共享机制
  - storage: 返回暴露Storage API的StorageManger对象
  - userAgent: 返回浏览器的用户代理字符串
  - verdor: 返回浏览器的产商名称
  - verdorSub: 返回浏览器厂商的更多信息
  - vibrate()：触发设备震动
  - webdriver:返回浏览器是否能被自动化程序控制
- navigator一般用来判断浏览器的类型
- 检测插件，除IE10以下的浏览器都可以根据plugins数组来确定。数组中的每一项都有如下属性
  - name: 插件名称
  - description: 插件介绍
  - filename: 插件的文件名
  - length: 由当前插件处理的MIME类型数量

```js
function hasPlugin(name){
  name = name.toLowerCase()
  for(let plugin of window.navigator.plugins) {
    if(plugin.name.toLowerCase().indexOf(name) > -1) {
      return true
    }
  }
  return false
}
```

- plugins数组中的每个插件对象都有一个MimeType对象，可以通过中括号访问。每个MimeType都有四个属性：descriptor描述MIME类型，enabledPlugin是指向该插件的指针，suffixes是该MIME类型对应拓展名的逗号分割的字符串，type是完整的MIME类型字符串。
- IE11的window.navigator支持plugins和mimeTypes属性。IE11中的ActiveXObject从DOM中隐身，不可再用来检测特性
- IE10及以下的版本检测插件比较麻烦，因为不支持Netscape式的插件。要使用ActiveXObject，并尝试实例化特定插件。
- IE中的插件实习为COM对象，由唯一字符串标识。所以检测插件就必须知道COM标识符。Flah的标识符是"ShockwaveFlash.ShockwaveFlash"，有了信息就可以检测插件了

```js
function hasIEPlugin(name){
  try{
    new ActiveXObject(name)
    return true
  } catch(e) {
    return false
  }
}
```

- plugins有一个refresh()方法，用于刷新plugins属性以反映新安装的插件。接受一个参数布尔值表示刷新时是否重新加载页面。传入true则所有包含插件的页面都会重新加载，否则只刷新plugins，不会从新加载页面

## 注册处理程序

- 现代浏览器支持navigator上的registerProtocolHandler()方法。可以把一个网站注册为处理某种特定类型信息应用程序。在线SSR阅读器跟电子邮件客户端的流行，可以借助这个方法将Web应用程序注册为像桌面软件一样的默认程序。
- 使用registerProtocolHandler()方法，必须传入3个参数：要处理的协议（如"mailto"或"ftp"）、处理该协议的URL、以及应用名称。如下

```js
navigator.registerProtocolHandler('mailto', 'http://www.somemailcient.com?cmd=%s', 'Some Mail Client')
```

- 这个例子为"mailto"协议注册一个处理程序，这样邮件地址就可以通过指定的Web应用程序打开。第二个参数是负责处理请求的URL，%s表示原始请求

## screen对象

- screen对象保存纯粹的客户端能力信息，也就是浏览器窗口外面的客户端显示器的信息，比如像素宽度与像素高度。属性如下
  - availHeight: 屏幕像素高度减去系统组件高度（只读）
  - availLeft: 没有被系统组件占用的屏幕最左侧像素（只读）
  - availTop: 没有被系统组件占用的屏幕最顶端像素（只读）
  - availWidth: 屏幕像素宽度减去系统组件宽度（只读）
  - colorDepth: 屏幕颜色的位数，多数系统是32（只读）
  - height: 屏幕像素高度
  - left: 当前屏幕左边的像素距离
  - pixelDepth: 屏幕的位深（只读）
  - top:当前屏幕顶端的像素距离
  - width:屏幕像素宽度
  - orientation:返回Screen Orientation API中屏幕朝向

## history

- history对象表示当前窗口建立以来用户的导航历史记录。对象不会对外暴露用户访问过的URL，可以在不知道实际URL的情况下前进和后退
- go()可以在用户历史记录中前进和后退。只接受一个参数，表示前进或后退多少。负值表示后退（类似点击浏览器的后退按钮），正值表示历史记录中前进

```js
history.go(-1) // 后退一页
history.go(1) // 前进一页
history.go(2) // 前进两页
```

- 部分旧版浏览器中，go()方法参数可以是一个字符串，这种情况下浏览器会导航到历史中包含该字符串的第一个位置。可能前进也可能后退。如果没有匹配到就什么也不做
- go()有两个简写方法：back()与forward()

```js
history.go('wrox.com')
history.back()
history.forawrd()
```

- history对象还有一个length属性，表示有多个条目，对于第一个页面，history.length为1，通过这个方法可以确定用户浏览起点是不是你的页面

## 历史状态管理

- hashChange在页面URL散列发生变化时被触发，开发者可以执行部分操作。状态管理API就可以让开发者改变浏览器URL而不用加载新页面。使用history.pushState()方法。接收3个参数：一个state对象、一个新状态的标题和一个（可选的）相对URL：例如

```js
let stateObject = {foo: 'bar'}
history.pushState(stateObject, 'My title', 'baz.html')
```

- pushState方法执行后，状态信息会被推到历史记录中，浏览器地址栏会改变。除了这个变化外，即使location.href返回的是地址栏中的内容，浏览器也不会发送请求。第二个参数并未被当前实现使用，所以可以传一个空字符串或者一个短标题。
- 第一个参数应该包含正确初始化页面状态所需的信息。状态大小有限制，通常在500k-1M以内
- pushState()会创建新的历史记录，所以会启用后退按钮，点击后退触发window对象的popstate事件。popstate事件有一个state属性，包含通过pushState第一个参数传入的state对象：

```js
window.addEventListener('popstate', (event) => {
  let state = event.state
  if(state) {
    console.log(state)
  }
})
```

- 基于这个状态应该把页面重置为状态锁边傲视的状态（浏览器不会为你做这些）。页面初次加载时没有状态，所以点击后退返回到最初页面时，event.state为null
- 可以通过history.state获取当前的状态对象，也可以使用replaceState()并传入与pushState同样的前两个参数来更新状态。更新状态不会创建新历史，只会覆盖当前状态：

```js
history.replaceState({ newFoo: 'newBar' }, 'New Title')
```

- 传给pushState与replaceState的state对象应该只包含可以被序列化的内容。所以DOM信息不适合放到状态对象里面。