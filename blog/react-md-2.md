---
title: "从零搭建一个react-hooks项目（二）"
date: "2020-06-12"
name: 'francis'
age: '25'
tags: [react, react hooks, redux, webpack]
categories: Webpack
---

# 从零搭建一个react-hooks项目（二）

- 上一篇搭建了基本的webpack项目，可以支持react，less的基本使用，但是没有考虑到项目中的实际情况，例如生产环境的代码混淆，代码压缩，开发环境的热启动等。
- 下面我们就针对开发与生产环境的不同需求，对webpack进行下一步的配置
- 生产环境的配置与开发环境的配置有很多的不同点，所以我们需要分别建对应的配置文件，在根目录下分别创建 webpack.prod.js（生产配置） 与webpack.dev.js（开发配置）
- 然后在package.json中的scripts里新建两个命令，分别是 "build": "webpack --config webpack.prod.js", "dev": "webpack --config webpack.dev.js"

## 开发环境的配置

- 先将webpack.config.js中的配置复制到webpack.dev.js中，然后进行我们的基本配置修改
- 首先开发中需要对错误进行一个精准定位，所以在配置中开启 devtool: "inline-source-map"，如下所示
- css的样式覆盖关系在我们之前的开发中就已经使用了source: map的属性，所以可以在开发环境中继续使用

<!--more-->

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
        use: [
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
  devtool: 'inline-source-map',
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

- 接着在我们的开发过程中我们不希望每做一次改动都需要手动的执行一次npm run dev，所以我们这里使用我们的webpack-dev-server来为我们提供node的静态服务，配合webpack的打包可以让我们实现实时更新，实时显示，不需要手动触发npm run dev命令来进行刷新
- 首先我们修改package.json中的dev命令为:"webpack-dev-server --open --config webpack.dev.js"
- 接下来就需要对该静态服务进行配置，配置项放在配置中的devServer下面，如下
  
```js
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    ...
  },
  output: {
    ...
  },
  module: {
    ...
  },
  devtool: 'inline-source-map',
  plugins: [
    ...
  ],
  devServer: {
    contentBase: './dist', // 静态文件目录，用于浏览器显示
    clientLogLevel: 'warning',  // 输出日志级别
    hot: true, // 启动热更新
    publicPath: '/', // 浏览器访问路径
    compress: true, // 启用gzip压缩
    port: 9998,
    open: true, // 自动调起浏览器
    overlay: { // 出现错误或警告是否覆盖页面线上错误信息
      warnings: true,
      errors: true
    },
    quiet: true,
    proxy: { // 代理
    },
    watchOptions: { // 监控文件相关配置
      poll: true,
      ignored: /node_modules/,
      aggregateTimeout: 300  // 默认值, 当你连续改动时候, webpack可以设置构建延迟时间(防抖)
    }
  }
}
```

- 然后在执行我们的npm run dev就可以发现会自动帮我们打开浏览器，然后当我们修改主要文件的时候也会重新帮我们刷新页面
- 上面的自动刷新在某些场景下会有一些问题，当依赖的模块发生改变时可能当前的页面绑定关系不能即时刷新，所以我们需要引入新的模块来进行问题修复
- webpack 自带模块热替换插件 HotModuleReplacementPlugin ，使用时只需要引入webpack，然后在plugin中添加 new webpack.HotModuleReplacementPlugin()即可解决部分依赖刷新不及时的问题，如下

```js
...
const webpack = require('webpack')

module.exports = {
  entry: {
    ...
  },
  output: {
    ...
  },
  module: {
    ...
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    ...
  ],
  devServer: {
    ...
  }
}
```

- 再次执行npm run dev就能实时的更改代码并实时刷新了，至此，开发环境的基本配置就完成了

## 生产环境的构建

- 生产环境为了客户的体验与代码的隐私性，我们一般都会对代码进行混淆压缩，包括css与js代码的压缩，下面我们就来进行相关的配置
- 首先还是将我们之前的webpack.config.js中的基本配置复制到webpack.prod.js中，然后在此基础上进行相关的修改
- 上一章中我们将output中的filename命名为[name].js与入口文件一致，在生产环境中，为了避免名称一致导致的缓存问题，我们要对其进行修改
- 修改为[name].[chunkhash].js，这样在生成文件的时候会默认添加一个hash值，避免缓存问题的出现，修改如下

```js
// 先贴一下上一章最后的配置内容，后续不再完整展示
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
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
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

- 执行npm run build之后打开dist文件夹发现生成的文件都会带一串乱码，这样就避免了线上缓存的问题
- 接下来我们需要打开完整的错误调试，方便线上查找问题，还是修改devtool为source-map即可，如下

```js
...

module.exports = {
  entry: {
    ...
  },
  devtool: 'source-map',
  output: {
    ...
  },
  ...
}
```

- 然后我们尝试在index.js中主动抛出错误，执行npm run build后在浏览器点击错误就可以定位到相关错误的地方，便于错误排查
- 然后我们就需要进行代码的压缩混淆，减少代码体积，先对js进行代码压缩，这里我们需要引用插件 terser-webpack-plugin ，先进行下载，命令为： cnpm i terser-webpack-plugin -D ，然后在配置文件中进行相关配置，如下

```js
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

module.exports = {
  entry: {
    ...
  },
  devtool: 'source-map',
  output: {
    ...
  },
  module: {
    ...
  },
  plugins: [
    ...
  ],
  optimization: {
    minimizer: [
      // js压缩
      new TerserWebpackPlugin({
        cache: true, // 启用文件缓存
        parallel: true, // 多线程调用
        sourceMap: true // 错误排查
      }),
    ]
  }
}
```

- 接下来就是对css文件的打包进行处理，首先我们要将css文件给单独打包出来，我们可以观察到之前打包出来的文件其实是没有css文件的，因为webpack把所有的文件都打到一个文件里面了，所以我们没办法看到它，这其实对最后的生成的项目并不友好，所以我们先要在打包中将css抽离出来，这里我们就需要一个新的包 mini-css-extract-plugin ，还是使用npm下载此包： npm i mini-css-extract-plugin -D，然后在loader中将其配置起来
- 首先我们在页面中引用该插件，然后将style-loader替换为它提供的loader，然后在plugins中进行css抽离的命名规则配置，为避免缓存问题，我们还是采用hash值进行命名，配置如下

```js
...
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    ...
  },
  devtool: 'source-map',
  output: {
    ...
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader, // 替换了原来的style-loader
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
      ...
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({// 将css打包成单独的css文件
      filename: '[name].[hash:5].css',
      chunkFilename: '[id].[hash:5].css'
    }),
    ...
  ]
  
}
```

- 然后在运行npm run build就可以发现我们打出来的文件中出现了app.xxxxx.css的文件
- 接下来我们就要对css进行压缩了，css的压缩需要使用 optimize-css-assets-webpack-plugin 插件，还是npm下载该插件 npm i optimize-css-assets-webpack-plugin -D，然后在webpack中进行相关配置，跟js的配置一样，需要放置在optimization 下的 minimizer 中，如下

```js
const path = require('path')
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

module.exports = {
  entry: {
    ...
  },
  devtool: 'source-map',
  output: {
    ...
  },
  module: {
    ...
  },
  plugins: [
    ...
  ],
  optimization: {
    minimizer: [
      // js压缩
      new TerserWebpackPlugin({
        cache: true, // 启用文件缓存
        parallel: true, // 多线程调用
        sourceMap: true // 错误排查
      }),
      new OptimizeCssAssetsWebpackPlugin({}) // css压缩
    ]
  }
}
```

- 到这我们就基本完成了开发与生产环境的各自配置，接下来我们就继续对项目需要进行相应的处理
- 观察上面的开发与生产配置，其实还是有一部分的公用配置可以抽离出来，这里我们采用webpack-merge包来将其公共配置分离出来
- 还是先下载该包：npm i webpack-merge -D
- 然后在根目录新建一个webpack.common.js用来放置我们的公共配置
- 观察开发与生产配置，抽离公共的配置如下

```js
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  entry: {
    app: './index.js',
    test: './index.jsx'
  },
  module: {
    rules: [
      {
        test: /\.(|js)x?$/,
        use: ['babel-loader'],
        exclude: /node-modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
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
    new CleanWebpackPlugin(),
  ]
}
```

- 之前我们的配置中没有进行代码块的抽离，这里我们也简单的进行一下补充，加一组配置即可，这个是开发与生产公用的，所以我们也加到上面的配置中，如下

```js
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
module.exports = {
  entry: {
    app: './index.js',
    test: './index.jsx'
  },
  module: {
    rules: [
      {
        test: /\.(|js)x?$/,
        use: ['babel-loader'],
        exclude: /node-modules/
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
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
    new CleanWebpackPlugin(),
  ],
  optimization: { // 公共代码抽离
    splitChunks:{ //启动代码分割，有默认配置项
      chunks: 'all'
    }
  }
}
```

- 这样便配置了我们的代码分割功能，然后就开始继续配置我们的生产与开发配置了
- 然后修改webpack.dev.js，先在webpack.dev.js中引入webpack-merge与webpack.common.js，然后进行合并，因为css中的loader与生产环境不一致所以没有抽离，现在的webpack还需要给配置指定mode，取值为production或者deveopment，我们这里为开发配置，所以新增一个字段mode: 'development',最终如下

```js
// webpack.dev.js
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'development',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
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
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 模块热替换
    new webpack.NamedModulesPlugin() // 热更新时返回文件名而不是文件id
  ],
  devServer: {
    contentBase: './dist', // 静态文件目录，用于浏览器显示
    clientLogLevel: 'warning',  // 输出日志级别
    hot: true, // 启动热更新
    publicPath: '/', // 浏览器访问路径
    compress: true, // 启用gzip压缩
    port: 8822,
    open: true, // 自动调起浏览器
    overlay: { // 出现错误或警告是否覆盖页面线上错误信息
      warnings: true,
      errors: true
    },
    quiet: true,
    proxy: { // 代理
    },
    watchOptions: { // 监控文件相关配置
      poll: true,
      ignored: /node_modules/,
      aggregateTimeout: 300  // 默认值, 当你连续改动时候, webpack可以设置构建延迟时间(防抖)
    }
  }
})
```

- 再运行npm run dev能够发现跟抽离之前的配置是一样的，接下来我们对生产配置也进行一个合并，然后新增一个mode: production
- 同样是引入webpack-merge与webpack.common.js，然后进行合并，如下
  
```js
// webpack.prod.js
const path = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({// 将css打包成单独的css文件
      filename: '[name].[hash:5].css',
      chunkFilename: '[id].[hash:5].css'
    }),
  ],
  optimization: {
    minimizer: [
      // js压缩
      new TerserWebpackPlugin({
        cache: true, // 启用文件缓存
        parallel: true, // 多线程调用
        sourceMap: true // 错误排查
      }),
      new OptimizeCssAssetsWebpackPlugin({}) // css压缩
    ]
  }
})
```

- 上面就完成了生产与开发环境的配置，但是之前的配置还有部分遗漏，一个是在开发环境没有配置css的抽离规则，一个是没有配置react开发中的图片资源加载跟字体库与icon
- 下面我们就先针对开发环境的css进行一个处理，之前我们在运行webpack的时候是没办法区分开发与生产环境的，所以我们现在在webpack的命令中设置环境变量，用以区分开发还是生产环境，我们先引用cross-env的包，用于各平台设置环境变量的兼容，命令为 npm i cross-env -D
- 然后修改package.json中的启动命令为 "dev": "cross-env NODE_ENV=development webpack-dev-server --open --config webpack.dev.js",  "build": "cross-env NODE_ENV=production webpack --config webpack.prod.js" 然后在webpack.common.js中打印process.env.NODE_ENV，然后可以观察到在npm run dev的命令下process.env.NODE_ENV是'development'， npm run build 的命令下 process.env.NODE_ENV是'production'，由此，我们来配置css的抽离规则，先将之前配置在webpack.prod.js中的css打包配置删除，然后在webpack.common.js中新增如下配置
  
```js
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV === 'development' // 命令行设置的值
console.log(devMode)
module.exports = {
  entry: {
    ...
  },
  module: {
    ...
  },
  plugins: [
    new MiniCssExtractPlugin({// 将css打包成单独的css文件，在开发与生成生成不同的css
      filename: devMode ? '[name].css' : '[name].[hash:5].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash:5].css'
    }),
    ...
  ]
}
```

- 接下来我们要对图片进行处理，在开发中我们会经常根据当前文件的相对路径来引入图片资源，但是我们的打包又是基于入口文件的，所以经常会导致最后的图片引用路径错误，这里我们就要使用url-loader来帮我们进行图片路径处理，会将我们的引用路径替换为打包后的文件路径。
- url-loader还对我们提供了图片转dataUrl的功能，这样就可以将图片转为dataUrl的路径直接引入，避免了网络请求，但是图片过大的时候会影响我们的编码速率，这种时候还是应该使用网络图片请求。url-loader中的limit就是控制多大的图片以内转为dataUrl，大于该限制的就引用图片地址访问。
- 同样，我们还是先下载url-loader的相关包， npm i url-loader file-loader -D
- 下面我们就对各格式的图片进行配置，这部分配置生产与开发都要使用，因此在webpack.common.js下配置，配置如下
  
```js
// webpack.common.js
...
module.exports = {
  entry: {
    ...
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name]-[hash:5].[ext]',
              outputPath: 'img/'
            }
          }
        ]
      }
      ...
    ]
  },
  plugins: [
    ...
  ]
}
```

- 这样当图片在10k以内的时候我们就会将其转为dataUrl的路径引入，并且将图片统一放到img文件夹下
- webpack还为我们提供了图片的压缩功能，方便缩小我们的项目体积，需要使用 image-webpack-loader 来进行配置，还是先下载该包 npm i image-webpack-loader -D
- 然后在开发与生产都需要进行相关的配置，所以还是在 webpack.common.js 进行配置，配置如下

```js
// webpack.common.js
...
module.exports = {
  entry: {
    ...
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name]-[hash:5].[ext]',
              outputPath: 'img/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    ...
  ]
}
```

- 上面就完成了开发中图片的相关配置，接下来配置一下字体库，还是使用url-loader，配置规则跟图片的一致，如下

```js

...
module.exports = {
  entry: {
    ...
  },
  module: {
    rules: [
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 文件大小小于limit参数，url-loader将会把文件转为DataUR
              limit: 10000,
              name: '[name]-[hash:5].[ext]',
              ourput: 'fonts/'
            }
          }
        ],
      },
    ]
  },
  plugins: [
    ...
  ]
}
```

- 如上就完成了咱们项目的前期配置，单纯使用react已经没有什么问题了，这一章的配置就到这吧，下面把各个配置文件都贴一下，当然也可以选择源码查看，地址是 [react-admin](https://github.com/mf950511/react-admin)
- 下一章我们进行typeScript的配置，之后就开始正式进行项目开发

```js
// webpack.common.js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const devMode = process.env.NODE_ENV === 'development'
console.log(devMode)
module.exports = {
  entry: {
    app: './index.js',
    test: './index.jsx'
  },
  module: {
    rules: [
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000,
              name: '[name]-[hash:5].[ext]',
              outputPath: 'img/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              optipng: {
                enabled: false
              },
              pngquant: {
                quality: [0.65, 0.9],
                speed: 4
              },
              gifsicle: {
                interlaced: false
              },
              webp: {
                quality: 75
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              // 文件大小小于limit参数，url-loader将会把文件转为DataUR
              limit: 10000,
              name: '[name]-[hash:5].[ext]',
              ourput: 'fonts/'
            }
          }
        ],
      },
      {
        test: /\.(js)x?$/,
        use: ['babel-loader'],
        exclude: /node-modules/
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({// 将css打包成单独的css文件
      filename: devMode ? '[name].css' : '[name].[hash:5].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash:5].css'
    }),
    new HtmlWebpackPlugin({
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
    new CleanWebpackPlugin(),
  ],
  optimization: { // 公共代码抽离
    splitChunks:{ //启动代码分割，有默认配置项
      chunks: 'all'
    }
  }
}

// webpack.dev.js
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')

module.exports = merge(common, {
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
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
      }
    ]
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ],
  devServer: {
    contentBase: './dist', // 静态文件目录，用于浏览器显示
    // clientLogLevel: 'warning',  // 输出日志级别
    hot: true, // 启动热更新
    publicPath: '/', // 浏览器访问路径
    compress: true, // 启用gzip压缩
    port: 8822,
    open: true, // 自动调起浏览器
    overlay: { // 出现错误或警告是否覆盖页面线上错误信息
      warnings: true,
      errors: true
    },
    quiet: true,
    proxy: { // 代理
    },
    watchOptions: { // 监控文件相关配置
      poll: true,
      ignored: /node_modules/,
      aggregateTimeout: 300  // 默认值, 当你连续改动时候, webpack可以设置构建延迟时间(防抖)
    }
  }
})

// webpack.prod.js
const path = require('path')
const TerserWebpackPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = merge(common, {
  devtool: 'source-map',
  output: {
    filename: '[name].[chunkhash].js',
    path: path.resolve(__dirname, 'dist'),
    chunkFilename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(le|c)ss$/,
        use: [
          MiniCssExtractPlugin.loader,
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
      }
    ]
  },
  plugins: [
    new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerHost: '127.0.0.1',
      analyzerPort: 7778,
      reportFilename: 'report.html',
      defaultSizes: 'parsed',
      openAnalyzer: true,
      generateStatsFile: false,
      statsFilename: 'stats.json',
      statsOptions: null,
      logLevel: 'info'
    }),
  ],
  optimization: {
    minimizer: [
      // js压缩
      new TerserWebpackPlugin({
        cache: true, // 启用文件缓存
        parallel: true, // 多线程调用
        sourceMap: true // 错误排查
      }),
      new OptimizeCssAssetsWebpackPlugin({}) // css压缩
    ]
  }
})
```