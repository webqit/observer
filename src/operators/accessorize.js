
/**
 * @imports
 */
import _isArray from '@webqit/util/js/isArray.js';
import _arrFrom from '@webqit/util/arr/from.js';
import _internals from '@webqit/util/js/internals.js';
import _get from './get.js';
import _set from './set.js';

/**
 * Initializes "Reflxive getter/setter" traps on the subject.
 *
 * @param array|object	subject
 * @param string|array	keys
 * @param object		params
 *
 * @return bool|array
 */
export default function(subject, keys = [], params = {}) {
	var successFlags = (arguments.length === 1 ? Object.keys(subject) : _arrFrom(keys)).map(key => {
		if (_internals(subject, 'accessorizedProps').has(key) && _internals(subject, 'accessorizedProps').get(key).touch(true)) {
			return false;
		}
		// ----------
		var currentDescriptor = Object.getOwnPropertyDescriptor(subject, key) || {
			enumerable: key in subject ? false/*existing but hidden*/ : true,
			configurable: params.configurable !== false,
		};
		if ('value' in currentDescriptor) {
			delete currentDescriptor.value;
		}
		if ('writable' in currentDescriptor) {
			delete currentDescriptor.writable;
		}
		// ----------
		currentDescriptor.get = () => {
			// _get() will return here
			// but to call _internals(subject, 'accessorizedProps').get(key).get();
			return _get(subject, key, params);
		};
		currentDescriptor.set = newValue => {
			// _set() will return here
			// but to call _internals(subject, 'accessorizedProps').get(key).set();
			return _set(subject, key, newValue, params);
		};
		// ----------
		try {
			const startingValue = subject[key];
			Object.defineProperty(subject, key, currentDescriptor);
			_internals(subject, 'accessorizedProps').set(key, {
				value: startingValue,
				read: function() { return this.value; },
				write: function(value) { this.value = value; return true; },
				restore: function() {
					try {
						if (this.intact()) {
							delete subject[key];
							subject[key] = this.value;
							_internals(subject, 'accessorizedProps').delete(key);
						}
						return true;
					} catch(e) {}
					return false;
				},
				intact: function() {
					return (Object.getOwnPropertyDescriptor(subject, key) || {}).get === currentDescriptor.get;
				},
				touch: function(attemptRestore = false) {
					// If intact, or not intact but not restorable, return true - "valid"
					return this.intact() || (attemptRestore ? !this.restore() : false);
				},
			});
			return true;
		} catch(e) {}
		return false;
	});
	return _isArray(keys) ? successFlags : successFlags[0];
}
