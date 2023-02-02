# JavaScript

## 事件循环

- JS 是单线程语言，所有任务需要排队依次执行
- JS 任务分**同步任务**和**异步任务**
- 异步任务又分为**宏任务**和**微任务**
- 宏任务包括：
  - script 主执行栈代码
  - setTimeout
  - setInterval
  - UI rendering
- 微任务包括：
  - process.nextTick()
  - Promise
  - MutationObserver
- 主线程首先执行主执行栈代码，在执行的过程中产生的异步任务分别放入宏任务队列或者微任务队列队尾
- 等待执行栈为空时，依次从微任务队列头部取出微任务放入执行栈执行，直到清空微任务队列
- 接着执行 UI 渲染，完成一次事件循环
- 取出宏任务队列头部的任务放入执行栈执行，重复以上操作

## Promise

### 对 Promise 的理解

- 解决异步操作回调函数嵌套问题，是 ES6 新增的接口对象
- Promise 有三种状态：pending (执行中)、fulfilled (已成功)、rejected (已失败)
- 状态只能从 pengding 变为 fulfilled 或 rejected，并且状态不可逆，一旦改变就不会再改变
- async、await 是 Promise 的语法糖，是为了优化 then 链而开发的，使用 try catch 语句捕获 await 异常

### Promise 的 all()、race()、allSettled() 方法的作用

- all() 方法接收一组可迭代的 promise，当所有 promise 都变为 fulfilled 状态时，才返回成功，返回的成功数据是一个数组，包含每个 promise 的 resolve 返回值，当有一个 promise 变为 rejected 状态时，all 方法立即返回失败，失败数据是对应 promise 的 reject 返回值
- race() 方法接收一组可迭代的 promise，一旦有 promise 成功或拒绝，race 方法就会成功或拒绝
- allSettled() 方法接收一组可迭代的 promise，当所有 promise 成功或拒绝时，变为 fulfilled 状态，返回描述每个 promise 结果的对象数组

### 实现 Promise.all()

```javascript
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    const result = []
    const len = promises.length
    let count = 0
    for (let [i, p] of promises.entries()) {
      p.then((res) => {
        count++
        result[i] = res
        if (count === len) {
          return resolve(result)
        }
      }).catch((error) => {
        return reject(error)
      })
    }
  })
}
```

### 判断 Promise 对象

```javascript
const isPromise = (val) => {
  return (
    typeof val !== null &&
    val === 'object' &&
    typeof val.then === 'function' &&
    typeof val.catch === 'function'
  )
}
```

## 浅拷贝与深拷贝

- **深拷贝**是指对象的属性与拷贝的源对象属性之间不共享引用的副本，对属性的修改不会影响到另一个对象
- **浅拷贝**是指对象的属性与拷贝的源对象属性之间共享相同引用的副本，修改对象属性会导致其他对象也发生更改
- JS 所有内置的复制操作创建的是浅拷贝：
  - 展开运算符（...）
  - Array.prototype.concat()
  - Array.prototype.slice()
  - Array.from()
  - Object.assign()
  - Object.create()

### JSON.parse、JSON.stringify 实现深拷贝的缺陷

- 会忽略 undefined、symbol、function
- Map, Set, RegExp 会被转换为空对象
- Date 会被转换为描述日期时间字符串
- 不支持循环引用对象的拷贝，导致栈溢出

### 如何解决深拷贝的循环引用问题

需要一个变量容器，将已拷贝的对象放置到容器变量中，优先从容器变量中获取目标值。

```javascript
function deepClone(target) {
  const map = new WeakMap()
  function clone(target) {
    if (typeof target === 'object') {
      let cloneTarget = Array.isArray(target) ? [] : {}
      if (map.has(target)) {
        return map.get(target)
      }
      map.set(target, cloneTarget)
      for (const key in target) {
        cloneTarget[key] = clone(target[key])
      }
      return cloneTarget
    } else {
      return target
    }
  }
  return clone(target)
}
```

## 函数柯里化

函数柯里化是指将接受多个参数的函数转换为接受一个参数的函数，并返回接受其余参数而且返回结果的函数。
函数柯里化的作用有：

- **参数复用**，当在多次调用同一个函数，并且传递的参数绝大多数是相同的，那么该函数是一个很好的柯里化候选
- **提前返回**，多次调用多次内部判断，可以直接把第一次判断的结果返回外部接收。例如立即执行函数提前判断环境决定返回哪一个函数
- **延迟执行**，避免重复的去执行程序，等真正需要结果的时候再执行。例如 Function.prototype.bind()

## 防抖和节流

**防抖**是在连续触发事件的情况下，仅执行最后一次的回调函数。在指定时间间隔内，如果连续触发事件，会重新开始计时。应用场景：

- **input 搜索、输入联想、浏览器窗口改变大小、窗口滚动**。

**节流**是在连续触发事件的情况下，在指定时间间隔内仅执行一次回调函数。在指定时间间隔内，如果再触发事件，不再执行回调函数。应用场景：

- **表单提交、按钮点击、上拉加载**。

```javascript
// 防抖
const debounce = (fn, delay = 1000) => {
  let timer = null
  return (...args) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

// 节流 时间戳实现 首次会触发
const throttle = (fn, delay = 1000) => {
  let timer = 0
  return (...args) => {
    const now = Date.now()
    if (now - timer >= delay) {
      timer = now
      fn.apply(this, args)
    }
  }
}

// 节流 定时器实现 首次不会触发
const throttle1 = (fn, delay = 1000) => {
  let timer = null
  return (...args) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}
```

## 实现 call、apply、bind

call、apply、bind 都是 Function 原型对象里的方法，作用是改变函数执行时的 this 上下文。区别是：

1. apply 的第二个参数是数组，函数参数以数组方式传入。
2. bind 返回修改 this 后的函数，不会立即执行，需要手动调用执行。

```javascript
Function.prototype._call = function (ctx, ...args) {
  const context = Object(ctx)
  const key = Symbol()
  context[key] = this
  const result = context[key](...args)
  delete context[key]
  return result
}

Function.prototype._apply = function (ctx, args) {
  const context = Object(ctx)
  const key = Symbol()
  context[key] = this
  const result = context[key](...args)
  delete context[key]
  return result
}

Function.prototype._bind = function (ctx, ...args) {
  const self = this
  return function (...rest) {
    self._call(ctx, ...args, ...rest)
  }
}
```

## 实现 instanceof

instanceof 是指左侧对象的原型链上是否存在右侧构造函数的原型，存在即返回 true。由于原型链和 prototype 都可以修改，所以有时 instanceof 判断无法达到预期效果。

```javascript
function isInstanceof(obj, fn) {
  if (obj === null || obj === undefined || fn === null || fn === undefined) {
    return false
  }
  if (obj.__proto__ === fn.prototype) {
    return true
  }
  return isInstanceof(obj.__proto__, fn)
}
```

## 观察者模式和发布订阅模式的区别

- **观察者模式**定义了一对多的关系，多个观察者对象监听一个目标对象，目标对象的状态变化时，会通知所有的观察者对象更新自己。观察者对象和目标对象之间建立抽象耦合关系。目标对象维护一个观察者列表，观察者对象都有一个共同的接口被目标对象调用。
- **发布订阅模式**通过自定义事件订阅主题，统一由调度中心进行处理，实现了发布者与订阅者的解耦，避免了一个对象显示地调用另外一个对象的某个接口。

# TypeScript

## TypeScript 的优势

- 增加了静态类型，可以在编译阶段检测错误，使代码更健壮
- 类型文件可以在一定程度上充当文档
- 支持 IDE 自动补全

## interface 和 type 的区别

- **type 类型别名**用于给一个类型起个新名字，可以用来声明**基本类型、对象类型、函数类型、联合类型、元组和交叉类型**，type 不会创建新的类型
- **interface 接口**是声明数据结构的另一种方式，interface 仅限于声明**对象类型和函数类型**

### 相同点

- 都可以描述对象和函数
- 都允许扩展，interface 通过 **extends **实现，type 通过 **&** 实现。interface 和 type 之间也可以相互扩展，此时 type 必须是对象类型或对象交叉类型
- interface 和 type（联合类型除外）都可以被类实现

### 不同点

- type 可以声明基本类型别名、联合类型、元组和交叉类型，而 interface 做不到
- interface 可以重复声明，并会进行声明合并，而 type 重复声明会报错

## 泛型、泛型约束条件和 infer

### 泛型

泛型在程序中定义形式类型参数，在使用时用实际类型参数来替换。可以定义通用的数据结构，增加了代码类型的通用性。

### 泛型约束

泛型约束表示泛型类型必须是某个类型的子类型，通过 extends 实现，比如：

```typescript
interface Point {
  x: number
  y: number
}

function toArray<T extends Point>(a: T, b: T): T[] {
  return [a, b]
}
```

### infer

infer 的作用是**在约束条件中推导泛型参数的类型**，比如：

```typescript
type ArrayElementType<T> = T extends (infer E)[] ? E : T

type t1 = ArrayElementType<number[]> // number

type t2 = ArrayElementType<{ name: string }> // {name: string}
```

## any unknown never void 的区别

- any: 任意类型，是 ts 变量不写类型声明时的默认类型，不做任何约束，编译时会跳过对其的类型检查
- unknown: 未知类型，即写代码的时候不知道具体是怎样的类型，与 any 类似，比 any 更严格，在操作的时候，需要先进行类型断言或守卫。unknown 类型变量可以被任何类型赋值，而且它只能赋值给 any 或 unknown 类型变量
- never: 永不存在值的类型，例如函数总是抛出异常或执行死循环代码的返回值类型。变量也可以声明为 nerver 类型，除了 never 以外所有类型都不能赋值给它
- void: 无任何类型，表示函数没有返回值或者返回值是 undefined 或 null

## typeof 和 keyof 的作用

- typeof 接受一个变量，获取变量的类型
- keyof 获取某个类型（比如接口或类）的所有属性名称，返回由属性名称组成的联合类型

## TS 内置工具类型有哪些

- Partial<T> 将对象类型的所有属性变为可选属性
- Required<T> 将对象类型的所有属性变为必选属性
- Record<T, U> 定义对象类型的键和值的类型
- Readonly<T> 定义对象类型的属性是只读的
- Pick<T, U> 挑选对象类型 T 中 U 对应的属性和类型
- Omit<T, U> 与 Pick 功能是互补的，挑选出对象类型 T 中不在 U 中的属性和类型
- Exclude<T, U> 从类型 T 中剔除所有 U 包含的类型，全部剔除会得到 never 类型
- Extract<T, U> 与 Exclude 的功能是互补的，从类型 T 中获取所有 U 包含的类型。

工具类型源码：

```typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}

type Required<T> = {
  [P in keyof T]-?: T[P]
}

type Readonly<T> = {
  readonly [P in keyof T]: T[P]
}

type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}

type Record<K extends keyof any, T> = {
  [P in K]: T
}

type Exclude<T, U> = T extends U ? never : T

type Extract<T, U> = T extends U ? T : never

type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

# HTML/CSS

## 浏览器解析渲染页面过程

1. 将 HTML 解析成 DOM 树
2. 将 CSS 解析成 CSSOM 树
3. 遇到 `<script>` 标签的时候会停止解析文档，立即解析脚本，将脚本中改变 DOM 和 CSS 的地方分别解析出来，追加到 DOM 树 和 CSSOM 树上
4. 根据 DOM 树和 CSSOM 树构建 Render 树
5. 根据 Render 树进行布局渲染 render layer，计算好每个节点的位置和尺寸，将其放在浏览器窗口的正确位置
6. 根据计算的布局信息进行绘制，将最终内容显示在屏幕上

## 回流和重绘区别

区别：

- 回流指当前窗口发生改变，发生滚动操作，或者元素的位置大小相关属性被更新时会触发布局过程，发生在 render 树，比如元素的几何尺寸变化，就需要重新验证并计算 Render Tree
- 重绘指当前视觉样式属性被更新时触发的绘制过程，发生在渲染层 render layer
- 所以相比之下，回流的成本要比重绘高得多

减少回流重绘次数的方法：

1. 避免一条一条的修改 DOM 样式，而是修改 className 或者 style.classText
2. 对元素进行一个复杂的操作，可以先隐藏它，操作完成后在显示
3. 在需要经常获取那些引起浏览器回流的属性值时，要缓存到变量中
4. 不使用 table 布局，一个小的改动可能就会引起整个 table 重新布局
5. 在内存中多次操作节点，完成后在添加到文档中

## cookie、localStorage、sessionStorage、indexedDB 的区别

- cookie
  - 有效期默认是窗口会话的有效期，但可以手动设置过期时间
  - cookie 会随请求发送到服务端，客户端服务端都可操作
  - 存储大小 4k 左右
- localStorage
  - 数据会一直存在，除非手动删除
  - 在同源窗口下共享数据
  - 存储大小 5M 左右
- sessionStorage
  - 数据有效期是窗口会话的有效期
  - 在同源窗口下共享数据
  - 存储大小 5M 左右
- indexedDB
  - 除非手动删除，否则一直有效
  - 使用异步调用
  - 支持事务
  - 存储空间大，一般在不少于 250M
  - 可以存储二进制数据

## cookie 相关的属性

- **Expires**：cookie 的过期时间，值为 Date 类型，如果没有设置，**默认是会话的有效期**。
- **Max-Age**：表示 cookie 在多少秒之后过期，设置 0 或 -1 会直接过期，**比 Expires 优先级高**。
- **Domain**：表示 cookie 可以送达的域名，即有效范围，例如：.baidu.com。
- **Path**：指定一个路径，匹配的路径才可以使用对应的 cookie，下级目录也满足匹配的条件。
- **Secure**：表示仅在使用 **https** 协议的请求中被发送到服务端。
- **HttpOnly**：用于阻止 JS 访问 cookie。
- **SameSite**：设置 cookie 是否随着**跨站请求**一起发送。
  - Strict：仅对同一站点的请求发送 cookie。
  - Lax：允许与顶级导航一起发送，并将与第三方网站发起的 GET 请求一起发送，这是浏览器中的默认值。
  - None：在跨站和同站请求中均发送 cookie，必须同时设置 Secure 属性。

# Vue

## Vue 双向数据绑定原理

### Vue2 实现原理

Vue2 双向数据绑定由 **数据监听器 Observer** + **模版编译器 Compiler** 构成。
数据监听器由：**Object.defineProperty()** + **依赖收集 Dep **实现**。**
主要流程是：

1. 组件实例执行初始化，对 data 执行响应式处理。
   1. 通过 Object.defineProperty() 实现 defineReactive() 方法。
   2. 为 data 的每个 key 创建一个 Dep 实例，并实现 get 和 set 方法。如果 key 对应初始值是对象或数组，会执行递归响应式处理。
   3. 在 get 中判断 Dep.target 如果不为空，就将 Watcher 实例添加到 Dep 实例的管理列表中，并返回 key 的新值。
   4. set 方法用于更新 key 的值，并通过它的 Dep 通知其管理的所有 Watcher 执行更新函数。
   5. 对于数组类型数据，重写数组原型中 7 个可修改数组自身的方法：push、pop、unshift、shift、splice、sort、reverse，重写后的方法里加入了通知 Watcher 更新的逻辑，并将修改后的原型赋给数组的 **proto**属性。
2. 对模版执行编译，找到其中动态绑定的数据，从 data 中获取并初始化视图，同时定义一个 Watcher，并将其添加到对应 Dep 的管理列表。
3. 由于 data 的某个 key 在模版中可能被多个节点绑定，所以每个 key 都需要依赖收集 Dep 来管理多个 Watcher。
4. 以后 data 中的数据一旦发生变化，会首先找到对应的 Dep，通知其管理的所有 Watcher 执行更新函数。

### Vue3 双向数据绑定和 Vue2 的区别

1. Vue2 通过 Object.defineProperty() 来劫持对象属性的 getter 和 setter 操作，Vue3 通过 Proxy 来劫持数据。
2. Proxy 在对象级别做监听，defineProperty 只能监听某个属性，不能对全对象监听。
3. Proxy 可以监听数组，无需再对数组原型方法做特殊处理。
4. Proxy 模式下，能检测到对象属性的添加和删除。

### 编译器 Compiler 的作用

1. 递归处理模板中的节点，检测到元素有 **v-bind** 开头的指令或者**双大括号**指令，就会从 **data** 中取对应的值去修改模板内容，同时创建一个 **watcher** 添加到该属性的 **dep** 管理列表中。
2. 遇到 **v-on** 开头的指令，会对该节点添加对应事件的监听，并使用 **call** 方法将 **vue** 绑定为该方法的 **this**。
3. 最终将模版编译为抽象语法树 **AST**，然后以 **AST** 作为参数调用 **render** 函数生成虚拟 **DOM**。

## Vue 的 diff 算法

### Vue2 实现原理

1. Vue 的 diff 算法通过对新旧虚拟 DOM 做对比，精确地找出之间的差异，**最小化更新真实 DOM**，此过程称为 **patch**。
2. diff 过程遵循**深度优先、同层比较、首尾指针**的策略，比对过程以**新的 VNode** 为准。
   1. 首先判断是否是同类标签，**如果不是同类标签，直接替换**。
   2. 如果是同类标签，**判断是否相等**，如果相等直接 return，否则比对子节点。
   3. **旧的有子节点、新的没有子节点的情况**，直接清空旧的子节点。
   4. **旧的没有子节点、新的有子节点的情况**，直接添加新的子节点。
   5. **子节点是文本的情况**，用新的文本替换旧文本。
   6. **都有子节点的情况，**通过头头、尾尾、头尾、尾头依次比对查找，如果相同则移动到新虚拟节点的位置，头尾指针向中间移动，直到头部索引超出尾部索引为止。如果都没找到，就通过 key 在旧虚拟节点中查找 key 值相同的节点进行复用。

### Vue3 中对 diff 的优化

- **事件缓存**：将事件缓存，优先从缓存中获取。
- **添加静态标记**：Vue2 是全量 Diff，Vue3 是静态标记 + 非全量 Diff。
- **静态提升**：创建静态节点时保存，后续直接复用。
- **使用最长递增子序列优化对比流程**：Vue2 里在 updateChildren() 函数里对比变更，在 Vue3 里这一块的逻辑主要在 patchKeyedChildren() 函数里。

### key 的作用

Vue 在 patch 过程中通过 key 可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，使得整个 patch 过程更加高效。

## 对虚拟 DOM 的理解

虚拟 DOM 是对真实 DOM 的抽象，是以 JS 对象为基础的树形结构，用对象的属性描述节点，属性至少包含：标签名、属性、子元素。 最终通过一系列操作将虚拟 DOM 映射到真实页面中。
**为什么使用虚拟 DOM：**

- 操作真实 DOM 是很慢的，其元素非常庞大，频繁操作会出现页面卡顿，页面的性能问题，大多是由 DOM 操作引起的。
- 通过虚拟 DOM 以及 diff 算法可以实现局部更新真实 DOM，避免了大量的 DOM 操作。

## Vue2 和 Vue3 的区别

1. 双向数据绑定的实现不同，vue2 通过 ES5 的 **Object.defineProperty()** 结合观察者模式实现，Object.defineProperty() 只能劫持对象的属性，因此需要对每个对象的属性进行遍历。也不具备监听数组的能力，需要重写数组的原型方法达到响应式。 vue3 使用 ES6 的 **Proxy** 代理实现，Proxy 代理的是整个对象，也可以监听数组，不需要通过遍历来进行数据绑定。
2. vue3 增加**组合式 API**，数据和方法都定义在 setup 中，统一返回，vue2 使用的是选项式 API。
3. vue3 组件中可以有**多个根结点**，vue2 组件中只能有一个根结点。
4. vue3 增加 **TelePort** 组件，可以将组件挂载到指定的 dom 节点。
5. vue3 增加 **Suspense** 组件，可以在异步组件加载完成前渲染兜底内容。
6. vue3 在项目构建时更好的支持了 **tree-shaking**，将全局 API 作为命名导出，实现按需导入。
7. vue3 使用 **TypeScript** 重写，更好的支持 TypeScript。

## Vue 组件间通信方式

- 父子组件通信
  - 父传子使用 props、ref
  - 子传父使用 $emit、$parent
- 兄弟组件通信
  - EventBus
  - 通过共同父组件
- 祖先与后代组件通信
  - $attrs
  - provide、inject
  - vuex
  - $root
- 非关系组件
  - vuex
  - EventBus
  - $root

## Vue 封装公共组件的注意事项

1. 要保证组件的通用性、低耦合性
2. 对传入的 props 添加类型校验，不能修改 props 的值
3. 组件中的事件处理尽量通知到外层，让父组件去处理，避免组件中过多的事件处理逻辑
4. 合理使用全局和局部 css 样式
5. 可以使用 slot 提供给用户自定义组件内容

# React

## React 的特性有哪些

- JSX 语法
- 单向数据流
- 虚拟 DOM
- 声明式编程
- Component
- Hook

## 对 React Hook 的理解，使用过哪些 Hook

Hook 是 React 16.8 版本中引入的特性

- 可以在函数组件中使用 state 及其他 React 特性
- 可以重用组件中的状态逻辑
- 不存在 this 指向问题

使用过的 Hook:

- React 内置：useState、useEffect、useContext、useRef、useMemo、useCallback
- 路由相关：useLocation、useParams、useNavigate

## React 的 diff 算法

React 的 diff 算法主要遵循三个层级的策略：

1. **tree** **层级**：只比较同一层级的节点，忽略跨层级的操作，**只有删除、创建操作，没有移动操作**。
2. **component** **层级**：在对比两个组件时，如果是同一类的组件，则会继续往下 diff 运算，如果不是一个类的组件，那么直接删除旧组件，创建新的。
3. **element** **层级**：对于同一层级的一组节点，会使用具有唯一性的 key 来区分是否需要**创建、删除、或者移动**。

## 对 Fiber 的理解

1. React 15 渲染过程不可中断并且是同步执行的，在渲染复杂场景组件时会出现页面卡顿问题。为解决此问题，在 React 16 版本中引入了 Fiber 新的协调引擎。
2. Fiber 是一种数据结构，用 JS 的对象来表示。
3. Fiber 对渲染任务进行拆分，执行增量渲染。
4. 通过 Fiber 可以暂停、终止、复用渲染任务。
5. Fiber 对不同的任务赋予不同的优先级，高优先级的任务优先渲染。

# 构建工具

## webpack

### webpack 的构建流程

webpack 的构建流程是一个串行的过程，从启动到结束会依次执行以下步骤：

1. **初始化参数**：从配置文件和 shell 语句中读取与合并参数，得到最终的参数。
2. **开始编译**：用上一步得到的参数初始化 **compiler** 对象，加载所有配置的**插件**，通过执行对象的 **run** 方法开始编译。
3. **确定入口**：根据配置中的 **entry** 找出所有的入口文件。
4. **编译模块**：从入口文件出发，调用所有配置的 **loader** 对模块进行处理，再找出该模块依赖的模块，递归当前步骤直到依赖的所有模块都经过处理。
5. **完成模块编译**：经过上一步之后，得到每个模块被处理后的最终内容以及它们之间的依赖关系。
6. **输出资源**：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 **chunk**，再将每个 chunk 转换成单独的文件加入到输出列表中。
7. **输出完成**：确定好输出内容后，根据配置确定输出的路径和文件名，将文件内容写入到文件系统中。

### 对 Loader、Plugin 的理解，两者的区别

- **loader**: webpack 只能理解 JavaScript 和 JSON 文件。**loader 使 webpack 能够处理其他类型的文件，并将它们转换为有效模块，并添加到依赖图中**。loader 在 module.rules 中配置，最先声明的 loader 最后执行。
  - css-loader：对 @import 和 url() 进行处理，使其变为 webpack 可识别的模块
  - style-loader：将 css 插入到 dom 中
  - ts-loader：将 TS 文件转换成 JS 模块并输出
  - babel-loader：转译 js 和 jsx 文件
  - less-loader：将 less 编译为 css
  - postcss-loader：处理 css，比如添加浏览器前缀
- **plugin**: 插件可以扩展 webpack 功能，用于执行范围更广的任务。包括：**打包优化，资源管理，注入环境变量**。插件在 plugins 中单独配置，类型为数组，每一项是一个插件的实例，参数都通过构造函数传入。
  - html-webpack-plugin：生成 HTML 模版文件，通过 script 标签引入 webpack 生成的 bundle
  - DefinePlugin：内置插件，可以定义各种变量，在代码中使用
  - copy-webpack-plugin：从一个目录拷贝静态资源文件到指定目录
  - terser-webpack-plugin：用于生产模式下压缩 JS 代码
  - mini-css-extract-plugin：将 css 提取到单独的文件中，为每个包含 css 的 JS 文件创建一个 css 文件
  - css-minimizer-webpack-plugin：压缩 css 代码
  - BannerPlugin：内置插件，可以在 chunk 文件头部创建描述信息

### 做过哪些 webpack 打包优化

1. JS 代码压缩
2. CSS 代码压缩
3. HTML 文件代码压缩
4. Tree Shaking
5. 代码分割，按需加载
6. 提取公共代码
7. 使用 CDN 加载资源，配置 output.publicPath 属性

### webpack 的热更新

模块热更新(HMR)，指在应用程序运行过程中，替换、添加、删除模块，而无需重新刷新整个应用：

1. 通过 webpack-dev-server 创建两个服务器：提供静态资源的服务（express）和 socket 服务。
2. express server 负责直接提供静态资源（打包后的资源直接被浏览器请求和解析）。
3. socket server 是一个 websocket 的长连接，双方可以通信。
4. 当 socket server 监听到对应的模块发生变化时，会生成两个文件.json（manifest 文件）和 .js 文件（update chunk）。
5. 通过长连接，socket server 可以直接将这两个文件主动发送给客户端（浏览器）。
6. 浏览器拿到两个新的文件后，通过 HMR runtime 机制，加载这两个文件，并且针对修改的模块进行更新。

### webpack 与 vite 的区别

1. webpack 会先打包，然后启动开发服务器，请求服务器时直接给予打包结果。 而 vite 是直接启动开发服务器，请求哪个模块再对该模块进行实时编译。 由于现代浏览器本身就支持 ESModule，会自动向依赖的 module 发出请求。vite 充分利用这一点，将开发环境下的模块文件，就作为浏览器要执行的文件，而不是像 webpack 那样进行打包合并。
2. 由于 vite 在启动的时候不需要打包，也就意味着不需要分析模块的依赖、不需要编译，因此启动速度非常快。当浏览器请求某个模块时，再根据需要对模块内容进行编译。这种按需动态编译的方式，极大的缩减了编译时间，项目越复杂、模块越多，vite 的优势越明显。
3. 在 HMR 方面，当改动了一个模块后，仅需让浏览器重新请求该模块即可，不像 webpack 那样需要把该模块的相关依赖模块全部编译一次，效率更高。
4. 当需要打包到生产环境时，vite 使用传统的 rollup 进行打包，因此，vite 的主要优势在开发阶段。另外，由于 vite 利用的是 ESModule，因此在代码中不可以使用 CommonJS。

## 模块化

### ESModule 和 Commonjs 的区别

1. 两者的模块导入导出语法不同，ESModule 是通过 export 导出，import 导入，CommonJs 是通过 module.exports，exports 导出，require 导入。
2. ESModule 在编译期间会将所有 import 提升到顶部，CommonJs 不会提升 require。
3. CommonJs 是**运行时**加载模块，ESModule 是在**静态编译期间就确定模块的依赖**。
4. CommonJs 导出的是一个值拷贝，会对加载结果进行缓存，一旦内部再修改这个值，则不会同步到外部。ESModule 是导出的一个引用，内部修改可以同步到外部。
5. CommonJs 中顶层的 this 指向这个模块本身，而 ESModule 中顶层 this 指向 undefined。
6. CommonJS 加载的是整个模块，将所有的接口全部加载进来，ESModule 可以单独加载其中的某个接口。

# HTTP/网络/安全

## 从地址栏输入 URL 到呈现页面

1. 浏览器向`DNS`服务器请求解析该 URL 中的域名所对应的 `IP` 地址;
2. 建立`TCP`连接（三次握手）;
3. 浏览器发出读取文件的`HTTP` 请求，该请求报文作为 `TCP` 三次握手的第三个报文的数据发送给服务器;
4. 服务器对浏览器请求作出响应，并把对应的 `html` 文本发送给浏览器;
5. 浏览器解析该 `html` 文本并显示内容;
6. 释放 `TCP`连接（四次挥手）。

## HTTP 方法有哪些，GET 和 POST 区别有哪些

HTTP1.0 定义了三种请求方法，GET，POST 和 HEAD 方法 HTTP1.1 新增六种请求方法：OPTIONS，PUT，PATCH，DELETE，TRACH 和 CONNECT
GET 和 POST 区别主要从三方面讲即可：**参数表现形式，传输数据大小，安全性**。

1. 首先表现形式上：GET 请求的数据会附加在 URL 后面，以 ? 分割，多参数用 & 连接，可缓存；POST 请求会把请求参数放在请求体中，不可缓存
2. 传输数据大小：对于 GET 请求，HTTP 规范没有对 URL 长度进行限制，但是不同浏览器对 URL 长度加以限制，所以 GET 请求时，传输数据会受到 URL 长度的限制；POST 不是 URL 传值，理论上无限制，但各个服务器一般会对 POST 传输数据大小进行限制
3. 安全性：相比 URL 传值，POST 利用请求体传值安全性更高

## HTTP 的缓存过程（强缓存和协商缓存）

- 通过头部信息 Cache-Control 和 Expires 判断资源是否过期，如果时间未过期，则直接从缓存中取，即强缓存
  - **Cache-Control **
    - 其中`max-age = <seconds>`设置缓存存储的最大周期，超过这个时间缓存将会被认为过期，时间是相对于请求的时间
    - public 表示响应可以被任何对象缓存，即使是通常不可缓存的内容
    - private 表示缓存只能被单个用户缓存，不能作为共享缓存（即代理服务器不可缓存它）
    - no-cache 告诉浏览器、缓存服务器，不管本地副本是否过期，使用副本前一定要到源服务器进行副本有效校验
    - no-store 缓存不应该存储有关客户端请求或服务器响应的任何内容
  - **Expires**
    - Expires 字段规定了缓存的资源的过期时间，该字段时间格式使用 GMT 标准时间格式， js 通过`new Date().toUTCString()`得到，由于时间期限是由服务器生成，存在着服务端和客户端的时间误差，相比 Cache-Control 优先级较低
- 那么如果判断缓存时间已经过期，将会采用**协商缓存**策略
  - 那么浏览器在发起 HTTP 请求时，会带上 **If-None-Match 和 If-Modified-Since **请求头，其值分别是上一次发送 HTTP 请求时，服务器设置在 Etag 和 Last-Modified 响应头中的值
  - 请求头中的 If-None-Match 将会和资源的 Etag 进行对比，如果不同，则说明资源被修改过，响应 200 并返回最新资源；如果相同，则说明资源未改动，响应 304
  - 如果请求头中没有 If-None-Match，则会判断 If-Modified-Since，如果资源最后修改时间大于 If-Modified-Since，说明资源被改动过，响应完整资源内容，返回状态码 200；如果小于或者等于，说明资源未被修改，则响应状态码 304，告知浏览器可以继续使用所保存的缓存

## HTTP 的状态码，301 和 302 的区别

状态码告知从服务器返回请求的状态，一般由以 1~5 开头的三位整数组成：
1xx：请求正在处理
2xx：成功
3xx：重定向

- 301 moved permanently，永久性重定向，表示资源已被分配了新的 URL
- 302 found，临时性重定向，表示资源临时被分配了新的 URL
- 303 see other，表示资源存在着另⼀个 URL，应使⽤ GET ⽅法定向获取资源
- 304 not modified，表示服务器允许访问资源，但因发生请求未满足条件的情况
- 307 temporary redirect，临时重定向，和 302 含义相同

4xx：客户端错误

- 400 bad request，请求报文存在语法错误
- 401 unauthorized，表示发送的请求需要有通过 HTTP 认证的认证信息
- 403 forbidden，表示对请求资源的访问被服务器拒绝
- 404 not found，表示服务器上没找到请求的资源
- 408 Request timeout，客户端请求超时
- 409 confict，请求的资源可能引起冲突

5xx：服务器错误

- 500 internal  server error，表示服务器端在执行请求时发生了错误
- 501 Not Implemented，请求超出服务器能力范围
- 503 service unavailable，表示服务器暂时处于超负载或正在停机维护，无法处理
- 505 http version not supported，服务器不支持，或者拒绝支持在请求中的使用的 HTTP 版本

同样是重定向，302 是 HTTP1.0 的状态码，在 HTTP1.1 版本的时候为了细化 302 又分出来 303 和 307，303 则明确表示客户端应采用 get 方法获取资源，他会把 post 请求变成 get 请求进行重定向；307 则会遵照浏览器标准，不会改变 post。

## HTTP1.1 相比 1.0 的区别有哪些

目前通用标准是 HTTP1.1，在 1.0 的基础上升级加了部分功能，主要从连接方式，缓存，带宽优化（断点传输），host 头域，错误提示等方面做了改进和优化

- 连接方式：HTTP1.0 使用短连接（非持久连接）；HTTP1.1 默认采用带流水线的长连接（持久连接）
- 缓存：HTTP1.1 新增例如 ETag，If-None-Match，Cache-Control 等更多的缓存控制策略
- 带宽优化：HTTP1.0 在断连后不得不下载完整的包，存在一些带宽浪费的现象；HTTP1.1 则支持断点续传的功能，在请求消息中加入 range 头域，允许请求资源的某个部分，在响应消息中 Content-Range 头域中声明了返回这部分对象的偏移值和长度
- host 头域：在 HTTP1.0 中每台服务器都绑定一个唯一的 IP 地址，所有传递消息中的 URL 并没有传递主机名；HTTP1.1 请求和响应消息都应支持 host 头域，且请求消息中没有 host 头域名会抛出一个错误（400 Bad Request）
- 错误提示：HTTP1.1 新增 24 个状态响应码，比如 409（请求的资源与资源当前状态冲突），410（服务器上某个资源被永久性删除）；相比 HTTP1.0 只定义了 16 个状态响应码

## HTTP2.0 相比 HTTP1.1 的优势和特点

HTTP2 有 4 大特点，**二进制协议，头部压缩，服务端推送和多路复用**

1. **二进制协议**：HTTP2 使用二进制格式传输数据，而 HTTP1.1 使用文本格式，二进制协议解析更高效
2. **头部压缩**：HTTP1.1 每次请求和发送都携带不常改变的，冗杂的头部数据，给网络带来额外负担；而 HTTP2 在客户端和服务器使用"部首表"来追踪和存储之前发送的键值对，对于相同的数据，不再每次通过每次请求和响应发送
3. **服务端推送**：服务端可以在发送页面 HTML 时主动推送其他资源，而不用等到浏览器解析到相应位置时，发起请求再响应
4. **多路复用**：在 HTTP1.1 中如果想并发多个请求，需要多个 TCP 连接，并且浏览器为了控制资源，一般对单个域名有 6-8 个 TCP 连接数量的限制；而在 HTTP2 中：
   - 同个域名所有通信都在单个连接下进行
   - 单个连接可以承载任意数量的双向数据流
   - 数据流以消息的形式发送，而消息又由一个或多个帧组成，多个帧之间可以乱序发送

## HTTPS 和 HTTP 的区别

HTTP 都是使用明文传输的，对于敏感信息的传输就很不安全，HTTPS 正是为了解决 HTTP 存在的安全隐患而出现的。当使用 HTTPS 时， 先和 SSL 通信，再由 SSL 和 TCP 通信。
HTTPS 采⽤了**⾮对称加密和对称加密两者并⽤**的混合加密机制。

1. 浏览器与服务端握⼿，发送⾃⼰**⽀持的加密算法**。
2. 服务端返回选择的**加密算法和证书**。
3. 浏览器**验证证书的合法性**。颁发证书的机构是否合法，证书中包含的⽹站地址是否与正在访问的地址⼀致。
4. 浏览器**⽣成随机数的密码，并⽤证书中的公匙加密发送到服务端**，服务端使⽤私匙解析获取随机数密码（⾮对称加密）。
5. 浏览器和服务端**使⽤之前⽣成的随机数进⾏对称加密数据**，并在互联⽹上传输。

## TCP 和 UDP 区别有哪些

TCP 和 UDP 都属于 `TCP/IP`协议簇的一种，都属于传输层协议。

- TCP 是面向连接的，UDP 则是无连接的，即发送数据之前不需要建立连接
- TCP 提供的可靠的服务，TCP 连接传送的数据，无差错，不丢失，不重复，且按序到达，而 UDP 不保证可靠传输
- TCP 连接只能是**一对一**通信，UDP 支持**一对一、一对多、多对一和多对多**的通信
- TCP 面向字节流，UDP 是面向报文的
TCP 首部开销较大，20 字节，UDP 只有 8 字节

  | | TCP | UDP |
  | --- | --- | --- |
  | 是否连接 | 面向连接 | 面向无连接 |
  | 传输可靠性 | 可靠 | 不可靠 |
  | 通信方式 | 一对一通信 | 支持一对一、一对多、多对一、多对多通信 |
  | 传输方式 | 面向字节流 | 面向报文 |
  | 首部开销 | 大，20 字节 | 小，8 字节 |
  | 应用场景 | 直播、视频会议、DNS 解析 | 可靠性高的应用 |
  | 速度 | 慢 | 快 |

## CSRF 跨站请求伪造

跨站请求伪造出现在利用 `cookie-session`作为身份认证的网站中，核心是利用了发送请求时会在请求头中自动携带 `cookie`的特性。诱导用户访问攻击者的网站，并发送请求给攻击者的网站。
完成一次 CSRF 需要**两个条件**：

1. 登录网站 A，并生成 `cookie`
2. 在不登出 A 的情况下，访问网站 B

**解决办法**：

1. 同源检测，检查请求头中的 `referer`属性
2. 使用 `token` 验证，加载页面下发 `token`，提交数据时携带 token 做验证
3. 双 `cookie` 验证，提交数据时 JS 从 `cookie`中获取值和表单一起提交
4. `cookie`， 设置 `SameSite: strict`属性
5. 使用验证码，用户体验不友好

## XSS 跨站脚本攻击

跨站脚本攻击是一种代码注入攻击，攻击者通过向目标网站注入恶意脚本，使之在浏览器运行。
根据攻击的来源，分为**存储型、反射型、DOM 型**：

| 攻击类别 | 攻击形式                                                      | 攻击场景                                            |
| -------- | ------------------------------------------------------------- | --------------------------------------------------- |
| 存储型   | 后端数据库存储了恶意脚本，渲染到 HTML 时，执行恶意代码        | 评论、富文本                                        |
| 反射型   | url 上包含恶意代码，后端拼接 html 时直接使用了 url 上恶意代码 | 非单页面应用搜索，将 url 上搜索关键词插入到 html 中 |
| DOM 型   | url 上包含恶意代码，前端直接获取了 url 上恶意代码执行         | 单页面应用搜索，将 url 上搜索关键词插入到 html 中   |

**解决办法**：

1. 对输入的字符串进行**格式校验**
2. 对 html 标签进行**转义处理**
3. 对于富文本可以添加**白名单**，删除非法字符
4. 设置 **http-only**，防止 cookie 被盗取

## 前端性能优化的方案有哪些

前端性能优化手段：**减少请求数量，减小资源大小，优化网络连接，优化资源加载，减少回流重绘，构建优化**。

- 减少请求数量
  - 文件合并，并按需分配（公共库合并，其他页面组件按需分配）
  - 图片处理：使用雪碧图，将图片转码 base64 内嵌到 HTML 中
  - 减少重定向：尽量避免使用重定向，当页面发生了重定向，就会延迟整个 HTML 文档的传输
  - 使用缓存：即利用浏览器的强缓存和协商缓存
- 减小资源大小
  - 压缩：静态资源删除无效冗余代码并压缩
  - webp：更小体积
  - 开启 GZIP：HTTP 协议上的 GZIP 编码是一种用来改进 WEB 应用程序性能的技术
- 优化网络连接
  - 使用 CDN
  - 使用 DNS 预解析：DNS Prefetch，即 DNS 预解析就是根据浏览器定义的规则，提前解析之后可能会用到的域名，使解析结果缓存到`系统缓存`中，缩短 DNS 解析时间，来提高网站的访问速度
- 优化资源加载
  - 为优先级低的 script 脚本添加 defer 属性
- 减少回流重绘
- 构建优化：如 webpack 打包优化
