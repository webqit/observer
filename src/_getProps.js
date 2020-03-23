
/**
 * @imports
 */
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import QueryEvent from './internal/QueryEvent.js';
import TrapBase from './internal/TrapBase.js';

/**
 * Runs a "getProps" type of query operation on a target.
 * Fires any observers for the specific type that may be bound to target.
 *
 * @param bool			ownKeys
 * @param array|object	target
 *
 * @return array
 */
export default function(ownKeys, target) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	// ---------------------------------
	// Execute any "keys" traps, otherwise "test" the default way
	var trapBase, defaultKeys = function(_keys) {
		return arguments.length ? _keys : (
			ownKeys ? Object.getOwnPropertyNames(target) : Object.keys(target)
		);
	};
	if (trapBase = TrapBase.getForTarget(target)) {
		return trapBase.fire(new QueryEvent(target, {type:ownKeys ? 'ownKeys' : 'keys'}), defaultKeys);
	}
	return defaultKeys();
}
