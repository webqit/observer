# `Observer.observe()`

This method is used to observe changes to an object or array.

+ [Syntax](#syntax)
+ [Usage](#usage)
+ [Constraining an Observer](#constraining-an-observer)
+ [Tagging an Observer](#tagging-an-observer)
+ [The Returned Observer Instance](#the-returned-observer-instance)
+ [Related Methods](#related-methods)

## Syntax

```js
// Observe all properties
Observer.observe(obj, callback[, params = {}]);

// Observe a list of properties
Observer.observe(obj, propertyNames, callback[, params = {}]);

// Observe a specific property
Observer.observe(obj, propertyName, callback[, params = {}]);
```

**Parameters**

+ `obj` - an object or array.
+ `propertyNames/propertyName` - the list of properties, or a property, to observe.
+ `callback` - a callback function that receives the change notifications. This recieves:
    + `changes/change` - a list of *changes*, or a *change* (in the case of the last syntax above.)
+ `params` - Additional parameters.

**Return Value**

An [*Observer* instance](#the-returned-observer-instance).

## Usage

+ [Observing All Properties](#observing-all-properties)
+ [Observing a List of Properties](#observing-a-list-of-properties)
+ [Observing a Specific Property](#observing-a-specific-property)
+ [Observing Deep Changes](#observing-deep-changes)

### Observing All Properties

```js
let callback = changes => {
    console.log(changes);
};
let obj = {};
Observer.observe(obj, callback);
```

The code above will report changes as the *object* gets modified on any of its properties.

```js
let arr = [];
Observer.observe(arr, callback);
```

The code above will report changes as the *array* gets modified with entries.

Let's now effect a change and watch the console.

```js
Observer.set(obj, 'fruit', 'apple');
```

### Observing a List of Properties

```js
let callback = changes => {
    console.log(changes);
};

let obj = {};
Observer.observe(obj, ['fruit', 'brand'], callback);
```

The code above will report changes as any of "fruit" or "brand" properties get created, modified or deleted on the object.

```js
let arr = [];
Observer.observe(arr, [0, 3], callback);
```

The code above will report changes as the array's first or fourth entry gets created, modified or deleted.

Now, we'll effect a change on the first observed property and watch the console.

```js
Observer.set(obj, 'fruit', 'orange');
```

### Observing a Specific Property

```js
let callback = change => {
    console.log(change);
};

let obj = {};
Observer.observe(obj, 'fruit', callback);
```

The code above will report changes as the "fruit" property gets created, modified or deleted on the object.

```js
let arr = [];
Observer.observe(arr, 0, callback);
```

The code above will report changes as the array's first entry gets created, modified or deleted.

Let's effect a change and watch the console.

```js
Observer.set(obj, 'fruit', 'apple');
```

### Observing Deep Changes

It is possible to observe changes on nested objects or arrays.

**Syntax**

```js
// Observe changes on both direct properties and descendant properties 
// We employ the params.subtree parameter
Observer.observe(obj, callback, {subtree:true});

// Observe changes on a specific path
// We use the dot (.) notation to represent our path
Observer.observe(obj, 'level1.level2', callback);

// Observe changes on a list of paths
// We provide an array of paths
Observer.observe(obj, ['level1.level2_a', 'level1,level2_b'], callback);

// Observe changes on a wildcard path
// We provide a "template" path expression that could automatically match more than one path
Observer.observe(obj, 'level1..level3', callback);
```

#### Using the params.subtree Parameter

When we observe down an object tree, deep changes will bubble to the handler bound up the tree.

```js
let obj = {
    preferences: {},
};
Observer.observe(obj, changes => {
    console.log(changes);
}, {subtree:true});
```

Modify the tree at level 2 and watch the event bubble up to the observer at the root level.

```js
Observer.set(obj.preferences, 'fruit', 'apple');
```

#### Using A Path Expression

When we observe a path on an object tree, changes that occur at any level along that path will bubble to the observer bound up the tree.

```js
let obj = {
    preferences: {},
};
Observer.observe(obj, 'preferences.fruit', change => {
    console.log(change);
});
```

Modify the tree at level 2 and watch the console.

```js
Observer.set(obj.preferences, 'fruit', 'orange');
```

Below is another example, but this time, the change isn't happening along the path we're observing. So, we don't expect anything in the console.

```js
Observer.set(obj.preferences, 'brand', 'apple');
```

#### Using Multiple Path Expressions

When we observe multiple paths on an object tree, changes that occur at any level along any of the paths will bubble to the observer bound up the tree.

```js
let obj = {
    preferences: {},
};
Observer.observe(obj, ['preferences.fruit', 'preferences.brand'], changes => {
    console.log(changes);
});
```

With the code below, our observer above will be called twice.

```js
Observer.set(obj.preferences, 'fruit', 'orange');
Observer.set(obj.preferences, 'brand', 'apple');
```

With the code below, our observer above will be called once.

```js
Observer.set(obj.preferences, {
    fruit: 'orange',
    brand: 'apple',
});
```

#### Using a Wildcard Path Expression

When we observe a wildcard path on an object tree, changes that occur at a descendant node that fulfills the wildcard path will bubble to the observer bound up the tree.

Below, notice that our path is a 3-level path with the second level being the wildcard.

```js
let obj = {
    preferences: {
        favourites: {},
    },
};
Observer.observe(obj, 'preferences..fruit', change => {
    console.log(change);
});
```

Set a property on the tree at level 3. Our observer should be triggered as the event will be firing at a path - `preferences.favourites.fruit` - that fulfills our wildcard path!

```js
Observer.set(obj.preferences.favourites, 'fruit', 'mango');
```

## Constraining an Observer

The `params.type` parameter can be used to constrain an observer to respond to a specific mutation type like "set" and "del".

```js
Observer.observe(obj, propertyName, callback, {type:'del'});
```

## Tagging an Observer

The `params.tags` parameter can be used to tag an observer. Tags are an *array* of values (*strings*, *numbers*, *objects*, etc) that can be used to identify the observer for later use.

```js
Observer.observe(obj, propertyName, callback, {tags:['#tag']});
```

## The Returned Observer Instance

The `Observer.observe()` method returns an *Observer* instance that gives us per-instance control.

```js
// Obtain the Observer instance
let instance = Observer.observe(obj, callback);

// Synthetically fire the observer
instance.fire({
    type:'customType',
});

// Disconnect the observer
instance.disconnect();
```

## Related Methods

+ [`Observer.unobserve()`](/observer/v1/api/unobserve.md)
+ [`Observer.set()`](/observer/v1/api/set.md)
+ [`Observer.deleteProperty()`](/observer/v1/api/deleteproperty.md)
