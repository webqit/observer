# The Observer API

<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/@webqit/observer" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@webqit/observer.svg" alt="NPM version" /></a></span> <span class="badge-npmdownloads"><a href="https://npmjs.org/package/@webqit/observer" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@webqit/observer.svg" alt="NPM downloads" /></a></span>

<!-- /BADGES -->

# Overview

Take a one-minute rundown of the Observer API.

## Observe

Observe operations on any object or array...

```js
let obj = {};
```

...using the [`Observer.observe()`](https://webqit.io/tooling/observer/docs/api/reactions/observe) method.

```js
Observer.observe(obj, changes => {
    changes.forEach(c => {
        console.log(c.type, c.name, c.path, c.value, c.oldValue);
    });
});
```

Now changes will be delivered *synchronously* - as they happen.

## Mutate

Programmatically make *reactive* changes using the *Reflect-like* [set of operators](https://webqit.io/tooling/observer/docs/api/actions)...

```js
// A single set operation
Observer.set(obj, 'prop1', 'value1');
```
```js
// A batch set operation
Observer.set(obj, {
    prop2: 'value2',
    prop3: 'value3',
});
```

...or switch to using *object accessors* - using the [`Observer.accessorize()`](https://webqit.io/tooling/observer/docs/api/actors/accessorize) method...

```js
// Accessorize all (existing) properties
Observer.accessorize(obj);
// Accessorize specific properties (existing or new)
Observer.accessorize(obj, ['prop1', 'prop5', 'prop9']);
```
```js
// Make reactive operations
obj.prop1 = 'value1';
obj.prop5 = 'value5';
obj.prop9 = 'value9';
```

...or even go with a *reactive Proxy* of your object, and imply properties on the fly.

```js
// Obtain a reactive Proxy
let _obj = Observer.proxy(obj);
```
```js
// Make reactive operations
_obj.prop1 = 'value1';
_obj.prop4 = 'value4';
_obj.prop8 = 'value8';
```

And no problem if you inadvertently cascade the approaches. No bizzare behaviours.

```js
// Accessorized properties are already reactive
Observer.accessorize(obj, ['prop1', 'prop6', 'prop10']);

// But no problem if you inadvertently proxy an accessorized object
let _obj = Observer.proxy(obj);

// And yet no problem if you inadvertently made a programmatic call over an already reactive Proxy
Observer.set(_obj, 'prop1', 'value1');
```

## Intercept

How about some level of indirection - the ability to hook into operators like `Observer.set()` and  `Observer.deleteProperty()` to repurpose their operation? That's all possible using the [`Observer.intercept()`](https://webqit.io/tooling/observer/docs/api/reactions/intercept) method!

Below, we catch any attempt to set an HTTP URL and force it to an HTTPS URL.

```js
Observer.intercept(obj, 'set', (action, previous, next) => {
    if (action.name === 'url' && action.value.startsWith('http:')) {
        return next(action.value.replace('http:', 'https:'));
    }
    return next();
});
```

Now, only the first of the following will fly as-is.

```js
Observer.set(obj, 'url', 'https://webqit.io');
```
```js
Observer.set(obj, 'url', 'http://webqit.io');
```

## Pass Some Detail to Observers

Operators, like `Observer.set()`, can pass arbitrary value to observers via a `params.detail` property.

```js
// A set operation with detail
Observer.set(obj, {
    prop2: 'value2',
    prop3: 'value3',
}, { detail: 'Certain detail' });
```

Observers will recieve this value in a `delta.detail` property.

```js
// An observer with detail
Observer.observe(obj, 'prop1', delta => {
    console.log('An operation has been made with detail:' + delta.detail);
});
```

## Negotiate with Observers

Observers can access and *act* on a special object called the *Response Object*.

```js
// An observer and the response object
Observer.observe(obj, 'prop1', (delta, response) => {
    if (1) {
        response.preventDefault(); // Or return false
    } else if (2) {
        response.stopPropagation(); // Or return false
    } else if (3) {
        response.waitUntil(new Promise); // Or return new Promise
    }
});
```

Operators can access and honour the response.

```js
// A set operation that returns the responseObject
let response = Observer.set(obj, {
    prop2: 'value2',
    prop3: 'value3',
}, { responseObject: true });
```

```js
if (response.defaultPrevented) {
    // response.preventDefault() was called
} else if (response.propagationStopped) {
    // response.stopPropagation() was called
} else if (response.promises) {
    // response.waitUntil() was called
    response.promises.then(() => {

    });
}
```

*Learn more about negotiation [here](https://webqit.io/tooling/observer/docs/api/core/Event#negotiating-with-operators)*

## Clean Up Anytime

Need to undo certain bindings? There are the methods for that!

+ [`Observer.unobserve()`](https://webqit.io/tooling/observer/docs/api/reactions/unobserve)
+ [`Observer.unintercept()`](https://webqit.io/tooling/observer/docs/api/reactions/unintercept)
+ [`Observer.unproxy()`](https://webqit.io/tooling/observer/docs/api/actors/unproxy)
+ [`Observer.unaccessorize()`](https://webqit.io/tooling/observer/docs/api/actors/unaccessorize)

## The End?

Certainly not! But this rundown should be a good start. Next:

+ Visit the [download](https://webqit.io/tooling/observer/docs/getting-started/download) page to obtain the Observer API.
+ Explore the [API Reference](https://webqit.io/tooling/observer/docs/api).

## Issues

To report bugs or request features, please submit an [issue](https://github.com/webqit/observer/issues).

## License

MIT.
