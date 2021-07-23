
/**
 * @imports
 */
import _objFrom from '@webqit/util/obj/from.js';
import _arrFrom from '@webqit/util/arr/from.js';
import _isArray from '@webqit/util/js/isArray.js';
import _isNumeric from '@webqit/util/js/isNumeric.js';
import _isClass from '@webqit/util/js/isClass.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _internals from '@webqit/util/js/internals.js';
import Interceptors from '../core/Interceptors.js';
import _unproxy from './unproxy.js';

/**
 * Runs a "get" query operation on a subject.
 * Fires any such query observers that may be bound to subject.
 *
 * @param array|object	subject
 * @param string|array	keys
 * @param object		params
 *
 * @return mixed
 */
export default function(subject, keys, params = {}) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	subject = _unproxy(subject);
	// ---------------------------------
	var _keys = _arrFrom(keys);
	var values = _keys.map(key => {
		// Execute any "get" traps, otherwise "get" the default way
		var interceptors, defaultGet = function(_value) {
			if (arguments.length) {
				return _value;
			}
			if (_internals(subject, 'accessorizedProps').has(key) && _internals(subject, 'accessorizedProps').get(key).touch(true)) {
				return _internals(subject, 'accessorizedProps').get(key).read();
			}
			return subject[key];
		};
		if (interceptors = Interceptors.getFirebase(subject, true, params.namespace)) {
			return interceptors.fire({type:'get', name: key, related: _keys}, defaultGet);
		}
		return defaultGet();
	});
	// ---------------------------------
	return _isArray() ? values : values[0];
}
