
/**
 * @imports
 */
import _arrFrom from '@webqit/util/arr/from.js';
import _get from './get.js';
import _set from './set.js';

/**
 * Initializes "Reflxive getter/setter" traps on the subject.
 *
 * @param array|object	subject
 * @param string|array	keys
 * @param object		params
 *
 * @return void
 */
export default function(subject, keys, params = {}) {
	var initializedProps, initPropsKey = Symbol.for('.observer.init.props');
	if (!(initializedProps = subject[initPropsKey])) {
		initializedProps = [];
		Object.defineProperty(subject, initPropsKey, {value: initializedProps, enumerable: false});
	}
	_arrFrom(keys).forEach(key => {
		if (initializedProps.includes(key)) {
			return;
		}
		initializedProps.push(key);
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
			var _value = _get(subject, key, params);
			onGetFire = false;
			return _value;
		};
		currentDescriptor.set = newValue => {
			if (onSetFire) {
				value = newValue;
				return true;
			}
			onSetFire = true;
			var rspns = _set(subject, key, newValue, params);
			onSetFire = false;
			return true;
		};
		Object.defineProperty(subject, key, currentDescriptor);
	});
}
