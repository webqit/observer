
/**
 * @imports
 */
import _arrFrom from '@webqit/util/arr/from.js';
import _isString from '@webqit/util/js/isString.js';
import _isArray from '@webqit/util/js/isArray.js';
import _isNumber from '@webqit/util/js/isNumber.js';
import _isObject from '@webqit/util/js/isObject.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import Interceptors from '../core/Interceptors.js';
import Observers from '../core/Observers.js';
import Event from '../core/Event.js';
import build, { isUserObject } from '../hierarchy/build.js';
import unlink from '../hierarchy/unlink.js';
import link from '../hierarchy/link.js';
import _has from './has.js';
import _get from './get.js';
import _unproxy from './unproxy.js';

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
	subject = _unproxy(subject);
	var interceptors = Interceptors.getFirebase(subject, false, params.namespace),
		observers = Observers.getFirebase(subject, false, params.namespace);
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
		if (_has(subject, key, params)) {
			isUpdate = true;
			oldValue = _get(subject, key, params);
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
			var responseObject = descriptor 
				? {type:'def', name:key, descriptor, related, detail, isUpdate, oldValue} 
				: {type:'set', name:key, value, related, detail, isUpdate, oldValue};
			e.success = interceptors.fire(responseObject, defaultSet);
		} else {
			e.success = defaultSet();
		}
		// ---------------------------------
		if (e.success && e.value !== e.oldValue) {
			// Unobserve outgoing value for bubbling
			if (_isTypeObject(e.oldValue)) {
				unlink(subject, key, e.oldValue, null, params);
			}
			// Observe incoming value for bubbling
			if (_isTypeObject(e.value)) {
				link(subject, key, e.value, null, params);
				if (observers && (observers.subBuild || (observers.build && isUserObject(e.value)))) {
					build(e.value, observers.subBuild, observers.build, params.namespace);
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
		evt = observers.fire(successfulEvents, params.cancellable);
		evt.successCount = successfulEvents.length;
	} else if (params.responseObject) {
		evt = new Event(subject);
	}
	return params.responseObject ? evt : successfulEvents.length > 0;
}
