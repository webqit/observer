
/**
 * @imports
 */
import {
    _isClass, _isFunction, _isTypeObject,
    _getType, _internals,
} from '@webqit/util/js/index.js';
import apply from '../actions/apply.js';
import construct from '../actions/construct.js';
import defineProperty from '../actions/defineProperty.js';
import deleteProperty from '../actions/deleteProperty.js';
import get from '../actions/get.js';
import getOwnPropertyDescriptor from '../actions/getOwnPropertyDescriptor.js';
import getPrototypeOf from '../actions/getPrototypeOf.js';
import has from '../actions/has.js';
import isExtensible from '../actions/isExtensible.js';
import ownKeys from '../actions/ownKeys.js';
import preventExtensions from '../actions/preventExtensions.js';
import set from '../actions/set.js';
import setPrototypeOf from '../actions/setPrototypeOf.js';

/**
 * Returns an object as a proxy and binds all instance methods
 * to the proxy instead of the object itself.
 *
 * @param Object|Array		target
 * @param Object		    params
 *
 * @return Proxy
 */
export default function(target, params = {}) {
	if (!_isTypeObject(target)) {
		throw new Error('Object must be of type target; "' + _getType(target) + '" given!');
    }
    var proxy = new Proxy(target, {
        apply:  (target, thisArgument, argumentsList) => apply(target, thisArgument, argumentsList, params),
        construct:  (target, argumentsList, newTarget = null) => construct(target, argumentsList, newTarget, params),
        defineProperty:  (target, propertyKey, attributes) => defineProperty(target, propertyKey, attributes, params),
        deleteProperty: (target, propertyKey) => deleteProperty(target, propertyKey, params),
        get: (target, propertyKey, receiver = null) => {
            var val = get(target, propertyKey, receiver, params);
            if (params.proxyAutoBinding !== false && _isFunction(val) && !_isClass(val)) {
                return val.bind(proxy);
            }
            return val;
        },
        getOwnPropertyDescriptor: (target, propertyKey) => getOwnPropertyDescriptor(target, propertyKey, params),
        getPrototypeOf: target => getPrototypeOf(target, params),
        has: (target, propertyKey) => has(target, propertyKey, params),
        isExtensible: target => isExtensible(target, params),
        ownKeys: target => ownKeys(target, params),
        preventExtensions: target => preventExtensions(target, params),
        set: (target, propertyKey, value, receiver = null) => set(target, propertyKey, value, receiver, params),
        setPrototypeOf: (target, prototype) => setPrototypeOf(target, prototype, params),
    });
    _internals(proxy).set(proxy, target);
	return proxy;
}
