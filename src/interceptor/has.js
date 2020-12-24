
/**
 * @imports
 */
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import getInterceptors from './getInterceptors.js';
import _unproxy from './unproxy.js';

/**
 * Runs an "in" query operation on a subject.
 * Fires any such query observers that may be bound to subject.
 *
 * @param array|object	subject
 * @param string		key
 *
 * @return bool
 */
export default function(subject, key) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	subject = _unproxy(subject);
	// ---------------------------------
	// Execute any "has" traps, otherwise "test" the default way
	var interceptors, defaultHas = function(_state) {
		return arguments.length ? _state : (key in subject);
	};
	if (interceptors = getInterceptors(subject, false)) {
		return interceptors.fire({type:'has', name:key}, defaultHas);
	}
	return defaultHas();
}
