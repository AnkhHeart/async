export const ASYNC_FN = Symbol('asyncFunction')

// conditionally promisify a function.
// only return a promise if a callback is omitted
export default function awaitify (asyncFn, arity) {
    function awaitable(...args) {
        if (args.length === arity || typeof args[arity - 1] === 'function') {
            return asyncFn.apply(this, args)
        }

        return new Promise((resolve, reject) => {
            args.push((err, ...cbArgs) => {
                if (err) return reject(err)
                resolve(cbArgs.length > 1 ? cbArgs : cbArgs[0])
            })
            asyncFn.apply(this, args)
        })
    }

    awaitable[Symbol.toStringTag] = 'AsyncFunction'
    awaitable[ASYNC_FN] = true
    awaitable.displayName = `awaitable(${asyncFn.name})`

    return awaitable
}
