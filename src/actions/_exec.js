
/**
 * @imports
 */
import { _isTypeObject } from '@webqit/util/js/index.js';
import Interceptors from '../core/Interceptors.js';
import _unproxy from '../actors/unproxy.js';

/**
 * Runs a Reflect operation of the specified type.
 *
 * @param string		type
 * @param array|object	target
 * @param object		payload
 * @param object		params
 *
 * @return array
 */
export default function(type, target, payload = {}, params = {}) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	target = _unproxy(target);
	// ---------------------------------
	// Execute any "keys" traps, otherwise "test" the default way
	var interceptors, defaultHandler = function(_val) {
		return arguments.length ? _val : Reflect[type](target, ...Object.values(payload));
	};
	if (interceptors = Interceptors.getFirebase(target, false, params.namespace)) {
		return interceptors.fire({ type, ...payload }, defaultHandler);
	}
	return defaultHandler();
}
