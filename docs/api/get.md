# `Observer.get()`

This method is used to read a property. It corresponds to the JavaScript's `Reflect.get()` function, which is itself the programmatic alternative to the syntax for property access – `obj.property; obj[property]`.

`Observer.get()` brings the added benefit of triggering [*interceptors*](/observer/v1/api/intercept.md).

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Usage as a Trap's "get" Handler](#usage-as-a-traps-get-handler)
+ [Usage with Property Getters](#usage-with-property-getters)
+ [Intercepting `Observer.get()`](#Intercepting-observer.get)
+ [Related Methods](#related-methods)

## Syntax

```js
// Read a specific property.
// The return value will be the value of the property
var value = Observer.get(object, propertyName);

// Read a list of properties
// The return value will be a key/value map of the listed properties
var values = Observer.get(object, propertyNames);
```

**Parameters**

+ `obj` - an object or array.
+ `propertyNames/propertyName` - the list of properties, or a property, to read.

**Return Value**

+ `value` - *any* - the value of the property
+ `values` - *object* - a key/value map of the listed properties

## Usage

### Reading a Specific Property

```js
let obj = {
    fruit:'orange',
    brand:'apple',
};

let fruit = Observer.get(obj, 'fruit');
```

### Reading a List of Properties

```js
let obj = {
    fruit:'orange',
    brand:'apple',
};

let fruits = Observer.get(obj, ['fruit', 'brand']);
```

## Usage as a Trap's "get" Handler

`Observer.get()` can be used as the "get" handler in Proxy traps.

```js
let _obj = new Proxy(obj, {get: Observer.get});
let _arr = new Proxy(arr, {get: Observer.get});
```

*Read* operations will now be forwarded to `Observer.get()` and [*interceptors*](/observer/v1/api/intercept.md) that may be bound to the object will continue to respond.

```js
let fruit = _obj.fruit;
let value = _arr[2];
```

## Usage with Property Getters

It is possible to implement *property getters* that use `Observer.get()` behind the scene. This gives us the benefit of using JavaScript's property access syntax while still driving [*interceptors*](/observer/v1/api/intercept.md).

This is automatically done by the [`Observer.init()`](/observer/v1/api/init.md) support function.

```js
// Virtualize a property or multiple properties
Observer.init(obj, 'fruit');
Observer.init(obj, ['fruit', 'brand']);

// Now we can do without Observer.get
let fruit = obj.fruit;
let brand = obj.brand;
```

We could follow the pattern above for arrays; we could even *init* an array's prototype methods instead. The specific keys modified after calling these methods will be announced to [*observers*](/observer/v1/api/observe.md).

```js
// Virtualize the arr.push() and arr.splice() methods
Observer.init(arr, ['push', 'splice']);

// Now we can do without Observer.set
arr.push('Item 1');
arr.push('Item 2');
arr.splice(1);
```

## Intercepting `Observer.get()`

Using [`Observer.intercept()`](/observer/v1/api/intercept.md), it is possible to intercept calls to `Observer.get()`. When a "get" operation triggers an interceptor, the interceptor will receive an event object containing the property name to read.

```js
Observer.intercept(obj, 'get', (event, recieved, next) => {
    // What we recieved...
    console.log(event.name);
    // The read operation
    return obj[event.name];
});

let value = Observer.get(obj, 'fruit');
```

When the "get" operation is of multiple properties, the interceptor gets fired for each property while also recieving the total list of properties as a hint - via `event.related`.

```js
Observer.intercept(obj, 'get', (event, recieved, next) => {
    // What we recieved...
    console.log(event.name, event.related);
    // The read operation
    return obj[event.name];
});

let values = Observer.get(obj, ['orange', 'apple']);
```

The above should trigger our interceptor twice with `event.related` being `['fruit', 'brand']`.

## Related Methods

+ [`Observer.observe()`](/observer/v1/api/observe.md)
+ [`Observer.intercept()`](/observer/v1/api/intercept.md)
