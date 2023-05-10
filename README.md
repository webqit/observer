# The Observer API

<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/@webqit/observer" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@webqit/observer.svg" alt="NPM version" /></a></span> <span class="badge-npmdownloads"><a href="https://npmjs.org/package/@webqit/observer" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@webqit/observer.svg" alt="NPM downloads" /></a></span>

<!-- /BADGES -->

# Overview

> **Note**
> <br>This is documentation for `Observer@2.x`. (Looking for [`Observer@1.x`](https://github.com/webqit/observer/tree/v1.7.6)?)

## Table of Contents

+ [Download Options](#download-options)
+ [Overview](#overview)
+ [Method: `Observer.observe()`](#method-observerobserve)
  + [Concept: *Observers*](#concept-observers)
  + [Concept: *Mutations*](#concept-mutations)
  + [Concept: *Batch Mutations*](#concept-batch-mutations)
  + [Concept: *Custom Details*](#concept-custom-details)
  + [Concept: *Diffing*](#concept-diffing)
+ [Method: `Observer.intercept()`](#method-observerintercept)
  + [Concept: *Traps*](#concept-traps)
+ [Issues](#issues)
+ [License](#license)

## Download Options

**_Use as an npm package:_**

```bash
npm i @webqit/observer
```

```js
// Import
import Observer from '@webqit/observer';;
```

**_Use as a script:_**

```html
<script src="https://unpkg.com/@webqit/observer/dist/main.js"></script>
```

```js
// Obtain the APIs
const Observer = window.webqit.Observer;
```

## Method: `Observer.observe()`

Observe mutations on any object or array!

```js
// Signature 1
Observer.observe( obj, callback[, options = {} ]);
```

```js
// Signature 2
Observer.observe( obj, props, callback[, options = {} ]);
```

### Concept: *Observers*

Observe arbitrary objects and arrays:

```js
// An object
const obj = {};
// Mtation observer on an object
const abortController = Observer.observe( obj, handleChanges );
```

```js
// An array
const arr = [];
// Mtation observer on an array
const abortController = Observer.observe( arr, handleChanges );
```

*Now changes will be delivered **synchronously** - as they happen. (The *sync* design is discussed shortly.)*

```js
// The change handler
function handleChanges( mutations ) {
    mutations.forEach( mutation => {
        console.log( mutation.type, mutation.key, mutation.value, mutation.oldValue );
    } );
}
```

**-->** Stop observing at any time by calling `abort()` on the returned *abortController*...

```js
// Remove listener
abortController.abort();
```

...or by using an [Abort Signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) instance:

```js
// Providing an AbortSignal
const abortController = new AbortController;
Observer.observe( obj, mutations => {
    // Handle...
}, { signal: abortController.signal } );
```

```js
// Abort at any time
abortController.abort();
```

### Concept: *Mutations*

Programmatically mutate properties of an object using the *[Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect#static_methods)-like* set of operators; each operation will be reported by observers:

```js
// A single "set" operation on an object
Observer.set( obj, 'prop0', 'value0' );
Observer.defineProperty( obj, 'prop1', { get: () => 'value1' } );
Observer.deleteProperty( obj, 'prop2' );
```

```js
// A single "set" operation on an array
Observer.set( arr, 0, 'item0' ); // Array [ 'item0' ]
Observer.deleteProperty( arr, 0 ); // Array [ <1 empty slot> ]
```

*Beware non-reactive operations*:

```js
// Literal object accessors
delete obj.prop0;
obj.prop3 = 'value3';
```

```js
// Array methods
arr.push( 'item3' );
arr.pop();
```

**-->** Enable reactivity on *specific* properties with literal *object accessors* - using the `Observer.accessorize()` method:

```js
// Accessorize all (existing) properties
Observer.accessorize( obj );
// Accessorize specific properties (existing or new)
Observer.accessorize( obj, [ 'prop0', 'prop1', 'prop2' ] );

// Make reactive UPDATES
obj.prop0 = 'value0';
obj.prop1 = 'value1';
obj.prop2 = 'value2';
```

```js
// Accessorize all (existing) indexes
Observer.accessorize( arr );
// Accessorize specific indexes (existing or new)
Observer.accessorize( arr, [ 0, 1, 2 ] );

// Make reactive UPDATES
arr[ 0 ] = 'item0';
arr[ 1 ] = 'item1';
arr[ 2 ] = 'item2';

// Bonus reactivity: array methods that re-index existing items
arr.unshift( 'new-item0' );
arr.shift();
```

*Beware non-reactive operations*:

```js
// The delete operator and object properties that haven't been accessorized
delete obj.prop0;
obj.prop3 = 'value3';
```

```js
// Array methods that do not re-index existing items
arr.push( 'item0' );
arr.pop();
```

**-->** Enable reactivity on *arbitray* properties with *Proxies* - using the `Observer.proxy()` method:

```js
// Obtain a reactive Proxy for an object
const _obj = Observer.proxy( obj );

// Make reactive operations
_obj.prop1 = 'value1';
_obj.prop4 = 'value4';
_obj.prop8 = 'value8';

// With the delete operator
delete _obj.prop0;
```

```js
// Obtain a reactive Proxy for an array
const _arr = Observer.proxy( arr );

// Make reactive operations
_arr[ 0 ] = 'item0';
_arr[ 1 ] = 'item1';
_arr[ 2 ] = 'item2';

// With an instance method
_arr.push( 'item3' );
```

*And no problem if you end up nesting the approaches.*

```js
// 'value1'-->obj
Observer.accessorize( obj, [ 'prop0', 'prop1', 'prop2', ] );
obj.prop1 = 'value1';

// 'value1'-->_obj-->obj
let _obj = Observer.proxy( obj );
_obj.prop1 = 'value1';

// 'value1'-->set()-->_obj-->obj
Observer.set( _obj, 'prop1', 'value1' );
```

**-->** "Restore" accessorized properties to normal by calling `unaccessorize()`:

```js
Observer.unaccessorize( obj, [ 'prop1', 'prop6', 'prop10' ] );
```

**-->** "Reproduce" original objects from Proxies obtained via `Observer.proxy()` by using the `unproxy()` method:

```js
obj = Observer.unproxy( _obj );
```

### Concept: *Batch Mutations*

Make multiple mutations at a go, and they'll be correctly delivered in batch to observers!

```js
// Batch operations on an object
Observer.set( obj, {
    prop0: 'value0',
    prop1: 'value1',
    prop2: 'value2',
} );
Observer.defineProperties( obj, {
    prop0: { value: 'value0' },
    prop1: { value: 'value1' },
    prop2: { get: () => 'value2' },
} );
Observer.deleteProperties( obj, [ 'prop0', 'prop1', 'prop2' ] );
```

```js
// Batch operations on an array
Observer.set( arr, {
    '0': 'item0',
    '1': 'item1',
    '2': 'item2',
} );
Object.proxy( arr ).push( 'item3', 'item4', 'item5', );
Object.proxy( arr ).unshift( 'new-item0' );
Object.proxy( arr ).splice( 0 );
```

**-->** Use the `Observer.batch()` to batch multiple arbitrary mutations - whether related or not:

```js
Observer.batch( arr, async () => {
    Observer.set( arr, 0, 'item0' ); // Array [ 'item0' ]
    await somePromise();
    Observer.set( arr, 2, 'item2' ); // Array [ 'item0', <1 empty slot>, 'item2' ]
} );
```

> Method calls on a proxied instance - e.g. `Object.proxy( arr ).splice( 0 )` - also follow this strategy.

### Concept: *Custom Details*

Pass some custom detail - an arbitrary value - to observers via a `params.detail` property.

```js
// A set operation with detail
Observer.set( obj, {
    prop2: 'value2',
    prop3: 'value3',
}, { detail: 'Certain detail' } );
```

*Observers recieve this value on their `mutation.detail` property.*

```js
// An observer with detail
Observer.observe( obj, 'prop1', mutation => {
    console.log( 'A mutation has been made with detail:' + mutation.detail );
} );
```

### Concept: *Diffing*

Receive notifications only for mutations that actually change property state, and ignore those that don't.

```js
// Responding to state changes only
Observer.observe( obj, handleChanges, { diff: true } );
```

```js
// Recieved
Observer.set( obj, 'prop0', 'value' );
```

```js
// Ignored
Observer.set( obj, 'prop0', 'value' );
```

<!--
### Concept: *Live*
descripted
namespace
-->

## Method: `Observer.intercept()`

Intercept operations on any object or array before they happen!

```js
// Signature 1
Observer.intercept( obj, prop, handler[, options = {} ]);
```

```js
// Signature 2
Observer.intercept( obj, traps[, options = {} ]);
```

### Concept: *Traps*

Extend standard operations on an object - `Observer.set()`,  `Observer.deleteProperty()`, etc - with custom traps using the [`Observer.intercept()`](https://webqit.io/tooling/observer/docs/api/reactions/intercept) method!

*Below, we intercept all "set" operations for an HTTP URL then transform it to an HTTPS URL.*

```js
const setTrap = ( operation, previous, next ) => {
    if ( operation.key === 'url' && operation.value.startsWith( 'http:' ) ) {
        operation.value = operation.value.replace( 'http:', 'https:' );
    }
    return next();
};
Observer.intercept( obj, 'set', setTrap );
```

*Now, only the first of the following will fly as-is.*

```js
// Not transformed
Observer.set( obj, 'url', 'https://webqit.io' );

// Transformed
Observer.set( obj, 'url', 'http://webqit.io' );
```

*And below, we intercept all "get" operations for a certain value to trigger a network fetch behind the scenes.*

```js
const getTrap = ( operation, previous, next ) => {
    if ( operation.key === 'token' ) {
        return next( fetch( tokenUrl ) );
    }
    return next();
};
Observer.intercept( obj, 'get', getTrap );
```

*And all of that can go into one "traps" object:*

```js
Observer.intercept( obj, {
    get: getTrap,
    set: setTrap,
    deleteProperty: deletePropertyTrap,
    defineProperty: definePropertyTrap,
    ownKeys: ownKeysTrap,
    has: hasTrap,
    // etc
} );
```

## The End?

Certainly not! But this rundown should be a good start. Next:

+ Visit the [download](https://webqit.io/tooling/observer/docs/getting-started/download) page to obtain the Observer API.
+ Explore the [API Reference](https://webqit.io/tooling/observer/docs/api).

## Issues

To report bugs or request features, please submit an [issue](https://github.com/webqit/observer/issues).

## License

MIT.
