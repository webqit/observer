# `Observer.intercept()`

This method is used to intercept operations performed on an object or array with custom handlers. Requests like *set*, *delete*, *get* and *has* are trapped and forwarded to these custom handlers.

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Tagging an Interceptor](#tagging-an-interceptor)
+ [Setting Multiple Interceptors](#setting-multiple-interceptors)
+ [The Returned Interceptor Instance](#the-returned-interceptor-instance)
+ [Related Methods](#related-methods)

## Syntax

```js
// Intercept all operations or queries
Observer.intercept(obj, handler[, params = {}]);

// Intercept a specific operation
Observer.intercept(obj, type, handler[, params = {}]);
```

**Parameters**

+ `obj` - an object or array.
+ `type` - the operation to intercept.
+ `handler` - a function that handles the operation. This recieves:
    + `event` - an object containing details of the operation.
    + `recieved` - the return value of a previous trap in the list, if any.
    + `next` - a function that calls the next trap in the list, if any.
+ `params` - Additional parameters.

**Return Value**

An [*Interceptor* instance](#the-returned-interceptor-instance).

## Usage

```js
let obj = {name: 'reflex',};
let getVersionNumberRemotely = () => '1.0.0';
```

Below, we're intercepting the "get" request and skipping all other requests using the `next()` function we receive in our handler. This trap will "lazy-load" the object's version value.

```js
Observer.intercept(obj, (event, recieved, next) => {
    if (event.type === 'get') {
        let requestedKey = event.name;
        if (requestedKey === 'version' && !(requestedKey in obj)) {
            obj[requestedKey]; =  getVersionNumberRemotely();
        }
        return obj[requestedKey];
    }
    return next();
});
```

Now, let's see what we get for each property we access.

```js
console.log(Observer.get(obj, 'name')); // 'reflex'
console.log(Observer.get(obj, 'version')); // '1.0.0'
```

In another case, we're intercepting a "set" operation to validate the incoming value for a specific property. We're using the `type` parameter to constrain the trap to just the "set" type.

```js
Observer.intercept(obj, 'set', (event, recieved, next) => {
    let requestedKey = event.name;
    let requestedValue = event.value;
    if (requestedKey === 'url' && !requestedValue.startsWith('http')) {
        throw new Error('The url property only accepts a valid URL!');
    }
    obj[requestedKey] = requestedValue;
    // We return true here
    // and it's always good to still call next() with a return a value
    return next(true);
});
```

Now, let's attempt setting different URLs on our object. Remember that `Observer.set()` will also trigger observers that may be bound to the object.

```js
console.log(Observer.set(obj, 'url', 'https://example.com')); // true
console.log(Observer.set(obj, 'url', 'example.com')); // Fatal Error
```

## Tagging an Interceptor

The `params.tags` parameter can be used to tag a trap. Tags are an *array* of values (*strings*, *numbers*, *objects*, etc) that can be used to identify the trap for later use.

```js
Observer.intercept(obj, handler, {tags:['#tag']});
```

## Setting Multiple Interceptors

Multiple traps can rightly be set on an object. Each trap called will have the decision to call the next. A trap is called with the return value of the previous trap \(or *undefined* where there is no previous trap\) and a reference to the next trap \(or a reference to the default handler where there is no next trap\).

Below, we set an additional trap to handle setting the url property. But this time, we wouldn't bother if the previous trap has handled this.

```js
Observer.intercept(obj, 'set', (event, recieved, next) => {
    If (received === true) {
        console.log('A previous handler has handled this!');
        return next(true);
    }
    // We could do the work here
    // or simply leave it to the default property setter
    return next();
});
```

## The Returned Interceptor Instance

The `Observer.intercept()` method returns an *Interceptor* instance that gives us per-instance control.

```js
// Obtain the Interceptor instance
let instance = Observer.intercept(obj, handler);

// Synthetically fire the handler
instance.fire({
    type:'set',
    name: 'propertyName'
    value:'...',
});

// Disconnect the trap
instance.disconnect();
```

## Related Methods

+ [`Observer.unintercept()`](/observer/v1/api/unintercept.md)
+ [`Observer.set()`](/observer/v1/api/set.md)
+ [`Observer.get()`](/observer/v1/api/get.md)
+ [`Observer.has()`](/observer/v1/api/has.md)
+ [`Observer.deleteProperty()`](/observer/v1/api/deleteproperty.md)
+ [`Observer.del()`](/observer/v1/api/deleteproperty.md)
+ [`Observer.defineProperty()`](/observer/v1/api/defineproperty.md)
+ [`Observer.def()`](/observer/v1/api/defineproperty.md)
+ [`Observer.keys()`](/observer/v1/api/keys.md)
+ [`Observer.ownKeys()`](/observer/v1/api/ownkeys.md)