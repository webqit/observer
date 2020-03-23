
/**
 * @imports
 */
import _arrFrom from '@web-native-js/commons/arr/from.js';
import reflexGet from './get.js';
import reflexSet from './set.js';

/**
 * Initializes "Reflxive getter/setter" traps on the target.
 *
 * @param array|object	target
 * @param string|array	keys
 *
 * @return void
 */
export default function(target, keys) {
	_arrFrom(keys).forEach(key => {
		var value = target[key], onGetFire, onSetFire;
		var currentDescriptor = Object.getOwnPropertyDescriptor(target, key)
		|| {enumerable: key in target ? false/*existing but hidden*/ : true};
		if ('value' in currentDescriptor) {
			delete currentDescriptor.value;
		}
		if ('writable' in currentDescriptor) {
			delete currentDescriptor.writable;
		}
		currentDescriptor.get = () => {
			if (onGetFire) {
				return value;
			}
			onGetFire = true;
			var _value = reflexGet(target, key);
			onGetFire = false;
			return _value;
		};
		currentDescriptor.set = newValue => {
			if (onSetFire) {
				value = newValue;
				return true;
			}
			onSetFire = true;
			var rspns = reflexSet(target, key, newValue);
			onSetFire = false;
			return true;
		};
		Object.defineProperty(target, key, currentDescriptor);
	});
}
