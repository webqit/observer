# `Observer.unobserve()`

This method is used to unbind observers previously bound with [`Observer.observe()`](/observer/v1/api/observe.md).

+ [Syntax](#syntax)
+ [Related Methods](#related-methods)

## Syntax

```js
// Unbind all observers bound to the following property name
// regardless of the handler function
Observer.unobserve(obj, propertyName);

// Unbind the observer bound with the following handler function
Observer.unobserve(obj, propertyName, originalCallback);

// Unbind the observer bound with the following handler function and tags
Observer.unobserve(obj, propertyName, originalCallback, {tags:[...originalTags]});

// Unbind the observer bound with the following handler function and reflex type 
Observer.unobserve(obj, propertyName, originalCallback, {type:’set’});

// Unbind all observers bound with the following tags
// regardless of the handler function
Observer.unobserve(obj, propertyNames, null, {tags:[...originalTags]});
```

**Parameters**

+ `obj` - an object or array.
+ `propertyName/propertyNames` - if given, the *propertyName* or list of *propertyNames* (in any order) used on [`Observer.observe()`](/observer/v1/api/observe.md)
+ `originalCallback` - if given, the *original* callback function used on [`Observer.observe()`](/observer/v1/api/observe.md)
+ `params.tags` - if given, the list of *tags* (in any order) used on [`Observer.observe()`](/observer/v1/api/observe.md)


**Return Value**

*undefined*

## Related Methods

+ [`Observer.observe()`](/observer/v1/api/observe.md)
