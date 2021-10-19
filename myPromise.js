//立即执行函数 防止污染全局变量
const MyPromise = (() => {
    const PENDING = "pending",
        RESOLVED = "resolved",
        REJECTED = "rejected",
        // 外面无法访问用Symbol
        PromiseValue = Symbol("PromiseValue"),//状态数据
        PromiseStatus = Symbol("PromiseStatus"),//当前状态
        changeStatus = Symbol("changeStatus");
    return class MyPromise {
        /**
         * 改变Promise状态
         * @param {*} newStatus 
         * @param {*} newValue 
         */
        [changeStatus](newStatus, newValue) {
            if (this[PromiseStatus] !== PENDING) {
                // 状态无法变更
                return;
            }
            this[PromiseStatus] = newStatus;
            this[PromiseValue] = newValue;
        }

        /**
         * 
         * @param {*} executor 未决状态（pending状态）下的处理函数
         */
        constructor(executor) {
            this[PromiseStatus] = PENDING;
            this[PromiseValue] = undefined;
            /* 
               由于这两个函数功能差不多，可以封装成一个函数changeStatus

            // 函数必须要用箭头函数或者that = this;
               const resolve = data => {
                   if (this[PromiseStatus] !== PENDING) {//因为这里的this指向会出问题，在调用的时候是直接调用
                       // 状态无法变更
                       return;
                   }
                   this[PromiseStatus] = RESOLVED;
                   this[PromiseValue] = data;
               };
               const reject = reason => {
                   if (this[PromiseStatus] !== PENDING) {
                       return;
                   }
                   this[PromiseStatus] = REJECTED;
                   this[PromiseValue] = reason;
               }
      */
            const resolve = data => {
                this[changeStatus](RESOLVED, data);
            };
            const reject = reason => {
                this[changeStatus](REJECTED, reason)
            }
            try {
                // 在构造函数里面调用了该函数，所以会执行
                executor(resolve, reject)
            } catch (err) {
                // 捕获错误
                reject(err);
            }
        }
    }
})();