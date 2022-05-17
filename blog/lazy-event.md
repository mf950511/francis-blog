---
title: "事件绑定的两种优化方式"
date: "2019-11-01"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---


# 事件绑定的两种优化方式

- 事件绑定在我们的项目中是经常存在的，但因为各浏览器对事件绑定的支持度不同，使我们不得不写一个兼容函数来实现事件绑定，常规的写法如下

```js
function on(dom, type, fn){
  if(document.addEventListener) { // IE9以上及主流浏览器
    dom.addEventListener(type, fn, false)
  } else if(document.attachEvent) { // IE8一下浏览器
    dom.attachEvent('on' + type, fn)
  } else { // dom0级支持浏览器
    dom['on' + type] = fn
  }
}
```

- 上面的写法虽然能解决我们的问题，但是在页面中使用时，每绑定一次就要走一次逻辑判断，而这一部分其实是可以优化的，优化的方式一般有两种，一种是页面加载完毕便执行一个立即执行函数完成on的赋值，另一个则是在第一次调用的时候完成on的重新赋值
- 页面加载完成赋值的实现如下

<!--more-->

```js

var on = (function(){
  if(document.addEventListener) {
    return function(dom, type, fn){
      dom.addEventListener(type, fn)
    }
  } else if(document.attachEvent) {
    return function(dom, type, fn){
      dom.attachEvent('on' + type, fn)
    }
  } else {
    return function(dom, type, fn){
      dom['on' + type] = fn
    }
  }
})()

```

- 通过开始的立即执行函数完成条件判断，并重新返回一个符合该浏览器兼容的绑定函数给on，这样在之后的函数绑定时就会使用这个返回的函数而不用再去判断一次浏览器情况
- 缺陷就是在页面开始加载的时候就会执行，如果页面依赖比较多的情况下建议使用第二种方式
- 第一次调用时绑定，也就是利用懒性模式实现绑定，实现方式如下

```js
function on(dom, type, fn){
  if(document.addEventListener) {
    on = function(dom, type, fn){
      dom.addEventListener(type, fn, false)
    }
  }else if(document.attachEvent) {
    on = function(dom, type, fn){
      dom.attachEvent('on' + type, fn)
    }
  } else {
    on = function(dom, type, fn){
      dom['on' + type] = fn
    }
  }
  on(dom, type, fn)
}
```

- 这种方式的实现是在浏览器判断条件完成之后对on重新赋值，并且在赋值之后进行函数的调用，这样在第一次执行之后on就被重新赋值，下次绑定就不会再走条件判断了，适用于首屏加载依赖比较多的情况
