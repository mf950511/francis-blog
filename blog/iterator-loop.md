---
title: "迭代器在轮播图中的应用"
date: "2019-10-31"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---

# 采用迭代器形式封装轮播图对象

- 轮播图是我们开发中经常需要实现的一个小功能，但是应用于不同的场景需要对应不同的效果，有的需要淡入淡出，有的需要左侧划入，有的则需要上一张下一张的按钮
- 如果针对每个效果都要重新实现的话就会做太多的无用功，所以我们可以看看轮播图的共同点，然后封装一个迭代函数来帮助我们处理轮播图
- 轮播图都会接收一个数组作为图片的来源，轮播中我们可能会遇到上一张下一张的显示，所以我们对上一张下一张还有第一张与最后一张做特殊处理，也有可能会对轮播对象中的几个图片不做显示
- 所以我们可以提供一个迭代器对象，能对外提供操作数据的方法，包括next、pre、first、last的获取，包括对所有元素的初始化方法，包括对个别元素的操作方法

<!--more-->

```js
function Iterator(item) {
  let container = document.querySelector('.container')
  let items = container.getElementsByTagName(item)
  let length = items.length
  let index = 0
  return {
    // 获取下一张
    next: function(){
      if(index === length - 1) {
        index = length - 1
        return null
      } else {
        return items[++index]
      }
    },
    // 获取下一张
    pre: function(){
      if(index === 0) {
        index = 0
        return null
      } else {
        return items[--index]
      }
    },
    // 获取第一张
    first: function(){
      return items[0]
    },
    // 获取最后一张
    last: function(){
      return items[length - 1]
    },
    // 获取指定序号一张
    get: function(index){
      index = index >= 0 ? index % length : index % length + length
      return items[index]
    },
    // 所有图片统一处理方式
    dealEach: function(fn){
      Array.prototype.slice.call(items).forEach(item => {
        fn.call(item)
      })
    },
    // 单张图片特殊处理函数
    dealItem: function(index, fn){
      fn.call(items[index])
    },
    // 部分图片的排他处理
    exclusive: function(num, allFn, itemFn){
      this.dealEach(allFn)
      if(Object.prototype.toString.call(num) === '[object Array]') {
        num.forEach(item => {
          this.dealItem(item, itemFn)
        })
      } else {
        this.dealItem(num, itemFn)
      }
    }
  }
}
```

- 上面我们提供了一个处理轮播图对象的迭代器函数，分别对外暴露了pre,next,last,first,get,dealEach,dealItem,exlusive几个功能函数，使用时只需要指定轮播对象就可以正常使用了，使用方法如下

```js
  var it = Iterator('li')
  console.log(it.first()) // 获取第一个对象
  console.log(it.next())  // 获取下一个对象
  console.log(it.pre())   // 获取上一个对象
  console.log(it.last())  // 获取最后一个对象

  // 为元素统一设置背景色
  it.dealEach(function(){
    this.style.background = 'red'
  })
  // 单个元素修改其内容
  it.dealItem([2], function(){
      this.innerHTML = 'dealItem'
  })
  // 修改其他元素内容
  it.exclusive([1,3], function(){
      this.innerHTML = 'exclusive'
  }, function(){
      console.log(234, this)
      this.innerHTML = 'each'
  })
```

- 这样就提供了轮播图的操作对象，具体的轮播实现还要看各自的需求，借助这个轮播对象应该都会比较轻松