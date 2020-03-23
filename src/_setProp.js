
/**
 * @imports
 */
import _arrFrom from '@web-native-js/commons/arr/from.js';
import _all from '@web-native-js/commons/arr/all.js';
import _isString from '@web-native-js/commons/js/isString.js';
import _isArray from '@web-native-js/commons/js/isArray.js';
import _isNumber from '@web-native-js/commons/js/isNumber.js';
import _isObject from '@web-native-js/commons/js/isObject.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import MutationEvent from './internal/MutationEvent.js';
import QueryEvent from './internal/QueryEvent.js';
import ObserverBase from './internal/ObserverBase.js';
import TrapBase from './internal/TrapBase.js';
import unlink from './unlink.js';
import link from './link.js';
import reflexHas from './has.js';

/**
 * Executes a "_setProp" type of operation on a target.
 * Fires any observers for the specific type that may be bound to target.
 *
 * @param bool			define
 * @param array|object	target
 * @param string|array	keysOrPayload
 * @param mixed			value
 * @param bool			returnEvent
 *
 * @return bool|Event
 */
export default function(define, target, keysOrPayload, value = null, returnEvent = false) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	if (_isObject(keysOrPayload)) {
		returnEvent = value;
	}
	var keys = keysOrPayload, _data = {}, data = {}, created = [];
	var handleSet = (key, value, related) => {
		_data[key] = target[key];
		if (!reflexHas(target, key)) {
			created.push(key);
		}
		// ---------------------------------
		var descriptor;
		if (define) {
			descriptor = value || {};
			value = descriptor.value;
		}
		// Execute any "set" traps, otherwise "set" the default way
		var success, trapBase, defaultSet = function(_success) {
			if (!arguments.length) {
				if (descriptor) {
					Object.defineProperty(target, key, descriptor);
				} else {
					target[key] = value;
				}
				return true;
			}
			return _success;
		};
		if (trapBase = TrapBase.getForTarget(target)) {
			var details = descriptor 
				? {type:'def', query:key, descriptor, related} 
				: {type:'set', query:key, value, related};
			success = trapBase.fire(new QueryEvent(target, details), defaultSet);
		} else {
			success = defaultSet();
		}
		// ---------------------------------
		if (success) {
			data[key] = value;
			if (data[key] !== _data[key]) {
				// Unobserve outgoing value for bubbling
				if (_data[key] && _isTypeObject(_data[key])) {
					unlink(target, key, _data[key]);
				}
				// Observe incoming value for bubbling
				if (data[key] && _isTypeObject(data[key])) {
					link(target, key, data[key]);
				}
			} else {
				delete data[key];
				delete _data[key];
			}
		} else {
			delete _data[key];
		}
		return success;
	};
	// ---------------------------------
	var successStates = [];
	if (_isArray(keys) || ((_isString(keys) || _isNumber(keys)) && (keys = _arrFrom(keys)))) {
		successStates = keys.map(key => handleSet(key, value, keys))
	} else if (_isObject(keysOrPayload)) {
		var payloadKeys = Object.keys(keysOrPayload);
		successStates = payloadKeys.map(key => handleSet(key, keysOrPayload[key], payloadKeys))
	}
	// ---------------------------------
	var evt, mutationBase;
	if ((mutationBase = ObserverBase.getForTarget(target)) || returnEvent) {
		evt = new MutationEvent(target, {type:'set', data, _data, created});
		if (mutationBase) {
			mutationBase.fire(evt);
		}
	}
	return returnEvent ? evt : _all(successStates, state => state);
}
