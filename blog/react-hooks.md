---
title: "react hooks下封装通用redux"
date: "2020-07-14"
name: 'francis'
age: '25'
tags: [react, react hooks, redux]
categories: React
---

# react hooks下封装通用redux

redux我们常用来做全局状态管理，一般我们都会按功能模块来新建相关的action，reducer然后再使用combineReducers来将其组合导出，这样的话就实现了模块的划分，让我们更方便项目的管理。但是在某些情况下，我们想要一个通用的redux管理，比如一些特别小，但是又必须要用到的场景，比如我们现在新建了一个chat模块用来管理聊天相关的redux，新建了一个menu模块来管理我们的菜单模块，新建了一个number模块用来管理我们的数据状态，但是这时候我想要对顶部导航栏的显示与隐藏添加一个reducer用来与其他组件交互，这种情况下还要单独再开一个nav模块吗？肯定是不愿意的，所以针对我们这些比较小的功能模块，我们想封装一个通用的reducer，这个通用的reducer共享一个normal数据，dispatch时接受一组数据key,value用于进行数据的改变，下面就是我们的封装过程

<!--more-->

- 首先我们需要创建一个normalReducer，如下

```js
// store/normal/reducer.js

export const normalReducer = (state = {}, action) => {
  if(action.type === 'normal') { // 用于标识走通用的reducer
    const { payload: { key, value } } = action
    return {
      ...state,
      [key]: value
    }
  } else {
    return state
  }
}

// store/index.js

import { normalReducer } from './normal/reducer.js'

const rootReducer = combineReducer({
  normal: normalReducer,
  ...
})

```

- 这样我们就简单实现了一个通用的normal模块，在页面中我们可以这样使用

```js
import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const Home = () => {
  const normalState = useSelector((state) => state.normal) // 获取到了相应的normal状态值
  const dispatch = useDispatch() // 获取dispatch函数

  const changeOk = () => {
    dispatch({
      type: 'normal',
      payload: {
        key: 'isOk',
        value: !normalState.isOk
      }
    })
  }

  return (
    <div className="home">
      <div>{ normalState.isOk }</div>
      <button onClick={ changeOk }>点我切换状态</button>
    </div>
  )
}

``` 

- 这样就更新了我们的数据状态，这样我们每次都需要写dispatch相关部分，还是有点繁琐，所以我们可以参考useState的写法，接收一个键值，返回数据值与数据操作函数，如下

```js
// src/effect/reducer
import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'

export const normalReducerDispatch = (key) => {
  const dispatch = useDispatch()
  const normalInfo = useSelector(state => state.normal)
  const stateValue = normalInfo[key]
  const setNormalInfo = (value) => {
    dispatch({
      type: 'normal',
      payload: {
        key,
        value
      }
    })
  }
  return [stateValue, setNormalInfo]
}
```

// 上面封装之后我们就可以像使用useState一样来使用我们的normal模块了，在需要使用的页面引入使用即可，如下

```js
// src/home.jsx
import * as React from 'react'
import { normalReducerDispatch } from 'src/effect/reducer'

const Home = () => {
  const [isOk, setIsOk] = normalReducerDispatch('isOk')

  return (
    <div className="home">
      <div>{ isOk }</div>
      <button onClick={ setIsOk(!isOk) }>点我切换状态</button>
    </div>
  )
}

```

- 这样就实现了我们上面代码同样的功能，其他需要使用redux的小模块也可以同样使用了