<div align="center">

# The Observer API

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![License][license-src]][license-href]

</div>

---

Observe and intercept operations on arbitrary JavaScript objects and arrays using a utility-first, general-purpose reactivity API! This API re-explores the unique design of the [Object.observe()](https://web.dev/es7-observe/) API and unifies that with the rest of JavaScript's metaprogramming APIs like Proxy "traps" and the `Reflect` API!

The Observer API comes as one little API for all things _object observability_. (Only `~5.8KiB min|zip`)

```js
const state = {};

// Observe all property changes
Observer.observe(state, (mutations) => {
  mutations.forEach(mutation => {
    console.log(`${mutation.type}: ${mutation.key} = ${mutation.value}`);
  });
});

Observer.set(state, 'count', 5);
Observer.deleteProperty(state, 'oldProp');
```

> [!TIP]
> Reactivity is anchored on the programmtic APIs — `.set()`, `.deleteProperty()`, etc. — but reactivity is also possible over literal JavaScript operations like `obj.prop = value`, `delete obj.prop` — by means of the `accessorize()` and `proxy()` methods covered just ahead.
>
> For full-fledged Imperative Reactive Programming, you may want to see the [Quantum JS](https://github.com/webqit/quantum-js) project.

---

<details><summary>Looking for Observer@1.x?</summary>

This documentation is for Observer@2.x. For the previous version, see [Observer@1.x](https://github.com/webqit/observer/tree/v1.7.6).

</details>

## Table of Contents

- [Why Observer](#why-observer)
- [Quick Start](#quick-start)
- [Key Features](#key-features)
- [Ecosystem Integrations](#ecosystem-integrations)
- [API Reference](#api-reference)
- [Extended Documentation](#extended-documentation)
- [Contributing](#contributing)

## Why Observer?

JavaScript is *inherently* a mutable language but lacks a built-in way to observe said mutations. When you do `obj.prop = value` or `delete obj.prop`, there's no mechanism to detect those changes.

**The Problem:**

```js
const state = { count: 0, items: [] };

// No way to observe/intercept these mutations in JavaScript
state.count = 5;
state.items.push('new item');
delete state.oldProp;

// No way to detect these changes
```

This limitation in the language has long created a **blindspot** — and a **weakness** — for reactive systems. Consequently:

+ reactive frameworks (like React, Vue) learned to forbid mutability
+ *immutability* became the default workaround. You don't mutate, you create a new object each time:
  
  ```js
  state = { ...state, count: 6 };
  state = { ...state, count: 7 };
  state = { ...state, count: 8 };
  ```

```js
  state = { ...state, items: [...state.items, 'new item 1'] };
  state = { ...state, items: [...state.items, 'new item 2'] };
  state = { ...state, items: [...state.items, 'new item 3'] };
  ```

  > Because this is generally hard to follow, frameworks typically enforce immutability via strong design constraints. Outside of a framework, you get standalone *immutability* libraries (like Immer, or Immutable.js back in the day) that as well try to simulate an immutable world, where data is never changed, only replaced.

+ mutation gets a bad rap

**Using the Observer API:**

By enabling observability at the object/array level, the Observer API effectively solves reactivity for a mutable world. Consequently:

+ you are able to weild *the sheer power of mutability* in programming to your advantage — and unappologetically
+ you are able to make sense of a mutable world — and integrate with it — rather than stand at odds with it.

The Observer API collapses layers of complexity that reactive frameworks have built around immutability, bringing you back to the simplicity and power of direct mutation—and this time, with full observability.

**The Result** is *mutation-based reactivity* as a first-class concept in JavaScript.

## Quick Start

Install from NPM or include from a CDN.

### Installation

```bash
npm install @webqit/observer
```

```js
import Observer from '@webqit/observer';
```

### CDN

```html
<script src="https://unpkg.com/@webqit/observer/dist/main.js"></script>
<script>
  const Observer = window.webqit.Observer;
</script>
```

### Basic Usage

```js
import Observer from '@webqit/observer';

const user = { name: 'John', items: [] };

// Watch for changes
const controller = Observer.observe(user, (mutations) => {
  mutations.forEach(mutation => {
    console.log(`Changed ${mutation.key}: ${mutation.oldValue} → ${mutation.value}`);
  });
});

// Make changes using programmatic APIs
Observer.set(user, 'name', 'Jane');
Observer.set(user, 'age', 26);

// Stop watching
controller.abort();
```

### Working with Arrays

```js
const items = ['apple', 'banana'];

Observer.observe(items, (mutations) => {
  console.log('Array changed:', mutations);
});

// Use programmatic APIs for mutations
Observer.set(items, 0, 'grape');
Observer.set(items, 2, 'orange');

// Reactive method calls
Observer.apply(items.push, items, ['new item']); // Observer.proxy(state.items).push('new item')
```

### Intercepting Operations

```js
// Transform values before they're set
Observer.intercept(user, 'set', (operation, previous, next) => {
  if (operation.key === 'email') {
    operation.value = operation.value.toLowerCase();
  }
  return next();
});

Observer.set(user, 'email', 'JOHN@EXAMPLE.COM'); // Becomes 'john@example.com'
```

## Key Features

### **Core Reactivity**
- **🔄 Real-time Observability**: Watch object and array changes as they happen
- **⚡ Synchronous Updates**: Changes are delivered synchronously, not batched
- **🎯 Granular Control**: Watch specific properties, paths; even wildcards
- **🌳 Deep Path Watching**: Observe nested properties or entire object tree

### **Advanced Capabilities**
- **🛡️ Operation Interception**: Transform, validate, or block operations before execution
- **🔗 Traps Pipeline**: Compose multiple interceptors for complex behavior
- **📦 Atomic Batching**: Batch multiple changes into single atomic operation
- **🔄 Object Mirroring**: Create reactive synchronization between objects

### **Developer Experience**
- **🔧 Utility-First API**: Clean, functional design with consistent patterns
- **📱 Universal Support**: Works in browsers, Node.js, and all JavaScript environments
- **🔌 Standard Integration**: Built on AbortSignal, Reflect API, and Proxy standards
- **📊 Lightweight**: Only ~5.8KB min+gz with zero dependencies

## Ecosystem Integrations

The Observer API is enabling a shared protocol for *mutation-based* reactivity across the ecosystem:

### **🚀 [Quantum Runtime](https://github.com/webqit/quantum-js)**
Uses Observer API under the hood to operate as a **full-fledged reactive runtime**. Quantum enables Imperative Reactive Programming by leveraging Observer's reactivity foundation to make ordinary JavaScript code reactive.

### **🌐 [OOHTML](https://github.com/webqit/oohtml)**
Uses Observer API to underpin **dynamic, reactive UIs**. OOHTML enables live data binding between UI and app state, automatically updating the DOM when your data changes.

### **⚡ [Webflo](https://github.com/webqit/webflo)**
Uses Observer API to underpin **Live Objects** as a first-class concept. Live Objects in Webflo lets you send dynamic state from your server to the UI with reactivity over the wire.

### **🔗 [LinkedQL](https://github.com/linked-db/linked-ql)**
Uses Observer API to underpin **Live Objects** as a first-class concept. Live Objects in LinkedQL lets you have query results as self-updating result sets.

## API Reference
    
- [Observer.observe()](#observerobservertarget-callback-options)
- [Observer.intercept()](#observerintercepttarget-operation-handler-options)
- [Observer.set()](#observersettarget-key-value-options)
- [Observer.get()](#observergettarget-key-options)
- [Observer.has()](#observerhastarget-key-options)
- [Observer.ownKeys()](#observerownkeystarget-options)
- [Observer.deleteProperty()](#observerdeletepropertytarget-key-options)
- [Observer.deleteProperties()](#observerdeletepropertiestarget-keys-options)
- [Observer.defineProperty()](#observerdefinepropertytarget-key-descriptor-options)
- [Observer.defineProperties()](#observerdefinepropertiestarget-descriptors-options)
- [Observer.accessorize()](#observeraccessorizetarget-properties-options)
- [Observer.unaccessorize()](#observerunaccessorizetarget-properties-options)
- [Observer.proxy()](#observerproxytarget-options)
- [Observer.unproxy()](#observerunproxytarget-options)
- [Observer.path()](#observerpathsegments)
- [Observer.batch()](#observerbatchtarget-callback-options)
- [Observer.map()](#observermapsource-target-options)
- [Observer.any()](#observerany)
- [Observer.subtree()](#observersubtree)
- [Other Methods](#other-methods)

### `Observer.observe(target, callback, options?)`

Observe changes on an object or array.
Returns an `AbortController` instance for lifecycle management.

**Basic Usage:**
```js
const obj = {};

const controller = Observer.observe(obj, (mutations) => {
  mutations.forEach(mutation => {
    console.log(`${mutation.type}: ${mutation.key} = ${mutation.value}`);
  });
});

// Changes are delivered synchronously
Observer.set(obj, 'name', 'Bob');
Observer.set(obj, 'age', 30);

// Stop observing
controller.abort();
```

**Alternative Method Shapes:**
```js
// Watch specific properties
Observer.observe(obj, ['name', 'email'], callback);

// Watch a single property
Observer.observe(obj, 'name', callback);

// Watch all properties (default)
Observer.observe(obj, callback);
```

**Options:**
- `signal`: A custom AbortSignal instance that control lifecycle
- `diff`: Only fire for values that actually changed
- `recursions`: Controls recursion handling (`'inject'`, `'force-sync'`, `'force-async'`)
- `withPropertyDescriptors`: Include property descriptor information

#### Abort Signals

Observer returns a standard [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) instance for managing observer lifecycle.

```js
// Returns AbortController for lifecycle management
const controller = Observer.observe(obj, callback);
controller.abort(); // Stop observing

// Provide your own AbortSignal
const abortController = new AbortController();
Observer.observe(obj, callback, { signal: abortController.signal });
abortController.abort(); // Stop observing
```

Or, you can provide your own:

```js
// Providing an AbortSignal
const abortController = new AbortController;
Observer.observe(obj, inspect, { signal: abortController.signal });
```

```js
// Abort at any time
abortController.abort();
```

#### Lifecycle Signals

Each lifecycle event fired carries its own Abort Signal that automatically aborts at the end of its turn — just when the next event fires. They're useful for tying other parts of the system to just the given event's lifecycle. For example, lifecycle signals enable parent-child observer relationships where child observers automatically abort when their parent aborts.
Leverage this to simplify hierarchical observer patterns.

```js
// Parent observer with lifecycle management
const parentController = Observer.observe(obj, (mutations, flags) => {
  // Child observers automatically abort when parent aborts
  Observer.observe(obj, childCallback, { signal: flags.signal });
  
  // Multiple child observers tied to parent lifecycle
  Observer.observe(obj, anotherCallback, { signal: flags.signal });
});

// All child observers abort when parent aborts
parentController.abort();
```

#### Parity Table

| | Observer API | Object.observe() (Deprecated) |
|-------------|--------------|-------------------------------|
| **Signature** | `.observe(target, callback, options?)` | `.observe(target, callback, acceptList?)` |
| **Return Value** | `AbortController` (lifecycle management) | `undefined` (no lifecycle management) |
| **Additional Features** | AbortSignal integration, path watching, batch/atomic operations, synchronous event model, etc. | Basic object observation, asynchronous event model (deprecated) |

### `Observer.intercept(target, operation, handler, options?)`

Intercept operations before they happen.
Can intercept individual operations or multiple operations at once.

**Single Operation Interception:**

Intercept individual operations to transform, validate, or block them before they execute.

```js
// Transform values before they're set
Observer.intercept(obj, 'set', (operation, previous, next) => {
  if (operation.key === 'email') {
    operation.value = operation.value.toLowerCase();
  }
  return next();
});

Observer.set(obj, 'email', 'JOHN@EXAMPLE.COM'); // Becomes 'john@example.com'
```

**Multiple Operations Interception:**

Intercept multiple operations simultaneously to create comprehensive behavior modifications.

```js
const options = {};
Observer.intercept(obj, {
  set: (operation, previous, next) => {
    if (operation.key === 'email') {
      operation.value = operation.value.toLowerCase();
    }
    return next();
  },
  get: (operation, previous, next) => {
    if (operation.key === 'token') {
      return next(fetchToken());
    }
    return next();
  },
  deleteProperty: (operation, previous, next) => {
    if (operation.key === 'password') {
      console.log('Password deletion blocked');
      return false; // Block the operation
    }
    return next();
  }
}, options);
```

**Traps Pipeline:**

Multiple interceptors can intercept same operation, and these will operate like a middleware pipeline where each interceptor uses `next()` to advance the operation to subsequent interceptors in the pipeline.

```js
// First interceptor: Transform email to lowercase
Observer.intercept(obj, 'get', (operation, previous, next) => {
  if (operation.key === 'email') {
    const result = next();
    return result ? result.toLowerCase() : result;
  }
  return next();
});

// Second interceptor: Add validation
Observer.intercept(obj, 'get', (operation, previous, next) => {
  if (operation.key === 'email') {
    const result = next();
    if (result && !result.includes('@')) {
      throw new Error('Invalid email format');
    }
    return result;
  }
  return next();
});

// Now when accessing email, both interceptors run in sequence:
// 1. First: transforms to lowercase
// 2. Second: validates format
// Result: 'JOHN@EXAMPLE.COM' → 'john@example.com' → validation passes
```

#### Interceptable Operations

- `set` - Property assignment
- `get` - Property access
- `has` - Property existence check
- `ownKeys` - Object key enumeration
- `deleteProperty` - Property deletion
- `defineProperty` - Property definition
- `getOwnPropertyDescriptor` - Property descriptor access

#### Parity Table

| | Observer API | Proxy Traps |
|-------------|--------------|-------------|
| **Signature** | `.intercept(target, operation, handler, options?)`<br>`.intercept(target, { [operation]: handler[, ...]}, options?)` | `new Proxy(target, { [operation]: handler[, ...] })` |
| **Return Value** | `undefined` (registration) | `Proxy` (wrapped object) |
| **Additional Features** | Traps pipeline, composable interceptors | Single trap per operation, no composability |

---

### `Observer.set(target, key, value, options?)`

Set properties _reactively_ using a programmatic mutation API.
Triggers observers and can be intercepted via `Observer.intercept()`.

**Basic Usage:**

```js
Observer.set(obj, 'name', 'Alice');
Observer.set(arr, 0, 'first item');
```

**Alternative Method Shapes:**

```js
// Set multiple properties at once
Observer.set(obj, {
  name: 'Alice',
  age: 25,
  email: 'alice@example.com'
});

// Set with receiver context
Observer.set(obj, 'name', 'Alice', receiver);
```

#### Usage Patterns

```js
// Reactive state updates
Observer.set(state, 'loading', true);
Observer.set(state, 'data', responseData);

// Array operations
Observer.set(items, 0, 'new item');
Observer.set(items, items.length, 'append item');

// Nested property updates
Observer.set(obj, Observer.path('user', 'profile', 'name'), 'Alice');
```

#### Parity Table

| | Observer API | Reflect API |
|-------------|--------------|-------------|
| **Signature** | `.set(target, key, value, options?)` | `.set(target, key, value)` |
| **Return Value** | `boolean` (success) | `boolean` (success) |
| **Additional Features** | Triggers observers, interceptable | Standard property setting |

### `Observer.get(target, key, options?)`

Get properties using a programmatic API.
Can be intercepted via `Observer.intercept()` to provide computed values or transformations.

**Basic Usage:**

```js
const value = Observer.get(obj, 'name');
const nested = Observer.get(obj, 'user.profile.name');
```

**_Scenario_: Computed Properties:**

```js
// Intercept to provide computed values
Observer.intercept(obj, 'get', (operation, previous, next) => {
  if (operation.key === 'fullName') {
    return `${obj.firstName} ${obj.lastName}`;
  }
  return next();
});

Observer.get(obj, 'fullName'); // "John Doe" (computed on-the-fly)
```

#### Parity Table

| | Observer API | Reflect API |
|-------------|--------------|-------------|
| **Signature** | `.get(target, key, options?)` | `.get(target, key)` |
| **Return Value** | `any` (property value) | `any` (property value) |
| **Additional Features** | Interceptable for computed values | Standard property access |

### `Observer.has(target, key, options?)`

Check if a property exists on an object.
Can be intercepted via `Observer.intercept()` to hide or reveal properties dynamically.

**Basic Usage:**

```js
Observer.has(obj, 'name'); // true/false
Observer.has(obj, 'user.profile.name'); // nested property check
```

**_Scenario_: Property Hiding:**

```js
// Intercept to hide sensitive properties
Observer.intercept(obj, 'has', (operation, previous, next) => {
  if (operation.key === 'password') {
    return false; // Hide password from property checks
  }
  return next();
});

Observer.has(obj, 'password'); // false (hidden from checks)
```

#### Parity Table

| | Observer API | Reflect API |
|-------------|--------------|-------------|
| **Signature** | `.has(target, key, options?)` | `.has(target, key)` |
| **Return Value** | `boolean` (exists) | `boolean` (exists) |
| **Additional Features** | Interceptable for property hiding | Standard property existence check |

### `Observer.ownKeys(target, options?)`

Get all own property keys of an object.
Can be intercepted via `Observer.intercept()` to filter or transform the key list.

**Basic Usage:**

```js
Observer.ownKeys(obj); // ['name', 'email', 'age']
```

**_Scenario_: Key Filtering:**

```js
// Intercept to filter out sensitive keys
Observer.intercept(obj, 'ownKeys', (operation, previous, next) => {
  const keys = next();
  return keys.filter(key => key !== 'password');
});

Observer.ownKeys(obj); // ['name', 'email'] (password filtered out)
```

#### Parity Table

| | Observer API | Reflect API | Object API |
|-------------|--------------|-------------|-------------|
| **Signature** | `.ownKeys(target, options?)` | `.ownKeys(target)` | `.keys(obj)` |
| **Return Value** | `string[]` (keys) | `string[]` (keys) | `string[]` (keys) |
| **Additional Features** | Interceptable for key filtering | Standard key enumeration | Standard key enumeration |

### `Observer.deleteProperty(target, key, options?)`

Delete properties _reactively_ using a programmatic mutation API.

**Basic Usage:**
```js
Observer.deleteProperty(obj, 'oldProp');
Observer.deleteProperty(arr, 0);
```

#### Parity Table

| | Observer API | Reflect API |
|-------------|--------------|-------------|
| **Signature** | `.deleteProperty(target, key, options?)` | `.deleteProperty(target, key)` |
| **Return Value** | `boolean` (success) | `boolean` (success) |
| **Additional Features** | Triggers observers, interceptable | Standard property deletion |

### `Observer.deleteProperties(target, keys, options?)`

Delete multiple properties at once.

```js
Observer.deleteProperties(obj, ['oldProp1', 'oldProp2', 'tempProp']);
```

#### Parity Table

| | Observer API | No Direct Equivalent |
|-------------|--------------|---------------------|
| **Signature** | `.deleteProperties(target, keys, options?)` | No batch delete in standard APIs |
| **Return Value** | `boolean[]` (success array) | N/A |
| **Additional Features** | Triggers observers, interceptable | N/A |

### `Observer.defineProperty(target, key, descriptor, options?)`

Define properties _reactively_ using the programmatic mutation API.

**Basic Usage:**

```js
Observer.defineProperty(obj, 'computed', { 
  get: () => obj.value * 2 
});
```

#### Parity Table

| | Observer API | Reflect API | Object API |
|-------------|--------------|-------------|-------------|
| **Signature** | `.defineProperty(target, key, descriptor, options?)` | `.defineProperty(target, key, descriptor)` | `.defineProperty(obj, key, descriptor)` |
| **Return Value** | `boolean` (success) | `boolean` (success) | `object` (modified object) |
| **Additional Features** | Triggers observers, interceptable | Standard property definition | Standard property definition |

### `Observer.defineProperties(target, descriptors, options?)`

Define multiple properties at once.

```js
Observer.defineProperties(obj, {
  name: { value: 'Alice', writable: true },
  email: { value: 'alice@example.com', writable: true },
  age: { value: 25, writable: true }
});
```

#### Parity Table

| | Observer API | Object API |
|-------------|--------------|-------------|
| **Signature** | `.defineProperties(target, descriptors, options?)` | `.defineProperties(obj, descriptors)` |
| **Return Value** | `boolean` (success) | `object` (modified object) |
| **Additional Features** | Triggers observers, interceptable | Standard property definition |

---

### `Observer.accessorize(target, properties?, options?)`

Make properties reactive for direct assignment.

```js
const obj = { age: null };

// Make all CURRENT properties reactive
Observer.accessorize(obj);

// Make specific properties reactive
Observer.accessorize(obj, ['name', 'email']);

// Now direct assignment works
obj.name = 'Alice';
obj.email = 'alice@example.com';
```

#### Parity Table

| | Observer API | No Direct Equivalent |
|-------------|--------------|---------------------|
| **Signature** | `.accessorize(target, properties?, options?)` | No direct equivalent in standard APIs |
| **Return Value** | `undefined` (modification) | N/A |
| **Additional Features** | Makes properties reactive for direct assignment | N/A |

### `Observer.unaccessorize(target, properties?)`

Restore accessorized properties to their normal state.

```js
// Restore specific properties
Observer.unaccessorize(obj, ['name', 'email'], options?);

// Restore all accessorized properties
Observer.unaccessorize(obj);
```

#### Parity Table

| | Observer API | No Direct Equivalent |
|-------------|--------------|---------------------|
| **Signature** | `.unaccessorize(target, properties?, options?)` | No direct equivalent in standard APIs |
| **Return Value** | `undefined` (modification) | N/A |
| **Additional Features** | Restores accessorized properties to normal state | N/A |

---

### `Observer.proxy(target, options?)`

Create a reactive proxy of any object to get automatic reactivity and interceptibility over on-the-fly operations.

**Basic Usage:**

```js
const $obj = Observer.proxy(obj);

// All operations are reactive
$obj.name = 'Alice';             // Triggers observers
$obj.newProp = 'value';          // Triggers observers
delete $obj.oldProp;             // Triggers observers

// Array methods are reactive
$arr.push('item1', 'item2');     // Triggers observers
$arr[0] = 'newValue';            // Triggers observers
```

#### Nested Operations (Requires `chainable: true`)

Use `chainable: true` to interact with deeply nested objects as proxy instances too. By default, `.proxy()` doesn't perform deep wrapping - nested objects are returned as plain objects. Chainable mode enables automatic proxying of nested objects at the point they're accessed, allowing nested operations to trigger observers.

```js
const $obj = Observer.proxy(obj, { chainable: true });

// Nested objects are automatically proxied when accessed
const $user = $obj.user;           // Returns a proxied object
$user.name = 'Alice';              // Triggers observers
$user.profile.theme = 'dark';      // Triggers observers

// Array methods return proxied arrays
const $filtered = $obj.items.filter(x => x.active); // Returns proxied array
$filtered.push('newItem');         // Triggers observers

// Direct nested access also works
$obj.users[0].name = 'Bob';        // Triggers observers
$obj.data.splice(0, 1);            // Triggers observers
```

#### Membrane Mode

Membranes ensure that the same proxy instance is returned across multiple `.proxy()` calls for the same object. When combined with `chainable: true`, membranes also ensure consistent proxy identity for nested objects.

```js
// Create membrane for consistent proxy identity
const $obj1 = Observer.proxy(obj, { membrane: 'userData' });
const $obj2 = Observer.proxy(obj, { membrane: 'userData' });

// Same proxy instance returned
console.log($obj1 === $obj2); // true

// Root operations are reactive
$obj1.name = 'Alice';                  // Triggers observers
$obj2.email = 'alice@example.com';    // Triggers observers (same proxy)

// When combined with chainable: true
const $obj3 = Observer.proxy(obj, { membrane: 'userData', chainable: true });
const $user1 = $obj3.user;
const $user2 = $obj3.user;

// Same nested proxy instance returned
console.log($user1 === $user2); // true
$user1.name = 'Alice';          // Triggers observers
```

#### How Membranes Work

- **Root Object Identity** - Same root object always returns the same proxy instance across multiple `.proxy()` calls
- **Membrane References** - Uses a reference system to ensure consistent proxy identity
- **Nested Object Identity** - When combined with `chainable: true`, ensures same nested objects return same proxy instances
- **Performance** - Only creates one proxy per object (root or nested)
- **Consistency** - Maintains referential equality for both root and nested objects

#### Membrane vs Chainable Object Identity

```js
const obj = { user: { name: 'Alice' }, items: ['item1'] };

// MEMBRANE: Same root object = same proxy instance
const $obj1 = Observer.proxy(obj, { membrane: 'test' });
const $obj2 = Observer.proxy(obj, { membrane: 'test' });
console.log($obj1 === $obj2); // true - same root proxy

// Nested objects are NOT automatically proxied (without chainable)
const user1 = $obj1.user; // Plain object, not proxied
const user2 = $obj2.user; // Plain object, not proxied
console.log(user1 === user2); // true - same plain object

// CHAINABLE: Auto-proxies nested objects when accessed
const $obj = Observer.proxy(obj, { chainable: true });
const $user1 = $obj.user; // Proxied object
const $user2 = $obj.user; // Different proxy instance
console.log($user1 !== $user2); // true - different proxy instances

// MEMBRANE + CHAINABLE: Consistent nested proxy identity
const $obj3 = Observer.proxy(obj, { membrane: 'test', chainable: true });
const $user3 = $obj3.user; // Proxied object
const $user4 = $obj3.user; // Same proxy instance
console.log($user3 === $user4); // true - same nested proxy
```

#### Real-World Usage Patterns

**_Scenario_: Form Handling:**

```js
const $form = Observer.proxy(formData, { membrane: 'form' });
$form.name = 'John';             // Auto-save, validation
$form.email = 'john@example.com'; // Auto-save, validation
$form.tags.push('urgent');       // Auto-save, validation
```

**_Scenario_: State Management:**

```js
const $state = Observer.proxy(appState, { chainable: true });
$state.user.isLoggedIn = true;   // UI updates
$state.cart.items.push(product); // UI updates
$state.getUser().profile.theme = 'dark'; // UI updates (chainable)
```

#### Formal Arguments

```js
// Basic proxy
const $obj = Observer.proxy(obj);

// Proxy with options
const $obj = Observer.proxy(obj, {
  membrane: 'userData',        // Auto-proxy nested objects
  chainable: true              // Auto-wrap returned objects
});

// Proxy with custom extension
const $obj = Observer.proxy(obj, {}, (traps) => {
  // Extend proxy traps
  traps.get = (target, key, receiver) => {
    if (key === 'computed') {
      return target.firstName + ' ' + target.lastName;
    }
    return traps.get(target, key, receiver);
  };
  return traps;
});
```

#### Proxy Features (Summary)

- **Literal syntax** - Use normal JavaScript operations
- **Array methods** - All array methods are reactive
- **Property access** - All property operations are reactive
- **Nested operations** - Works with deeply nested objects
- **Dynamic properties** - Supports computed property names
- **Method chaining** - Array methods can be chained
- **Membrane support** - Auto-proxy nested objects
- **Chainable operations** - Auto-wrap returned values
- **Custom traps** - Extend proxy behavior
- **Namespace isolation** - Separate observer namespaces

#### Parity Table

| | Observer API | Proxy API |
|-------------|--------------|-----------|
| **Signature** | `.proxy(target, options?)` | `new Proxy(target, handlers)` |
| **Return Value** | `Proxy` (reactive proxy) | `Proxy` (standard proxy) |
| **Additional Features** | Built-in reactivity, membrane, chainable | Manual trap implementation required |

### `Observer.unproxy(target, options?)`

Get the original object from a proxy.

```js
const $obj = Observer.proxy(obj);
const original = Observer.unproxy($obj); // Returns original obj
```

#### Parity Table

| | Observer API | No Direct Equivalent |
|-------------|--------------|---------------------|
| **Signature** | `.unproxy(target)` | No direct equivalent in standard APIs |
| **Return Value** | `object` (original object) | N/A |
| **Additional Features** | Extracts original object from Observer proxy | N/A |

---

### `Observer.path(...segments)`

Create path arrays for deep property observation. Path watching enables observing changes at specific nested paths within object trees, including non-existent paths that are created dynamically.

**Basic Usage:**

```js
// Watch deep paths
const path = Observer.path('user', 'profile', 'settings');
Observer.observe(obj, path, (mutation) => {
  console.log(`Deep change: ${mutation.path} = ${mutation.value}`);
});
```

#### Usage Patterns

```js
// Form validation
const path = Observer.path('form', 'user', 'email');
Observer.observe(form, path, (mutation) => {
  validateEmail(mutation.value);
});

// State management
const path = Observer.path('app', 'user', 'preferences', 'theme');
Observer.observe(state, path, (mutation) => {
  updateTheme(mutation.value);
});

// Configuration watching
const path = Observer.path('config', 'api', 'endpoint');
Observer.observe(config, path, (mutation) => {
  updateApiEndpoint(mutation.value);
});
```

#### Path Features (Summary)

- Watches paths that are created dynamically
- Uses an array syntax to avoid conflicting with property names with dots
- Returns mutation context for audit trails

### `Observer.any()`

Create a wildcard directive for matching any property or array index in path patterns. Wildcards enable flexible observation of dynamic data structures where you need to watch changes at any index or property name.

**Basic Usage:**

```js
// Watch any user at any index
const path = Observer.path('users', Observer.any(), 'name');
Observer.observe(obj, path, (mutation) => {
  console.log(`User name changed: ${mutation.path} = ${mutation.value}`);
});
```

**Advanced Compositions:**

Combine multiple wildcards to create powerful observation patterns for complex data structures. This enables watching changes across dynamic arrays, nested objects, and varying property names.

```js
// Multiple wildcards in sequence
const path = Observer.path('sections', Observer.any(), 'items', Observer.any(), 'name');
// Matches: sections[0].items[1].name, sections[2].items[0].name, etc.

// Wildcard at different levels
const path = Observer.path('app', 'users', Observer.any(), 'profile', 'settings', Observer.any());
// Matches: app.users[0].profile.settings[theme], app.users[1].profile.settings[language], etc.

// Wildcard with specific properties
const path = Observer.path('data', Observer.any(), 'metadata', 'version');
// Matches: data[item1].metadata.version, data[item2].metadata.version, etc.
```

### `Observer.subtree()`

Create a subtree directive for watching all changes from a specific level down infinitely. Subtree watching enables comprehensive observation of complex nested data structures without needing to specify every possible path.

**Basic Usage:**

```js
// Watch all changes from this level down
Observer.observe(obj, Observer.subtree(), (mutation) => {
  console.log(`Any change: ${mutation.path} = ${mutation.value}`);
});
```

**Advanced Compositions:**

```js
// Subtree after specific path
const path = Observer.path('app', 'users', Observer.subtree());
// Watches: app.users.name, app.users.profile.theme, app.users.settings.notifications, etc.

// Subtree with wildcards
const path = Observer.path('sections', Observer.any(), Observer.subtree());
// Watches: sections[0].title, sections[0].items[1].name, sections[1].config.theme, etc.

// Multiple subtrees
const path = Observer.path('app', 'users', Observer.any(), 'profile', Observer.subtree());
// Watches: app.users[0].profile.name, app.users[0].profile.settings.theme, etc.

// Subtree at root level
Observer.observe(obj, Observer.subtree(), (mutation) => {
  // Watches EVERY change in the entire object tree
});
```

#### Real-World Usage Patterns

```js
// E-commerce: Watch any product in any category
const path = Observer.path('store', 'categories', Observer.any(), 'products', Observer.any(), Observer.subtree());
// Triggers for: store.categories[electronics].products[laptop].price
//              store.categories[books].products[novel].title
//              store.categories[clothing].products[shirt].sizes[large]
```

```js
// Multi-tenant: Watch any user's data in any organization
const path = Observer.path('orgs', Observer.any(), 'users', Observer.any(), Observer.subtree());
// Triggers for: orgs[company1].users[alice].profile.name
//              orgs[company2].users[bob].settings.theme
```

```js
// Content Management: Watch any page in any section
const path = Observer.path('cms', 'sections', Observer.any(), 'pages', Observer.any(), Observer.subtree());
// Triggers for: cms.sections[blog].pages[post1].content
//              cms.sections[news].pages[article].metadata.tags
```

---

### `Observer.batch(target, callback, options?)`

Batch multiple operations together. Batched operations ensure atomicity - all changes are delivered as a single event to observers, preventing partial updates and ensuring data consistency.

**Basic Usage:**

```js
// Batch multiple changes
Observer.batch(obj, () => {
  Observer.set(obj, 'name', 'Alice');
  Observer.set(obj, 'email', 'alice@example.com');
  Observer.deleteProperty(obj, 'age');
});

// All changes are delivered as a single batch to observers
```

---

### `Observer.map(source, target, options?)`

Create reactive mirrors between objects — changes in source automatically sync to target. Object mirroring enables automatic data flow between different parts of your application, keeping them synchronized without manual intervention.

**Basic Usage:**

```js
const source = { name: 'Alice', age: 25 };
const target = {};

// Create reactive mirror
const controller = Observer.map(source, target);

// Changes in source automatically sync to target
Observer.set(source, 'name', 'Bob');
console.log(target.name); // 'Bob'

// Stop mirroring
controller.abort();
```

**Alternative Method Shapes:**

```js
// Mirror with options
Observer.map(source, target, {
  only: ['name', 'email'], // Only mirror specific properties
  except: ['password'], // Exclude specific properties
  spread: true, // Spread array elements
  onlyEnumerable: false // Include non-enumerable properties
});

// Mirror with namespace
Observer.map(source, target, { namespace: 'user' });
```

#### Usage Patterns

```js
// State synchronization
const appState = { user: { name: 'Alice' } };
const uiState = {};
Observer.map(appState, uiState);

// Form data mirroring
const formData = { name: '', email: '' };
const validationState = {};
Observer.map(formData, validationState);

// Array synchronization
const sourceArray = [1, 2, 3];
const targetArray = [];
Observer.map(sourceArray, targetArray, { spread: true });
```

---

### Other Methods

Mentioned here for completeness, Observer also provides these utility methods:

- **`Observer.apply(target, thisArg, args)`** - Apply functions reactively
- **`Observer.construct(target, args)`** - Construct objects reactively  
- **`Observer.getOwnPropertyDescriptor(target, key)`** - Get property descriptors reactively
- **`Observer.getPrototypeOf(target)`** - Get prototype reactively
- **`Observer.setPrototypeOf(target, prototype)`** - Set prototype reactively
- **`Observer.isExtensible(target)`** - Check extensibility reactively
- **`Observer.preventExtensions(target)`** - Prevent extensions reactively

## Extended Documentation

- [Timing and Batching](https://github.com/webqit/observer/wiki#timing-and-batching)
- [Reflect API Supersets](https://github.com/webqit/observer/wiki#featuring-reflect-api-supersets)

## Contributing

We welcome contributions! Here's how to get involved:

- 🐛 [Report Issues](https://github.com/webqit/observer/issues)
- 💬 [Join Discussions](https://github.com/webqit/observer/discussions)
- 📖 [Read Documentation](https://github.com/webqit/observer/wiki)
- 🔧 [View Source](https://github.com/webqit/observer)

## License

MIT

[npm-version-src]: https://img.shields.io/npm/v/@webqit/observer?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@webqit/observer
[npm-downloads-src]: https://img.shields.io/npm/dm/@webqit/observer?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@webqit/observer
[bundle-src]: https://img.shields.io/bundlephobia/minzip/@webqit/observer?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@webqit/observer
[license-src]: https://img.shields.io/github/license/webqit/observer.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/webqit/observer/LICENSE