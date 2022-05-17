---
title: "客户端检测--高程4"
date: "2020-12-28"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 客户端检测

- 客户端在Web开发中是绕不过的话题，浏览器之间的差异与奇异行为，让我们必须使用客户端检测来进行补救，常见的补救方式为先设计最常用的方案，然后针对其他浏览器进行补救

## 能力检测

- 能力检测基于JavaScript测试浏览器是否支持某种特性，不需要知道浏览器的信息，只需要知道这种能力浏览器是否存在即可，常见的IE5之前没有document.getElementById()方法，但可以通过document.all属性实现同样的功能

```js
function getElement(id){
    if(document.getElementById){
        return document.getElementById(id)
    } else if(document.all) {
        return document.all[id]
    } else {
        throw new Error('No way to retrive element')
    }
}
```

- 能力检测最有效的就是检测属性不仅存在，还要能够有预期的表现，以确定一个对象是否可以排序时

```js
// 错误形式
function isSortable(object) {
    return !!object.sort
}
isSortable({ sort: true })

// 正确形式
function isSortable(object){
    return typeof object.sort === 'function'
}

```
<!--more-->
- 恰当的使用能力检测可以分析运行代码的浏览器，一般将这些按照能力归类浏览器的操作集中进行，不用等到执行代码在检测

```js
// 浏览器是否支持Netscape式的插件
let hasNSPugins = !!(navigator.plugins && navigator.plugins.length)
// 是否具有DOM Level 1 能力
let hasDom1 = !!(document.getElementById && document.createElenment && document.getElementByTagName)
```

- 下面是根据浏览器独特行为判断浏览器身份的方法

```js
class BrowserDetector {
    constructor(){
        // IE6 - IE 10
        this.isIE_Gte6Lte10 = /*@cc_on!@*/false
        // IE7 - 11支持
        this.isIEGte7Lte11 = !!document.documentMode
        // Edge 20及以上
        this.isEdge_Gte20 = !!window.StyleMedia
        // 所有Firefox
        this.isFirefox_Gte1 = typeof InstanllTrigger !== 'undefined'
        // chrome对象
        this.isChrome_Gte1 = !!window.chrome && !!window.chrome.webstore
        // safari 3-9.1
        this.isSafari_Gte3Lte9_1 = /constructor/i.test(window.Element)
        // safari 7.1及以上
        this.isSafari_Gte7_1 = (({ pushNotification = {} } = {}) => pushNotification.toString() == '[object SafariRemoteNotification]')(window.safari)
        // opera 20及以上
        this.isOpera_Gte20 = !!window.opr && !!window.opr.addons
    }

    isIE(){
        return this.isIE_Gte6Lte10 || this.isIEGte7Lte11
    }
    isEdge(){
        return this.isEdge_Gte20 && !this.isIE()
    }
    isFirefox(){
        return this.isFirefox_Gte1
    }
    isChrome(){
        return this.isChrome_Gte1
    }
    isSafari(){
        return this.isSafari_Gte3Lte9_1 || this.isSafari_Gte7_1
    }
    isOpera(){
        return this.isOpera_Gte20
    }
}
```

## 用户代理检测

- 用户代理检测可以通过浏览器的用户代理字符串确定使用的浏览器。用户代理字符串包含在每个http请求头的头部，JavaScript中可以通过navigator.useAgent访问。在服务器端，浏览器通过用户代理字符串确定浏览器并执行操作。
- 但在客户端，用户代理字符串都被认为不可靠，因为很长一段时间，浏览器都通过用户代理字符串包含错误或诱导信息欺骗服务器
- http规范（1.0和1.1）要求浏览器要向服务器发送包含浏览器名称和版本信息的简短字符串。一般要求用户代理字符串应该以“标记/版本”形式的产品列表
- 为分析代码运行在什么浏览器下，开发者一般会用window.navigator.userAgent返回的字符串值来分析。
- 相比于能力检测，用户代理检测的优势在于：能力检测可以保证脚本不必理会浏览器而正常执行。现代浏览器用户代理字符串的过去、现在和未来都是有章可循的，可以准确识别。

## 伪造用户代理

- 通过检测用户代理来识别浏览器并不是完美的方式，因为它可以造假。不过所有实现window.navigator对象的浏览器都提供userAgent只读属性，简单的给它设置其他值不会生效。
- 但是有很多简单的方法可以绕过这个限制，有些浏览器提供了__defineGetter__方法，利用它可以篡改用户代理字符串

```js
console.log(window.navigator.userAgent)

window.navigator.__defineGetter__('userAgent', () => 'foo')
console.log(window.navigator.userAgent)
```

- 所以如果我们相信浏览器返回的用户代理字符串，那就可以用来判断浏览器。如果怀疑脚本或浏览器修改，那还是使用能力检测
