# `Observer.init()`

This function is used to implement property *setters* and *getters* that use `Observer.set()` and `Observer.get()` respectively behind the scene. This gives us the benefit of using JavaScript's assignment and accessor syntax while still driving [*observers*](/observer/v1/api/observe.md) and [*interceptors*](/observer/v1/api/intercept.md).

+ [Syntax](#syntax)
+ [Usage](#usage)

## Syntax

```js
// Init a single property
Observer.init(object, propertyName);

// Init multiple properties
Observer.init(object, propertyNames);
```

**Parameters**

+ `obj` - an object or array.
+ `propertyName/propertyNames` - the property, or list of properties, to initialize.

**Return Value**

*undefined*

## Usage

```js
// The object
let obj = {};

// We observe the 'preferences' property
Observer.observe(obj, 'preferences', changes => {
    console.log(changes);
});

// Now we virtualize this property
Observer.init(obj, 'preferences');

// We use the property and watch our console.
obj.preferences = {};
```