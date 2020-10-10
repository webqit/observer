# `Observer.proxy()`

This function wraps an object or array in a proxy with all operations on the instance forwarded to the appropriate [*interceptors*](/observer/v1/api/interceptors.md) and announced to [*observers*](/observer/v1/api/observe.md).

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Related Methods](#related-methods)

## Syntax

```js
// Wrap an object
let _obj = Observer.proxy(obj);
```

**Parameters**

+ `obj` - an object or array to proxy.

**Return Value**

*Proxy*

## Usage

```js
// The observed object/array
let arr = [];
Observer.observe(arr, changes => {
    console.log(changes);
});

// The proxy
Observer.proxy(arr).push('one', 'two');
```

The above operation above will notify our observer *three times* each for a *set* operation on the properties `0`, `1`, `length`.

## Related Methods

+ [`Observer.closure()`](/observer/v1/api/closure.md)
+ [`Observer.observe()`](/observer/v1/api/observe.md)
+ [`Observer.intercept()`](/observer/v1/api/intercept.md)
