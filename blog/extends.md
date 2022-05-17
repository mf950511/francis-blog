---
title: 'JavaScript中的继承'
name: Francis
age: 24
date: "2019-03-21"
tags: ['JavaScript', '进修', 'ES2015']
categories: JavaScript
---

# 继承的实现与原理

## 继承

- `继承`是面向对象中的一个特性，与`多态`，`封装`称为面向对象的三个基本特征
- 使用`继承`可以使一个对象快速拥有另一个对象的属性与方法，并能够重新定义自己的方法
- `JavaScript`中并没有真正的类，所以实现`继承`可以通过`原型链`或者通过改变`this`来实现`伪造对象继承`
<!--more-->

## ES5中的实现

- `es5`中的继承实现一般有三种方式
- 构造继承
   - 构造继承是在子类的内部调用超类的构造函数，并将`this`的指向替换为子类
   - 可以通过`bind`,`apply`,`bind`来实现

```js
  function Person(name, age) {
    this.name = name
    this.age = age
    this.say = function(){
      console.log(`我是${this.name},我${this.age}岁了`)
    }
  }
  function Child(name, age){
    // bind方法
    Person.bind(this)(name, age)
    // call方法
    Person.call(this, name, age)

    // apply方法
    Person.apply(this, [name, age])
  }
  var child = new Child('张三',24)
  child.say() // 我是张三,我24岁了
```
   - 上面三种方法都可以实现子类的继承，但是缺点是未共享父类方法，内存浪费

- 原型链继承
   - `原型链继承`其实就是将超类的一个实例作为子类的原型，从而实现子类共享父类属性与方法

```js
  function Person1(name, age){
    this.name = [name]
    this.age = age
    this.rename = function(){
      this.name.push(name)
    }
    this.say = function(){
      console.log(`我是${this.name},我${this.age}岁了`)
    }
  }
  function Child1(){}
  Child1.prototype = new Person1('李四', 27)
  var child = new Child1() 
  child.rename()
  console.log(child.name) // ["李四", "李四"]
  var child1 =  new Child1() 
  console.log(child1.name)   // ["李四", "李四"]
```
   - 这里我们也发现在继承的同时我们失去了向超类传递参数的可能
   - 这里我们实现了两个子类共享了超类的`方法`，但是却也共享了`属性`，从而导致实例一调用rename方法则实例二的name属性也会变化

- 组合继承
   - `组合继承`就是将上述两种方法结合到一起，实现的属性继承且不会互相影响，并能向超类传递参数

```js
  function Person2(name, age){
    this.name = [name]
    this.age = age
    this.rename = function(){
      this.name.push(name)
    }
    this.say = function(){
      console.log(`我是${this.name},我${this.age}岁了`)
    }
  }
  function Child2(name, age){
    Person2.call(this, name, age)
  }
  Child2.prototype = new Person2()
  Child2.prototype.constructor = Child2
  var child = new Child2('王五', 30)
  child.rename()
  child.say()  // 我是王五,王五,我30岁了   rename只改变了我自己的实例
  var child1 = new Child2('孙刘', 40)
  child1.say() // 并不受另一个实例的影响

```
   - 这里我们使用`Child2.prototype = new Person2()`的时候将`Child2`的原型的构造函数给指向了`Person2`，他应该指向`Child2`的
   - 所以我们添加了`Child2.prototype.constructor = Child2`来将其指向偏转回来
   - `组合继承`相对来说比较优秀，但是`超类`构造函数被调用两次，子类实例的属性存在两份，造成内存浪费

- 寄生继承
   - 寄生继承就是利用`Object.create`方法来取得超类的`原型对象`并构造成为子类的`原型`，从而实现子类继承父类属性与方法

```js
  function Person3(name, age){
    this.name = [name]
    this.age = age
    this.say = function(){
      console.log(`我是${this.name},我${this.age}岁了`)
    }
  }
  Person3.prototype.rename = function(name){
    this.name.push(name)
  }
  function Child3(name, age){
    Person3.call(this, name, age)
  }
  Child3.prototype = Object.create(Person3.prototype)
  var child1 = new Child3('刘琦', 34)
  child1.rename('小孩')
  child1.say() // 我是刘琦,小孩,我34岁了
  var child2 = new Child3('王八', 35)
  child2.rename('大人')
  child2.say() // 我是王八,大人,我35岁了
```

   - `Person3.prototype`其实可以看作`Person3`的一个实例，这里我们使用`Object.create`创建了一个原型对象为`Person3.prototype`的对象作为`Child3`的原型对象
   - 从而实现`Person3`的实例共享同一属性与方法

## ES6中的继承

- ES6中我们可以通过extends来实现继承
```js
  class Person {
    constructor(name, age){
      this.name = name
      this.age = age
    }
    say(){
      console.log(`我是${this.name},我${this.age}岁了`)
    }
  }
  class Child extends Person {
    constructor(name, age){
      super(name, age)
    }
  }
  var child = new Child('张三', 18)
  child.say() // 我是张三,我18岁了
```
- `ES6`中的继承就跟传统语言中的一样了，只需要定义方法与私有方法即可