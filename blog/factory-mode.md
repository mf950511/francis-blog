---
title: "JavaScript中的设计模式——工厂模式"
date: "2019-10-16"
name: 'francis'
age: '24'
tags: [JavaScript回顾,设计模式,进修]
categories: JavaScript
---

# JavaScript中的设计模式——工厂模式

- 在我们的项目开发中会定义很多的类，当协作开发时，每个人都有可能定义很多的类，若是不对每个人或者每一种类进行管理的话，开发中对类的使用将会极其困难，而工厂模式就是对类进行管理的一种模式
- 工厂模式一般有以下几种，分别对应不同的使用场景

<!--more-->

## 简易工厂模式

- 简易工厂模式：不去关心子类的创建过程，只是提供一个函数向外提供他们想要的子类即可
- 该模式就是单纯的对同一类型的类进行管理，使用者只需要传入每一个类的别名或简称即可获取该类
  
```js
    function LoginClass(){
        console.log('我是登录模块类')
    }
    function RegisterClass(){
        console.log('我是注册模块类')
    }
    function LogoutClass(){
        console.log('我是退出登录模块类')
    }

    function createUserClass(name){
        switch(name) {
            case 'login':
                return new LoginClass()
            case 'register':
                return new RegisterClass()
            case 'logout':
                return new LogoutClass()
        }
    }
    let login = createUserClass('login') // 构建登录模块
    let register = createUserClass('register') // 构建注册模块
    let logout = createUserClass('logout') // 构建退出登录模块
```

- 上面就是一个简易的工厂模式，一般用于管理同类型的类，对外提供每个类型的别名即可使用

## 工厂模式

- 工厂模式：工厂模式一般用于会不断创建新类时使用，比如我初始提供了三个类，突然需求变化新增了一个类，如果还使用建议工厂模式的话就需要先创建这个新类，然后在对外暴露的函数中再加一条case语句，会比较繁琐，所以就产生了工厂模式
- 工厂模式是对一个工厂类的拓展，在该类的原型对象上面绑定工厂内所能提供的子类，调用者通过传入不同的类名可获取相应的实例
- 工厂模式由于对外提供的是一个工厂类，若是项目新成员或者不熟悉开发的成员在调用过程中将其当做普通函数处理可能会出现异常并且会在全局对象上挂载太多全局变量，所以我们这里要对工厂类进行安全模式

```js
    function Factory(name){
        // 是否是类式调用，即有没有使用new方法来调用，若是按普通函数来调用则this会指向window，若以new的形式来调用，则会指向当前类
        if(this instanceof Factory) {
            // 采用new的形式调用则直接返回他想要的类
            return new Factory[name]()
        } else {
            // 若是不熟悉或者忘了new的调用则我们帮他们调用一下工厂类，最终还是返回他们想要的类
            return new Factory(name)
        }
    }
```

- 上面就是对工厂类的安全模式，可防止意外调用导致的一系列问题
- 对安全模式的工厂类进行原型对象绑定即可实现我们最终的工厂模式，按需创建类，按需获取类

```js
    function Factory(name){
        // 是否是类式调用，即有没有使用new方法来调用，若是按普通函数来调用则this会指向window，若以new的形式来调用，则会指向当前类
        if(this instanceof Factory) {
            // 采用new的形式调用则直接返回他想要的类，会获取原型对象上的属性，从而获取所需类的构造函数
            return new this[name]()
        } else {
            // 若是不熟悉或者忘了new的调用则我们帮他们调用一下工厂类，最终还是返回他们想要的类
            return new Factory(name)
        }
    }
    // 通过对工厂类原型对象的修改来获取工厂内存在的各个类，从而可以在工厂内提供人们需要的类
    Factory.prototype = {
        JS: function(){
            this.name = 'js'
        },
        PHP: function(){
            this.name = 'php'
            this.age = 16
            this.say = function(){
                console.log('php是世界上最好的语言')
            }
        },
        JAVA: function(){
            this.name = 'java'
            this.advantage = '我是最稳定的'
            this.say = function(){
                console.log(this.advantage)
            }
        }
    }

    var js = new Factory('JS')          
    var php = Factory('PHP')        // 异常调用，可正常返回所需实例
    var java = new Factory('JAVA')  // 正常调用
    php.say()   // php是世界上最好的语言
    java.say()  // 我是最稳定的

```

- 上面就是最终的工厂模式，可以看到，当我们需要添加新类的时候只需要在工厂类的原型对象上添加即可，添加完成便可以在别的地方传入名称直接由工厂类生成，需求变化也只需要修改一个地方即可
  
## 抽象类

- 了解抽象工厂类之前我们需要先了解抽象类，抽象类就是只能继承，无法实例化的一种类，实例化时会抛出异常，且继承抽象类的子类必须重写抽象类的方法。js中abstract仍然只是一个保留字，并没有实现抽象类，所以抽象类需要我们模拟实现
- 抽象类在实现上与普通类相似，只是对其方法进行了限制，下面的Car就是一个抽象类

```js
    let Car = function(){
        this.name = 'Car'
    }
    // 如果对Car直接进行实例化或者继承类没有重写下面的方法，则调用时会弹出报错
    Car.prototype = {
        getSpeed: function(){
            throw new Error('不可调用抽象方法')
        },
        getPrice: function(){
            throw new Error('不可调用抽象方法')
        }
    }
```

## 抽象工厂类

- 抽象工厂类是对外提供抽象类的工厂模式，下面就是一个抽象工厂模式

```js
    function VehicleFactory(SubClass, SuperClass){
        // 判断工厂内是否存在该抽象类，存在则进行子类的继承
        if(typeof VehicleFactory[SuperClass] === 'function'){
            function F(){}
            F.prototype = new VehicleFactory[SuperClass]()
            SubClass.prototype = new F()
            SubClass.prototype.constructor = SubClass
        } else {
            // 若不存在，则抛出异常
            throw new Error('未创建该抽象类')
        }
    }
    // 抽象小汽车类
    VehicleFactory.Car = function(){
        this.name = 'Car'
    }
    VehicleFactory.Car.prototype = {
        getSpeed: function(){
            throw new Error('不可调用抽象方法')
        },
        getPrice: function(){
            throw new Error('不可调用抽象方法')
        }
    }

    // 抽象公交车类
    VehicleFactory.Bus = function(){
        this.name = 'Bus'
    }
    VehicleFactory.Bus.prototype = {
        getSpeed: function(){
            throw new Error('不可调用抽象方法')
        },
        getPrice: function(){
            throw new Error('不可调用抽象方法')
        }
    }
    // 实体类
    function BWM(price, speed){
        this.price = price
        this.speed = speed
    }
    // 实现BWM对抽象类Car的继承,但不重写抽象方法
    VehicleFactory(BWM, 'Car')
    var b = new BWM(500000, 100)
    b.getPrice()    // Uncaught Error: 不可调用抽象方法
    b.getSpeed()    // Uncaught Error: 不可调用抽象方法
    // 实体类
    function BRT(price, speed){
        this.price = price
        this.speed = speed
    }
    // 实现BRT对抽象类Bus的继承
    VehicleFactory(BRT, 'Bus')
    // 重写抽象类中的方法
    BRT.prototype.getPrice = function(){
        console.log(this.price)
    }
    BRT.prototype.getSpeed = function(){
        console.log(this.speed)
    }
    var t = new BRT(300000, 80)
    t.getPrice()    // 300000
    t.getSpeed()    // 80
```

- 这里我们的抽象工厂可以实现一个实体类对其想要的抽象类的继承，注意点就是要重写抽象类的方法再调用，否则会抛出异常
