---
title: "从零搭建一个react-hooks项目（六）"
date: "2021-02-06"
name: 'francis'
age: '25'
tags: [react, react hooks, redux, webpack, esLint]
categories: Webpack
---

# 从零搭建一个react-hooks项目（六）

- 最近项目比较忙，所以有段时间没有补充新内容了，直到github提示有人给我提了issue才抽时间补了一下这个内容
- 之前已经完成了webpack的搭建与优化，可以完成项目的基本使用，这位热心的伙伴也是提出了一些关于eslint的建议，所以这次补充一下ESLint的引入
- 我们的项目使用了react与typescript，有typescript的存在看起来应该使用TSLint，但是官方提出以后会弃用TSLint，转而使用ESLint，声明也说了ESLint对TS的支持很完善，所以我们就引入一下ESLint

## 在项目中安装ESLint

- 首先安装ESLint与TS的相关依赖

```js
// yarn add eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser --save-dev
```

- 然后在项目的根目录创建 .eslintrc.json 文件，然后补充下面选项进入
<!--more-->
```js
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "jsx": true,
    "useJSXTextNode": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"]
  }
}
```

- parser告诉ESLint使用typescript模式解析，parserOpions告诉ESLint我们想要使用jsx语法
- extends是表明我们想要使用ESLint中typescript的推荐语法与基本的eslint默认规则
- plugins中是我们要用到的ESLint包含的详细typescript的解析规则
- rules是我们指定的typescript的一些规则，第一个是未使用的变量需要报错，第二个是对可以使用type或者interface申明的类型统一都用type，否则会报错

## 使用prettier

- 使用prettier就是告诉ESLint我们已经在本地校验过代码格式了，你可以不用关心代码的格式怎么样，下面是安装的依赖

```js
// yarn add prettier eslint-config-prettier
npm install prettier eslint-config-prettier --save-dev
```

- 然后就需要在ESLint的配置规则中进行拓展，拓展之后能给我们更好看的代码格式校验，修改 .eslintrc.json 文件如下
- 然后新建`.prettierrc` 文件，同样是一个json文件，里面是对应的prettier的配置选项，具体可见选项可见 [prettier option](https://prettier.io/docs/en/options.html)

```js
// .prettierrc
{
  "singleQuote": true
}

// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "jsx": true,
    "useJSXTextNode": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  "plugins": ["@typescript-eslint"],
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/consistent-type-definitions": ["error", "type"]
  }
}
```

- 在`extends`最后加了`prettier`可以让我们eslint与prettier同时工作，不会产生冲突

## 使用VSCode优化编码体验

- 上面添加了基本的校验规则，但是不会在我们编码的时候主动为我们执行检查，所以我们可以通过配置VSCode插件来让编辑器实时为我们检查
- 先在VSCode的插件库里搜索ESlint跟Prettier，然后安装并重启
- 之后在 文件 -> 首选项 -> 设置中搜索 setting.json ，然后在 setting.json 最外层补充

```js
// setting.json
{
  // otherSetting
  "editor.tabSize": 2,
  "eslint.format.enable": true,
  "eslint.nodeEnv": "",
  "typescript.validate.enable": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.options": {
    "extensions": [
      ".js",
      ".vue",
      ".ts",
      ".tsx",
      ".jsx"
    ]
  }
}

```

- 之后再打开我们的代码就发现可以在每个页面提醒我们代码中的格式问题，并且会在我们保存代码的时候帮我们格式化代码了
- 好了，上面就是引入代码规范ESLint的步骤了，有什么问题也可以私我啊(没啥问题也可以私我哦)