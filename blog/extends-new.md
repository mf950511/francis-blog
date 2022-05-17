---
title: "JavaScript中的继承"
date: "2019-10-14"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---

# js中的继承（一）

- 之前也写过一篇关于js继承的一篇文章，不过是在刚开始了解继承的时候写的一篇，看了很多别人的博客，似懂非懂的情况下写了那篇，最近再看js设计模式的时候再次看到了它，也想比较详细的再写一篇
- 因为js中没有类，所以一般会以函数内部使用this赋值属性与方法的形式使函数具有类的功能，作为与普通函数的区分，我们会将这一类函数的首字母大写来表明这是一个类
- 继承就是让继承类具有被继承类的属性与方法，一般用于对某类的拓展
- 既然js都没有类的，自然更不会有继承存在了，这里我们就要用一些比较灵活的方法来实现类的继承了，传统的方法有以下几种

## 继承的实现

## 原型链继承

- 原型链继承的原理：继承实现的效果其实就是子类的实例具有父类的属性与方法，所以根据对象属性沿原型链查找的原理实现了原型链继承（对象查找某方法或属性时，会先在对象自身上找，当自身查找不到时，就会在__proto__指向的对象上面找，如果第一个__proto__对象上面也没有就会继续沿着__proto__往上找，一直到找到该属性或者null为止，这也就是原型链，对这一块感兴趣的话，可以先了解一下原型与原型链）
- 所以实现这一继承方法的话我们只需要使子类的原型对象为父类的实例即可，这样，子类实例查找属性时便会查找到子类的原型对象也就是父类的实例，便能获取到父类的构造函数内的属性与方法，若父类实例未查找到便会查找到父类的原型对象上面，这样也就实现了继承父类原型对象的方法，具体实现如下
  
<!--more-->

```js
  function Super(){
    this.name = '张三'
    this.age = 24
    this.favite = ['烧烤', '桑拿']
    this.showName = function(){
      console.log(this.name)
    }
  }
  Super.prototype.showAge = function(){
    console.log(this.age)
  }
  Super.prototype.showFavite = function(){
    console.log(this.favite)
  }

  function Sub(){}
  Sub.prototype = new Super()

  var a = new Sub()
  var b = new Sub()
  a.showName()  // 张三
  a.showAge()   // 24
  b.showFavite() // ["烧烤", "桑拿"]
  a.favite.push('看书')
  b.showFavite() // ["烧烤", "桑拿", "看书"]
```

- 这里我们也能发现此方法的弊端，所有子类共用一个原型对象，若该对象上面存在引用类型的属性，则任意子类修改所有子类都会改变，而且，子类实例化的时候不能接受参数

## 构造函数继承

- 构造函数继承：这里就要理解实例化的过程（也就是new的原理），可以参考另一篇博客（[js中new的原理与实现](https://blog.csdn.net/weixin_41900457/article/details/102557358)）。类实例化其实就是生成一个对象，并将this指向该对象，所以我们可以在子类的构造函数内调用父类的构造函数并将this指向子类，如此一来子类的实例对象就可以拥有父类构造函数内的属性与方法，实现方法如下

```js
  function SuperClass(name){
    this.name = name
    this.books = ['js', 'css', 'html']
    this.showBooks = function(){
        console.log(this.books)
    }
  }

  // showName为原型对象方法
  SuperClass.prototype.showName = function(){
      console.log(this.name)
  }


  function SubClass(name){
      SuperClass.call(this, name)
  }

  // 原理为使用call或apply在子类内部执行父类的构造函数，只不过将this的指向改为了子类，
  // 所以只能继承父类的属性方法，并不能继承父类原型的方法，所以showBooks可正常工作，showName会报错
  let a = new SubClass('张胜男')
  let b = new SubClass('江玉成')
  b.showBooks() // ['js', 'css', 'html']
  a.books.push('php')
  b.showBooks() // ['js', 'css', 'html']
  b.showName()  // TypeError()

```

- 该继承方式只能继承父类的属性方法，并不能继承父类原型的方法

## 组合继承

- 组合继承就是兼顾了上两种继承的优势与劣势进行的继承方式，既可以完整继承父类，也可以对子类初始化入参， 实现如下

```js
  function SuperClass(name){
    this.name = name
    this.books = ['js', 'css', 'html']
    console.log('我执行了')
    this.showBooks = function(){
        console.log(this.books)
    }
  }

  SuperClass.prototype.showName = function(){
      console.log(this.name)
  }

  function SubClass(name){
      SuperClass.call(this, name)
  }
  SubClass.prototype = new SuperClass()
  // 这里我们需要了解，任何原型对象的constructor属性都会指向自己的构造函数
  console.log(SubClass.prototype.constructor) // [Function: SuperClass] 这里子类的constructor属性指向了父类的构造函数，需要进行偏转
  SubClass.prototype.constructor = SubClass
  console.log(SubClass.prototype.constructor) // [Function: SubClass] 正常
  // 组合式继承，call或apply继承父类属性方法，设置子类原型为父类实例继承父类原型方法，即可实现功能完备的继承
  // 缺点：生成子类实例会调用两次父类构造函数，若父类原型对象上存在引用类型仍会出现所有子类共享该属性的问题
  let a = new SubClass('张三')
  let b = new SubClass('李四')
  b.showBooks() // ['js', 'css', 'html']
  b.showName()  // 李四
  a.books.push('php')
  b.showBooks() // ['js', 'css', 'html']
  console.log(a instanceof SuperClass)
```

- 这里是比较常用的继承方式，但仍不是最优解，上面我们可以看到生成子类实例会调用两次父类构造函数，若父类原型对象上存在引用类型仍会出现所有子类共享该属性的问题
- 这一篇先介绍这三种继承方式，下一篇带来剩下几种继承的形式

  

