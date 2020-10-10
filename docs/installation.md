# Installation

Observer is usable in both browser and server environments.

## Embed as script

```html
<script src="https://unpkg.com/@web-native-js/observer/v1/dist/main.js"></script>

<script>
// The above tag loads Observer into a global "WebNative" object.
const Observer = window.WebNative.Observer;
</script>
```

## Install via npm

```text
$ npm i -g npm
$ npm i --save @web-native-js/observer
```

**Import with the `import` keyword:**

```js
// Node-style import
import Observer from '@web-native-js/observer';

// Standard JavaScript import. (Actual path depends on where you installed Observer to.)
import Observer from './node_modules/@web-native-js/observer/v1/src/index.js';
```

## Usage

+ [Examples](/observer/v1/examples.md)
+ [API Docs](/observer/v1/api/README.md)
