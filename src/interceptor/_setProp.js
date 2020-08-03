
/**
 * @imports
 */
import _arrFrom from '@web-native-js/commons/arr/from.js';
import _isString from '@web-native-js/commons/js/isString.js';
import _isArray from '@web-native-js/commons/js/isArray.js';
import _isNumber from '@web-native-js/commons/js/isNumber.js';
import _isObject from '@web-native-js/commons/js/isObject.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import getObservers from '../observer/getObservers.js';
import build from '../observer/build.js';
import unlink from '../observer/unlink.js';
import link from '../observer/link.js';
import getInterceptors from './getInterceptors.js';
import _has from './has.js';
import _get from './get.js';

/**
 * Executes a "_setProp" type of operation on a subject.
 * Fires any observers for the specific type that may be bound to subject.
 *
 * @param bool			define
 * @param array|object	subject
 * @param string|array	keysOrPayload
 * @param mixed			value
 * @param any			detail
 *
 * @return bool
 */
export default function(define, subject, keysOrPayload, value = null, detail = null) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	if (_isObject(keysOrPayload)) {
		detail = value;
		value = null;
	}
	// ----------
	var interceptors = getInterceptors(subject, false),
		observers = getObservers(subject, false);
	// ----------
	const handleSet = (key, value, related, detail) => {
		var type = 'set', descriptor;
		if (define) {
			type = 'def';
			descriptor = value || {};
			value = descriptor.value;
		}
		// ---------------------------------
		// The event object
		var e = {
			name:key,
			type,
			value,
			related,
			detail,
		};
		if (_has(subject, key)) {
			e.isUpdate = true;
			e.oldValue = _get(subject, key);
		}
		// ---------------------------------
		// The set operation
		var defaultSet = function(_success) {
			if (!arguments.length) {
				if (descriptor) {
					Object.defineProperty(subject, key, descriptor);
				} else {
					subject[key] = value;
				}
				return true;
			}
			return _success;
		};
		if (interceptors) {
			var eventObject = descriptor 
				? {type:'def', name:key, descriptor, related, detail} 
				: {type:'set', name:key, value, related, detail};
			e.success = interceptors.fire(eventObject, defaultSet);
		} else {
			e.success = defaultSet();
		}
		// ---------------------------------
		if (e.success && e.value !== e.oldValue) {
			// Unobserve outgoing value for bubbling
			if (_isTypeObject(e.oldValue)) {
				unlink(subject, key, e.oldValue);
			}
			// Observe incoming value for bubbling
			if (_isTypeObject(e.value)) {
				link(subject, key, e.value);
				if (observers && observers.build) {
					build(e.value, null, true);
				}
			}
		}
		return e;
	};
	// ---------------------------------
	var keys, events = [];
	if (_isArray(keysOrPayload) || ((_isString(keysOrPayload) || _isNumber(keysOrPayload)) && (keys = _arrFrom(keysOrPayload)))) {
		events = keys.map(key => handleSet(key, value, keys, detail));
	} else if (_isObject(keysOrPayload) && (keys = Object.keys(keysOrPayload))) {
		events = keys.map(key => handleSet(key, keysOrPayload[key], keys, detail));
	}
	var successfulEvents = events.filter(e => e.success);
	// ---------------------------------
	if (observers) {
		observers.fire(successfulEvents);
	}
	return successfulEvents.length > 0;
}
