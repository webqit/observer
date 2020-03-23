
/**
 * @imports
 */
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import QueryEvent from './internal/QueryEvent.js';
import TrapBase from './internal/TrapBase.js';

/**
 * Runs an "in" query operation on a target.
 * Fires any such query observers that may be bound to target.
 *
 * @param array|object	target
 * @param string		key
 *
 * @return bool
 */
export default function(target, key) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	// ---------------------------------
	// Execute any "has" traps, otherwise "test" the default way
	var trapBase, defaultHas = function(_state) {
		return arguments.length ? _state : (key in target);
	};
	if (trapBase = TrapBase.getForTarget(target)) {
		return trapBase.fire(new QueryEvent(target, {type:'has', query:key}), defaultHas);
	}
	return defaultHas();
}
