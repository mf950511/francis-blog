---
title: "jquery选择器的实现"
date: "2019-10-31"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---

# jQuery选择器的简单实现

- jQuery是前几年前端开发中的老大哥了，而我们最喜欢的也是他提供的选择器跟链式调用的方法了，最近在看了原型与原型链之后也是有点简单的想法，想尝试着实现以下jquery的选择器
- 首先需要构建一个函数A可以接受一个id名，返回一个新的对象，而且对象具有jquery提供的一系列方法，所以我们可以构造一个拥有这些方法的B对象并返回

```js
  function A(selector){
    return B
  }
  let B = {
    length: 3,
    size: function(){
      return this.length
    }
  }
```

<!--more-->

- 但是单纯的B对象的没办法接收选择器名称，所以我们可以给B添加一个初始化函数init，接收一个选择器名称，并返回最后的对象，因为返回的对象需要拥有B上面的方法，所以我们还是选择将B对象返回，但是我们也需要获取到的dom元素，所以，参照jquery的方法，我们可以将B对象的0属性设置为获取到的dom元素,并且更新B对象的length属性。那如何在函数内返回B对象那？因为init方法是挂载在对象身上的，所以，我们需要返回B对象的时候只需要返回this就可以了

```js
  function A(selector){
    return B.init(selector)
  }
  let B = {
    init: function(selector){
      let dom = document.getElementById(selector)
      this[0] = dom
      this.length = 1
      return this
    },
    length: 3,
    size: function(){
      return this.length
    }
  }
```

- 这里的话我们需要手动实现一个B对象，过于繁琐，其实我们可以将A函数的fn属性设置为这个对象，这样就省去了显式的创建B对象

```js
  function A(selector){
    return A.fn.init(selector)
  }
  A.fn = {
    init: function(selector){
      let dom = document.getElementById(selector)
      this[0] = dom
      this.length = 1
      return this
    },
    length: 3,
    size: function(){
      return this.length
    }
  }

  var a = A('demo') // Object {0: #demo, init: f, length: 1, size: f}
  var t = A('test') // Object {0: #test, init: f, length: 1, size: f}
  console.log(a)    // Object {0: #test, init: f, length: 1, size: f}
```

- 上面我们能发现，如果直接返回A.fn这个对象的话则所有通过A函数获取到的对象会公用一个对象，包括属性，这样的话就会相互影响，取不到我们想要的dom，所以我们可以在返回前使用new进行修饰，但是new的特性导致返回的对象中的this将不再指向我们的A.fn，也就意味这我们不能使用size()方法，所以我们可以指定A.fn.init的prototype到A.fn从而获取size方法

```js
  function A(selector){
    return new A.fn.init(selector)
  }
  A.fn = {
    init: function(selector){
      let dom = document.getElementById(selector)
      this[0] = dom
      this.length = 1
      return this
    },
    length: 3,
    size: function(){
      return this.length
    }
  }

  A.fn.init.prototype = A.fn

  var a = A('demo')         // Object {0: #demo, init: f, length: 1, size: f}
  var t = A('test')         // Object {0: #test, init: f, length: 1, size: f}
  console.log(a.size())     // 1
```

## extend方法实现

- 上面我们就简单的实现了一个id选择器，下面的话我们需要实现一下jQuery拓展插件的方式extend，extend方法其实就是对对象的整合并返回新的对象，所以要根据参数进行拓展，单对象则在当前对象拓展，多对象则融合并返回
  
```js
  A.extend = A.fn.extend = function(...args){
    let len = args.length, target
    if(len === 0) {
      return
    }
    if(len === 1) {
      target = this
      for(let key in args[0]) {
        target[key] = args[0][key]
      }
    } else {
      target = args[0]
      for(let i = 1; i < len; i++) {
        for(let key in args[i]) {
          target[key] = args[i][key]
        }
      }
    }
    return target
  }

  var a = A('demo')
  a.extend({b: 3, d: 4})
  console.log(a) // Object {0: #demo, length: 1, b:3, d: 4}

  A.extend(a, {e: 4})

  console.log(a) // Object {0: #demo, length: 1, b:3, d: 4, e:4}
```

- 上面就是拓展插件extend方法的实现，利用这个方法，可以在A函数或者选择之后的对象进行拓展

## 链式调用的实现

- 链式调用就是在每个方法执行完成之后都将当前this放回，这样接下来的方法便都可以拿到这个对象并接着调用，所以我们可以先拓展几个常用的jquery的方法

- on方法的实现，由于各浏览器的兼容性问题，所以我们对事件绑定方式on进行一个简单的实现，还是要用到我们的extend方法，因为选择器返回的对象都可以调用这个方法，所以我们将其拓展到A.fn对象上面

```js
A.fn.extend({
  // 立即执行函数获取各浏览器下的绑定方式并绑定到on方法上，避免每次调用都要判断浏览器环境
  on: (function(){
    if(document.addEventListener) {
      return function(type, fn){
        for(let i = 0; i < this.length; i++) {
          this[i].addEventListener(type, fn, false)
        }
      }
    } else if(document.addEvent) {
      return function(type, fn){
        for(let i = 0; i < this.length; i++) {
          this[i].addEvent('on'+type, fn)
        }
      }
    } else {
      return function(type, fn){
        for(let i = 0; i < this.length; i++) {
          this[i]['on' + type] = fn
        }
      }
    }
  })()
})

a.on('click', function(){
  console.log(this.innerHTML) // 1
})

```

- 上面我们对A.fn进行了拓展，使所有选择器返回的对象都可以进行数据绑定，并且可以成功打印1
- 接下来我们依次对其进行attr,css,html方法的拓展，在对css方法进行拓展的时候我们先对A进行了拓展，使其拥有可以将-连接的css属性转为驼峰命名的css属性，从而实现我们的赋值
  
```js

A.extend({
  // 常用css转驼峰
  cameName: function(str){
    return str.replace(/\-(\w)/g, function(all, letter){
      return letter.toUpperCase()
    })
  }
})

A.fn.extend({
  attr: function(...args){
    if(args.length < 1) {
      return
    }
    if(args.length === 1) {
      if(typeof args[0] === 'string') {
        return this[0].getAttribute(args[0])
      } else {
        for(let i = 0; i < this.length; i++) {
          for(let key in args[0]) {
            this[i].setAttribute(key, args[0][key])
          }
        }
      }
    } else {
      for(let i = 0; i < this.length; i++) {
        this[i].setAttribute(args[0], args[1])
      }
    }
    return this
  },
  html: function(...args){
    console.log(args)
    if(args.length) {
      for(let i = 0; i < this.length; i++) {
        this[i].innerHTML = args[0]
      }
      return this
    } else {
      return this[0].innerHTML
    }
  },
  css: function(...args){
    if(args.length < 1) {
      return
    }
    if(args.length === 1) {
      const name = args[0]
      if(typeof args[0] === 'string') {
        if(this[0].currentStyle){
          return this[0].currentStyle[name]
        } else {
          return getComputedStyle(this[0], false)[name]
        }
      }else if(typeof args[0] === 'object') {
        for(let i = 0; i < this.length; i++) {
          for(let key in args[0]) {
            this[i].style[A.cameName(key)] = args[0][key]
          }
        }
      }
    } else {
      const name = args[0]
      for(let i = 0; i < this.length; i++) {
        this[i].style[A.cameName(name)] = args[1]
      }
    }
    return this
  }
})

```

- 上面我们就实现了jquery常用的几个方法与链式调用，下面我们就可以使用上面的方法进行调用
  
```js
a.css('background-color', '#0f0').html('我是链式调用').attr('data-tag', 'div').on('click', function(){
    alert(this.innerHTML)
})
```
