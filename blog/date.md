---
title: "Date类型"
date: "2020-10-12"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# Date 类型

- Date构造函数可以接收毫秒数来创建时间对象，对此提供了辅助函数来进行毫秒数的获取

## Date.parse()

- 该方法接收一个表示日期的字符串，并转为对应的毫秒数，接受的格式如下
  - "月/日/年"，如"5/23/2019"
  - "月名日,年"，如"May 23, 2019"
  - "周几月名日年时:分:秒:时区"，如"Tue May 23 2020 00:00:00 GMT-0700"
  - 拓展格式"YYYY-MM-DDTHH:mm:ss.sssZ"，如："2020-05-23T00:00:00"
- 使用方式如下

```js
let time1 = new Date(Date.parse("May 23, 2020"))
// Sat May 23 2020 00:00:00 GMT+0800 (中国标准时间)
```

- 如果传给Date.parse()的字符串不能表示时间该方法返回NaN
- 如果在给new Date()传参时直接传了表示时间的字符串，那Date会在后台隐式调用Date.parse()，下代码与上面同样

```js
let time1 = new Date("May 23, 2020")
// Sat May 23 2020 00:00:00 GMT+0800 (中国标准时间)
```

- 关于越界时间，当我们传了一个不存在的时间比如3月32号时部分浏览器会返回4月1号的时间，有些浏览器则会直接返回当前时间，比如你在5月1日运行代码就会返回5月1号的时间
<!--more-->
## Date.UTC()

- 这个方法也是用于返回日期的毫秒数，但是参数不一样，参数是年，零起点的月数（也就是1月用0表示，2月用1表示，依次类推），日，时（0-24），分，秒，毫秒
- 只有年跟月是必须，其他的不填都默认为0，使用方式如下

```js
let time2 = new Date(Date.UTC(2020, 09, 12, 15, 44, 03))
// Mon Oct 12 2020 23:44:03 GMT+0800 (中国标准时间)
```

- 可以看到其实会被我们的参数当做UTC时间来做解析，最后得到的是本地的 23：44
- 当我们在new Date()的时候使用Date.UTC形式的参数，那Date也会隐式调用Date.UTC()，但是不同的是不会被当做UTC时间处理而是当做本地时间处理，如下

```js
let time2 = new Date(2020, 09, 12, 15, 44, 03)
// Mon Oct 12 2020 15:44:03 GMT+0800 (中国标准时间)
```

## Date原型方法

- Date对象重写了toString、valueOf、toLocalString方法
- toLocalString与toString，两个方法分别返回对应的GMT时间与本地时间，如下

```js
new Date().toLocaleString()
// "2020/10/12 下午3:53:58"
new Date().toString()
// "Mon Oct 12 2020 15:54:04 GMT+0800 (中国标准时间)"
```

- valueOf方法会返回对应时间的毫秒数，数字类型

```js
new Date().valueOf()
// 1602489459169
```

- Date格式时间的方法
  - toDateString()，显示时间中的周几、月、日、年
  - toTimeString()，显示时间中的时、分、秒、时区
  - toLocalDateString()，获取本地时间的周几、月、日、年
  - toLocalTimeString()，获取本地时间的时、分、秒、时区
  - toUTCString()，显示完整的UTC时间