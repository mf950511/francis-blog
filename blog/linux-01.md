---
title: "Linux操作--01"
date: "2021-10-27"
name: 'francis'
age: '26'
tags: [Linux基本操作]
categories: Linux
---

# Linux

## 环境变量更新

- yarn环境变量配置
  - 更新Users/.zshrc 文件，在后面补充变量
  - 更新.zshrc

```js
export PATH="$PATH:`yarn global bin`:$HOME/.config/yarn/global/node_modules/.bin"

source .zshrc
```

- 查看命令详情
  - man 命令名称，如 man ls
- 通配符
  - * 匹配任意字符
  - ？ 匹配一个字符串
  - [xyz] 匹配其中任意一个字符串
  - [a-z] 匹配一个范围
  - [!xyz]或[^xyz] 不匹配
<!--more-->
- 文件夹操作命令
  - pwd 展示当前目录名称
  - cd 更改当前操作目录
    - cd - 返回上一次的目录
  - ls 查看当前目录下的文件，可跟多个文件夹以 空格 分割，如 ls -l /root /Users/fmeng，也可以命令简写，如 ls -l -r 简写为 ls -lr，搭配通配符展示所有以file开头的文件 ls file*
    - -l 长格式显示文件
    - -a 显示隐藏文件
    - -r 逆序显示
    - -t 按时间顺序显示
    - -R 递归显示
  - touch 创建文件
  - mkdir 创建文件夹
    - mkdir /a 在根目录下创建文件夹
    - mkdir a b c 在当前文件夹下创建文件夹,创建多个
    - mkdir a/b/c 创建嵌套文件夹a/b/c,这里必须存在文件夹 a 跟 b 才能创建文件夹c，也就是上层文件夹必须存在才可以
    - mkdir -p a/b/c/d/e/f/g 创建嵌套文件夹，这里不需要上层文件夹存在，不存在会自动创建
  - rmdir 只能删除空文件夹，内部有文件或文件夹都不可删除
  - rm -r /a 删除非空文件夹
  - rm -rf a 删除非空文件夹 a 并不进行提示
  - cp 源文件 目的文件夹 复制文件或文件夹
    - -r 复制文件夹
    - -v 展示复制进度
    - -p 保留原文件的操作时间等信息
    - -a 保留权限、属主、时间等信息
  - mv 移动或重命名操作,可搭配通配符使用 如 mv file* /tem
- 文件查看命令
  - cat 文本内容显示到终端
  - head 查看文件开头，默认10行，可以加参数指定开头多少行，如 head -5 /Users/test
  - tail 查看文件结尾，默认10行，可以加参数指定结尾多少行，如 tail -5 /Users/test
    - 常用参数 -f 针对该文件不停变化时，如在文件后面不停追加内容时。文件内容更新后显示信息同步更新
  - wc 统计文件内容信息
    - -l 展示文件有多少行
  - more 按进度查看，可按 空格 进行内容切换
- vi 命令
  - vim 模式，正常文本编辑模式，可以使用 vim 文件名进入
    - i 光标位置开始插入
    - I 光标位置行最开头插入
    - a 光标位置的后一位插入
    - A 光标所在行最结尾插入
    - o 光标所在行后一行插入空行
    - O 光标所在行上一行插入空行
    - h 向左移动
    - l 向右移动
    - j 向下移动
    - k 向上移动
    - yy 复制整行
    - p 粘贴
    - 3yy 复制三行
    - y$ 复制光标到该行结尾的文本
    - dd 剪切整行
    - d$ 剪切光标到该行结尾的文本
    - u 撤销
    - ctrl + r 重做撤销
    - x 删除光标对应文本
    - r 替换光标对应的文本
    - :set nu 文本展示对应的行数
    - :set nonu 文本隐藏对应的行数
    - 行数 + G 跳抓到对应的行
    - g 跳转文本第一行
    - G 跳转文本最后一行
    - ^ 光标所在行行首
    - $ 跳转光标所在行行尾
    - :w 文件路径及文件名 保存文本到指定路径
    - :q 文件退出
    - :q! 不保存退出
    - :wq 保存并退出
    - :! 命令 可在vi界面执行其他操作
    - /文本 进行文本查找
    - n 有多个匹配文本进行下一个跳转
    - shift + n 多个匹配文本进行上一个跳转
    - :s/被替换文本/替换文本 只针对本行查找
    - :%s/被替换文本/替换文本 整个文件查找替换第一个
    - :%s/被替换文本/替换文本/g 整个文件查找替换
    - v 进入可视字符模式，移动光标按字符选中
    - shift + v 进入可视行模式，移动光标按行选中
    - ctrl + v 进入可视块模式，移动光标会按块状选中，这种模式下使用 I 插入字符后，在连按两次esc可以在每一行都插入同样的字符，按 d 可删除选中的块
  - vim /etc/vimrc 是vim配置文件，可更改
    - 结尾新增 set nu
- 打包与压缩
  - Linux下之前使用打包进行文件备份，也就是tar命令
  - 打包后的文件进行压缩，压缩命令是 gzip和bzip2
  - 常使用的拓展名是 .tar.gz .tar.bz2 .tgz
  - tar 执行打包命令 tar cf /test.tar /etc 将 etc文件夹打包到 test.tar ,需要sudo权限
    - c 打包
    - x 解包
    - f 制定操作类行为文件
    - czf 表示打包压缩为gzip格式，所以后缀一般是双后缀表示打包压缩，如 tar czf /test.tar.gz /etc 缩写为 .tgz
    - cjf 表示打包压缩为bzip2格式，所以后缀一般是双后缀表示打包压缩，如 tar cjf /test.tar.bz2 /etc 缩写为 .tbz2
    - bzip2打包慢一点，但是打包体积更小
    - xf 解包 tar xf /test.tar -C /Users 表示将文件解包到 Users 文件夹
    - zxf 解包解压缩 tar zxf /test.tar.gz -C /Users 
    - jxf 解包解压缩 tar jxf /test.tar.bz2 -C /Users 
- 进程查看
  - ps -ef | grep Z
  - sudo kill -9 进程号
- 权限切换命令
  - su - root
