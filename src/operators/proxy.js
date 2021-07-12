
/**
 * @imports
 */
import _isClass from '@webqit/util/js/isClass.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _getType from '@webqit/util/js/getType.js';
import _del from './deleteProperty.js';
import _def from './defineProperty.js';
import _ownKeys from './ownKeys.js';
import _get from './get.js';
import _set from './set.js';
import _has from './has.js';

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
            if (key === Symbol.for('.observer.proxy.target')) {
                return () => subject;
            }
            var val = _get(subject, key, params);
            if (!params.autoBindAccessorizedMethods && _isFunction(val) && !_isClass(val)) {
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
	return proxy;
}
