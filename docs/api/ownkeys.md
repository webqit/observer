# `Observer.ownKeys()`

This method is used to get an object's list of direct properties. It corresponds to the JavaScript's `Reflect.ownKeys()` function.

`Observer.ownKeys()` brings the added benefit of triggering [*interceptors*](/observer/v1/api/intercept.md).

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Usage as a Trap's "ownKeys" Handler](#usage-as-a-traps-ownKeys-handler)
+ [Intercepting `Observer.ownKeys()`](#Intercepting-observer.ownKeys)
+ [Related Methods](#related-methods)

## Syntax

```js
// Show all keys.
let keys = Observer.ownKeys(obj);
```

**Parameters**

+ `obj` - an object or array.

**Return Value**

*Array*

## Usage

```js
let obj = {
    fruit:'orange',
    brand:'apple',
};

let keys = Observer.ownKeys(obj);
```

## Usage as a Trap's "ownKeys" Handler

`Observer.ownKeys()` can be used as the "ownKeys" handler in Proxy traps.

```js
let _obj = new Proxy(obj, {ownKeys: Observer.ownKeys});
let _arr = new Proxy(arr, {ownKeys: Observer.ownKeys});
```

*Show keys* operations will now be forwarded to `Observer.ownKeys()` and [*interceptors*](/observer/v1/api/intercept.md) that may be bound to the object will continue to respond.

```js
let keys = Reflect.ownKeys(_obj);
let keys = Reflect.ownKeys(_arr);

```

## Intercepting `Observer.ownKeys()`

Using [`Observer.intercept()`](/observer/v1/api/intercept.md), it is possible to intercept calls to `Observer.ownKeys()`.

```js
Observer.intercept(obj, 'keys', (event, recieved, next) => {
    // The read operation
    return Reflect.ownKeys(obj);
});

let keys = Observer.ownKeys(obj);
```

## Related Methods

+ [`Observer.observe()`](/observer/v1/api/observe.md)
+ [`Observer.intercept()`](/observer/v1/api/intercept.md)
