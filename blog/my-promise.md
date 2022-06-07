---
title: "实现一个Promise"
date: "2022-06-06"
name: 'francis'
age: '27'
tags: [JavaScript回顾]
categories: JavaScript
---

# 实现一个Promise

---

## Promise 需要实现的功能

按照 Promise A+ 的规范，Promise应该具有下面的几个功能

- 需要具有`then`方法
- 有一个`value`值，可以是任何合法的JS值
- `exception`,需要能够捕获Promise中产生的任何异常报错
- `reason`,拒绝的原因，具体为reject的原因

有了上述的实现点，我们就可以实现一个我们自己的Promise。

<!--more-->

## Promise 实现

---

### Promise 构造函数实现

- 首先Promise接受一个立即执行的回调函数作为参数

```js
function MyPromise(callback){
  callback()
}
```

- 然后需要确定这个回调函数需要有两个参数
- 第一个参数可以接受一个数据来表示这个Promise成功执行了，第二个参数可以接受一个原因表示这个Promise被拒绝了，所以我们可以按此来实现

```js
function MyPromise(callback){
  const resolve = (value) => {do something...}
  const reject = (reason) => {do something...}
  callback(resolve, reject)
}
```

- 接着我们需要明确这里的成功执行与拒绝的状态，所以我们需要给Promise指定一个状态值，并在这两个函数执行到的时候改变对应的值
- 在状态改变后我们需要把状对应的数据或者错误给抛出去，这个过程不是在构造函数内实现的，所以需要把这两个值也给存起来

```js
function MyPromise(callback){
  this.status = 'pending' // 表示还没有确定好状态
  this.value = undefined
  this.error = null
  const resolve = (value) => {
    this.value = value
    this.status = 'resolved'
  }
  const reject = (reason) => {
    this.error = reason
    this.status = 'rejected'
  }
  callback(resolve, reject)
}
```

### Then 方法实现

- 首先我们需要给`then`方法指定两个参数，分别是Promise状态变为`resolved`跟`rejected`时需要执行的函数，所以可以先指定这两个参数

```js
MyPromise.prototype.then = function (onResolve, onReject) {

}
```

- 然后我们需要按照Promise的状态来给他们指定不同的行为
  - Promise状态为`resolved`时，需要直接执行 onResolve
  - 状态为`rejected`时，需要直接执行 onReject
    ```js
    MyPromise.prototype.then = function (onResolve, onReject) {
      switch(this.status) {
        case 'resolved':
          onResolve(this.value)
          break
        case 'rejected':
          onReject(this.reason)
          break
        case 'pending':
          ...do something
      }
    }
    ```
  - 当状态为`pending`时我们无法确认到底该执行`onResolve`还是`onReject`，所以我们需要把这两个函数都收集起来，等状态变了我们再根据状态来分别执行他们，所以我们需要先把构造函数改造一下

  ```js
  function MyPromise(callback){
    this.status = 'pending' // 表示还没有确定好状态
    this.value = undefined
    this.error = null

    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      this.value = value
      this.status = 'resolved'
      this.onResolvedCallbacks.forEach(callback => {callback(this.value)})
    }
    const reject = (reason) => {
      this.error = reason
      this.status = 'rejected'
      this.onRejectedCallbacks.forEach(callback => {callback(this.error)})
    }
    callback(resolve, reject)
  }
  ```

  - 然后我们就是收集的过程了，在`then`方法中进行调整

  ```js
  MyPromise.prototype.then = function (onResolve, onReject) {
    switch(this.status) {
      case 'resolved':
        onResolve(this.value)
        break
      case 'rejected':
        onReject(this.reason)
        break
      case 'pending':
        this.onResolvedCallbacks.push(onResolve)
        this.onRejectedCallbacks.push(onReject)
        break
    }
  }
  ```
- 到这一步已经可以简单的触发只有一次then的场景了，数据也可以正常触发，我们试一下

```js
// MyPromise 实现部分的代码
const myPromise1 = new MyPromise((res, rej) => {
  setTimeout(() => {
    res(123)
  }, 1000)
})

myPromise1.then((value) => {
  console.log(value) // 123
})

const myPromise2 = new MyPromise((res, rej) => {
  setTimeout(() => {
    rej(234)
  }, 1000)
})

myPromise2.then((value) => {
  console.log('value:',value)
}, (error) => {
  console.log('error:',error) // error: 234
})
```

- 接下来我们需要考虑一下异常场景，首先我们需要考虑构造函数内的异常，也就是 `callback(onResolve, onReject)` 这一句，要是这里我们的参数不是一个函数，我们就应该让这个Promise直接失败，所以改造一下为

```js
function MyPromise(callback){
  // ...other code
  try {
    callback(resolve, reject)
  } catch (err) {
    reject(err)
  }
}
```

- 然后考虑我们的`then`方法中的`onResolve`跟`onReject`参数，这两个参数也都有可能不是函数，这种情况下，Promise并不会报错，只是会忽略这个参数，所以我们就需要对这两个参数进行特殊处理了，如下
  - onResolve被忽略的时候应该是收到什么值就原样丢给下一个then，所以我们只需要在它不是函数的时候重写为一个收到并转发值的函数就可以
  - onReject被忽略的时候应该将收到的错误原样的丢给下一个catch，所以我们就需要在收到一个错误原因的时候重新throw一个错误让后面的catch去捕获

```js
MyPromise.prototype.then = function (onResolve, onReject) {
  onResolve = typeof onResolve === 'function' ? onResolve : (value) => (value)
  onReject = typeof onReject === 'function' ? onReject: (reason) => {throw reason}
  switch(this.status) {
    case 'resolved':
      onResolve(this.value)
      break
    case 'rejected':
      onReject(this.reason)
      break
    case 'pending':
      this.onResolvedCallbacks.push(onResolve)
      this.onRejectedCallbacks.push(onReject)
      break
  }
}
```

- 这里因为我们还没有实现它的链式调用所以没有办法测试，我们先接着实现链式调用，然后再测试吧
- 接着我们就要考虑，`then`需要返回一个Promise，Promise的返回值就是我们对应函数的返回值，所以我们需要先对返回值做一下处理，先处理`resolved`状态

```js
MyPromise.prototype.then = function (onResolve, onReject) {
  // ...other code
  switch(this.status) {
    case 'resolved':
      return new MyPromise((res, rej) => {
        const result = onResolve(this.value)
        res(result)
      })
    // ...other code
  }
}
```

- 然后就要考虑，这里我们的onResolve方法执行可能出错，要是出错就需要把这个错误给 reject 出去，所以，还需要对它包一层 `try catch`

```js
MyPromise.prototype.then = function (onResolve, onReject) {
  // ...other code
  switch(this.status) {
    case 'resolved':
      return new MyPromise((res, rej) => {
        try {
          const result = onResolve(this.value)
          res(result)
        } catch (err) {
          rej(err)
        }
      })
    // ...other code
  }
}
```

- 然后我们再一起试一下上一步定义的默认函数能不能生效以及这个新版的resolve能不能正常工作

```js
const myPromise1 = new MyPromise((res, rej) => {
  res(123)
})

myPromise1.then(null).then(res => {
  console.log('value:', res) // value: 123
})
```

- 貌似是正常的，所以我们需要再对`onReject`也进行一下改造，这里需要注意，当我们的onReject成功执行就表示这个错误已经被我们处理了，所以需要resolve这个返回值

```js
MyPromise.prototype.then = function (onResolve, onReject) {
  // ...other code
  switch(this.status) {
    // ...other code
    case 'rejected':
      return new MyPromise((res, rej) => {
        try {
          const result = onReject(this.reason)
          res(result)
        } catch (err) {
          rej(err)
        }
      })
    // ...other code
  }
}
```

- 然后我们测试一下这一步的改动

```js
const myPromise1 = new MyPromise((res, rej) => {
  rej(123)
})
myPromise1.then(null, (err) => {console.log('error:', err)}).then((res) => {
  console.log('value:', res)
}, (err) => {
  console.log('error:', err)
})
// error: 123
// value: undefined
```

- 然后就需要调整我们`pending`状态的处理了，同样的，它也需要返回一个Promise，所以改造如下

```js
MyPromise.prototype.then = function (onResolve, onReject) {
  // ...other code
  switch(this.status) {
    // ...other code
    case 'pending':
      return new MyPromise((res, rej) => {
        this.onResolvedCallbacks.push((value) => {
          try {
            const result = onResolve(value)
            res(result)
          } catch (err) {
            rej(err)
          }
        })

        this.onRejectedCallbacks.push((error) => {
          try {
            const result = onReject(error)
            res(result)
          } catch (err) {
            rej(err)
          }
        })
      })
  }
}
```

- 这里是重点，因为我们在状态为`pending`的时候是拿不到状态的，所以只能将onResolve或者onReject的方法收集起来，而这里他们的执行结果又会影响到返回出去的Promise，所以使用这样的形式来将他们绑到一起
- 然后我们来看一下实现后的效果，就用上面的测试用例来进行测试

```js
const myPromise1 = new MyPromise((res, rej) => {
  setTimeout(() => {
    res(123)
  }, 1000)
})

myPromise1.then(null).then(res => {
  console.log('value:', res) // value: 123
})

const myPromise2 = new MyPromise((res, rej) => {
  setTimeout(() => {
    rej(234)
  }, 1000)
})
myPromise2.then(null, (err) => {console.log('error:', err)}).then((res) => {
  console.log('value:', res)
}, (err) => {
  console.log('error:', err)
})
// error: 234
// value: undefined
```

- 到这里我们就基本实现了我们`then`方法，但是这里还需要做一部分考虑，就是如果我们的onResolve或者onReject本身就返回了一个异步的Promise呐？这里会发生什么？让我们来看看

```js
const myPromise1 = new MyPromise((res, rej) => {
  res(123)
})

const asyncResolveFn = (value) => {
  return new MyPromise((res, rej) => {
    setTimeout(() => {
      res(value)
    }, 1000)
  })
}
myPromise1.then(asyncResolveFn).then(res => {
  console.log('value:', res) // value: 'pending'状态的MyPromise
})
```

- 这里明显不符合我们的需求，Promise的行为是在上一个`then`中有Promise返回值时，会等待该Promise返回后再将返回值作为参数传给下一个`then`模块，所以这里我们需要对上面的代码再进行一次改造，以`resolved`为例

```js
MyPromise.prototype.then = function (onResolve, onReject) {
  // ...other code
  switch(this.status) {
    case 'resolved':
      return new MyPromise((res, rej) => {
        try {
          const result = onResolve(this.value)
          if(result instanceof MyPromise) {
            result.then(res, rej)
          } else {
            res(result)
          }
        } catch (err) {
          rej(err)
        }
      })
    // ...other code
  }
}

```

- 这里我们只需要将改变状态的两个参数`res`跟`rej`作为参数丢给新返回的Promise就可以了，这样当他的值发生决断的时候我这面也会同步收到这个结果，并触发下一个`then`或者`catch`，然后我们再来测试一下

```js
// ...MyPromise code
const myPromise1 = new MyPromise((res, rej) => {
  res(123)
})

const asyncResolveFn = (value) => {
  return new MyPromise((res, rej) => {
    setTimeout(() => {
      res(value)
    }, 1000)
  })
}
myPromise1.then(asyncResolveFn).then(res => {
  console.log('value:', res) // value: 123
})
```

- 同理，我们也需要改造一下`rejected`跟`pending`，如下

```js
MyPromise.prototype.then = function (onResolve, onReject) {
  // ...other code
  switch(this.status) {
    case 'resolved':
      return new MyPromise((res, rej) => {
        try {
          const result = onResolve(this.value)
          if(result instanceof MyPromise) {
            result.then(res, rej)
          } else {
            res(result)
          }
        } catch (err) {
          rej(err)
        }
      })
    case 'rejected':
      return new MyPromise((res, rej) => {
        try {
          const result = onReject(this.error)
          if(result instanceof MyPromise) {
            result.then(res, rej)
          } else {
            res(result)
          }
        } catch (err) {
          rej(err)
        }
      })
    case 'pending':
      return new MyPromise((res, rej) => {
        this.onResolvedCallbacks.push((value) => {
          try {
            const result = onResolve(value)
            if(result instanceof MyPromise) {
              result.then(res, rej)
            } else {
              res(result)
            }
          } catch (err) {
            rej(err)
          }
        })

        this.onRejectedCallbacks.push((error) => {
          try {
            const result = onReject(error)
            if(result instanceof MyPromise) {
              result.then(res, rej)
            } else {
              res(result)
            }
          } catch (err) {
            rej(err)
          }
        })
      })
  }
}
```

- 然后测试一下，如下

```js
const myPromise1 = new MyPromise((res, rej) => {
  setTimeout(() => {
    rej(123)
  }, 1000)
})

const asyncResolveFn = (value) => {
  return new MyPromise((res, rej) => {
    setTimeout(() => {
      res(value)
    }, 1000)
  })
}
myPromise1.then(asyncResolveFn).then(res => {
  console.log('value:', res)
}, err => {
  console.log('error:', err) // error: 123
})
```

- 这里我们发现，不仅等待了返回值中的Promise决断，而且正确的处理了asyncResolveFn中的res状态的反转，所以到这里我们就实现了`then`的完整功能

### catch 方法实现

- 这里我们只需要知道，catch就是一个只接受一个参数，捕获错误并且返回一个新的Promise，所以，我们可以在内部调用我们实现的`then`方法即可，如下

```js
MyPromise.prototype.catch = function(onReject) {
  return this.then(null, onReject)
}
```

- 这样就实现了我们的catch方法，然后再来测试一下

```js
new MyPromise((res, rej) => {
  rej(123)
}).catch(err => {
  console.log('error:',err) // error: 123
  }).then(res => {
  console.log('value:', res) // value: 123
})
```

- 这就是我们实现的一个Promise，完整代码如下

```js
function MyPromise(callback){
  this.status = 'pending' 
  this.value = undefined
  this.error = null

  this.onResolvedCallbacks = []
  this.onRejectedCallbacks = []

  const resolve = (value) => {
    this.value = value
    this.status = 'resolved'
    this.onResolvedCallbacks.forEach(callback => {callback(this.value)})
  }
  const reject = (reason) => {
    this.error = reason
    this.status = 'rejected'
    this.onRejectedCallbacks.forEach(callback => {callback(this.error)})
  }
  try {
    callback(resolve, reject)
  } catch (err) {
    reject(err)
  }
}
MyPromise.prototype.then = function (onResolve, onReject) {
  onResolve = typeof onResolve === 'function' ? onResolve : (value) => (value)
  onReject = typeof onReject === 'function' ? onReject: (reason) => {throw reason}
  switch(this.status) {
    case 'resolved':
      return new MyPromise((res, rej) => {
        try {
          const result = onResolve(this.value)
          if(result instanceof MyPromise) {
            result.then(res, rej)
          } else {
            res(result)
          }
        } catch (err) {
          rej(err)
        }
      })
    case 'rejected':
      return new MyPromise((res, rej) => {
        try {
          const result = onReject(this.error)
          if(result instanceof MyPromise) {
            result.then(res, rej)
          } else {
            res(result)
          }
        } catch (err) {
          rej(err)
        }
      })
    case 'pending':
      return new MyPromise((res, rej) => {
        this.onResolvedCallbacks.push((value) => {
          try {
            const result = onResolve(value)
            if(result instanceof MyPromise) {
              result.then(res, rej)
            } else {
              res(result)
            }
          } catch (err) {
            rej(err)
          }
        })

        this.onRejectedCallbacks.push((error) => {
          try {
            const result = onReject(error)
            if(result instanceof MyPromise) {
              result.then(res, rej)
            } else {
              res(result)
            }
          } catch (err) {
            rej(err)
          }
        })
      })
  }
}

MyPromise.prototype.catch = function(onReject) {
  return this.then(null, onReject)
}
```
