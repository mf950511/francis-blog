---
title: "DOM2跟DOM3-CSS"
date: "2021-01-16"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# DOM2跟DOM3-CSS

- 支持style属性的HTML元素在JavaScript中都有一个style属性，该属性是CSSStyleDeclaration属性的实例，包含通过HTML style属性为元素设置的所有样式信息，不包含通过层叠样式机制从文档样式和外部样式中继承来的样式
- HTML style属性中的CSS属性在JavaScript style对象中都有对应的属性（JavaScript中会把连字符分割的单词转为驼峰）
- 大多数属性都可以直接转换，但是float不可以，因为它在JavaScript中是保留字，所以不能用做属性名。DOM2 Style规定它为cssFloat
- DOM2 Style规范在style对象上加了一些属性和方法
  - cssText:包含style属性中的CSS代码
  - length，应用给元素的css属性数量
  - parentRule，表示CSS信息的CSSRule对象
  - getPropertyCSSValue(propertyName)，返回包含CSS属性值propertyName值的CSSValue对象（已废弃）
  - getPropertyPriority(propertyeName)，如果CSS属性PropertyName使用了!important则返回"important"，否则返回空字符串
  - getPropertyValue(propertyName),返回属性propertyName的字符串值
  - item(index)，返回索引index的CSS属性名
  - removeProperty(propertyName)，从样式中删除CSS属性
  - setProperty(propertyName, value, priority)，设置CSS属性propertyName值为value，priority是"important"或空字符串
- cssText可以存取样式的CSS代码，读模式下，cssText返回style属性CSS代码在浏览器内部的表示。写模式下，给cssText赋值会重写整个style属性的值。
- length属性跟item()方法一起使用迭代CSS属性

```js
for(let i = 0; i < myDiv.style.length; ++i){
  console.log(myDiv.style[i]) // 取得css属性名为"background-color"而不是backgroundColor
}
```
<!--more-->
- getPropertyValue返回CSS属性值的字符串表示，getPropertyCSSValue返回一个CSSValue对象，包含两个值：cssText和cssValueType。前者跟getPropertyValue返回值一样，后者是一个数值常量，表示当前值类型（0代表继承值，1代表原始值，2代表列表，3代表自定义值）
- removeProperty用于从元素样式中删除指定CSS属性，删除后会使用该属性的默认（从其他样式表继承）样式，不确定默认值是什么的情况下，从style属性中删除就会用默认值

## 计算样式

- style样式包含支持style属性的元素为这个属性设置的样式信息，但是不包含从其他样式层叠表继承的同样影响该元素的样式信息。
- DOM2 Style在document.defaultView上增加了getComputedStyle()方法。该方法接受两个参数：要取得计算样式的元素和伪元素字符串（如":after"）。不需要查询伪元素，第二个参数可以为null
- getComputedStyle返回一个CSSStyleDeclaration对象，包含元素的计算样式

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #myDiv{
      background-color: blue;
      width:100px;
      height: 200px;
    }
  </style>
</head>
<body>
  <div id="myDiv" style="background-color: red;border:1px solid black"></div>
  <script>
    let div = document.getElementById('myDiv')
    let computedStyle = document.defaultView.getComputedStyle(div, null)
    console.log(div.style.backgroundColor) // 
    console.log(computedStyle.backgroundColor)
    console.log(div.style.width)
    console.log(computedStyle.width)
    console.log(div.style.height)
    console.log(computedStyle.height)
    console.log(div.style.border)
    console.log(computedStyle.border)
  </script>
</body>
</html>
// red
// rgb(255, 0, 0)
// 
// 100px
//
// 200px
// 1px solid black
// 1px solid rgb(0, 0, 0)
```

- 所有浏览器中，计算样式都是只读的，不可修改，计算样式还会包含默认值
- CSSStyleSheet类型表示CSS样式表，包括使用\<link>元素和通过\<style>元素定义的样式。这两个元素本身是HTMLLinkElement和HTMLStyleElement。CSSStyleSheet类型是通用样式表类型。CSSStyleSheet类型的实例是一个只读对象
- CSSStyle继承StyleSheet，以下为继承的属性
  - disabled:布尔值，样式表是否被禁用，设置为true会禁用样式表
  - href:如果是link包含的样式表，返回样式表的URL，否则返回null
  - media:样式表支持的媒体类型集合，集合有一个length属性和item()方法，如果样式表可用于所有媒体，就返回空列表
  - ownerNode,指向拥有当前样式表的节点，在HTML中要么是link元素要么是style元素。如果当前样式表是@import被包含在另一个样式表中，则这个值是null
  - parentStyleSheet，如果当前样式是通过@import被包含在另一个样式表中，这个属性指向导入它的样式表
  - title,ownerNode的title属性
  - type,字符串，表示样式表的类型，CSS样式表就是"text/css"
- 以上属性除了disabled，其他都是只读的，除了以上继承属性，还支持下属性和方法
  - cssRules，当前样式表包含的样式规则的集合
  - ownerRule:如果样式表是使用@import导入，指向导入规则，否则指向null
  - deleteRule(index)，在指定位置删除cssRules中的规则
  - insertRule(rule, index),在指定位置向cssRules中插入规则
- document.styleSheets表示文档中可用的样式表的集合
- CSSRule类型表示样式表中的一条规则，很多类型都继承它，最常用的是表示样式信息的CSSStyleRule，以下是CSSStyleRule对线上可用的属性
  - cssText，返回整个规则的文本。返回的文本可能跟实际的不一样，Safari始终会把所有字母转为小写
  - parentRule,如果这条规则被其他规则包含，就指向包含规则，否则指向null
  - parentStyleSheet,包含当前规则的样式表
  - selectText，返回规则的选择符文本，可能与样式表中的文本不一样。在Opera中是可修改的
  - style，返回CSSStyleDecalaration对象，可以设置和获取当前规则中的样式
  - type,数值常量，表示规则类型，样式规则，始终为1
- cssText与style.cssText类似，前者包含选择符文本和环绕样式的大括号，后者只包含样式生命，cssText是只读的，style.cssText是可以被重写的
- DOM中，可以使用insertRule来向样式表插入新规则，接受两个参数：规则的文本和表示插入未知的索引值

```js
let sheet = document.styleSheets[0]
sheet.insertRule("body{ background-color: silver }", 0)
```

- 上面例子中这条规则作为样式表的第一条规则插入
- 支持从样式表中删除规则的DOM方法deleteRule()，接受一个参数，要删除的索引

## 元素尺寸

- 这咯的属性和方法并不是DOM2 Style中定义的，但是与HTML元素样式有关。IE率先增加了一些属性，这些属性已经得到所有主流浏览器支持
- 偏移尺寸：包含元素在屏幕上占用的所有视觉空间。元素在页面山的视觉空间由高度与宽度决定，包括所有内边距、滚动条和边框
  - offsetHeight: 元素在垂直方向上占用的像素尺寸，包括它的高度、水品滚动条高度（如果可见）和上下边框的高度
  - offsetLeft: 元素左边框外侧距离包含元素左边框内侧的像素数
  - offsetTop:元素上边框外侧距离包含元素上边框内侧的像素数
  - offsetWidth:元素在水平方向上占用的像素尺寸，包含它的宽度、垂直滚动条宽度和左右边框宽度
- offsetLeft和offsetTop是相对于包含元素的，包含元素保存在offsetParent属性中。offsetParent不一定是parentNode。比如\<td>元素的offsetParent是table元素，因为table是节点中第一个提供尺寸的元素
- 要确定一个元素在页面中的偏移量，可以将它的offsetLeft和offsetTop分别于offsetParent的相同属性相加，一直到更元素

```js
function getElementLeft(element){
  let actualLeft = element.offsetLeft
  let current = element.offsetParent
  while(current !== null) {
    actualLeft += current.offsetLeft
    current = offsetParent
  }
  return actualLeft
}
```

- 对于CSS布局的页面，这个函数很精确，对使用表格和内嵌窗格的页面，返回值会不相同
- 所有偏移尺寸都是只读的，每次访问都会重新计算
- 元素的客户端尺寸：客户端尺寸只有clientWidth和clientHeight
  - clientWidth是内容区宽度加左右内边距的宽度
  - clientHeight是内容区高度加上下内边距的高度
- 客户端尺寸实际上就是元素内部的空间，不包含滚动条占用的空间，最常用的是确定浏览器视口尺寸，及document.documentElement的clientWidth和clientHeight
- 滚动尺寸：提供了元素滚动距离的信息
  - scrollHeight:没有滚动条出现时，元素内容的总高度
  - scrollLeft:内容区左侧隐藏的像素数，设置这个属性可以改变元素的滚动位置
  - scrollTop:内容区顶部隐藏的像素数，设置这个属性可以改变元素的滚动位置
  - scrollWidth:没有滚动条出现时，元素内容的总宽度
- scrollWidth和scrollHeight可以确定元素的实际尺寸
- scrollWidth和scrollHeight等于文档内容的宽度，而clientWidth和clientHeight等于视口的大小
- scrollLeft个scrollTop用于确定当前元素的滚动位置或者设置滚动位置，这两个属性表示已经滚动不可见的元素的高度
- 浏览器在每个元素上暴露了getBoundingClientRect()方法，返回一个DOMRect对象，包含六个属性：left、top、right、bottom、height、width

## 遍历

- DOM2 Traversal and Range定义了两个类型用于辅助遍历：NodeIterator和TreeWalker对DOM结构的深度遍历优先
- NodeIterator通过document.createNodeIterator()，接受以下4个参数
  - root，作为遍历根节点的节点
  - whatToShow,数值代码，表示应该访问哪些节点
  - filter，NodeFilter对象或函数，表示是否接收或跳过特定节点
  - entityReferenceExpansion，布尔值，表示是否拓展实体引用。这个参数在HTML文档中没有效果
- whatToShow参数是一个位掩码，通过应用一个或多个过滤器来指定访问哪些节点。常量是在NodeFilter中定义的
  - NodeFilter.SHOW_ALL，所有节点
  - NodeFilter.SHOW_ELEMENT，元素节点
  - NodeFilter.SHOW_ATTRIBUTE，属性节点，DOM结构中用不到
  - NodeFilter.SHOW_TEXT,文本节点
  - NodeFilter.SHOW_CDATA_SECTION,CData区块节点，不在HTML页面使用
  - NodeFilter.SHOW_ENTITY_REFERENCE,实体引用节点，不在HTML页面使用
  - NodeFilter.SHOW_PROCESSING_INSTRUCTION，处理指令节点，不在HTML页面使用
  - NodeFilter.SHOW_COMMENT，注释节点
  - NodeFilter.SHOW_DOCUMENT，文档节点
  - NodeFilter.SHOW_DOCUMENT_TYPE,文档类型节点
  - NodeFilter.SHOW_DOCUMENT_FRAGMENT，文档片段节点，不在HTML页面使用
  - NodeFilter.SHOW_NOTATION,记号节点，不在HTML页面使用
- 除了NodeFilter.SHOW_ALL之外，都可以组合使用

```js
let whatToShow = NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT
```

- createNodeIterator()方法的filter参数可以用来指定自定义NodeFilter对象，或者一个作为节点过滤器的函数。NodeFilter对象只有一个方法acceptNode()，如果给定节点应该访问就返回NodeFilter.FILTER_ACCEPT，否则返回NodeFilter.FILTER_SKIP。因为NodeFilter是抽象类，不可创建势力

```js
let filter = {
  acceptNode(node) {
    return node.tagName.toLowerCase() === 'p' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
  }
}

// 或者直接用函数
function filter(node){
  return node.tagName.toLowerCase() === 'p' ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
}
let iterator = document.createNodeIterator(root, NodeFilter.SHOW_ELEMENT, filter, false)
```

- filter参数也可以是一个函数，与acceptNode形式一样，返回对应的属性值
- 如果不需要指定过滤器，可以直接传入null
- NodeIterator有两个主要方法是nextNode()跟previouseNode()。
- nextNode在DOM子树中以深度优先方法前进一步，而previousNode则是后退一步。创建NodeIterator对象时会有一个内部指针指向根节点，因此第一次调用时nextNode()返回根节点。当遍历到最后一个节点时，nextNode返回null，previousNode当遍历到最后一个节点时，调用previousNode返回遍历的根节点时，再次调用返回null
- TreeWalker是NodeIterator的高级版，除了同样的NextNode和previousNode外，新增了在DOM中向不同方向遍历的方法
  - parentNode():遍历到当前节点的父节点
  - firstChild():遍历到当前节点的第一个子节点
  - lastChild():遍历到当前节点的最后一个子节点
  - nextSibling():遍历到当前节点的下一个同胞节点
  - previousSibling():遍历到当前节点的上一个同胞节点
- document.createTreeWalker方法来创建TreeWalker实例，接受与document.createNodeIterator一样的参数，两者很相似，所以经常会使用TreeWalker替代NodeIterator
- 不同的是，节点过滤器（filter）除了可以返回NodeFilter.FILTER_ACCEPT跟NodeFilter.FILTER_SKIP，还可以返回NodeFilter.FILTER_REJECT。
- 在使用NodeItertor时，NodeFilter.FILTER_SKIP与NodeFilter.FILTER_REJECT是一样的。在使用TreeWalker时，NodeFilter.FILTER_SKIP表示跳过该节点，访问子树中的下一个节点，而NodeFilter.FILTER_REJECT表示跳过该节点及节点的整个子树
