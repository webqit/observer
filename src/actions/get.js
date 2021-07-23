
/**
 * @imports
 */
import {
	_isArray, _isNumeric, _isClass,
	_isFunction, _isTypeObject, _internals
} from '@webqit/util/js/index.js';
import { _from as _objFrom } from '@webqit/util/obj/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import Interceptors from '../core/Interceptors.js';
import _unproxy from '../actors/unproxy.js';

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
