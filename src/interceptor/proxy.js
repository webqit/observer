
/**
 * @imports
 */
import _isClass from '@webqit/util/js/isClass.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _getType from '@webqit/util/js/getType.js';
import _get from './get.js';
import _set from './set.js';
import _has from './has.js';
import _del from './deleteProperty.js';
import _def from './defineProperty.js';
import _ownKeys from './ownKeys.js';

/**
 * Returns an object as a proxy and binds all instance methods
 * to the proxy instead of the object itself.
 *
 * @param object|array		subject
 *
 * @return Proxy
 */
export default function(subject) {
	if (!_isTypeObject(subject)) {
		throw new Error('Object must be of type subject; "' + _getType(subject) + '" given!');
    }
    var proxy = new Proxy(subject, {
        get: (subject, key) => {
            var val = _get(subject, key);
            if (_isFunction(val) && !_isClass(val)) {
                return val.bind(proxy);
            }
            return val;
        },
        set:  (...args) => {_set(...args); return true},
        has: _has,
        deleteProperty: (...args) => {_del(...args); return true},
        defineProperty: (...args) => {_def(...args); return true},
        ownKeys: _ownKeys,
    });
	return proxy;
}
