> Observability and Interceptability, Objects and Arrays.

# Observer v1

Observer is an API for intercepting and observing JavaScript objects and arrays.

## Replace Static with Dynamic

Observer is designed as a drop-in replacement for the 
It is designed for general-purpose event-based architectures (from UI data-binding to debugging, and everything in between). It draws its inspiration from [`Object.observe()`](https://arv.github.io/ecmascript-object-observe) and JavaScript's other reflection APIs like [`Reflect`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect), and features better object interceptability than what's possible with property [setters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/set) and [getters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get).

[Check this project out on GitHub](https://github.com/web-native/observer).

## Documentation

+ [Installation](/observer/v1/installation.md)
+ [Examples](/observer/v1/examples.md)
+ [API](/observer/v1/api/README.md)

## Issues

To report bugs or request features, please submit an [issue](https://github.com/web-native/observer/issues).

## License

MIT.
