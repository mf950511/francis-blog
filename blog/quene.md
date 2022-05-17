---
title: "JavaScript中实现数据结构队列"
date: "2020-01-02"
name: 'francis'
age: '24'
tags: [JavaScript回顾,数据结构,进修]
categories: '数据结构'
---

# 队列

- 队列也是我们编程当中经常用到的一个数据结构，具有先入先出的特性，跟平时我们的排队一样，先进来先走
- 同样，JavaScript并没有队列这个数据类型，所以需要我们自己来实现，因为队列同样具有顺序，且可以存入与去除，所以我们采用数组来做一个简单的实现
- 首先定义一个队列类，因为只涉及到数据的存储，所以初始设置一个容器就可以

```js
function Quene(){
  this.dataStore = []
}
```

- 上面就是一个队列的基本属性了，接下来就是队列拥有的方法，分别为入队，出队,获取队首元素，队尾元素，队列是否为空

<!--more-->

```js
Quene.prototype = {
  enquene: function(data){
    // 队列元素只能添加到队列最后面，所以我们直接使用数组push方法即可
    this.dataStore.push(data)
  },
  dequene: function(){
    // 队列元素出队是移除第一个元素，可以使用数组的shift方法移除数组的第一个元素
    return this.dataStore.shift()
  },
  front: function(){
    // 查询队首的元素
    return this.dataStore[0]
  },
  back: function(){
    // 查询队尾的元素
    return this.dataStore[this.dataStore.length - 1]
  },
  isEmpty: function(){
    return this.dataStore.length === 0 ? true : false
  },
  toString: function(){
    // 用于遍历展示队列的元素
    let str = ''
    for(let i = 0; i < this.dataStore.length; i++) {
      str += '下一个是: ' + this.dataStore[i] + ' ,'
    }
    return str
  }
}
```

- 上面就是一个完整的数据类型队列的实现，我们可以拿来尝试一下队列的经典案例

## 队列实现舞池效果

- 舞池效果，舞池可供男女组队跳舞，但是男女的人数都不固定，所以需要一套匹配系统，当同时有男生女生排队时则播报入场男生名字与女方入场名字，若是只有男生或者女生，则播报男生或者女生的等待名称
- 根据这个需求，我们需要确立一个舞者的类，具有性别与姓名的属性
  
```js
// 舞者类
function Dancer(name, sex){
  this.name = name
  this.sex = sex
}

// 跳舞者的文档资料，前面为性别，后面为名称
let dancers = `
F A
M B
F C
M D
F E
M F
M G
`
// 用于存储男女舞者
let M = new Quene()
let F = new Quene()

function initDancer(){
  let dancerArr = dancers.split('\n')
  // 剔除空字符串
  dancerArr = dancerArr.filter(item => {
    if(item.trim()) {
      return item.trim()
    }
  })
  // 对所有舞者进行分组排列
  dancerArr.forEach(item => {
    let name = item.split(' ')[1], sex = item.split(' ')[0]
    if(sex === 'F') {
      F.enquene(new Dancer(name, sex))
    } else {
      M.enquene(new Dancer(name, sex))
    }
  })
}

initDancer()

function dancer(){
  console.log('The dancer parters are \n')
  while(!M.isEmpty() && !F.isEmpty()) {
    console.log(`男方入场者为：${ M.dequene().name }，女方入场者为${ F.dequene().name }`)
  }
  if(!M.isEmpty()){
    console.log(`男方等待区为：${ M.dequene().name }`)
  }
  if(!F.isEmpty()){
    console.log(`女方等待区为: ${ F.dequene().name }`)
  }
}

dancer()
// The dancer parters are 
// 男方入场者为：B，女方入场者为A
// 男方入场者为：D，女方入场者为C
// 男方入场者为：F，女方入场者为E
// 男方等待区为：G

```



