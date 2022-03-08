const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

function runMicroTask(callback) {
    if (process && process.nextTick) {
        process.nextTick(callback)
    } else if (MutationObserver) {
        const p = document.createElement('p')
        const observer = new MutationObserver(callback)
        observer.observe(p, {
            childList: true
        })
        p.innerHTML = '123'
    } else {
        setTimeout(callback, 0);
    }
}
class MyPromise {
    constructor(executor) {
        this._state = PENDING;
        this._value = undefined;
        this._handlers = []
        try {
            executor(this._resolve.bind(this), this._reject.bind(this))
        } catch (error) {
            this._reject(error)
        }
    }
    _pushHandler(executor, state, resolve, reject) {
        this._handlers.push({
            executor, state, resolve, reject
        })
    }
    _runOneHandler(handler) {

    }
    _runHandlers() {
        if (this._state == PENDING) return;
        while (this._handlers[0]) {
            const handler = this._handlers[0]
            this._runOneHandler(handler)
            this._handlers.shift()
        }
    }
    then(onFulfulled, onRejected) {
        return new MyPromise((resolve, reject) => {
            // 1. 成功或者失败都会做的函数
            // 2. 微队列
            this._pushHandler(onFulfulled, FULFILLED, resolve, reject)
            this._pushHandler(onRejected, REJECTED, resolve, reject)
            this._runHandlers()// 执行队列
        })
    }
    _changeState(newState, value) {
        if (this._state !== PENDING) return;
        this._state = newState;
        this._value = value
    }
    _resolve(data) {
        this._changeState(FULFILLED, data)
    }
    _reject(reason) {
        this._changeState(REJECTED, reason)
    }
}
const pro = new MyPromise((resolve, reject) => {
    resolve(1234)
})
console.log(pro);
