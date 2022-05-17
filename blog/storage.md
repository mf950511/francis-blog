---
title: "storage工具类的封装"
date: "2019-11-01"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---


# Storage工具类的封装

- 日常开发中我们都会涉及到前端数据的存储，对一些需要长期保存在客户端的数据，我们通常会采用浏览器提供的localStorage对象，简称Storage对象。
- 由于所有的页面处于同一个浏览器环境下，所以各个开发工程师所存储的Storage数据可能会出现同名情况，这样就会相互覆盖相互影响，所以为了解决这一问题，我们需要每个开发者都对自己的存储数据进行前缀命名好避免数据的污染
- Storage的存储api提供的比较简单，所以要实现这个功能就要我们进行进一步的封装与拓展，以实现我们的需求，首先我们构建一个Storage类，接收一个开发者id与数据分隔符（用于区分内容值与内容有效时间），并初始化状态对象

<!--more-->  


```js
function Storage(userId, sep){
  this.userId = userId  // 开发者标识
  this.sep = sep || '|_|'       // 数据分隔符
  this.Storage = localStorage || window.localStorage
  this.status = { // 操作状态值
    FAILUER: 0,   // 失败
    SUCCESS: 1,   // 成功
    TIMEOUT: 2,   // 过期
    OVERFLOW: 3   // 溢出
  }
}

```

- 之后我们需要对这个类提供操作方法，常用的方法为get,set,remove，get方法一般接受键名与一个回调函数，set接受键名，键值，有限期与回调函数，remove接收一个键名与一个回调函数，下面我们分别来实现这几个方法
- 为了Storage实例可以调用这几个方法，所以我们将其绑定到Storage的原型上面

```js
Storage.prototype = {
  // 方便后续获取键名
  getKey: function(key){
    return this.userId + key
  },
  get: function(userKey, cb){
    let key = this.getKey(userKey)
    let status = this.status.SUCCESS
    let value, sepIndex, time, result
    try {
      value = this.Storage.getItem(key)
    } catch(e) {
      value = null
      status = this.status.FAILURE
      result = {
        value,
        status
      }
      cb && cb(result)
      return result
    }
    if(value) {
      sepIndex = value.indexOf(this.sep)
      time = value.slice(0, sepIndex)
      // 查看内容是否过期
      if(new Date().getTime() < new Date(time).getTime() || +time === 0){
        value = value.slice(sepIndex + this.sep.length)
      } else {
        status = this.status.TIMEOUT
        value = null
        this.remove(key)
      }
    } else {
      value = null
    }
    result = {
      value,
      status
    }
    cb && cb(result)
    return result
  },
  set: function(userKey, value, time, time = 0, cb){
    let key = this.getKey(userKey)
    let status = this.status.FAILURE
    let result
    // 是否设置时间，未设置默认一个月
    try {
      time = new Date(time).getTime()
    } catch (e) {
      time = new Date().getTime() + 30 * 24 * 60 * 60 * 1000
    }
    const realValue = time + this.sep + value
    // 检查是否数据过多溢出
    try {
      this.Storage.setItem(key, realValue)
    } catch (e) {
      status = this.status.OVERFLOW
    }
    result = {
      status
    }
    cb && cb(result)
    return result
  },
  remove: function(userKey, cb){
    let status = this.status.FAILUER
    let key = this.getKey(userKey)
    let result
    try {
      this.Storage.removeItem(key)
      status = this.status.SUCCESS
    } catch(e) {
    }
    result = {
      status
    }
    cb && cb(result)
    return result
  }
}
```

- 上面就是我们对Storage操作方法的实现，实现很简单，主要是处理一下各个情况下的状态值还有错误屏蔽，防止意外报错
- 下面我们可以尝试一下为张三设置一下存储信息

```js
let zsStorage = new Storage('zhangsan-')
myStorage.set('name', '张三')  // zhangsan-name: 0|_|张三
myStorage.get('name')         // {value: '张三', status: 1}
myStorage.remove('name')
```

- 这样一来就可以实现了一个适合我们使用的Storage的工具类