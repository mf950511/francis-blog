---
title: "script不为人知的标签属性"
date: "2020-09-23"
name: 'francis'
age: '24'
tags: [JavaScript回顾]
categories: JavaScript
---

# script不为人知的标签属性

## 普通引用

- js加载与执行都会阻塞页面渲染与执行，等到js加载并执行完成后才会继续页面的渲染

## async

- js加载不会阻塞页面渲染，js加载后就会立即执行，执行时会阻塞页面渲染，有多个async的文件时，跟引入的顺序无关，谁先加载完就执行谁

## defer

- js加载不会阻塞页面渲染，js加载后不会立即执行，等页面渲染完成后才执行，在 DOMContentLoaded 事件之前执行，有多个 defer 文件时，规范应该是按引入的顺序执行，但实际情况下并不一定按原有顺序执行，所以多个 defer 引入需注意
<!--more-->
## charset

- 定义js脚本使用的编码值，大多数浏览器都没有遵守它，无意义

## crossorigin

- 当正常引入跨域资源脚本时，因为浏览器限制，如果该脚本报错我们是拿不到报错信息的，监听onerror只能拿到script error，但是最新的html5规范又规定允许本地获取到跨域脚本错误的，这个时候，满足两个条件就可以实现
- 跨域资源服务器通过 Access-Control-Allow-Origin 头信息允许当前域名可以获取错误信息。
- script标签指定脚本地址是跨域资源，也就是我们的 crossorigin，当值为 anonymous 时不携带cookie等认证信息，当值为 use-credentials 会携带cookie等认证信息

## integrity

- 又称SRI，子资源完整性完整性。该值由两部分组成签名算法跟摘要签名内容组成，用 - 连接。
- 指定了该值之后，浏览器在拿到资源后会用 integrity 指定的签名算法对资源进行计算并与 摘要签名内容 进行比较，如果值不统一，说明是经过篡改的，就不会执行该资源

## type

- 传统意义上该值为"text/javscript"或者"text/ecmascript"，但是这两个值已经不赞成使用了
- 通常我们应该设置该值为"application/x-javascript"，虽然设置该值可能会导致脚本被忽略
- 其他在非IE浏览器下，我们可以设置为"application/javascript"或者"application/ecmascript"
- 如果设置该值为"module"，则该文件下的code会被视为ES6模块，只有这样才能使用import跟export关键字