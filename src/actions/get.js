
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
 * Runs a "get" operation on a target.
 * Fires any such query observers that may be bound to target.
 *
 * @param array|object	target
 * @param string|array	keys
 * @param object		receiver
 * @param object		params
 *
 * @return mixed
 */
export default function(target, keys, receiver = null, params = {}) {
	target = receiver || target;
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	target = _unproxy(target);
	// ---------------------------------
	var _keys = _arrFrom(keys);
	var values = _keys.map(key => {
		// Execute any "get" traps, otherwise "get" the default way
		var interceptors, defaultGet = function(_value) {
			if (arguments.length) {
				return _value;
			}
			if (_internals(target, 'accessorizedProps').has(key) && _internals(target, 'accessorizedProps').get(key).touch(true)) {
				return _internals(target, 'accessorizedProps').get(key).get();
			}
			return receiver 
				? Reflect.get(target, key, receiver) 
				: Reflect.get(target, key);
		};
		if (interceptors = Interceptors.getFirebase(target, true, params.namespace)) {
			return interceptors.fire({type:'get', name: key, related: _keys, receiver}, defaultGet);
		}
		return defaultGet();
	});
	// ---------------------------------
	return _isArray(keys) ? values : values[0];
}
