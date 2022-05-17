---
title: "JavaScript中实现数据结构栈"
date: "2019-12-25"
name: 'francis'
age: '24'
tags: [JavaScript回顾,数据结构,进修]
categories: '数据结构'
---

# 栈

- 栈是我们经常听到的数据结构，拥有后入先出的特性，可以理解为存放箱子的过程，存的时候后来的都放到先来的上面，取得时候也是从上面往下取，因为上面都是后来的箱子，所以会被先取出来
- JavaScript并没有栈这个数据类型，所以需要我们手动来实现，因为要涉及到一堆数据的存储，并且有先后顺序，还能实现存入与取出，最理想的实现数据类型自然就是我们的数组了，下面我们来实现一下栈
- 首先定义一个栈类，应该拥有一个存放数据的数组，以及标记最上面元素的一个标记

```js
function Stack(){
  this.top = 0
  this.dataStore = []
}
```

<!--more-->

- 上面就是一个栈的基本属性了，接下来就是栈拥有的方法，分别为存入，取出,因为所有的栈都有这些方法，所以我们定义在Stack的原型上

```js
Stack.prototype = {
  insert: function(data){
    // 因为top初始值为0，所以我们可以采用后加加的方式实现赋值后对top的加一来标识下一个位置
    this.dataStore[this.top++] = data
  },
  pop: function(){
    // 这里要移除最后一个元素并返回，这里top已经指向了下一个位置，所以我们返回元素需要前减减来返回我们最顶部的元素。而且我们并没有用数组pop的方式对数组进行改变，因为我们的插入方式是针对下标赋值的，只需要将下标改到最后一个元素，这样下次插入就会直接改变最后一个值了
    return this.dataStore[--this.top] 
  },
  peek: function(){
    // 这里我们只是要获取栈顶元素，并不是要从栈中移除元素，所以我们不改变top值
    return this.dataStore[this.top - 1]
  },
  length: function(){
    return this.top
  }
}
```

- 上面就是一个完整的数据类型栈的实现，我们可以拿来尝试一下栈的经典案例

## 栈实现进制转换

- 进制转换的方式，对一个数值，不停的整除以要转换的进制，取余数后继续整除以，直到最后整除以后为0截至，然后将所有余数倒置拼接即可拿到转换后的数值，按照这个规则，我们可利用栈来进行进制转换
  
```js
function toFixed(number, fix){
  let stack = new Stack()
  let str = ''
  while(number > 0) {
    stack.insert(number % fix)
    number = Math.floor(number / fix)
  }
  while(stack.length() > 0) {
    str += stack.pop()
  }
  return str
}

toFixed(12, 2) // 1100
```



