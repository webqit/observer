
/**
 * @imports
 */
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import { _isTypeObject, _internals } from '@webqit/util/js/index.js';
import Interceptors from '../core/Interceptors.js';
import Observers from '../core/Observers.js';
import Event from '../core/Event.js';
import unlink from '../connectors/unlink.js';
import _unproxy from '../actors/unproxy.js';
import _has from './has.js';
import _get from './get.js';

/**
 * Executes a "deleteProperty" operation on a target.
 * Fires any observers that may be bound to target.
 *
 * @param array|object	target
 * @param string|array	keys
 * @param object		params
 *
 * @return Event
 */
export default function(target, keys, params = {}) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	target = _unproxy(target);
	var _keys = _arrFrom(keys);
	var events = _keys.map(key => {
		// ---------------------------------
		// The event object
		var oldValue;
		if (_has(target, key, params)) {
			oldValue = _get(target, key, null, params);
		}
		var e = {
			name: key,
			type: 'deleteProperty',
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
			if (_internals(target, 'accessorizedProps', false).has(key)
			&& !_internals(target, 'accessorizedProps').get(key).restore()) {
				return false;
			}
			delete target[key];
			return true;
		};
		if (interceptors = Interceptors.getFirebase(target, false, params.namespace)) {
			e.success = interceptors.fire({type: 'deleteProperty', name:key, oldValue, related: _keys}, defaultDel);
		} else {
			e.success = defaultDel();
		}
		// ---------------------------------
		// Unobserve outgoing value for bubbling
		if (e.success && _isTypeObject(e.oldValue)) {
			unlink(target, key, e.oldValue, null, params);
		}
		return e;
	});
	var successfulEvents = events.filter(e => e.success !== false);
	// ---------------------------------
	var observers, evt;
	if (observers = Observers.getFirebase(target, false, params.namespace)) {
		evt = observers.fire(successfulEvents, params.cancellable);
		evt.successCount = successfulEvents.length;
	} else if (params.eventTypeReturn) {
		evt = new Event(target);
	}
	return params.eventTypeReturn ? evt : successfulEvents.length > 0;
}
