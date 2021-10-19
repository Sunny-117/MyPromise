# 状态控制

三种状态：`pending`，`resolved`，`rejected`

状态数据：`PromiseValue`

当前状态：`PromiseStatus`

封装改变状态的函数：`changeStatus`，以便`resolve`和`reject`时候改变状态



- 这里封装方式采用es6的class

```js
const MyPromise = (()=> {
  //...定义状态和状态数据
  return class MyPromise{
    /**
         * 
         * @param {*} executor 未决状态（pending状态）下的处理函数,有能力讲状态推向已决
         */
    constructor(executor) {
      
    }
  }
})()
```

- 为了保证内部变量不被外部使用，这里采用Symbol定义状态

```js
const PENDING = "pending",
      RESOLVED = "resolved",
      REJECTED = "rejected",
      // 外面无法访问用Symbol
      PromiseValue = Symbol("PromiseValue"),//状态数据
      PromiseStatus = Symbol("PromiseStatus"),//当前状态
      changeStatus = Symbol("changeStatus");
```

- `changeStatus`的实现

> 只有pending的时候才能改变状态，一旦到达了已决，就无法改变状态

```js
[changeStatus](newStatus, newValue) {
  if (this[PromiseStatus] !== PENDING) {
    // 状态无法变更
    return;
  }
  this[PromiseStatus] = newStatus;
  this[PromiseValue] = newValue;
}
```



- 实现`constructor`

最初的时候，状态为pending挂起，并且状态数据为undefined

![image-20211019215719921](/Users/sunny/Library/Application Support/typora-user-images/image-20211019215719921.png)

所以初始化`constructor`的时候先设置

```js
this[PromiseStatus] = PENDING;
this[PromiseValue] = undefined;
```



- 在构造函数里面调用`executor`

```js
const pro = new Promise((resolve, reject) => {
  console.log("因为这里面的代码会立即执行");
});
```

因为`executor`需要接受两个参数，`resolve函数和reject函数`，所以我可以先定义一下这两个函数

```js
const resolve = data => {
  this[changeStatus](RESOLVED, data)
}
const reject = reason => {
  this[changeStatus](REJECTED, reason)
}
```

最后，考虑到如下情况：

![image-20211019220244651](/Users/sunny/Library/Application Support/typora-user-images/image-20211019220244651.png)

可以用`try catch`来捕获一下错误

```js
try {
  executor(resolve, reject)
} catch (err) {
  // 捕获错误
  reject(err);
}
```

