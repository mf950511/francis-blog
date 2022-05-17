---
title: "从零搭建一个react-hooks项目（一）"
date: "2020-06-11"
name: 'francis'
age: '25'
tags: [react, react hooks, redux, webpack]
categories: Webpack
---

# 从零搭建一个react-hooks项目（一）

- 最近有打算仿vue-admin项目构造一个react的项目，不引用官方脚手架，从webpack开始配置一套基于react,redux,typescript的项目，并实时记录一下项目中的一些配置情况
- 首先搭建一个基本的webpack环境

## webpack项目搭建

- 前置基础，电脑有安装node环境，可以使用npm工具
- 新建文件夹，命名项目名称（react-admin）,进入文件夹，使用命令 npm init ，然后一路确定生成package.json文件
- webpack需要安装基本依赖 webpack webpack-cli webpack-dev-server, 命令为 npm i webpack webpack-cli webpack-dev-server -D
- 安装依赖完成，则需要进行webpack的基本配置，我们在根目录构建 webpack.config.js 文件用于配置webpack
- 然后在根目录创建一个index.js作为入口文件，我们先构造index.js这个入口文件，代码如下

<!--more-->

```js
function a(number){
  console.log(number)
}
a(12)
```

- 然后开始配置我们的webpack，webpack需要配置入口及输出位置，分别对应entry与output属性
- entry可以接收一个字符串作为主入口的文件路径，但只能用于单入口项目。也可以接收一个对象作为入口的文件路径，如下所示
- output用来描述打包后的文件应该放到哪，叫什么名字，也有两个基本属性，一个是打包后的文件名，一个是打包后的文件路径，这里我们通过[name].js来获取他在入口文件中的对应名称并生成文件名，如果是单入口并且直接用字符串指定的文件路径，比如entry: './index.js'，这样最后生成的文件名就是main.js，如果采用对象形式设定的entry属性，比如entry: { app: './index.js' }，则最后生成的文件就是对应的键值app.js。 路径使用path.resolve()来在根目录下生成dist文件夹并将打包文件放到其中

```js
const path = require('path') // node环境自带，无需下载
// 单入口文件
module.exports = {
  entry: './index.js', // 入口为index.js
  output: {  // 输出就是 dist/main.js
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}

// 多入口文件
module.exports = {
  entry: { // 入口也是index.js
    app: './index.js'
  }, 
  output: {  // 输出为dist/app.js
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
  }
}

```

- 配置到这就算完成了最基本的配置，我们可以来测试一下，先在package.json中的 scripts 下新建指令 "start": "webpack --config webpack.config.js"
- 然后再执行npm run start 就可以看到执行了打包过程，生成了dist文件夹
- 这里我们完成了基本的配置，但是这里还有一个问题，当我们修改entry对应的文件名时，重新执行打包，会发现之前的打包文件还存在，这样就会导致我们的dist文件夹会包含很多之前打包的跟当前代码无关的文件，这样其实对我们的项目并不友好，这里我们想要在每次打包的时候都把dist给移除了，并重新生成
- clean-webpack-plugin 插件可以帮助我们实现这个需求，先下载这个包  npm i clean-webpack-plugin -D
- 然后在webpack.config.js中进行配置，如下，plugins用于我们配置我们想要的相关插件，接收一个数组值，这样我们的项目就可以在每次打包前都将dist清空了，就不会存在无用文件在内了

```js
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  entry: {
    app: './index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}
```

- 接下来就让我们开始配置react相关吧，react开发中我们会用到jsx或者es6的语法，而这些语法在低版本浏览器都是不兼容的，所以我们需要配置babel来实现低版本浏览器的兼容
- 这里我们需要下载 babel-loader @babel/preset-env(根据环境转换代码) @babel/preset-react(react使用) @babel/preset-polyfill(Babel默认只转换新的JavaScript语法，但是不转换新的API，比如 `Iterator`、`Generator`、`Set`、`Maps`、`Proxy`、`Reflect`、`Symbol`、`Promise` 等全局对象，以及一些定义在全局对象上的方法（比如`Object.assign` ）都不会转码。而`@babel/preset-polyfill`可以转码。) @babel/proposal-object-rest-spread(处理react中对象的rest写法) @babel/proposal-object-rest-spread (处理类里面的箭头函数this绑定，static属性等 ), 依赖下载完成后就需要进行babel配置了
- 我们在根目录构建 .babelrc 文件，内里配置如下

```js
{
  "presets": [
    "@babel/preset-env",
    "@babel/preset-react"
  ],
  "plugins": [
    "@babel/proposal-object-rest-spread", // 处理对象的rest写法
    "@babel/proposal-class-properties" // 处理类里面的箭头函数绑定，static属性等 
  ]
}
```

- 然后就需要在webpack里面配置编译规则了，还是在webpack.config.js里面，新增module模块，添加不同文件的解析规则，如下

```js
module.exports = {
  entry: {
    app: './index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)x?$/,
        use: ['babel-loader'],
        exclude: /node-modules/ // 不解析node_modules中的文件
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ]
}

```

- 然后我们可以写代码来测试一下，react 要基于 dom 展示，所以我们新建一个index.html用于dom展示，index.jsx用于执行react挂载，新建一个文件夹src用于放置react相关的组件及内里逻辑，并在里面新建一个app.jsx用于做初始组件，代码分别如下
  
```js
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  
<div id="app"></div>
<script src="./dist/app.js"></script>
<script src="./dist/test.js"></script>
</body>
</html>

```

```js
// index.jsx
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import App from './src/app.jsx'
ReactDOM.render(
  <App/>
  ,document.querySelector('#app')
)

```

```js
// app.jsx
import * as React from 'react'
class App extends React.Component{
  render(){
    return (
      <div>123</div>
    )
  }
}
export default App

```

- 然后需要在我们的webpack配置中新增加一个入口文件，如我们在html中的引入一样，需要命名为test，配置如下

```js
module.exports = {
  entry: {
    app: './index.js',
    test: './index.jsx'
  },
  ...// 省略
}
```

- 接下来执行npm run start 执行打包，打包完成后打开页面 index.html 查看就可以发现已经插入了123进去
- 这里我们可以发现我们需要新建一个index.html然后再主动根据生成的文件路径将其引入进去，要是生成的文件比较多则会很麻烦，所以我们接下来使用插件让其自动生成
- 首先下载插件 html-webpack-plugin，命令为 npm i html-webpack-plugin
- 然后再webpack.config.js里进行相关配置，还是用在plugins模块中，如下所示

```js
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './index.js',
    test: './index.jsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(js)x?$/,
        use: ['babel-loader'],
        exclude: /node-modules/
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      inject: true, // 所有js脚本放于body之后
      hash: true, // 为静态资源生成hash，用于清楚缓存
      cache: true, // 仅在文件被更改时发出文件
      title: 'react admin',
      filename: 'index.html',
      template: path.resolve(__dirname, 'index.html'),
      minify: {
        collapseWhitespace: true, // 折叠空白
        removeComments: true, // 删除注释
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new CleanWebpackPlugin()
  ]
}
```

- 然后在根目录放置我们的模板index.html，不需要主动引入js文件了，内容如下

```js
// index.html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>react admin</title>
</head>
<body>
  
<div id="app"></div>
</body>
</html>

```

- 之后再执行我们的npm run start 就可以在dist中自动生成我们的index.html文件了，直接打开就能发现已经有我们要渲染的内容了
- react相关的就配置完成了，接下来我们需要配置一下css部分，开发中以less作为示例配置一下
- 首先安装相关的依赖 less-loader style-loader postcss-loader css-loader autoprefixer，命令为 npm i less-loader style-loader postcss-loader css-loader autoprefixer -D
- 接下来进行webpack配置，用以处理less文件的解析及处理
- 还是在 module 下面的 rules 中配置规则，如下

```js
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    app: './index.js',
    test: './index.jsx'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      { 
        test: /\.(le|c)ss$/,
        use: [ // 解析规则为从右向左，即 less-loader, postcss-loader, css-loader, style-loader
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              sourceMap: true //是否打开样式查找
            }
          },
          {
            loader: 'postcss-loader', // 为浏览器加前缀
            options: {
              ident: 'postcss',
              sourceMap: true,
              plugins: loaders => [
                require('autoprefixer')({
                })
              ]
            }
          },
          {
            loader: 'less-loader', // 解析样式文件
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(js)x?$/,
        use: ['babel-loader'],
        exclude: /node-modules/
      }
    ]
  },
  plugins: [
    new HTMLWebpackPlugin({
      inject: true, // 所有js脚本放于body之后
      hash: true, // 为静态资源生成hash，用于清楚缓存
      cache: true, // 仅在文件被更改时发出文件
      title: 'react admin',
      filename: 'index.html',
      template: path.resolve(__dirname, 'index.html'),
      minify: {
        collapseWhitespace: true, // 折叠空白
        removeComments: true, // 删除注释
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true
      }
    }),
    new CleanWebpackPlugin()
  ]
}
```

- 配置完成之后我们简单做个测试，在app.jsx目录下新建app.less文件，并简单书写样式

```css
.red{
  color: red;
  .blue{
    background: blue;
  }
  .orange{
    background: orange;
  }
}

```

- 修改app.jsx中的渲染内容为

```js
import * as React from 'react'
import './app.less'

class App extends React.Component{
  render(){
    return (
      <div className="red">
        <div className="blue">123</div>
        <div className="orange">345</div>
      </div>
    )
  }
}

export default App
```

- 然后执行npm run start,之后打开dist中的index.html，就发现样式已经生效了，然后F12打开开发者工具调试，能查找到对应的div生效样式的所在位置
- 上面就完成了一个简单的demo，接下来就是要针对项目做一些配置化了
