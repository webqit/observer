
/**
 * @imports
 */
import _objFrom from '@web-native-js/commons/obj/from.js';
import _isArray from '@web-native-js/commons/js/isArray.js';
import _isNumeric from '@web-native-js/commons/js/isNumeric.js';
import _isFunction from '@web-native-js/commons/js/isFunction.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import QueryEvent from './internal/QueryEvent.js';
import TrapBase from './internal/TrapBase.js';
import transaction from './transaction.js';

/**
 * Runs a "get" query operation on a target.
 * Fires any such query observers that may be bound to target.
 *
 * @param array|object	target
 * @param string|array	keys
 *
 * @return mixed
 */
export default function(target, keys) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	// ---------------------------------
	// Execute any "get" traps, otherwise "get" the default way
	var value, trapBase, defaultGet = function(_value) {
		return arguments.length ? _value : (_isArray(keys) ? _objFrom(keys, target) : target[keys]);
	};
	if (trapBase = TrapBase.getForTarget(target)) {
		value = trapBase.fire(new QueryEvent(target, {type:'get', query:keys}), defaultGet);
	} else {
		value = defaultGet();
	}
	// ---------------------------------
	// Execute array methods in "mutation" mode
	if (_isArray(target) && !_isNumeric(keys) && _isFunction(value)) {
		return function reflexArrayMethodWrapper(...args) {
			return transaction([target], () => {
				return value.apply(target, args);
			});
		};
	}
	return value;
}
