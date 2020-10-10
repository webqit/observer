# `Observer.set()`

This method is used to set the value of an object's property. It corresponds to the JavaScript's `Reflect.set()` function, which is itself the programmatic alternative to the assignment expression – `obj.property = value`.

`Observer.set()` brings the added benefit of triggering [*observers*](/observer/v1/api/observe.md) and [*interceptors*](/observer/v1/api/intercept.md).

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Usage as a Trap's "set" Handler](#usage-as-a-traps-set-handler)
+ [Usage with Property Setters](#usage-with-property-setters)
+ [Intercepting `Observer.set()`](#Intercepting-observer.set)
+ [Related Methods](#related-methods)

## Syntax

```js
// Set or modify a specific property
Observer.set(obj, propertyName, value);

// Set or modify a list of properties with the same value
Observer.set(obj, propertyNames, value);

// Perform multiple key/value assignments
Observer.set(obj, keyValueMap);
```

**Parameters**

+ `obj` - an object or array.
+ `propertyNames/propertyName` - the list of properties, or a property, to modify.
+ `value` - the value to set.
+ `keyValueMap` - an object of key/value pairs.

**Return Value**

*Boolean*

## Usage

### Assigning On a Specific Property

```js
// On an object
Observer.set(obj, 'fruit', 'orange');
// On an array
Observer.set(arr, 0, 'orange');
```

### Assigning On a List of Propertieskeys

```js
// On an object
Observer.set(obj, ['fruit', 'brand'], 'apple');
// On an array
Observer.set(arr, [0, 3], 'apple');
```

### Multiple Key/Value Assignment

```js
// On an object
Observer.set(obj, {
    fruit:'apple',
    brand:'apple'
});

// On an array
// Provide key/value as an object
Observer.set(arr, {
    0:'apple',
    3:'apple'
});
```

## Usage as a Trap's "set" Handler

`Observer.set()` can be used as the "set" handler in Proxy traps.

```js
let _obj = new Proxy(obj, {set: Observer.set});
let _arr = new Proxy(arr, {set: Observer.set});
```

Assignment operations will now be forwarded to `Observer.set()` and [*observers*](/observer/v1/api/observe.md) and [*interceptors*](/observer/v1/api/intercept.md) that may be bound to the object will continue to respond.

```js
_obj.fruit = 'apple';
_arr[2] = 'Item 3';
```

## Usage with Property Setters

It is possible to implement *property setters* that use `Observer.set()` behind the scene. This gives us the benefit of using JavaScript's assignment syntax while still driving [*observers*](/observer/v1/api/observe.md) and [*interceptors*](/observer/v1/api/intercept.md).

This is automatically done by the [`Observer.init()`](/observer/v1/api/init.md) support function.

```js
// Virtualize a property or multiple properties
Observer.init(obj, 'fruit');
Observer.init(obj, ['fruit', 'brand']);

// Now we can do without Observer.set
obj.fruit = 'apple';
obj.brand = 'apple';
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

## Intercepting `Observer.set()`

Using [`Observer.intercept()`](/observer/v1/api/intercept.md), it is possible to intercept calls to `Observer.set()`. When a "set" operation triggers an interceptor, the interceptor will receive an event object containing the property name and the assignable value.

```js
Observer.intercept(obj, 'set', (event, recieved, next) => {
    // What we recieved...
    console.log(event.name, event.value);
    // The assignment operation
    obj[event.name] = event.value;
    // The return value - Boolean
    return true;
});

Observer.set(obj, 'fruit', 'orange');
```

When the "set" operation is of multiple key/value assignments, the interceptor gets fired for each pair while also recieving the total list of properties as a hint - via `event.related`.

```js
Observer.intercept(obj, 'set', (event, recieved, next) => {
    // What we recieved...
    console.log(event.name, event.value, event.related);
    // The assignment operation
    obj[event.name] = event.value;
    // The return value - Boolean
    return true;
});

Observer.set(obj, {fruit: 'orange', brand:'apple'});
```

The above should trigger our interceptor twice with `event.related` being `['fruit', 'brand']`.

The interceptor is expected to return *true* when the operation is successful; *false* otherwise.

## Related Methods

+ [`Observer.observe()`](/observer/v1/api/observe.md)
+ [`Observer.intercept()`](/observer/v1/api/intercept.md)
