
/**
 * @imports
 */
import _isClass from '@onephrase/util/js/isClass.js';
import _isFunction from '@onephrase/util/js/isFunction.js';
import _isTypeObject from '@onephrase/util/js/isTypeObject.js';
import _getType from '@onephrase/util/js/getType.js';
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
        set:  _set,
        has: _has,
        deleteProperty: _del,
        defineProperty: _def,
        ownKeys: _ownKeys,
    });
	return proxy;
}
