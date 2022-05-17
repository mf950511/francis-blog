---
title: "字符串模板的实现"
date: "2019-11-01"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---

# 字符串模板的实现

- 字符串模板是针对大批量、多频率操作dom的解决方案，比如我们要根据数据动态创建一个多嵌套的元素并将其插入到页面中，如果我们采用常规创建dom元素的方式进行插，代码量会极其庞大，下面就是常规方式实现的功能

<!--more-->

```js
// 源数据
let data = {
  data: {
    li: [
      {
        span: '我是span',
        strong: '我是strong'
      },
      {
        span: '我是span',
        strong: '我是strong'
      },
      {
        span: '我是span',
        strong: '我是strong'
      }
    ],
    h2: '我是第二标题',
    p: '我是p标签'
  },
  id: 'containter',
}

function createDom(data){
  let div = document.createElement('div')
  div.id = data.id
  let ul = document.createElement('ul')
  let p = document.createElement('p')
  let pt = document.createTextNode(data.data.p)
  let h2 = document.createElement('h2')
  let ph = document.createTextNode(data.data.h2)
  p.appendChild(pt)
  h2.appendChild(ph)
  let liData = data.data.li
  for(let i = 0, len = liData.length; i < len; i++) {
    let li = document.createElement('li')
    let span = document.createElement('span')
    let strong = document.createElement('strong')
    let t = document.createTextNode(liData[i].strong)
    let p = document.createTextNode(liData[i].span)
    span.appendChild(p)
    strong.appendChild(t)
    li.appendChild(span)
    li.appendChild(strong)
    ul.appendChild(li)
  }

  div.appendChild(ul)
  div.appendChild(p)
  div.appendChild(h2)
  document.body.appendChild(div)
}
```

- 上面的方式可以看到在大批量的创造dom，然后不停地嵌套添加，代码量大，并且效率低下
- 所以这里我们提供了一个模板字符串的函数来生成这个模板并最后插入到页面中，首先我们要提供一个字符串替换的一个函数用来将数据替换到页面中

```js
// 替换字符串模板中的数据
function formatString(str, data){
  return str.replace(/\{\{(\w+)\}\}/g, function(all, key){
    return data[key]
  })
}

```

- 然后根据数据结构创建我们的模板字符串与生成模板字符串的函数

```js
// 生成数据的函数
function createStrTemplate(data){
  let div = document.createElement('div')
  div.id = data.id
  // 获取li遍历的数据
  let liData = data.data.li
  let ulStr = ''
  // 根元素div的子元素模板
  let divStr = [
    '<p>{{p}}</p>',
    '<h2>{{h2}}</h2>',
    '<ul>{{ul}}</ul>'
  ].join('')
  // li的模板
  let liStr = [
    '<li>',
    '<span>{{span}}</span>',
    '<strong>{{strong}}</strong>',
    '</li>'
  ].join('')
  for(let i = 0, len = liData.length; i < len; i++) {
    // 遍历li数组生成li元素并将内里的数据进行填充
    ulStr += formatString(liStr, liData[i])
  }
  // 将填充好的字符串作为ul的源数据进行赋值
  data.data.ul = ulStr
  // 对div模板内的数据进行替换，并作为html内容进行赋值
  let divStrTemplate = formatString(divStr, data.data)
  div.innerHTML = divStrTemplate
  document.body.appendChild(div)
}

createStrTemplate(data)

```

- 这样便实现了我们的模板字符串函数，只操作了一次dom创建与一次添加便完成了功能，能极大地提升我们的执行效率
- 上面得代码可以看到创建的模板字符串都是同名标签加同名变量，我们可以对其进行进一步的处理
- 构造一个生产标签加变量的函数
  
```js
// 此函数可以接收字符串或者数组来生产对应的标签加变量
function view(name){
  if(Object.prototype.toString.call(name) === '[object Array]') {
    let str = ''
    for(let i = 0, len = name.length; i < len; i++) {
      str += view(name[i])
    }
    return str
  } else {
    return `<${name}>{{${name}}}</${name}>`
  }
}
```

- 有了这个函数之后我们就可以对上面得代码进行进一步的优化

```js
function createStringTemplate(data){
  let div = document.createElement('div')
  div.id = data.id
  // 生成div子元素模板
  let divStr = view(['p', 'h2', 'ul'])
  let ulStr = ''
  let liData = data.data.li
  // 这一句先是生成了li子元素的模板，生成了li模板，然后又将li子元素模板作为模板数据填充进li中
  let liTpl = formatString(view('li'), {li: view(['span', 'strong'])})
  for(let i = 0, len = liData.length; i < len; i++) {
    // 遍历li数组生成li元素并将内里的数据进行填充
    ulStr += formatString(liTpl, liData[i])
  }
  data.data.ul = ulStr
  // 对div模板内的数据进行替换，并作为html内容进行赋值
  let divStrTemplate = formatString(divStr, data.data)
  div.innerHTML = divStrTemplate
  document.body.appendChild(div)
}

createStringTemplate(data)
```

- 以上便是我们最终版的利用模板字符串替换频繁的dom操作，极大程度的提升我们的执行效率