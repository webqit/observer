# The Observer API

<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/@webqit/observer" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@webqit/observer.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@webqit/observer" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@webqit/observer.svg" alt="NPM downloads" /></a></span>

<!-- /BADGES -->

*[Observer](https://webqit.io/tooling/observer)* is an API for observing and intercepting JavaScript objects and arrays.

> [Visit project docs](https://webqit.io/tooling/observer).

```js
let obj = {};
Observer.observe(obj, events => {
    events.forEach(event => {
        console.log(event.type, event.name, event.path, event.value, event.oldValue);
    });
});

Observer.set(obj, path, value);
```

Follow the [installation guide](https://webqit.io/tooling/observer/installation) to obtain the Observer API.

## Documentation
+ [Examples](https://webqit.io/tooling/observer/examples)
+ [API](https://webqit.io/tooling/observer/api)

## Design Goals
See the [features explainer](https://webqit.io/tooling/observer/explainer).

## Issues
To report bugs or request features, please submit an [issue](https://github.com/webqit/observer/issues).

## License
MIT.
