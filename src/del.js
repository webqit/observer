
/**
 * @imports
 */
import _arrFrom from '@web-native-js/commons/arr/from.js';
import _all from '@web-native-js/commons/arr/all.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import MutationEvent from './internal/MutationEvent.js';
import QueryEvent from './internal/QueryEvent.js';
import ObserverBase from './internal/ObserverBase.js';
import TrapBase from './internal/TrapBase.js';
import unlink from './unlink.js';
import reflexHas from './has.js';

/**
 * Executes a "delete" operation on a target.
 * Fires any observers that may be bound to target.
 *
 * @param array|object	target
 * @param string|array	keys
 * @param bool			returnEvent
 *
 * @return bool|Event
 */
export default function(target, keys, returnEvent = false) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	var keys = _arrFrom(keys), _data = {}, data = {}, deleted = [];
	var successStates = keys.map(key => {
		_data[key] = target[key];
		if (reflexHas(target, key)) {
			deleted.push(key);
		}
		// ---------------------------------
		// Execute any "del" traps, otherwise "del" the default way
		var success, trapBase, defaultDel = function(_success) {
			if (!arguments.length) {
				delete target[key];
				return true;
			}
			return _success;
		};
		if (trapBase = TrapBase.getForTarget(target)) {
			success = trapBase.fire(new QueryEvent(target, {type:'del', query:key, related:keys}), defaultDel);
		} else {
			success = defaultDel();
		}
		// ---------------------------------
		if (success) {
			data[key] = undefined;
			// Unobserve outgoing value for bubbling
			if (_data[key] && _isTypeObject(_data[key])) {
				unlink(target, key, _data[key]);
			}
		}
		return success;
	});
	// ---------------------------------
	var evt, mutationBase;
	if ((mutationBase = ObserverBase.getForTarget(target)) || returnEvent) {
		evt = new MutationEvent(target, {type:'del', data, _data, deleted});
		if (mutationBase && Object.keys(data).length) {
			mutationBase.fire(evt);
		}
	}
	return returnEvent ? evt : _all(successStates, state => state);
}
