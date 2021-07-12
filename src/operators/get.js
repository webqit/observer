
/**
 * @imports
 */
import _objFrom from '@webqit/util/obj/from.js';
import _isArray from '@webqit/util/js/isArray.js';
import _isNumeric from '@webqit/util/js/isNumeric.js';
import _isClass from '@webqit/util/js/isClass.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import Interceptors from '../core/Interceptors.js';
import closure from '../subscribers/closure.js';
import _unproxy from './unproxy.js';

/**
 * Runs a "get" query operation on a subject.
 * Fires any such query observers that may be bound to subject.
 *
 * @param array|object	subject
 * @param string|array	keys
 * @param object		params
 *
 * @return mixed
 */
export default function(subject, keys, params = {}) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	subject = _unproxy(subject);
	// ---------------------------------
	// Execute any "get" traps, otherwise "get" the default way
	var value, interceptors, defaultGet = function(_value) {
		return arguments.length ? _value : (_isArray(keys) ? _objFrom(keys, subject) : subject[keys]);
	};
	if (interceptors = Interceptors.getFirebase(subject, true, params.namespace)) {
		value = interceptors.fire({type:'get', name:keys}, defaultGet);
	} else {
		value = defaultGet();
	}
	// ---------------------------------
	// Execute array methods in "mutation" mode
	if (params.autoBindAccessorizedMethods && _isArray(subject) && !_isNumeric(keys) && _isFunction(value) && !_isClass(value)) {
		return function observerArrayMethodWrapper(...args) {
			return closure(() => {
				return value.apply(subject, args);
			}, subject);
		};
	}
	return value;
}
