---
title: "Array对象"
date: "2020-10-14"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# Array对象

## Array的创建

- Array构建函数创建
- 无参数创建会生成一个空的数组
- 当传入一个数值时，会生成一个数组，并且长度设为该数值
- 当传入一个非数值时，会生成一个数组，并且数组第一项位该值
- 如果传入多个值时，会生成一个数组，并且这几个值都会依次存在于数组中

```js
let arr1 = new Array()
let arr2 = new Array(3)
let arr3 = new Array('张三')
let arr4 = new Array({ name: '张三' })
let arr5 = new Array(5, '张三', 24)
console.log(arr1, arr2, arr3, arr4, arr5)
// []
// [empty × 3]
// ["张三"]
// [{…}]
// [5, "张三", 24]
```

## Array.from、Array.of

- 这两个都是Array构造函数的静态方法，属于ES6新增范畴
- Array.from用于将类数组结构转为数组
- Array.from方法接收的第一个参数是一个类数组对象（任何可迭代的结构）或者有length属性与可索引元素的结构

<!--more-->
```js
// 字符串转为数组
console.log(Array.from("Matt"))
// ["M", "a", "t", "t"]
const m = new Map().set(1,2).set(3,4)
const s = new Set().add(1).add(2).add(3).add(4)
console.log(Array.from(m)) // [[1, 2], [3, 4]]
console.log(Array.from(s)) // [1, 2, 3, 4]
const iter = {
  *[Symbol.iterator](){
    yield 1;
    yield 2;
    yield 3;
    yield 4;
    yield 5;
  }
}
console.log(Array.from(iter)) // [1, 2, 3, 4, 5]

function getArgsArray(){
  return Array.from(arguments)
}
console.log(getArgsArray(1,2,3,4)) // [1, 2, 3, 4]

const arrayLikeObject = {
  0: 1,
  1: 2,
  3: 3,
  4: 4,
  length:4
}
console.log(Array.from(arrayLikeObject)) // [1, 2, 3, 4]

```

- Array.from的第二个参数（可选）接收的是一个对新数组操作的函数，会对新数组的每一项都执行该函数
- 第三个参数（可选）接收的是操作函数的this的值，当第二个参数是箭头函数时，这个值无效

```js
const array = [1,2,3,4]
const a2 = Array.from(array, x => x ** 2)
const a3 = Array.from(array, function(x) { return x ** this.exponent}, { exponent: 2 })
console.log(a2) // [1, 4, 9, 16]
console.log(a3) // [1, 4, 9, 16]
```

- Array.of可以把一组参数专为数组，用于替代之前的Array.prototype.slice.call(arguments)

```js
console.log(Array.of(1, 2, 3, 4)) // [1, 2, 3, 4]
console.log(Array.of(undefined))  // [undefined]
```

## 数组检测

- 在只有一个全局上下文时只用 instanceof 就够用了，但是要是有两个全局上下文，那么对应的Array构造函数可能不同，这种情况下可能不合适
- 所以针对这种情况就提供了 Array.isArray()方法，该方法只用于确定一个值是否是数组，跟上下文环境无关

```js
let array = [1, 2, 3, 4]
let arrayLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3
}
console.log(array instanceof Array)     // true
console.log(arrayLike instanceof Array) // false

console.log(Array.isArray(array))       // true
console.log(Array.isArray(arrayLike))   // false
```

## 迭代器方法

- Array原型暴露了3个检索数组内容的方法，keys()，values()，entries()
- keys返回数组索引的迭代器
- values返回数组元素的迭代器
- entries返回索引/元素的迭代器

```js
// 都是迭代器，所以可以直接使用Array.from转为数组
const a = ['foo', 'bar', 'baz', 'qux']
console.log(Array.from(a.keys()))     //  [0, 1, 2, 3]
console.log(Array.from(a.values()))   // ["foo", "bar", "baz", "qux"]
console.log(Array.from(a.entries()))  // [[0, "foo"], [1, "bar"], [2, "baz"], [3, "qux"]]
```

## 填充方法copyWithin、fill

- 数组填充方法 fill() 可以向一个已有的数组中插入全部或部分相同的值。
- 第一个参数为填充值
- 第二个参数为开始索引，指定开始填充的位置（可选），
- 第三个参数为结束索引位置（填充不包含该位置），不提供结束索引就一直填充到数组末尾
- 负值索引从数组末尾开始计算（也可以理解为数组长度加上它得到的正值索引）

```js
const zeroes = [0, 0, 0, 0, 0]
zeroes.fill(5) // [5, 5, 5, 5, 5]
zeroes.fill(0) // 重置为 0 [0, 0, 0, 0, 0]

zeroes.fill(6, 3) // [0, 0, 0, 6, 6]
zeroes.fill(0)

zeroes.fill(7, 1, 3) // [0, 7, 7, 0, 0]
zeroes.fill(0)

// -4 + 5 = 1, -1 + 5 = 4,等价于zeroes.fill(1, 4)
zeroes.fill(8, -4, -1) // [0, 8, 8, 8, 0]
```

- fill()静默忽略超出数组边界，零长度以及相反索引

```js
const zeroes = [0, 0, 0, 0, 0]
zeroes.fill(1, -10, -6) // 索引过低 [0, 0, 0, 0, 0]
zeroes.fill(0)

zeroes.fill(1, 10 ,15) // 索引过高 [0, 0, 0, 0, 0]
zeroes.fill(0)

zeroes.fill(7, 4, 2) // 索引相反，忽略 [0, 0, 0, 0, 0]
zeroes.fill(0)

// -4 + 5 = 1, -1 + 5 = 4,等价于zeroes.fill(1, 4)
zeroes.fill(8, 3, 10) // [0, 0, 0, 8, 8]
```

- copyWithin会浅复制数组中的部分内容，然后再插入到指定索引的位置，开始索引与结束索引与fill计算方式一直
- 第一个参数为插入元素的开始位置
- 第二个参数为复制数组的开始位置（可选），默认为0
- 第三个参数为复制数组的结束位置（可选），不指定则会一直复制到数组结束

```js
let ints, reset = () => ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
reset()

// 未指定开始位置表示从数组的第0个位置开始复制，然后插入到第5个位置
ints.copyWithin(5) // [0, 1, 2, 3, 4, 0, 1, 2, 3, 4]
reset()

// 第二个参数为5，表示从数组的第5个位置开始复制，然后从3的位置开始插入
ints.copyWithin(3, 5) // [0, 1, 2, 5, 6, 7, 8, 9, 8, 9]
reset()

// 第二个参数为0，表示从数组的第0个位置开始复制，复制到第3的位置，然后从第4个位置插入
ints.copyWithin(4, 0, 3) // [0, 1, 2, 3, 0, 1, 2, 7, 8, 9]
reset()

// 负值的算法与fill一致， -4 + 10 = 6， -7 + 10 = 3，-3  + 10 = 7,等价于 ints.copyWithin(6, 3, 7)
ints.copyWithin(-4, -7, -3) // [0, 1, 2, 3, 4, 5, 3, 4, 5, 6]

```

- copyWithin()也会静默忽略超出数组边界，零长度以及相反索引

```js
let ints, reset = () => ints = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
reset()

// 索引过低，忽略
ints.copyWithin(1, -15, -12) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
reset()

// 索引过高，忽略
ints.copyWithin(1, 12, 15) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
reset()

// 索引反向，忽略
ints.copyWithin(4, 3, 1) // [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
reset()

// 部分索引可用
ints.copyWithin(4, 7, 10) // [0, 1, 2, 3, 7, 8, 9, 7, 8, 9]

```

## 转换方法

- 所有对象都有toLocalString、toString、valueOf方法。
- 数组中valueOf返回数组本身
- toString返回数组每一项调用toString返回的字符串用逗号拼接的一个字符串
- toLocalString返回数组每一项调用toLocalString返回的字符串用逗号拼接的一个字符串

```js
let a = [1,2,3,4]
console.log(a.valueOf())  // [1, 2, 3, 4]
console.log(a.toString()) // 1,2,3,4
```

## reverse与sort

- reverse就是简单地将数组翻转
- sort默认会将数组的每一项调用String方法，然后再按照升序排列元素，所以对数字的排序会有问题
- 所以sort可以接收一个比较函数，如果第一个值要在第二个值前面，返回-1，两个参数相等，返回0，第一个值在第二个值后面，返回1

```js
let arr = [0, 1, 5, 10, 15]
console.log(arr.sort()) // [0, 1, 10, 15, 5]

function compare(x, y){
  if(x > y) {
    return 1
  } else if(x < y) {
    return -1
  } else {
    return 0
  }
}
console.log(arr.sort(compare)) // [0, 1, 5, 10, 15]
```

- 上面直接对数字数组调用出错是因为对数字排序时也会转为字符串在比较，'10' 对应的字符串要小于 '5'的字符串
- 下面进行了值比较后就正常了，单看这个比较，其实简单地 arr.sort((a, b) => a - b) 也可以实现

## concat方法

- concat是数组拼接方法，会创建一个数组的副本，然后把它的参数拼接到副本末尾，然后返回这个副本
- 如果参数是数组，会把数组的每一项都加到结果数组，如果是非数组，则直接加到结果数组中

```js
let colors = ['red', 'green', 'blue']
let colors1 = colors.concat('yellow', ['black', 'brown'])
console.log(colors)   // ["red", "green", "blue"]
console.log(colors1)  // ["red", "green", "blue", "yellow", "black", "brown"]
```

- 参数中的数组是否被展开拼接可以通过符号 Symbol.isConcatSpreadable 控制，为false不再展开，为true强制展开

```js
let colors = ['red', 'green', 'blue']
let newColors = ['black', 'brown']
newColors[Symbol.isConcatSpreadable] = false
let moreNewColors = {
  [Symbol.isConcatSpreadable]: true,
  length: 2,
  0: 'pink',
  1: 'cyan'
}
console.log(colors.concat(newColors))     // ["red", "green", "blue", Array(2)]
console.log(colors.concat(moreNewColors)) // ["red", "green", "blue", "pink", "cyan"]
```

## slice与splice

- slice就是简单地创建一个包含原数组一个或多个元素的数组
- 参数有两个，第一个为开始位置，第二个为结束位置（可选）
- 不设置结束位置则一直到数组尾的全部元素
- 如果结束位置小于开始位置，返回空数组
- 如果参数为负值，则认为值为该负值加数组长度后的值
- splice用于向数组删除与插入元素
- 第一个参数表示删除元素的位置
- 第二个参数表示删除的数量
- 第三个及以后的参数表示在删除位置要插入的元素
- 该方法返回值为删除后的元素

## find与findIndex

- 都用于查找元素，find返回第一个匹配的元素，findIndex返回第一个匹配元素的索引
- 没找到find返回undefined，findIndex返回-1
- 找到元素后两个方法都不会继续执行

```js
let arr1 = [2, 4, 6]
console.log(arr1.find(x => x === 4)) // 4
console.log(arr1.findIndex(x => x === 4)) // 1
```

## 迭代方法

- every()，数组每一项都执行传入的函数，都返回true则结果返回true
- filter()，数组每一项都运行该函数，函数返回true则会将返回true的项拼接为数组后返回
- forEach()，数组每一项都执行该函数，无返回值
- map()，数组每一项都执行该值，返回由函数调用结果够成的数组
- some()，数组每一项都执行该值，有一项返回true，则方法返回true

## reduce与reduceRight

- 两个方法都会迭代数组所有项，然后构建一个最终值并返回
- 区别是reduce从数组第一项开始迭代，reduceRight从数组最后一项开始迭代
- 两个方法都接受两个参数，第一个为归并函数，第二个为初始值（可选）
- 归并函数接收4个参数，上一个归并值，当前项，当前索引，数组本身
- 当方法的第二个参数不存在时，归并函数从第二个值开始，第一个值作为初始值
- 以此可以做数组求和

```js
let values = [1, 2, 3, 4, 5]
// 可以无初始值
let sum = values.reduce((prev, cur, index, array) => prev + cur)
console.log(sum) // 15
// 有初始值
sum = values.reduce((prev, cur, index, array) => prev + cur, 0)
console.log(sum) // 15

// 使用reduceRight
// 有初始值
sum = values.reduceRight((prev, cur, index, array) => prev + cur, 0)
console.log(sum) // 15
```