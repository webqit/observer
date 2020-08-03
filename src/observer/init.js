
/**
 * @imports
 */
import _arrFrom from '@web-native-js/commons/arr/from.js';
import _get from '../interceptor/get.js';
import _set from '../interceptor/set.js';

/**
 * Initializes "Reflxive getter/setter" traps on the subject.
 *
 * @param array|object	subject
 * @param string|array	keys
 *
 * @return void
 */
export default function(subject, keys) {
	_arrFrom(keys).forEach(key => {
		var value = subject[key], onGetFire, onSetFire;
		var currentDescriptor = Object.getOwnPropertyDescriptor(subject, key)
		|| {enumerable: key in subject ? false/*existing but hidden*/ : true};
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
			var _value = _get(subject, key);
			onGetFire = false;
			return _value;
		};
		currentDescriptor.set = newValue => {
			if (onSetFire) {
				value = newValue;
				return true;
			}
			onSetFire = true;
			var rspns = _set(subject, key, newValue);
			onSetFire = false;
			return true;
		};
		Object.defineProperty(subject, key, currentDescriptor);
	});
}
