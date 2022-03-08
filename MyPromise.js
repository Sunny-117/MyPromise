const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
class MyPromise {
    constructor(executor) {
        this._state = PENDING;
        this._value = undefined;
        try {
            executor(this._resolve.bind(this), this._reject.bind(this))
        } catch (error) {
            this._reject(error)
        }
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