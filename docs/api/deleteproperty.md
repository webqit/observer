# `Observer.deleteProperty()`

This method is used to delete an object's property. It corresponds to the JavaScript's `Reflect.deleteProperty()` function, which is itself the programmatic alternative to the assignment expression – `delete obj.property`.

`Observer.deleteProperty()` brings the added benefit of triggering [*observers*](/observer/v1/api/observe.md) and [*interceptors*](/observer/v1/api/intercept.md).

The `Observer.del()` function is an alias of this function and could be used interchangeably.

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Usage as a Trap's "deleteProperty" Handler](#usage-as-a-traps-deleteproperty-handler)
+ [Intercepting `Observer.deleteProperty()`](#Intercepting-observer.deleteproperty)
+ [Related Methods](#related-methods)

## Syntax

```js
// Delete a specific property
Observer.deleteProperty(obj, propertyName);

// Delete a list of properties
Observer.deleteProperty(obj, propertyNames);
```

**Parameters**

+ `obj` - an object or array.
+ `propertyNames/propertyName` - the list of properties, or a property, to delete.

**Return Value**

*Boolean*

## Usage

### ADeleting a Specific Property

```js
// On an object
Observer.deleteProperty(obj, 'fruit');
// On an array
Observer.deleteProperty(arr, 0);
```

### Deleting a List of Properties

```js
// On an object
Observer.deleteProperty(obj, ['fruit', 'brand']);
// On an array
Observer.deleteProperty(arr, [0, 3]);
```

## Usage as a Trap's "deleteProperty" Handler

`Observer.deleteProperty()` can be used as the "deleteProperty" handler in Proxy traps.

```js
let _obj = new Proxy(obj, {deleteProperty: Observer.deleteProperty});
let _arr = new Proxy(arr, {deleteProperty: Observer.deleteProperty});
```

Delete operations will now be forwarded to `Observer.deleteProperty()` and [*observers*](/observer/v1/api/observe.md) and [*interceptors*](/observer/v1/api/intercept.md) that may be bound to the object will continue to respond.

```js
delete _obj.fruit;
delete _arr[2];
```

## Intercepting `Observer.deleteProperty()`

Using [`Observer.intercept()`](/observer/v1/api/intercept.md), it is possible to intercept calls to `Observer.deleteProperty()`. When a "del" operation triggers an interceptor, the interceptor will receive an event object containing the property name to delete.

```js
Observer.intercept(obj, 'del', (event, recieved, next) => {
    // What we recieved...
    console.log(event.name);
    // The delete operation
    delete obj[event.name];
    // The return value - Boolean
    return true;
});

Observer.deleteProperty(obj, 'fruit');
```

When the "del" operation is of multiple deletion, the interceptor gets fired for each pair while also recieving the total list of properties as a hint - via `event.related`.

```js
Observer.intercept(obj, 'del', (event, recieved, next) => {
    // What we recieved...
    console.log(event.name, event.related);
    // The delete operation
    delete obj[event.name];
    // The return value - Boolean
    return true;
});

Observer.deleteProperty(obj, ['orange', 'apple']);
```

The above should trigger our interceptor twice with `event.related` being `['fruit', 'brand']`.

The interceptor is expected to return *true* when the deletion is successful; *false* otherwise.

## Related Methods

+ [`Observer.observe()`](/observer/v1/api/observe.md)
+ [`Observer.intercept()`](/observer/v1/api/intercept.md)
