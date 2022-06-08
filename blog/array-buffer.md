---
title: "定型数组"
date: "2020-10-15"
name: 'francis'
age: '25'
tags: [JavaScript回顾]
categories: JavaScript
---

# 定型数组

- WebGL的出现导致了定型数组的出现，WebGL的API不需要javascript默认的双精度浮点格式的数值，但是这种数值恰好是javascript数组在内存中的格式。
- 因此每次WebGL与javascript运行时传递数组WebGL都需要在目标环境分配新数组，以其当前形式迭代数组，然后将数值类型转为新数组中的适当格式，但是这一过程太过耗时
- 所以产生了CanvasFloatArray(现在的Float32Array)。javascript可以分配、读取和写入这个数组。这个数组可以直接传给底层的图形驱动API，也可以直接从底层API获取到
- Float32Array是定型数组的一种

## ArrayBuffer

- Float32Array其实是一种“视图”，允许jiavascript访问一块名为ArrayBuffer的预分配内存。ArrayBuffer是所有定型数组以及视图引用的基本单位
- ArrayBuffer是普通的javascript构造函数，用于在内存中分配特定数量的字节空间
- ArrayBuffer一经创建就不可更改大小，但是可以使用slice复制到一个新实例中
<!--more-->
```js
const buf1 = new ArrayBuffer(16)
console.log(buf1.byteLength)    // 16
const buf2 = buf1.slice(4, 12)
console.log(buf2.byteLength)    // 8
```

- ArrayBuffer分配失败会抛错，分配的内存不可超过Number.MAX_SAFE_INTEGER(2 ** 53 - 1)字节
- ArrayBuffer初始化会将所有二进制位初始化位0
- 不可直接对ArrayBuffer进行读取或写入内容，需要借助视图。视图有不同的类型，但是引用的都是ArrayBuffer中的二进制数据

## DataView

- 允许读写ArrayBuffer的一种视图。位文件I/O与网络I/O设计，API支持对缓冲数据的高度控制，但是性能会比其他视图差，对缓冲内容没有预设，也不能迭代
- 必须在有ArrayBuffer的情况下才能创建DataView实例。该实例可以使用全部或部分ArrayBuffer，还有对缓冲实例的引用以及在缓冲中的开始位置

```js
const buf = new ArrayBuffer(16)
const fullDataView = new DataView(buf)
console.log(fullDataView.byteOffset)      // 0
console.log(fullDataView.byteLength)      // 16
console.log(fullDataView.buffer === buf)  // true

```

- 构造函数可以接收可选的偏移量与字节长度，第二个参数为偏移量，第三个参数为字节长度
- 不指定字节长度则默认从偏移量到缓冲区域结束

```js
const buf = new ArrayBuffer(16)
const dataView = new DataView(buf, 6, 3)
console.log(dataView.byteOffset)      // 6
console.log(dataView.byteLength)      // 3
console.log(dataView.buffer === buf)  // true

const dataView2 = new DataView(buf, 9)
console.log(dataView2.byteOffset)      // 9
console.log(dataView2.byteLength)      // 7
console.log(dataView2.buffer === buf)  // true

```

- DataView读写组件还需要读写的字节偏移量
- 要使用ElementType来实现JavaScript的Number类型到缓冲内二进制的转换

### ElementType

- DataView对存储在缓冲的数据类型没有预设，强制要求开发者在读写时指定ElementType
- 常见的ElementType类型如下
  - Int8，1个字节，8位有符号整数，范围 -128 - 127
  - Uint8，1个字节，8位无符号整数，范围 0 - 255
  - Int16，2个字节，16位有符号整数，范围 -32768 - 32767
  - Uint16，2个字节，16位无符号整数，范围 0 - 65535
  - Int32，4个字节，32位有符号整数，范围 -2147483648 - 2147483647
  - Uint32，4个字节，32位无符号整数，范围 0 - 42949967295
  - Float32，4个字节，32位IEEE-754浮点数，范围 -3.4e+38 - 3.4e+38
  - Float64，8个字节，64位IEEE-754浮点数，范围 -1.7e+308 - 1.7e+308
- DataView给上面的每个类型都暴露了get与set方法，使用byteOffset定位要读写的值

```js
const buf = new ArrayBuffer(2)
const view = new DataView(buf)
// 因为ArrayBuffer的初始值都是0
console.log(view.getInt8(0)) // 0
console.log(view.getInt8(1)) // 0
console.log(view.getInt16(0)) // 0

// 采用8位有符号数设置
view.setInt8(0, 255)  // 将第一个字节用255填充，也就是二进制的 11111111
view.setInt8(1, 0xFF) // 第二个字节也用16进制的255填充，仍然是8位的1

view.getInt16(0)  // -1 获取有符号的16位整数，第一位为符号位表示负数，然后转为10进制数为 -1
view.getUint16(0) // 65535 无符号的16位整数，转为10进制数为65535
```

### 字节序

- 字节序是指计算机维护的字节顺序的约定，DataView支持大端字节序和小端字节序。
- 大端字节序意思是最高有效位保存在第一个字节，最低有效位保存在最后一个字节
- 小端字节序就相反，最低有效位保存在第一个字节，最高有效位保存在最后一个字节
- Javascript运行时所在系统的原生字节序决定如何读写字节，但是DataView不受该影响，DataView所有的API方法都是大端字节序，可以接受一个可选的布尔值设置为true启用小端字节序

```js
const buf2 = new ArrayBuffer(16)
const view2 = new DataView(buf2)
view.setInt8(0, 0x80)   // 二进制表示 10000000
view.setInt8(1, 0x01)   // 二进制表示 00000001

// 获取16位整型，因为包含两个字节，第一个字节为 10000000，第二个字节为 00000001 
// 采用大端字节序，从左往右读，就是 10000000 00000001，转为10进制就是 2 ** 15 + 2 ** 0 = 32769
console.log(view.getUint16(0)) // 32769

// 采用小端字节序，从右往左读，就是 00000001 10000000， 转为10进制就是 2 ** 8 + 2 ** 7 = 384
console.log(view.getUint16(0, true)) // 384

// 按大端字节序写入Uint16的 0x0004，此时字节为 00000000 00000100
view.setUint16(0, 0x0004)

// 此时按Uint8读取值为
console.log(view.getUint8(0)) // 0
console.log(view.getUint8(1)) // 4

// 按小端字节序写入Uint16的 0x0002，此时字节为 00000010 00000000
view.setUint16(0, 0x0002)

// 此时按Uint8读取值为
console.log(view.getUint8(0)) // 0
console.log(view.getUint8(1)) // 2
```

## 边界值

- DataView的读写操作都要在足够的缓冲内进行，否则抛出RangeError

```js
const buf3 = new ArrayBuffer(6)
const view3 = new DataView(buf3)
// 读取部分超出缓冲范围  因为Int32占4个字节，缓冲区总长度为6个字节，然后从第4个字节读取，读到第7个就没有值了，所以抛出错误
view.getInt32(4)  //VM4353:3 Uncaught RangeError: Offset is outside the bounds of the DataView

// 尝试读取超出范围的值
view.getInt32(8)  //VM4353:3 Uncaught RangeError: Offset is outside the bounds of the DataView
view.getInt32(-1)  //VM4353:3 Uncaught RangeError: Offset is outside the bounds of the DataView

// 尝试写入超出范围的值
view.setInt32(4, 123)  //VM4353:3 Uncaught RangeError: Offset is outside the bounds of the DataView

```

- DataView会尽可能地把一个值转为适当的类型，后备值为0。如果无法转换，抛出错误

```js
const buf4 = new ArrayBuffer(1)
const view4 = new DataView(buf4)

view4.setInt8(0, 1.5)
console.log(view4.getInt8(0)) // 1

view4.setInt8(0, [4])
console.log(view4.getInt8(0)) // 4

view4.setInt8(0, 'f')
console.log(view4.getInt8(0)) // 0

view4.setInt8(0, Symbol())
console.log(view4.getInt8(0)) // VM4674:13 Uncaught TypeError: Cannot convert a Symbol value to a number
```

## 定型数组

- 定型数组是另一种形式的ArrayBuffer，特定于一种ElementType并遵循原生的字节序，因此，它提供了适用面更广的Api和更好的性能
- 创建定型数组的方式有：读取已有缓冲、使用自有缓冲、填充可迭代结构，以及填充基于任意类型的定型数组
- 通过\<ElementType>.from()和\<ElementType>.of()也可以创建定型数组

```js
// 通过缓冲区创建
const buf5 = new ArrayBuffer(12)
const ints = new Int32Array(buf5)
// 因为我们的ArrayBuffer确定了字节数，Int32的字节数也是知道的，所以可以自动得出定型数组长度
console.log(ints.length) // 3

// 指定长度自己创建
const int1 = new Int32Array(6)
console.log(int1.length)              // 6
// 定型数组有一个关联缓冲的引用，可以根据自身的长度与字节数确定缓冲区的长度
console.log(int1.buffer.byteLength)   // 24

// 创建包含元素的定型数组
const int2 = new Int32Array([2, 4, 6, 8])
console.log(int2.length) // 4
console.log(int2.buffer.byteLength) // 16
console.log(int2[2]) // 6

const ints3 = new Int16Array(int2)
// 这里从int2生成了新的定型数组，元素位置都没有发生变化，只是将对应的 Int32 位数转为 Int16 位数，这样变化的只有缓冲区的大小
console.log(ints3.length) // 4
console.log(ints3.buffer.byteLength) // 8
console.log(ints3[2]) // 6

// const float = Float32Array.from([3.14, 2.718, 1.618]) 这两种方式都可以
const float = Float32Array.of(3.14, 2.718, 1.618)
console.log(float.length) // 3
console.log(float.buffer.byteLength) // 12
console.log(float[2]) // 1.6180000305175781
```

- 定型数组的构造函数跟实例都有一个BYTES_PER_ELEMENT来表示当前定型数组每个元素的大小

```js
console.log(Int16Array.BYTES_PER_ELEMENT) // 2
console.log(Int32Array.BYTES_PER_ELEMENT) // 4
```

- 定型数组没有初始化，那么对应的缓冲会以0填充
- 定型数组可以使用常用的数组方法，如some、map、every这些，并且返回的数组拥有相同元素类型的新定型数组
- 定型数组无法改变长度，所以concat、pop、push、shift、splice、unshift方法不可用
- 定型数组提供了set与subarray方法来复制数组元素以生成新的定型数组
- set方法从提供的数组中或者定性数组中把值复制到当前定型数组指定的索引位置
- 第一个参数为被复制的数组，第二个参数为复制到定型数组的索引
- 溢出会抛错

```js
const container = new Int16Array(8)
container.set(Int8Array.of(1, 2, 3, 4))
console.log(container) // [1, 2, 3, 4, 0, 0, 0, 0]

container.set([5, 6, 7, 8], 4)
console.log(container) // [1, 2, 3, 4, 5, 6, 7, 8]

// 剩余空间不够，溢出
container.set([5, 6, 7, 8], 7) // Uncaught RangeError: Source is too large
```

- subarray方法与set相反，从指定的定型数组中复制一部分并返回这一部分组成的新定型数组
- 接收2个参数，都可选，对应开始位置与结束位置

```js
const source = Int32Array.of(2, 4, 6, 8)
const sub = source.subarray()
console.log(sub)  // [2, 4, 6, 8]

const sub1 = source.subarray(2)
console.log(sub1) //  [6, 8]

const sub2 = source.subarray(1,3)
console.log(sub2) // [4, 6]
```

- 利用set手动实现一个拼接方法

```js
function concatTypeArray(typeArrayConstructor, ...typeArrays) {
  const totalLength = typeArrays.reduce((x, y) => (x.length || x) + y.length)
  const resultArray = new typeArrayConstructor(totalLength)
  let currentNum = 0
  typeArrays.map(array => {
    resultArray.set(array, currentNum)
    currentNum += array.length
  })
  return resultArray
}

const result = concatTypeArray(Int16Array, Int16Array.of(1, 2, 3), new Int16Array([4, 5, 6]), Int16Array.from([7, 8, 9]))
console.log(result) // [1, 2, 3, 4, 5, 6, 7, 8, 9]
console.log(result instanceof Int16Array) // true

```

## 上溢与下溢

- 定型数组中元素的上溢与下溢不会影响其他索引的元素，但是要考虑自身的数据类型，如下所示

```js
// Int8的范围为 -128 - 127
const ints = new Int8Array(2)
// 上溢
ints[1] = 128 
// 128用二进制表示为 10000000 ，因为是有符号 8 位，所以第一个 1 被当作负号的标识，所以会根据符号把它当作二补码来求原来的值
// 首先减一得 00000001，然后再取反得 10000000 是二进制的 128，再加上判定的负数，所以为 -128
console.log(ints[1]) // -128

// 下溢
ints[1] = -129
// 因为-129是负数形式，所以我们得到的 -129 得二进制表示为 129得二进制 10000001 ，然后各位取反得 01111110，然后再加 1 得 01111111，再补上符号位 1 ，因为要截取8位，所以得到的就是 01111111，转为我们的有符号数就是 127
console.log(ints[1]) // 127

// Uint8范围为 0 - 255
const unsignInts = new Uint8Array(2)
// 上溢
unsignInts[1] = 256
// 256用二进制表示为 100000000，然后这里截取后面 8 位就是 00000000，转为十进制就是0
console.log(unsignInts[1]) // 0

unsignInts[1] = 511
// 511 用二进制表示位 111111111，然后截取后面 8 位就是 11111111，转十进制就是255
console.log(unsignInts[1]) // 255

// 下溢
unsignInts[1] = -1
// -1 用二进制表示是 1 得二进制 00000001 ，然后各位取反 11111110，然后再加 1 得 11111111，这个用无符号数表示就是 255
console.log(unsignInts[1]) // 255

```

- 得出结论，无符号数上溢取最低有效位的 8 位，下溢的位被转为其无符号数的等价值
- 有符号数的上溢变成该值二补数形式，下溢也变成该值二补数形式

## Uint8ClampedArray

- 夹板数组，不允许任何方向的溢出，大于255的变为255，小于0的变为0

```js
const clampedInts = new Uint8ClampedArray([-1, 0, 255, 256])
console.log(clampedInts) // [0, 0, 255, 255]

```

- Uint8ClampedArray是canvas的历史残留，如果不是做canvas开发就不要用它