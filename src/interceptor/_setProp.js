
/**
 * @imports
 */
import _arrFrom from '@webqit/util/arr/from.js';
import _isString from '@webqit/util/js/isString.js';
import _isArray from '@webqit/util/js/isArray.js';
import _isNumber from '@webqit/util/js/isNumber.js';
import _isObject from '@webqit/util/js/isObject.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import getObservers from '../observer/getObservers.js';
import build from '../observer/build.js';
import unlink from '../observer/unlink.js';
import link from '../observer/link.js';
import Event from '../observer/Event.js';
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
 * @param Object		params
 *
 * @return Event
 */
export default function(define, subject, keysOrPayload, value = null, params = {}) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	if (_isObject(keysOrPayload)) {
		params = value || {};
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
		var isUpdate = false, oldValue;
		if (_has(subject, key)) {
			isUpdate = true;
			oldValue = _get(subject, key);
		}
		var e = {
			name:key,
			type,
			value,
			related,
			detail,
			isUpdate,
			oldValue,
		};
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
				? {type:'def', name:key, descriptor, related, detail, isUpdate, oldValue} 
				: {type:'set', name:key, value, related, detail, isUpdate, oldValue};
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
				if (observers && (observers.subBuild || observers.build)) {
					build(e.value, observers.subBuild, observers.build);
				}
			}
		}
		return e;
	};
	// ---------------------------------
	var keys, events = [];
	if (_isArray(keysOrPayload) || ((_isString(keysOrPayload) || _isNumber(keysOrPayload)) && (keys = _arrFrom(keysOrPayload)))) {
		events = keys.map(key => handleSet(key, value, keys, params.detail));
	} else if (_isObject(keysOrPayload) && (keys = Object.keys(keysOrPayload))) {
		events = keys.map(key => handleSet(key, keysOrPayload[key], keys, params.detail));
	}
	var successfulEvents = events.filter(e => e.success);
	// ---------------------------------
	var evt;
	if (observers) {
		evt = observers.fire(successfulEvents);
		evt.successCount = successfulEvents.length;
	} else if (params.eventObject) {
		evt = new Event(subject);
	}
	return params.eventObject ? evt : successfulEvents.length > 0;
}
