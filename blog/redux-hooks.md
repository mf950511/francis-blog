---
title: "react hooks下使用react-redux"
date: "2020-06-11"
name: 'francis'
age: '25'
tags: [react, react hooks, redux]
categories: React
---

# react hooks 下使用redux

## redux 

- redux是近年来javascript中火热的状态管理容器，提供可预测的全局状态管理。在大型的应用中我们常采用redux来进行状态管理，redux的基本使用方式如下
- 使用redux，我们先要进行action的编写，action一般由type与其他相关数据构成，下面就是简单的两个action

```js
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

// 数字增加action
{ type: INCREMENT, payload: number }

// 数字减少action
{ type: DECREMENT, payload: number }

```

<!--more-->

- 接下来，我们就要根据action来进行我们的reducer编写,reducer是一个函数，具有两个初始值，一个是当前的状态值state，一个是当前的操作模式action
- 我们要根据当前的操作模式进行相应的逻辑处理，并返回新的state,这里我们为state设置一个初始值 0，对应INCREMENT与DECREMENT分别进行加减操作

```js
const initialState = 0

const numberReducer = (state = initialState, action) => {
  switch(action.type) {
    case INCREMENT:
      return state + action.payload
    case DECREMENT:
      return state - action.payload
    default:
      return state
  }
}

```

- 上面只是定义了操作形式与如何响应该操作，并没有实际的进行触发，触发状态改变需要redux提供的dispatch,dispatch接收一个action并将这个action传递给reducer，从而触发最后的状态改变，如下

```js

dispatch({ type: DECREMENT, payload: number })

```

## react中使用redux

- react hooks出来之前，redux几乎是所有react项目的不二只选，但是其复杂的使用方式让许多开发者都头疼，对萌新来说更是要命，上网查了都不知道是怎么回事
- hooks的出现，解放了一大批的react的开发者，易上手的开发模式让开发者使用极其简单，而react-redux自然也不会放过hooks的这波狂潮，下面就让我们对比一下hooks前后的两种redux使用形式

### react中使用redux

- react中使用redux需要借助三方库react-redux，react-redux提供了connect来让我们在组件中使用redux，如下使用

```js
import React from 'react'
import { connect } from 'react-redux'

class Test extends React.Component {
  constructor(){
    super()
  }
  mapStateToProps(state) {
    return {
      number: state.number
    }
  }

  mapDispatchToProps(dispatch) {
    return {
      increment: (number) => dispatch({ type: 'INCREMENT', payload: number }),
      decrement: (number) => dispatch({ type: 'DECREMMENT', payload: number }),
    }
  }

  render() {
    return (
      <div>
        <div>{ this.props.number }</div>
        <button onClick={() => { this.props.increment(10) }}>增加10</button>
        <button onClick={() => { this.props.decrement(5) }}>减少5</button>
      </div>
    )
  }

}

export default connect(mapStateToProps, mapDispatchToProps)(Test)


```

## react hooks中使用redux

- hooks中使用redux需要依靠react-redux提供的 useSelector 与 useDispatch进行state取值与dispatch执行修改操作
- useSelector会根据接受的函数返回需要的状态值，如下面的number
- useDispatch会返回一个操作函数，返回的操作函数可以接收一个action执行状态值的修改

```js
import * as React from 'react'
import { useSelector, useDispatch } from 'react-redux'

const Test = () => {
  const number = useSelector(state => state.number)
  const dispatch = useDispatch()
  return (
      <div>
        <div>{ this.props.number }</div>
        <button onClick={() => { dispatch({ type: 'INCREMENT', payload: 10 }) }}>增加10</button>
        <button onClick={() => { dispatch({ type: 'DECREMMENT', payload: 5 }) }}>减少5</button>
      </div>
    )
}

export default Test

``` 
