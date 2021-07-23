
/**
 * @imports
 */
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import Interceptors from '../core/Interceptors.js';
import _unproxy from './unproxy.js';

/**
 * Runs an "in" query operation on a subject.
 * Fires any such query observers that may be bound to subject.
 *
 * @param array|object	subject
 * @param string		key
 * @param object		params
 *
 * @return bool
 */
export default function(subject, key, params = {}) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	subject = _unproxy(subject);
	// ---------------------------------
	// Execute any "has" traps, otherwise "test" the default way
	var interceptors, defaultHas = function(_state) {
		return arguments.length ? _state : (key in subject);
	};
	if (interceptors = Interceptors.getFirebase(subject, false, params.namespace)) {
		return interceptors.fire({type:'has', name:key}, defaultHas);
	}
	return defaultHas();
}
