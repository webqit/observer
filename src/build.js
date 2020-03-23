
/**
 * @imports
 */
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import init from './init.js';
import reflexKeys from './keys.js';
import reflexGet from './get.js';
import link from './link.js';

/**
 * Recursively "connects" an object's members to the object
 * for reflex actions.
 *
 * @param array|object	target
 * @param bool			_init
 *
 * @return void
 */
export default function build(target, _init = false) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	// ---------------------------------
	var keys = reflexKeys(target);
	keys.forEach(key => {
		var value = reflexGet(target, key);
		if (_isTypeObject(value) && value) {
			link(target, key, value);
			build(value, _init);
		}
	});
	if (_init) {
		init(target, keys);
	}
}
