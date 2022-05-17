---
title: "从零搭建一个react-hooks项目（三）"
date: "2020-06-23"
name: 'francis'
age: '25'
tags: [react, react hooks, redux, webpack]
categories: Webpack
---

# 从零搭建一个react-hooks项目（三）

- 上一篇我们配置了项目相关，包括代码压缩混淆，开发生产配置抽离，图片与文字的引入使用等
- 接下来我们就配置一下react-router，react-redux与typescript
- 配置之前我们先补充一下webpack的部分配置，用于方便我们的开发
- 在webpack.common.js中配置webpack的查找规则，也就是resolve，如下

<!--more-->

```js
...
module.exports = {
  entry: {
    ...
  },
  module: {
    ...
  },
  resolve: {
    extensions: ['.jsx', '.js', '.json'],
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    ...
  ],
  optimization: { // 公共代码抽离
    ...
  }
}
```

- 上面新增了一个resolve的解析规则，使webpack方便查找，第一个extensions中的配置表示我们在引入后缀为.jsx,.js,.json的文件时，可以直接写文件名而不用加后缀，比如引入'./index.jsx'，我们就可以直接写为'./index'
- 下面的alias就是别名配置，用于在引入路径时方便使用，比如我们在项目中有如下的代码结构
  
```js
src 
├── lib 
│ └── utils.js 
└── pages 
└── demo 
└── index.js
```

- 在 src/pages/demo/index.js 中如果要引用 src/lib/utils.js 那么可以通过：import utils from '../../lib/utils' ，如果目录更深一些，会越来越难看，这时可以通过设置 alias 来缩短这种写法，例如：

```js
module.exports = {
  resolve: {
      '@': path.resolve(__dirname, 'src'),
      '@lib': path.resolve(__dirname, 'src/lib')
  }
}

```

- 这样我们就可以直接使用 '@lib/utils'来进行文件的引入了

## react-router的使用

- 配置完resolve之后我们就开始进行react-router的配置了，还是先下载react-router-dom模块，命令为： npm i react-router-dom -S
- 然后在src下新建两个页面，pages/login.jsx与pages/home.jsx作为我们的路由页面
  
```js
// pages/home.jsx
import React from 'react'
const Home = () => {
  return (
    <div>我是首页</div>
  )
}
export default Home

// pages/login.jsx
import React from 'react'
const Login = () => {
  return (
    <div>我是登录页</div>
  )
}
export default Login
```

- 接着在src下新建routes/index.jsx文件作为我们的路由管理页面
- 在文件内引入react与react-router-dom,然后引入新建的login页面与home页面
- 页面代码如下
  
```js
// routes/index.jsx
import React from 'react'
import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Login from '@/pages/login'
import Home from '@/pages/home'
const RouteConfig = () => {
  return (
    <Router>
      <Switch>
        <Route path="/home" component={ Home }></Route>
        <Route path="/login" component={ Login }></Route>
        <Redirect to="/home" from="/"></Redirect>
      </Switch>
    </Router>
  )
}
export default RouteConfig
```

- 然后在app.jsx里面以组件的形式引入我们的路由即可，如下

```js
// app.jsx
import * as React from 'react'
import './app.less'
import RouteConfig from '@/route/index'
class App extends React.Component{
  render(){
    return (
      <RouteConfig></RouteConfig>
    )
  }
}
export default App
```

- 然后运行npm run dev就能发现自动帮我们定位到/home页面，我们手动修改路由为/login就可以发现页面跳转到了login页面
- 至此，我们的react-router就配置完成了

## react-redux的使用

- redux是常用的状态管理组件，用于维护全局的数据变量，react项目中自然也需要它的存在，下面我们就配置一下redux
- 在react中使用redux需要引入redux与react-redux，还是先安装包： npm i redux react-redux -S
- 然后在src下新建文件夹store用于放置我们的redux相关文件
- redux在数据比较复杂的时候会按照模块来放置文件，最后再用redux提供的api组合起来，方便后续的维护，这里我们创立数字模块number与聊天模块chat，分别在store下面建立两个文件夹store/chat与store/number
- 在每个文件夹下面建立我们会用到的操作该数据的操作类型与该操作类型下的数据变化情况，分别对应types.js与reducers.js
- 先构建store/number下的types与reducers，对外提供加减两个方法，先在types下构建常量用于标识对应的方法
  
```js
// store/number/types
export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
```

- 然后再编写该方法下的数据变化情况reducers，并为这个数字模块设立初始值0，当执行方法为加减的时候就在原基础上加减对应的值，否则就原样返回

```js
// store/number/reducers.js
import { INCREMENT, DECREMENT } from './types'
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
export default numberReducer
```

- 上面就是简单的数字模块的两个方法了，然后我们同样实现一下chat模块的方法

```js
// store/chat/types
export const SEND = 'SEND'
export const DELETE = 'DELETE'

// store/chat/reducers
import { SEND, DELETE } from './types'

const initialState = []
const chatReducer = (state = initialState, action) => {
  switch(action.type) {
    case SEND:
      return [...state, action.payload]
    case DELETE:
      return state.length ? state.slice(0, state.length - 1) : []
    default:
      return state
  }
}
export default chatReducer

```

- chat模块提供了一个发送方法与删除方法用于操作聊天列表
- 接下来我们就要使用redux提供的combineReducers方法将其合并起来
- 在store下新建index.js文件用于最后的导出
- 在index.js中引入combineReducers，chat模块，number模块，然后合并并导出，如下

```js
// store/index.js
import { combineReducers } from 'redux'
import ChatReducer from './chat/reducers'
import NumberReducer from './number/reducer'

const rootReducer = combineReducers({
  number: NumberReducer,
  chat: ChatReducer
})

export default rootReducer
```

- 上面就完成了redux的编写，接下来就要在react根组件上将其使用
- 在index.jsx中引入store/index.js，引入redux提供的方法createStore创建全局状态，引入react-redux中的Provider包装根组件，如下

```js
// index.jsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './src/app.jsx'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import RootReducer from '@/store/index'
const store = createStore(RootReducer)
ReactDOM.render(
  <Provider store={ store }>
    <App/>
  </Provider>
  ,document.querySelector('#app')
)
```

- 上面就在我们的项目中引入了redux，接下来就是使用，我们在login组件中尝试使用number并修改
- 在login组件中引入对应的操作方法与react-redux提供的connect方法，然后修改我们的login组件如下
  
```js
// src/pages/login.jsx
import React from 'react'
import { connect } from 'react-redux'
import { INCREMENT, DECREMENT } from '@/store/number/types'
const Login = (props) => {
  const { number, increment, decrement } = props
  return (
    <div>
      <button>我是数字{ number }</button>
      <button onClick={() => { increment() } }>点我加10</button>
      <button onClick={() => { decrement() } }>点我减10</button>
    </div>
  )
}
function mapStateToProps(state){ // 将redux中的state整合到props中
  return {
    number: state.number 
  }
}

function mapDispatchToProps(dispatch){ // 将操作state的函数整合到props中
  return {
    increment: () => dispatch({ type: INCREMENT, payload: 10 }),
    decrement: () => dispatch({ type: DECREMENT, payload: 10 })
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login)
```

- connect中的第一个参数接受两个函数，分别用于整合state到props中跟整合操作方法到props中，这样我们就可以在页面中使用该方法与该值了
- 修改之后我们点击两个按钮就可以看到对应值的变化了

## react中引入typescript

- typescript当下如此潮流我们自然也要接入一下啦，下面就是简单的接入过程
- 得益于我们强大的babel-7，我们不再需要去单独的使用ts-loader或者awesome-typescript-loader解析ts文件，只需要在babel中进行typescript的相关配置即可
- 首先还是先安装我们的typescript与@babel/preset-typescript，命令为： npm i typescript @babel/preset-typescript -D
- 然后再.babelrc文件中进行typescript的配置，如下

```js
// .babelrc
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react",
    "@babel/preset-rtpescript", // 处理typescript
  ],
  "plugins": [
    "@babel/proposal-object-rest-spread", // 处理对象的rest写法
    "@babel/proposal-class-properties" // 处理类里面的箭头函数绑定，static属性等 
  ]
}
```

- 然后在webpack中对typescript文件配置babel解析即可，这是一个通用配置，所以还是在webpack.common.js上修改，如下
  
```js
// webpack.common.js
module.exports = {
  entry: {
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/, // tsx或者ts文件也使用babel解析
        use: ['babel-loader'],
        exclude: /node-modules/
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'], // 添加.tsx与.ts后缀解析
    alias: {
      "@": path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    ...
  ],
  optimization: { // 公共代码抽离
    ...
  }
}
```

- 然后就要配置typescript中的编译规则，在根目录下新建tsconfig.json文件，然后添加如下配置

```js
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true, // 允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
    "outDir": "./dist/", // 重定向输出目录
    "noImplicitAny": true,// 在表达式和声明上有隐含的 any类型时报错。（默认为false，个人建议也为false，可以兼容之前的js代码，这里改为true是为了我自己检测哪些类型需要处理）
    "module": "es6", // 模块引入方式
    "target": "esnext",// 指定ECMAScript目标版本
    "jsx": "react", // 在 .tsx文件里支持JSX
    "allowJs": true,
    "sourceMap": true, // 生成相应的 .map文件
    "lib": [
      "es2015",
      "dom.iterable",
      "es2016.array.include",
      "es2017.object",
      "dom"
    ], // 编译过程中需要引入的库文件的列表。
    "moduleResolution": "node",// 用于解析一些加载器，如css-type, source-map 
    "baseUrl": "./src", // typescript的模块解析基础路径
    "paths": { // 对应的模块解析路径
      "store/*": ["store/*"],
    },
  },
  "include": [
    "src"
  ],
  "exclude": [
    "./node_modules"
  ]
}
```

- 因为我们之前配置了别名，所以需要加上后面的配置中的baseUrl与paths保证typescript能够找到对应的配置，其他的都是typescript的基本配置
- 接下来我们尝试将入口文件修改为tsx尝试一下，在webpack.common.js中将入口文件改为app:'index.tsx'，然后再将index.jsx后缀改为tsx，之后运行npm run dev发现报错 can not find module 'react'，就说明我们的typescript已经配置完成了，可以正常检查错误
- 上述错误是因为我们在TS中进行的开发，TS并不知道我们的react是什么类型，导出了什么，所以就报错了，这里我们就需要安装react相关的类型文件
- 项目中我们使用了react,react-dom,react-redux,react-router-dom这四个依赖，所以我们就需要安装依赖包，命令为：npm i @types/react @types/react-dom @types/react-redux @types/react-router-dom -S
- 之后我们再次编译，就发现项目可以正常运行了。
- 但是使用上面的配置之后发现，在我们编译过程中类型出错webpack并不会提示我们出错，这是因为babel7中在编译过程会移除typescript，完全以javascript的形式进行打包，详见[(https://iamturns.com/typescript-babel)](https://iamturns.com/typescript-babel)。因为，要把babel跟typescript同时编译，两个编译器会导致过程十分缓慢，这可是开发者不能容忍的。针对这种情况，我们可以新建一个命令 "check": "tsc -watch"，然后使用vscode带给我们的终端启用两个终端，一个运行命令 npm run check，另一个运行命令npm run dev，这样就发现我们在开发中出现的类型错误都会在check的终端对我们进行提示。
- 接下来我们只需要将所有的jsx文件转为tsx文件就可以进行typescript的开发了，项目地址[react-admin](https://github.com/mf950511/react-admin)，可以自行获取配置进行修改