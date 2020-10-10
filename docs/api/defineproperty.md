# `Observer.defineProperty()`

This method is used to define a property on an object or modifies an existing property. It corresponds to the JavaScript's `Reflect.defineProperty()` function.

`Observer.defineProperty()` brings the added benefit of driving [*observers*](/observer/v1/api/observe.md) and [*interceptors*](/observer/v1/api/intercept.md).

The `Observer.def()` function is an alias of this function and could be used interchangeably.

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Usage as a Trap's defineProperty Handler](#usage-as-a-traps-defineproperty-handler)
+ [Intercepting `Observer.defineProperty()`](#Intercepting-observer.defineproperty)
+ [Related Methods](#related-methods)

## Syntax

```js
// Define a property
Observer.defineProperty(obj, propertyName, propertyDescriptor);
```

**Parameters**

+ `obj` - an object or array.
+ `propertyName` - the property to define.
+ `propertyDescriptor` - the property descriptor as specified for [`Reflect.defineProperty()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect).

**Return Value**

*Boolean*

## Usage

```js
// On an object
Observer.defineProperty(obj, 'fruit', {value:'orange'});
```

## Usage as a Trap's defineProperty Handler

`Observer.defineProperty()` can be used as the "defineProperty" handler in Proxy traps.

```js
let _obj = new Proxy(obj, {defineProperty: Observer.defineProperty});
let _arr = new Proxy(arr, {defineProperty: Observer.defineProperty});
```

*Define* operations will now be forwarded to `Observer.defineProperty()` and [*observers*](/observer/v1/api/observe.md) and [*interceptors*](/observer/v1/api/intercept.md) that may be bound to the object will continue to respond.

```js
Reflect.defineProperty(_obj, 'fruit', {value:'apple'});
```

## Intercepting `Observer.defineProperty()`

Using [`Observer.intercept()`](/observer/v1/api/intercept.md), it is possible to intercept calls to `Observer.defineProperty()`. When a "def" operation triggers an interceptor, the interceptor will receive an event object containing the property name to define and the property descriptor.

```js
Observer.intercept(obj, 'def', (event, recieved, next) => {
    // What we recieved...
    console.log(event.name, event.descriptor);
    // The define operation, and the return value - Boolean
    return Reflect.defineProperty(obj, event.name, event.descriptor);
});

Observer.defineProperty(obj, 'fruit', {value:'apple'});
```

The interceptor is expected to return *true* when the deletion is successful; *false* otherwise.

## Related Methods

+ [`Observer.observe()`](/observer/v1/api/observe.md)
+ [`Observer.intercept()`](/observer/v1/api/intercept.md)
