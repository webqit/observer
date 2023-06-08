# The Observer API

<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/@webqit/observer" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@webqit/observer.svg" alt="NPM version" /></a></span> <span class="badge-npmdownloads"><a href="https://npmjs.org/package/@webqit/observer" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@webqit/observer.svg" alt="NPM downloads" /></a></span>

<!-- /BADGES -->

**[Motivation](#motivation) • [Overview](#an-overview) • [Polyfill](#the-polyfill) • [Design Discussion](#design-discussion) • [Getting Involved](#getting-involved) • [License](#license)**

Observe and intercept operations on arbitrary JavaScript objects and arrays using a utility-first, general-purpose reactivity API! This API re-explores the unique design of the [`Object.observe()`](https://web.dev/es7-observe/) API and takes a stab at what could be **a unifying API** over *related but disparate* things like `Object.observe()`, [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) APIs, and the "traps" API (proxy traps)!

Observer API is an upcoming proposal!

## Motivation

Tracking mutations on JavaScript objects has historically relied on "object wrapping" techniques with [ES6 Proxies](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy), and on "property mangling" techniques with [getters and setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty). Besides the *object identity* problem of the first and the *object compromissory* nature of the second, there is also the "scalability" issue inherent to the techniques and much "inflexibility" in the programming model they enable!

This is discussed extensively in [the introductory blog post](https://dev.to/oxharris/reinvestigating-reactivity-22e0-temp-slug-5973064?preview=8afd0f8b156bf0b0b1c08058837fe4986054e52a7450f0a28adbaf07dcb7f5659b724166f553fb98ceab3d080748e86b244684f515d579bcd0f48cbb#introducing-the-observer-api)<sup>draft</sup>

We find a design precedent to object observability in the [`Object.observe()`](https://web.dev/es7-observe/) API, which at one time checked all the boxes and touched the very pain points we have today! The idea with the new **Observer API** is to re-explore that unique design with a more wholistic approach that considers the broader subject of Reactive Programming in JavaScript!

## An Overview

The Observer API is a set of utility functions.

+ [Method: `Observer.observe()`](#method-observerobserve)
  + [Usage](#usage)
  + [Concept: *Mutation APIs*](#concept-mutation-apis)
  + [Concept: *Paths*](#concept-paths)
  + [Concept: *Batch Mutations*](#concept-batch-mutations)
  + [Concept: *Custom Details*](#concept-custom-details)
  + [Concept: *Diffing*](#concept-diffing)
+ [Method: `Observer.intercept()`](#method-observerintercept)
  + [Usage](#usage-1)
+ [API Reference](#api-reference)

> **Note**
> <br>This is documentation for `Observer@2.x`. (Looking for [`Observer@1.x`](https://github.com/webqit/observer/tree/v1.7.6)?)

### Method: `Observer.observe()`

Observe mutations on any object or array!

```js
// Signature 1
Observer.observe( obj, callback[, options = {} ]);
```

```js
// Signature 2
Observer.observe( obj, [ prop, prop, ... ], callback[, options = {} ]);
```

```js
// Signature 3
Observer.observe( obj, prop, callback[, options = {} ]);
```

#### Usage

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

└ *Changes are delivered [**synchronously**](https://dev.to/oxharris/reinvestigating-reactivity-22e0-temp-slug-5973064?preview=8afd0f8b156bf0b0b1c08058837fe4986054e52a7450f0a28adbaf07dcb7f5659b724166f553fb98ceab3d080748e86b244684f515d579bcd0f48cbb#timing-and-batching) - as they happen.*

```js
// The change handler
function handleChanges( mutations ) {
    mutations.forEach( mutation => {
        console.log( mutation.type, mutation.key, mutation.value, mutation.oldValue );
    } );
}
```

**-->** Stop observing at any time by calling `abort()` on the returned *abortController*:

```js
// Remove listener
abortController.abort();
```

└ And you can provide your own [Abort Signal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) instance:

```js
// Providing an AbortSignal
const abortController = new AbortController;
Observer.observe( obj, handleChanges, { signal: abortController.signal } );
```

```js
// Abort at any time
abortController.abort();
```

**-->** Where listeners initiate nested observers (child observers), leverage "AbortSignal-cascading" to tie child observers to parent observer's lifecycle:

```js
// Parent - 
const abortController = Observer.observe( obj, ( mutations, flags ) => {

    // Child
    Observer.observe( obj, handleChanges, { signal: flags.signal } ); // <<<---- AbortSignal-cascading

} );
```

└ *"Child" gets automatically aborted at parent's "next turn", and at parent's own abortion!*

#### Concept: *Mutation APIs*

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

<details>
<summary>Polyfill limitations</summary>

*Beware non-reactive operations:*

```js
// Literal object operators
delete obj.prop0;
obj.prop3 = 'value3';
```

```js
// Array methods
arr.push( 'item3' );
arr.pop();
```

</details>

**-->** Enable reactivity on *specific* properties with literal *object accessors* - using the `Observer.accessorize()` method:

```js
// Accessorize all current enumerable properties
Observer.accessorize( obj );
// Accessorize specific properties (existing or new)
Observer.accessorize( obj, [ 'prop0', 'prop1', 'prop2' ] );

// Make reactive UPDATES
obj.prop0 = 'value0';
obj.prop1 = 'value1';
obj.prop2 = 'value2';
```

```js
// Accessorize all current indexes
Observer.accessorize( arr );
// Accessorize specific indexes (existing or new)
Observer.accessorize( arr, [ 0, 1, 2 ] );

// Make reactive UPDATES
arr[ 0 ] = 'item0';
arr[ 1 ] = 'item1';
arr[ 2 ] = 'item2';

// Bonus reactivity with array methods that re-index existing items
arr.unshift( 'new-item0' );
arr.shift();
```

<details>
<summary>Polyfill limitations</summary>

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

</details>

**-->** Enable reactivity on *arbitray* properties with *Proxies* - using the `Observer.proxy()` method:

```js
// Obtain a reactive Proxy for an object
const $obj = Observer.proxy( obj );

// Make reactive operations
$obj.prop1 = 'value1';
$obj.prop4 = 'value4';
$obj.prop8 = 'value8';

// With the delete operator
delete $obj.prop0;
```

```js
// Obtain a reactive Proxy for an array
const $arr = Observer.proxy( arr );

// Make reactive operations
$arr[ 0 ] = 'item0';
$arr[ 1 ] = 'item1';
$arr[ 2 ] = 'item2';

// With an instance method
$arr.push( 'item3' );
```

└ *And no problem if you end up nesting the approaches.*

```js
// 'value1'-->obj
Observer.accessorize( obj, [ 'prop0', 'prop1', 'prop2', ] );
obj.prop1 = 'value1';

// 'value1'-->$obj-->obj
let $obj = Observer.proxy( obj );
$obj.prop1 = 'value1';

// 'value1'-->set()-->$obj-->obj
Observer.set( $obj, 'prop1', 'value1' );
```

**-->** "Restore" accessorized properties to their normal state by calling the `unaccessorize()` method:

```js
Observer.unaccessorize( obj, [ 'prop1', 'prop6', 'prop10' ] );
```

**-->** "Reproduce" original objects from Proxies obtained via `Observer.proxy()` by calling the `unproxy()` method:

```js
obj = Observer.unproxy( $obj );
```

#### Concept: *Paths*

Observe "the value" at a path in a given tree:

```js
const obj = {
  level1: {
    level2: 'level2-value',
  },
};
```

```js
const path = Observer.path( 'level1', 'level2' );
Observer.observe( obj, path, m => {
  console.log( m.type, m.path, m.value, m.isUpdate );
} );
```

```js
Observer.set( obj.level1, 'level2', 'level2-new-value' );
```

<details>
<summary>Console</summary>

| type | path | value | isUpdate |
| ---- | ---- | ----- | -------- |
| `set` | [ `level1`, `level2`, ] | `level2-new-value` | `true` |

</details>

└ *And the initial tree structure can be whatever*:

```js
// A tree structure that is yet to be built
const obj = {};
```

```js
const path = Observer.path( 'level1', 'level2', 'level3', 'level4' );
Observer.observe( obj, path, m => {
  console.log( m.type, m.path, m.value, m.isUpdate );
} );
```

└ *Now, any operation that changes what "the value" at the path resolves to - either by tree extension or tree truncation - will fire our listener*:

```js
Observer.set( obj, 'level1', { level2: {}, } );
```

<details>
<summary>Console</summary>

| type | path | value | isUpdate |
| ---- | ---- | ----- | -------- |
| `set` | [ `level1`, `level2`, `level3`, `level4`, ] | `undefined` | `false` |

</details>

└ *Meanwhile, this next one completes the tree, and the listener reports a value at its observed path*:

```js
Observer.set( obj.level1, 'level2', { level3: { level4: 'level4-value', }, } );
```

<details>
<summary>Console</summary>

| type | path | value | isUpdate |
| ---- | ---- | ----- | -------- |
| `set` | [ `level1`, `level2`, `level3`, `level4`, ] | `level4-value` | `false` |

</details>

**-->** Use the event's `context` property to inspect the parent event if you were to find the exact point at which mutation happened in the path in an audit trail:

```js
let context = m.context;
console.log(context);
```

└ *And up again one level until the root event*:

```js
let parentContext = context.context;
console.log(parentContext);
```

**-->** Observe trees that are built *asynchronously*! Where a promise is encountered along the path, further access is paused until promise resolves:

```js
Observer.set( obj.level1, 'level2', Promise.resolve( { level3: { level4: 'level4-value', }, } ) );
```

#### Concept: *Batch Mutations*

Make multiple mutations at a go, and they'll be correctly delivered as a batch to observers!

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

#### Concept: *Custom Details*

Pass some custom detail - an arbitrary value - to observers via a `params.detail` property.

```js
// A set operation with detail
Observer.set( obj, {
    prop2: 'value2',
    prop3: 'value3',
}, { detail: 'Certain detail' } );
```

└ *Observers recieve this value on their `mutation.detail` property.*

```js
// An observer with detail
Observer.observe( obj, 'prop1', mutation => {
    console.log( 'A mutation has been made with detail:' + mutation.detail );
} );
```

#### Concept: *Diffing*

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

### Method: `Observer.intercept()`

Intercept operations on any object or array before they happen!

```js
// Signature 1
Observer.intercept( obj, type, handler[, options = {} ]);
```

```js
// Signature 2
Observer.intercept( obj, traps[, options = {} ]);
```

#### Usage

Extend standard operations on an object - `Observer.set()`,  `Observer.deleteProperty()`, etc - with custom traps using the [`Observer.intercept()`](https://webqit.io/tooling/observer/docs/api/reactions/intercept) method!

└ *Below, we intercept all "set" operations for an HTTP URL then transform it to an HTTPS URL.*

```js
const setTrap = ( operation, previous, next ) => {
    if ( operation.key === 'url' && operation.value.startsWith( 'http:' ) ) {
        operation.value = operation.value.replace( 'http:', 'https:' );
    }
    return next();
};
Observer.intercept( obj, 'set', setTrap );
```

└ *Now, only the first of the following will fly as-is.*

```js
// Not transformed
Observer.set( obj, 'url', 'https://webqit.io' );

// Transformed
Observer.set( obj, 'url', 'http://webqit.io' );
```

└ *And below, we intercept all "get" operations for a certain value to trigger a network fetch behind the scenes.*

```js
const getTrap = ( operation, previous, next ) => {
    if ( operation.key === 'token' ) {
        return next( fetch( tokenUrl ) );
    }
    return next();
};
Observer.intercept( obj, 'get', getTrap );
```

└ *And all of that can go into one "traps" object:*

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

## The Polyfill

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

> 4.4 kB min + gz | 13.9 KB min [↗](https://bundlephobia.com/package/@webqit/observer@2.1.4)

```js
// Obtain the APIs
const Observer = window.webqit.Observer;
```

## API Reference

<!--

| Observer API | Reflect API | Description | Trap |
| -------------- | ------------ | ----------- | --------------- |
| `apply()`   | ✓    | Invokes a  function [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply) | `apply() {}` |
| `batch()`   | `×`   | Creates a batching context [↗](https://github.com/webqit/observer#:~:text=use%20the%20observer.batch()%20to%20batch%20multiple%20arbitrary%20mutations%20-%20whether%20related%20or%20not) | `-` |
| `construct()`   | ✓    | Initializes a constructor [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct) | `construct() {}` |
| `defineProperties()` [↗]()   | `×`    | `defineProperty() {}` |
| `defineProperty()`   | ✓    | Defines a property [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/defineProperty) | `defineProperty() {}` |
| `deleteProperties()` [↗]()   | `×`    | `deleteProperty() {}` |
| `deleteProperty()`   | ✓    | Deletes a property [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/deleteProperty) | `deleteProperty() {}` |
| `get()`   | ✓    | Reads a property [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get) | `get() {}` |
| `getOwnPropertyDescriptor()`        | ✓    | Obtains property descriptor [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getOwnPropertyDescriptor) | `getOwnPropertyDescriptor() {}`     |
| `getPrototypeOf()`  | ✓    | Obtains object prototype [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getPrototypeOf) | `getPrototypeOf() {}` |
| `has()`   | ✓    | Checks property existence [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/has) | `has() {}` |
| `intercept()`   | `×`   | Binds a "traps" object [↗](https://github.com/webqit/observer#method-observerintercept) | `-` |
| `isExtensible()`   | ✓    | Checks object extensibility [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/isExtensible) | `isExtensible() {}` |
| `observe()`   | `×`  | Binds a mutation observer [↗](https://github.com/webqit/observer#method-observerobserve) | `-` |
| `ownKeys()`   | ✓    | Obtains object keys [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys) | `ownKeys() {}` |
| `path()`   | `×`   | Evaluates a path [↗](#) | `-` |
| `preventExtensions()`   | ✓    | Prevents object extensibility [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/preventExtensions) | `preventExtensions() {}` |
| `set()`   | ✓    | Sets a property [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set) | `set() {}` |
| `setPrototypeOf()`   | ✓    | Sets object prototype [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/setPrototypeOf) | `setPrototypeOf() {}` |
| . | . | . | . |
| `accessorize()`   | `×`  | Applies pre-intercepted getters/setters to properties [↗](https://github.com/webqit/observer#:~:text=enable%20reactivity%20on%20specific%20properties%20with%20literal%20object%20accessors%20-%20using%20the%20observer.accessorize()%20method) | `-` |
| `proxy()`   | `×`  | Creates a pre-intercepted proxy object [↗](https://github.com/webqit/observer#:~:text=enable%20reactivity%20on%20arbitray%20properties%20with%20proxies%20-%20using%20the%20observer.proxy()%20method) | `-` |

-->

| Observer API | Reflect API | Trap |
| -------------- | ------------ | ----------- |
| `apply()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply)   | ✓    | `apply() {}` |
| `batch()` [↗](https://github.com/webqit/observer#concept-batch-mutations)   | `×`   | `-` |
| `construct()`  [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/construct)  | ✓    | `construct() {}` |
| `defineProperties()` [↗]()   | `×`    | `defineProperty() {}` |
| `defineProperty()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/defineProperty)   | ✓    | `defineProperty() {}` |
| `deleteProperties()` [↗]()   | `×`    | `deleteProperty() {}` |
| `deleteProperty()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/deleteProperty)   | ✓    | `deleteProperty() {}` |
| `get()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/get)   | ✓    | `get() {}` |
| `getOwnPropertyDescriptor()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getOwnPropertyDescriptor)        | ✓    | `getOwnPropertyDescriptor() {}`     |
| `getPrototypeOf()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/getPrototypeOf)  | ✓    | `getPrototypeOf() {}` |
| `has()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/has)   | ✓    | `has() {}` |
| `intercept()`[↗](https://github.com/webqit/observer#method-observerintercept)   | `×`   | `-` |
| `isExtensible()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/isExtensible)   | ✓    | `isExtensible() {}` |
| `observe()` [↗](https://github.com/webqit/observer#method-observerobserve)   | `×`  | `-` |
| `ownKeys()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/ownKeys)   | ✓    | `ownKeys() {}` |
| `path()` [↗](https://github.com/webqit/observer#concept-paths)   | `×`   | `-` |
| `preventExtensions()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/preventExtensions)   | ✓    | `preventExtensions() {}` |
| `set()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/set)   | ✓    | `set() {}` |
| `setPrototypeOf()` [↗](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect/setPrototypeOf)   | ✓    | `setPrototypeOf() {}` |
| . | . | . | . |
| `accessorize()` [↗](https://github.com/webqit/observer#:~:text=enable%20reactivity%20on%20specific%20properties%20with%20literal%20object%20accessors%20-%20using%20the%20observer.accessorize()%20method)   | `×`  | `-` |
| `proxy()` [↗](https://github.com/webqit/observer#:~:text=enable%20reactivity%20on%20arbitray%20properties%20with%20proxies%20-%20using%20the%20observer.proxy()%20method)   | `×`  | `-` |

## Design Discussion

[See more in the introductory blog post](https://dev.to/oxharris/reinvestigating-reactivity-22e0-temp-slug-5973064?preview=8afd0f8b156bf0b0b1c08058837fe4986054e52a7450f0a28adbaf07dcb7f5659b724166f553fb98ceab3d080748e86b244684f515d579bcd0f48cbb#introducing-the-observer-api)<sup>draft</sup>

## Getting Involved

All forms of contributions are welcome at this time. For example, implementation details are all up for discussion. And here are specific links:

+ [Project](https://github.com/webqit/observer)
+ [Documentation](https://github.com/webqit/observer/wiki)
+ [Discusions](https://github.com/webqit/observer/discussions)
+ [Issues](https://github.com/webqit/observer/issues)

## License

MIT.
