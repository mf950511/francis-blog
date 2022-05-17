---
title: "JavaScript中的继承（二）"
date: "2019-10-15"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---

# js中的继承（二）

## 原型式继承

- 原型式继承：原型式继承可以根据现有对象创建一个新的对象，并且不用显式的创建一个新的自定义类型对象（道格拉斯说的）。这也就是原型式继承的作用，创建一个继承某对象属性并可进行拓展的的新对象。
- 原型式继承采用的其实还是类式继承的原理，只不过不会显式的构建一个对象子类，而是用一个空的构造函数类来做过渡类，然后把被继承的对象设置为过渡类的原型对象，然后返回一个过渡类的实例，这样这个返回的对象就有了被继承对象的属性与方法，具体实现见下代码

<!--more-->

```js
  function inheritObject(obj){
    function F(){} // 过渡类，一般为空
    F.prototype = obj // 设置过渡类原型对象
    return new F() // 返回新的实例
  }

  let book = {
    books: ['css', 'js', 'html'],
    name: 'css book',
    showBooks: function(){
      console.log(this.books, this.name)
    }
  }

  let b1 = inheritObject(book)
  let b2 = inheritObject(book)
  b1.name = 'js book'
  b2.name = 'html book'
  b2.showBooks() // ["css", "js", "html"]  "html book"
  b1.books.push('php')
  // 这里可以看到对b1的books属性进行操作会影响到b2的books属性
  b2.showBooks() // ["css", "js", "html", "php"]  "html book"
  b1.showBooks() // ["css", "js", "html", "php"]  "js book"

```

- 原型式继承其实就是对类式继承的另类使用，只不过使用一个空构造函数的过渡类来替代子类减少开销，用于创建对象是一个蛮不错的选择，也是后来Object.create()的实现思想来源。

## 寄生式继承

- 寄生式继承：就是对原型式继承的二次封装，并且在二次封装中对继承的对象进行了拓展，这样对象不仅拥有了父类中的对象与属性，也有了新的属性与方法
  
```js
  function inheritObject(obj){
    function F(){} // 过渡类，一般为空
    F.prototype = obj // 设置过渡类原型对象
    return new F() // 返回新的实例
  }
  function createBook(obj){
    var o = inheritObject(obj) // 获取原型式继承的对象
    // 对该对象进行拓展
    o.getName = function(){ 
      console.log(this.name)
    }
    return o
  }
  let book = {
    books: ['css', 'js', 'html'],
    name: 'css book',
    showBooks: function(){
      console.log(this.books, this.name)
    }
  }

  let b1 = createBook(book)
  b1.getName() // css book

```

- 只是比原型式继承多了一个函数封装，使其拥有了自己的属性与方法，产生这个继承方式的目的也是为了寄生组合式继承模型的实现

## 完美的继承模式——寄生组合式继承

- 寄生组合式继承：是寄生式继承与构造函数继承的组合形式，取了两个继承的优点产生的目前最完美的继承形式
- 构造函数继承使子类具有父类构造函数内的属性与方法，寄生式继承获取一个继承自父类原型对象的子对象，避免了父类原型对象的二次调用，因为该对象可获取父类原型对象上的属性与方法，设置该对象为子类原型对象继承父类原型对象上的属性与方法，最后对该对象进行属性增强修正其constructor不指向子类的错误

```js
  function inheritObject(obj){
    function F(){}
    F.prototype = obj
    return new F()
  }

  function inherit(Subclass, Superclass){
    // 生成一个继承父类原型对象的子对象
    let sup = inheritObject(Superclass.prototype) 
    // 该对象的constructor并不是指向子类，所以要对其进行属性拓展，修改其constructor属性至子类
    sup.constructor = Subclass
    // 将这个拓展过后的对象作为子类的原型对象
    Subclass.prototype = sup
  }

  function SuperClass(name){
    this.name = name
    this.favite = ['吃饭', '喝酒', '打篮球']
  }
  // 原型对象方法
  SuperClass.prototype.showFavite = function(){
    console.log(this.favite)
  }

  function SubClass(name){
    SuperClass.call(this, name)
  }
  // 实现继承
  inherit(SubClass, SuperClass)

  let s1 = new SubClass('张三')
  let s2 = new SubClass('李四')
  s2.showFavite() //  ["吃饭", "喝酒", "打篮球"]
  s1.favite.push('打豆豆')
  s2.showFavite() //  ["吃饭", "喝酒", "打篮球"]
  s1.showFavite() //  ["吃饭", "喝酒", "打篮球", "打豆豆"]

```

- 原型链与构造函数的组合继承中子类的原型对象为父类的一个实例，也就导致在对子类实现继承的时候会执行两次父类的构造函数（一次子类构造函数调用父类构造函数，一次生成父类实例时调用）。
- 而在寄生组合式继承中，每次继承都会由过渡类继承父类原型对象返回一个新的实例，而且由于过渡类的空构造函数并不会导致有太大的内存开销，就避免了父类构造函数的二次调用，所以这也是当下最完美的继承形式