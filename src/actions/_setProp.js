
/**
 * @imports
 */
import {
	_isObject, _isTypeObject, _internals,
	_isNumber, _isArray, _isString
} from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import build, { isUserObject } from '../connectors/build.js';
import Interceptors from '../core/Interceptors.js';
import Observers from '../core/Observers.js';
import Event from '../core/Event.js';
import unlink from '../connectors/unlink.js';
import link from '../connectors/link.js';
import _unproxy from '../actors/unproxy.js';
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
	subject = _unproxy(subject);
	var interceptors = Interceptors.getFirebase(subject, false, params.namespace),
		observers = Observers.getFirebase(subject, false, params.namespace);
	// ----------
	const handleSet = (key, value, related, detail) => {
		var type = 'set', descriptor;
		if (define) {
			type = 'definition';
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
			if (arguments.length) {
				if (descriptor) {
					descriptor = _success;
				} else {
					value = _success;
				}
			}
			if (descriptor) {
				if (_internals(subject, 'accessorizedProps', false).has(key)
				&& !_internals(subject, 'accessorizedProps').get(key).restore()) {
					return false;
				}
				Object.defineProperty(subject, key, descriptor);
			} else if (_internals(subject, 'accessorizedProps', false).has(key)) {
				return _internals(subject, 'accessorizedProps').get(key).write(value);
			}
			subject[key] = value;
			return true;
		};
		if (interceptors) {
			var eventObject = descriptor 
				? {type: 'defineProperty', name:key, descriptor, related, detail, isUpdate, oldValue} 
				: {type: 'set', name:key, value, related, detail, isUpdate, oldValue};
			e.success = interceptors.fire(eventObject, defaultSet);
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
	} else if (params.eventTypeReturn) {
		evt = new Event(subject);
	}
	return params.eventTypeReturn ? evt : successfulEvents.length > 0;
}
