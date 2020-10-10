# `Observer.closure()`

This function provides a *observer-aware* context under which to execute code that could potentially mutate an observed object. Under this context, all mutations made to the object will be detected and [*observers*](/observer/v1/api/observe.md) that may be bound to the object will be notified.

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Related Methods](#related-methods)

## Syntax

```js
// Establish a closure on one or more objects
Observer.closure(callback, object1[, object2[, …]]);
```

**Parameters**

+ `callback` - the closure's callback function. This function recieves the listed objects into the closure in the order they were listed.
+ `object1` - an object or array to observe.

**Return Value**

*undefined*

## Usage

```js
// The observed object/array
let arr = [], obj = {};
Observer.observe(arr, changes => {
    console.log(changes);
});

// The closure
Observer.closure((arr, obj) => {
    arr.push('one');
    arr.push('two');
    arr.push('three');
    arr.push('four');
    arr.shift();
}, arr, obj);
```

The above operation above will notify our observer *once* for a *set* operation on the properties `0`, `1`, `2`, `length`.

Notice that changes are detected and [*observers*](/observer/v1/api/observe.md) fired after the code runs. These changes are detected by comparing the state of the object before and after the transaction. Intermediate changes, therefore, do not get caught, and [*interceptors*](/observer/v1/api/interceptors.md) that may have been bound to the object don't get fired. (Compare [`Observer.proxy()`](/observer/v1/api/proxy.md).)

## Related Methods

+ [`Observer.proxy()`](/observer/v1/api/proxy.md)
+ [`Observer.observe()`](/observer/v1/api/observe.md)
+ [`Observer.intercept()`](/observer/v1/api/intercept.md)
