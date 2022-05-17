---
title: "String类型"
date: "2020-10-12"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# String类型

- 字符串由16位码元组成，多数字符都是16位码元对应一个字符，length属性就是表示有多少个16位码元
- charAt()方法返回给定索引位置的字符，参数为索引位置
- javascript采用UCS-2和UTF-16两种Unicode编码混合策略，对于(U+0000~U+FFFF)，这两种编码是一样的
- charCodeAt()可以查看对应索引位置的字符编码，参数为索引位置
- fromCharCode()可以根据给定的UTF-16码元创建字符串，然后将其拼接返回

```js
let message = 'abcde'
console.log(message.charAt(2)) // 'c'
console.log(message.charCodeAt(2)) // 99
// 可以16进制入参
console.log(String.fromCharCode(0x61, 0x62, 0x63, 0x64, 0x65)) // "abcde"
console.log(String.fromCharCode(97, 98, 99, 100, 101)) // "abcde"
```

- 对于在U+0000~U+FFFF范围内的字符，length、charAt()、charCodeAt()、fromCharCode()都可以正常运行
- 当拓展到Unicode增补字符平面就不行了，上面的16位只能标识65536个字符，这些表示基本多语言平面，为了表示更多的字符，采用了每个字符使用另外16位去选择一个增补平面。这种每个字符使用两个16位码元的策略称为代理对
- 当我们对含有代理对编码的字符串就会有问题，如下
<!--more-->
```js
let message = 'ab😊de'
console.log(message.length)     // 6
console.log(message.charAt(1))  // b
console.log(message.charAt(2))  // �
console.log(message.charAt(3))  // �
console.log(message.charAt(4))  // d 
console.log(message.charCodeAt(1))  // 98
console.log(message.charCodeAt(2))  // 55357
console.log(message.charCodeAt(3))  // 56842
console.log(message.charCodeAt(4))  // 100


console.log(String.fromCharCode(97, 98, 55357, 56842, 100, 101)) // ab😊de
```

- 这里我们能看到笑脸符明显占了两个字符，然后我们尝试使用fromCharCode()来将代理对进行解析为字符串是没有问题的，这是因为浏览器可以正常解析代理对
- 针对这种情况，我们可以使用codePointAt()来替代charCodeAt()
- codePointAt()使用方法跟charCodeAt()基本一致，也是接受一个表示索引的参数并返回该索引的码点。码点是Unicode中一个字符的完整标识，可能是16位，也有可能32位，codePointAt()可以查看完整的码点

```js
let message = 'ab😊de'
console.log(message.codePointAt(1))  // 98
console.log(message.codePointAt(2))  // 128522
console.log(message.codePointAt(3))  // 56842
console.log(message.codePointAt(4))  // 100
```

- 我们可以通过字符串解析来识别代理对，如下

```js
let message = 'ab😊de'
console.log([...message]) // ["a", "b", "😊", "d", "e"]
```

- 这样就将我们的代理对给完整解析了
- 对应的，我们也有fromCodePoint()来讲对应的码点转为字符串，并拼接返回

```js
// 使用 fromCharCode要有6位数字才可以
console.log(String.fromCharCode(97, 98, 55357, 56842, 100, 101)) // ab😊de
// 使用 fromCodePoint
console.log(String.fromCodePoint(97, 98, 128522, 100, 101)) // ab😊de
```

## normalize 方法

- 该方法针对一些可以使用多种编码方式表达的unicode字符，比如下面字符

```js
// 上面带圆圈的 A
console.log(String.fromCharCode(0x00C5))          // Å
// 长度单位 “埃”
console.log(String.fromCharCode(0x212B))          // Å
// U+004大写字符 A, U+030A 上面的圆圈
console.log(String.fromCharCode(0x0041, 0x030A))  // Å
```

- 上面三种编码返回的字符串看上去是一样的，其实编码不一样，所以比较起来也不会一样

```js
let a1 = String.fromCharCode(0x00C5),
a2 = String.fromCharCode(0x212B),
a3 = String.fromCharCode(0x0041, 0x030A)
console.log(a1 === a2)  // false
console.log(a1 === a3)  // false
console.log(a2 === a3)  // false
```

- 针对上情况，Unicode提供了4种格式化方法，将类似上面的字符串转为一致格式，分别是NFD、NFC、NFKD、NFKC
- 然后我们就可以使用normalize方法跟对应的优化方法名称来进行格式化

```js
let a1 = String.fromCharCode(0x00C5),
a2 = String.fromCharCode(0x212B),
a3 = String.fromCharCode(0x0041, 0x030A)

// U+005C是对U+212B进行NFC/NFKC规范之后的结果
console.log(a1 === a1.normalize('NFD')) // false
console.log(a1 === a1.normalize('NFC')) // true
console.log(a1 === a1.normalize('NFKD')) // false
console.log(a1 === a1.normalize('NFKC')) // true

// U+212B是未规范化的
console.log(a2 === a2.normalize('NFD')) // false
console.log(a2 === a2.normalize('NFC')) // false
console.log(a2 === a2.normalize('NFKD')) // false
console.log(a2 === a2.normalize('NFKC')) // false

// U+0041/U+030A是对U+212B进行NFD/NFKD规范之后的结果
console.log(a3 === a3.normalize('NFD')) // true
console.log(a3 === a3.normalize('NFC')) // false
console.log(a3 === a3.normalize('NFKD')) // true
console.log(a3 === a3.normalize('NFKC')) // false
```

- 当对上述编码采用同样的规范方式可以让比较操作符返回正确结果

```js
let a1 = String.fromCharCode(0x00C5),
a2 = String.fromCharCode(0x212B),
a3 = String.fromCharCode(0x0041, 0x030A)

console.log(a1.normalize("NFD") === a2.normalize("NFD")) // true
console.log(a1.normalize("NFKC") === a3.normalize("NFKC")) // true
console.log(a2.normalize("NFC") === a3.normalize("NFC")) // true
```

## slice、substr、substring对比

- 这三种方法都是从字符串中提取子字符串
- 都接收一个或两个参数，第一个参数为开始位置
- slice跟substring第二个参数为提取结束的位置，该位置之前的字符串都会被提取
- substr第二个参数表示要提取的字符串的长度
- 忽略第二个参数这三个方法的返回值一致，都会提取到字符串尾

```js
let stringValue = 'hello world'
console.log(stringValue.slice(3))      //  'lo world'
console.log(stringValue.substring(3))  //  'lo world'
console.log(stringValue.substr(3))     //  'lo world'
console.log(stringValue.slice(3, 7))      //  'lo w'
console.log(stringValue.substring(3, 7))  //  'lo w'
console.log(stringValue.substr(3, 7))     //  'lo worl'

```

- 当参数为负数时，slice会将所有负数跟字符串长度相加作为新的参数
- substr会将第一个负数参数与字符串长度相加，第二个负数参数转为0
- substring会将所有的负数参数转为0，会将小的参数作为起点，大的参数作为终点


```js
let stringValue = 'hello world'
console.log(stringValue.slice(-3))      //  'rld'
console.log(stringValue.substring(-3))  //  'hello world'
console.log(stringValue.substr(-3))     //  'rld'
console.log(stringValue.slice(3, -4))      //  'lo w'
console.log(stringValue.substring(3, -4))  //  'hel'
console.log(stringValue.substr(3, -4))     //  ''

```

## indexOf与lastIndexOf

- 都是查找指定字符串，接受两个参数，第一个是查找字符串，第二个是起始位置
- indexOf默认从0开始向后找，指定第二个参数后会从第二个参数指定的下标开始找，忽略该下标之前的字符
- lastIndexOf默认从字符串最后一位开始向前找，指定第二个参数则会从参数指定的下标向前找，忽略该下标之前的字符

## startsWith、endsWith、includes

- ES6新增用于判断字符串中是否包含另外字符串的方法，都返回布尔值
- startsWith检查开始于索引0的匹配项
- endsWith检查开始于索引(string.length - subString.length)的匹配项
- includes检查整个字符串

```js
let message = 'foobarbaz'

console.log(message.startsWith('foo')) // true
console.log(message.startsWith('bar')) // false

console.log(message.endsWith('baz')) // true
console.log(message.endsWith('bar')) // false

console.log(message.includes('bar')) // true
console.log(message.includes('foo')) // true
```

- startsWith与includes可接收第二个参数，用于表示开始查找的位置，传入该参数会忽略该参数之前的字符
- endsWith也可以接收第二个参数，用于表示字符串末尾的位置，传入该参数就好像将被查找字符串截断了一样

```js
let message = 'foobarbaz'

console.log(message.startsWith('foo')) // true
console.log(message.startsWith('foo', 1)) // false

console.log(message.includes('bar')) // true
console.log(message.includes('bar', 4)) // false

console.log(message.endsWith('bar')) // false
console.log(message.endsWith('bar', 6)) // true
```

## trim、trimRight、trimLeft

- 分别用于去除两端的空格、右面的空格、左面的空格

## repeat方法

- 接收一个整数参数，表示将该字符串复制多少次然后拼接返回

```js
let stringValue = 'na '
console.log(stringValue.repeat(8)) // 'na na na na na na na na '

```

## padStart、padEnd方法

- 这两个方法会复制字符串，如果小于指定字符串，则在相应的一边填充字符，直到满足条件，第一个参数是长度，第二个参数是可选的填充字符串，默认为空格

```js
let stringValue = 'foo'
console.log(stringValue.padStart(6))      // '   foo'
console.log(stringValue.padStart(6, '.')) // '...foo'
console.log(stringValue.padEnd(6))        // 'foo   '
console.log(stringValue.padEnd(6, '.'))   // 'foo...'
```

- 要是第二个参数指定的是多个字符的字符串，那么在复制后如果长度超出会把参数指定的字符串裁剪
- 如果第一个参数指定的长度小于等于原始字符串长度，则返回原始字符串

```js
let stringValue = 'foo'
console.log(stringValue.padStart(8, 'bar')) // 'barbafoo'
console.log(stringValue.padStart(2))        // 'foo'
console.log(stringValue.padEnd(8, 'bar'))   // 'foobarba'
console.log(stringValue.padEnd(2))          // 'foo'
```

## 字符串解析与迭代

- 字符串原型暴露了 @@iterator方法，所以字符串可以被解析与迭代，如下

```js
let a = 'abcde'
for(const c of a) {
  console.log(c)
}
// a
// b
// c
// d
// e
console.log([...a])
// ["a", "b", "c", "d", "e"]

```

## toLowerCase、toUpperCase、toLocalLowerCase、toLocalUpperCase

- 都是用于进行大小写转换的，toLowerCase与toLocalLowerCase都是将字符串转为小写字母表示，toLocalLowerCase是为了防止出现地方字符无法转换的情况
- toUpperCase与toLocalUpperCase都是将字符串转为大写字母表示，toLocalUpperCase是为了防止出现地方字符无法转换的情况

## match、search、replace方法

- match方法接收一个正则表达式或正则表达式字符串，返回一个数组，第一个元素是与正则匹配的字符串，其余的元素是表达式中的捕获组匹配到的字符串('()'中的内容)
- search方法是查找方法，也是接收一个正则表达式或者正则表达式字符串，返回匹配到的第一个的索引，没有找到返回-1
- replace是替换方法，接受两个参数，第一个参数是正则表达式或者字符串（该字符串时不会转为正则表达式），第二个参数是字符串或者函数。当地一个参数为字符串时只会替换查找到的第一个字符串，要想全部替换必须用正则表达式

```js
let text = 'cat, bat, sat, fat'
console.log(text.replace('at', 'ond'))    // cond, bat, sat, fat
console.log(text.replace(/at/g, 'ond'))   // cond, bond, sond, fond
console.log(text.replace(/(.at)/g, 'word ($1)')) // word (cat), word (bat), word (sat), word (fat)
```

- 第二个参数为函数时，当匹配项只有一个时，有三个参数，整个模式匹配的字符串、匹配字符串的开始位置、整个字符串。
- 当有多个捕获组的情况下，每个匹配的捕获组的字符串也会被当做参数，最后两个参数仍然是匹配字符串的开始位置、整个字符串
- 这个函数应该返回一个字符串，表示把匹配项换成什么

## split方法

- split会根据传入的参数将字符串转为数组，参数可以是字符串，也可以是RegExp对象。还可以接收第二个参数来表示数组大小，确保数组不会超过指定大小

```js
let color = 'red,blue,green,yellow'
console.log(color.split(','))     // ["red", "blue", "green", "yellow"]
console.log(color.split(',', 2))  // ["red", "blue"]
console.log(color.split(/[^,]+/)) // ["", ",", ",", ",", ""]
```

## localeCompare方法

- 用于比较字符串
- 按照字母排序，如果字符串应该排在字符串参数之前，返回负数
- 字符串与参数字符串相同，返回0
- 字符串应该在字符串参数之后，返回正数

```js
let stringValue = 'yellow'
console.log(stringValue.localeCompare('brick'))   // 1
console.log(stringValue.localeCompare('yellow'))  // 0
console.log(stringValue.localeCompare('zoo'))     // -1
```