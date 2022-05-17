---
title: 'ES2015生成器'
date: "2019-02-28"
name: 'Francis'
age: '24'
tags: [JavaScript,ES2015,进修]
categories: JavaScript
---

# 生成器详解

## 生成器

- 生成器是什么？为什么会需要生成器？

## 生成器的由来

- 传统异步流程对程序员并不友好，设定回调函数的方式不符合大脑对任务步骤的规划
- 生成器就是实现看似同步的异步流程控制

<!--more-->
# 生成器的奇特之处

## 打破完整运行

- 传统意义上，`javascript`函数一旦开始运行，那么在结束之前将没有别的代码可以打断并插入运行
- ES6引入了新的函数类型，并不符合从始到终不可打断的原则，这类新的函数就是生成器

```js
  var x = 1;
  function foo() {
    x++
    bar();
    console.log( "x:", x )
  }
  function bar() {
    x++
  }
  foo(); // x: 3 
```

- 这里因为`bar`存在于`foo`内部，所以可以实现`x`的改变，那如过在外面调用`bar`有没有可能改变`x`的输出呐？
- 如果在多线程语言中，这个自然可以通过抢占线程来实现，但javascript是一个单线程的语言。但是，要是我们通过让`foo`暂停然后先执行`bar`会怎么样呐？
- 下面就是我们用生成器来实现的效果

```js
  var x = 1;
  function *foo() {
    x++;
    yield; // 暂停！
    console.log( "x:", x );
  }
  function bar() {
    x++;
  } 
  // 构造一个迭代器it来控制这个生成器
  var it = foo();
  // 这里启动foo()！
  it.next();
  x; // 2
  bar();
  x; // 3
  it.next(); // x: 3
```

- `it=foo()` 运算其实只是生成了一个迭代器，并没有执行生成器（迭代器在下面会介绍）
- 第一个`it.next()`执行了生成器，也就运行了`*foo`代码里的`x++`这一句，停在了`yield`
- `*foo`停在了`yield`这里，第一个`it.next`调用结束，暂停了`foo`,此时`x`值变为`2`
- 暂停`foo`后我们执行了`bar`函数使`x`变为`3`
- 最后一个`it.next`将生成器恢复了，使其完成代码块的执行，打印了`3`
- 这里我们也能发现，生成器函数与普通函数相比函数名之前会多一个`*`,并且函数执行过程碰到`yield`会被暂停

## 输入与输出

- 生成器作为一个函数，除了有新的执行模式，还具备一般函数的基本特性，可接受参数与返回值

```js
function *foo(x,y) {
  return x * y;
}
var it = foo( 6, 7 ); 
var res = it.next();
res.value; // 42 
```

- 生成器的传参，返回值与传统函数一致
- 注意：这里我们能看到`foo(6,7)`并没有像普通函数一样执行，是因为这一步只是执行了迭代器的生成并赋值给了it,然后我们才可以对其进行暂停与恢复
- `it.next`是让生成器从当前位置继续运行，直到碰到下一个yield或者生成器代码执行结束
- `it.next`调用的结果是一个对象，有`value`属性，值为生成器返回的值(如果有的话)

## 迭代器消息传递

- 迭代器除了控制生成器之外，还提供了消息的输入与输出，通过yield与next(..)实现

```js
function *foo(x) {
  var y = x * (yield);
  return y;
}
var it = foo( 6 );
// 启动foo(..)
it.next();
var res = it.next( 7 );
res.value; // 42 
```

- 这里是外部消息的输入，`foo`函数接受原始参数6，之后执行到了`yield`这一步暂停，并要求调用代码即`it.next`为`yield`提供一个结果值
- 第二个`it.next`作为`yield`的恢复调用理所当然的需要提供一个值，也就是我们的7
- 所以函数内部`y = x * (yield)` 其实就是`y = 6 * 7`即`42`
- 这里我们要注意，迭代器的`next`总要比生成器的`yield`多一个，因为它需要第一个`next`来启动生成器，其后才是每次遇到`yield`暂停，`next`恢复

```js
function *foo(x) {
  var y = x * (yield "Hello"); // <-- yield一个值！
  return y;
}
var it = foo( 6 );
var res = it.next(); // 第一个next()，并不传入任何东西
res.value // "Hello"
res = it.next( 7 ); // 向等待的yield传入7
res.value; // 42 
```

- 这里与上面的改动在于`yield`之后跟了一个数据'Hello'，它其实是`yield`传给外面的数据，用来响应`next`的调用，可以理解为我启动了你要是暂停得给我个解释啊，抛出的一个返回值
- 上面也就是我们生成器的消息互通，通过yield与next构成消息的双向传递

# 迭代器

## 为什么需要迭代器

- 生成器是对函数的暂停与恢复执行，那么在多次暂停时就需要有东西来保存其暂停时的值，而迭代器的作用也就凸现出来了
- 迭代器是一个定义良好的接口，可以从一个生产者一步步得到一系列的值

```js
  var something = (function(){
    var nextVal;
    return {
      // for..of循环需要
      [Symbol.iterator]: function(){ return this; },
      // 标准迭代器接口方法
      next: function(){
        if (nextVal === undefined) {
          nextVal = 1;
        }
        else {
          nextVal = (3 * nextVal) + 6;
        }
        return { done:false, value:nextVal };
      }
    };
  })();
  something.next().value; // 1
  something.next().value; // 9
  something.next().value; // 33
  something.next().value; // 105 
```

- 上面就是一个标准的数字生产迭代器，`Symbol.iterator`存在的原因是ES6开始要想从一个可迭代对象中提取迭代器，则该对象必须是ES6符号值`Symbol.iterator`,调用这个函数会返回一个迭代器
- 这里我们可以通过`next`方法返回一个对象，该对象有两个属性值：`done`为boolean值，标识迭代器的完成状态，`value`返回迭代值

## 生成器与迭代器

- 上面就是迭代器的作用与简单实现，这里我们就可以知道当我们执行`it=foo()`这一步时为什么会返回一个迭代器了
- 严格来说生成器本身并不是一个`iterable(可迭代对象)`,但当你执行一个生成器时，就得到了一个迭代器

```js
function *foo(){ .. }
var it = foo(); 
```

- 生成器通过执行返回一个迭代器也就可以实现生成器的无限次暂停与恢复

# 生成器与异步编程模式

## 生成器与异步回调

- 在传统的异步函数ajax中，我们为了实现异步数据获取通常会使用异步回调的方法，如下

```js
function foo(x,y,cb) {
  ajax(
  "http://some.url.1/?x=" + x + "&y=" + y,
  cb
  );
}
foo( 11, 31, function(err,text) {
  if (err) {
    console.error( err );
  }
  else {
    console.log( text );
  }
} ); 
```
- 但是有了生成器之后我们就可以这么实现了

```js
function foo(x,y) {
  ajax(
    "http://some.url.1/?x=" + x + "&y=" + y,
    function(err,data){
      if (err) {
        // 向*main()抛出一个错误
        it.throw( err );
      }
      else {
        // 用收到的data恢复*main()
        it.next( data );
      }
    }
  );
}
function *main() {
  try {
    var text = yield foo( 11, 31 ); 
    console.log( text );
  }
  catch (err) {
    console.error( err );
  }
}
var it = main();
// 这里启动！
it.next(); 

```

- 这里的代码看上去比上面的好像要长一点，但是这段代码比上面的代码要好得多
- 这段代码好像变成了之前的同步代码，在有异步请求的时候还能运行吗？当然是可以的，主要原因就在`yield`身上，当我们执行生成器`main`的时候，遇到`yield`后暂停了`foo(11,31)`后面的其他代码，等待迭代器的下一个next来恢复它的执行
- 当我们的`ajax`执行完成后，调用了`next`方法来恢复它，并把ajax的返回值传递给了生成器，使其赋值给了`text`，接着让`main`继续执行

## 总结

- 生成器其实就是可以暂停执行与继续执行的函数，暂停与执行使用过迭代器来实现的
- 生成器的主要作用就是解决传统异步编码回调问题，实现原理就是暂停后需要next来恢复，`next`与`yield`可以双向通信传递数据，可借此传递异步请求的数据

