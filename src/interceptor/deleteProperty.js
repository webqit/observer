
/**
 * @imports
 */
import _arrFrom from '@web-native-js/commons/arr/from.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import getObservers from '../observer/getObservers.js';
import unlink from '../observer/unlink.js';
import getInterceptors from './getInterceptors.js';
import _has from './has.js';
import _get from './get.js';

/**
 * Executes a "delete" operation on a subject.
 * Fires any observers that may be bound to subject.
 *
 * @param array|object	subject
 * @param string|array	keys
 * @param any			detail
 *
 * @return bool
 */
export default function(subject, keys, detail = null) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	var keys = _arrFrom(keys);
	var events = keys.map(key => {
		if (key.indexOf('.') !== -1) {
			throw new Error('Property names with a dot are not supported!');
		}
		// ---------------------------------
		// The event object
		var e = {
			name:key,
			type:'del',
			related:keys,
			detail,
		};
		if (_has(subject, key)) {
			e.oldValue = _get(subject, key);
		}
		// ---------------------------------
		// Execute any "del" traps, otherwise "del" the default way
		var interceptors, defaultDel = function(_success) {
			if (!arguments.length) {
				delete subject[key];
				return true;
			}
			return _success;
		};
		if (interceptors = getInterceptors(subject, false)) {
			e.success = interceptors.fire({type:'del', name:key, related:keys}, defaultDel);
		} else {
			e.success = defaultDel();
		}
		// ---------------------------------
		// Unobserve outgoing value for bubbling
		if (e.success && _isTypeObject(e.oldValue)) {
			unlink(subject, key, e.oldValue);
		}
		return e;
	});
	var successfulEvents = events.filter(e => e.success);
	// ---------------------------------
	var observers;
	if (observers = getObservers(subject, false)) {
		observers.fire(successfulEvents);
	}
	return successfulEvents.length > 0;
}
