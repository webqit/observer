
/**
 * @imports
 */
import {
    _isClass, _isFunction, _isTypeObject,
    _getType, _internals,
} from '@webqit/util/js/index.js';
import _del from '../actions/deleteProperty.js';
import _def from '../actions/defineProperty.js';
import _ownKeys from '../actions/ownKeys.js';
import _get from '../actions/get.js';
import _set from '../actions/set.js';
import _has from '../actions/has.js';

/**
 * Returns an object as a proxy and binds all instance methods
 * to the proxy instead of the object itself.
 *
 * @param object|array		subject
 * @param object		    params
 *
 * @return Proxy
 */
export default function(subject, params = {}) {
	if (!_isTypeObject(subject)) {
		throw new Error('Object must be of type subject; "' + _getType(subject) + '" given!');
    }
    var proxy = new Proxy(subject, {
        get: (subject, key) => {
            var val = _get(subject, key, params);
            if (params.proxyAutoBinding !== false && _isFunction(val) && !_isClass(val)) {
                return val.bind(proxy);
            }
            return val;
        },
        set:  (...args) => {_set(...args.concat(params)); return true},
        has: (...args) => _has(...args.concat(params)),
        deleteProperty: (...args) => {_del(...args.concat(params)); return true},
        defineProperty: (...args) => {_def(...args.concat(params)); return true},
        ownKeys: (...args) => _ownKeys(...args.concat(params)),
    });
    _internals(proxy).set(proxy, subject);
	return proxy;
}
