
/**
 * @imports
 */
import _arrFrom from '@webqit/util/arr/from.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _internals from '@webqit/util/js/internals.js';
import Interceptors from '../core/Interceptors.js';
import Observers from '../core/Observers.js';
import Event from '../core/Event.js';
import unlink from '../hierarchy/unlink.js';
import _has from './has.js';
import _get from './get.js';
import _unproxy from './unproxy.js';

/**
 * Executes a "delete" operation on a subject.
 * Fires any observers that may be bound to subject.
 *
 * @param array|object	subject
 * @param string|array	keys
 * @param object		params
 *
 * @return Event
 */
export default function(subject, keys, params = {}) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	subject = _unproxy(subject);
	var _keys = _arrFrom(keys);
	var events = _keys.map(key => {
		// ---------------------------------
		// The event object
		var oldValue;
		if (_has(subject, key, params)) {
			oldValue = _get(subject, key, params);
		}
		var e = {
			name:key,
			type:'del',
			related: _keys,
			detail: params.detail,
			oldValue,
		};
		// ---------------------------------
		// Execute any "del" traps, otherwise "del" the default way
		var interceptors, defaultDel = function(_success) {
			if (arguments.length) {
				return _success;
			}
			if (_internals(subject, 'accessorizedProps', false).has(key)
			&& !_internals(subject, 'accessorizedProps').get(key).restore()) {
				return false;
			}
			delete subject[key];
			return true;
		};
		if (interceptors = Interceptors.getFirebase(subject, false, params.namespace)) {
			e.success = interceptors.fire({type:'del', name:key, oldValue, related: _keys}, defaultDel);
		} else {
			e.success = defaultDel();
		}
		// ---------------------------------
		// Unobserve outgoing value for bubbling
		if (e.success && _isTypeObject(e.oldValue)) {
			unlink(subject, key, e.oldValue, null, params);
		}
		return e;
	});
	var successfulEvents = events.filter(e => e.success);
	// ---------------------------------
	var observers, evt;
	if (observers = Observers.getFirebase(subject, false, params.namespace)) {
		evt = observers.fire(successfulEvents, params.cancellable);
		evt.successCount = successfulEvents.length;
	} else if (params.responseObject) {
		evt = new Event(subject);
	}
	return params.responseObject ? evt : successfulEvents.length > 0;
}
