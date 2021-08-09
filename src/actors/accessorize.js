
/**
 * @imports
 */
import { _isArray, _internals } from '@webqit/util/js/index.js';
import { _isObject } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import _get from '../actions/get.js';
import _set from '../actions/set.js';

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
	params = _isObject(keys) ? keys : params;
	var successFlags = (arguments.length === 1 ? Object.keys(subject) : _arrFrom(keys)).map(key => {
		if (_internals(subject, 'accessorizedProps').has(key) && _internals(subject, 'accessorizedProps').get(key).touch(true)) {
			return false;
		}
		// ----------
		var originalDescriptor = Object.getOwnPropertyDescriptor(subject, key) || {
			writable: true,
			enumerable: key in subject ? false/* existing but inherited*/ : true,
			configurable: params.configurable !== false,
		};
		// ----------
		var currentDescriptor = { ...originalDescriptor };
		if ('value' in currentDescriptor) {
			delete currentDescriptor.value;
		}
		if ('writable' in currentDescriptor) {
			delete currentDescriptor.writable;
		}
		// ----------
		currentDescriptor.get = () => {
			if (controlObject.ongoingGets.length) {
				// .touch(true)
				return controlObject.get();
			}
			// _get() will return here
			// but to call controlObject.get();
			controlObject.ongoingGets.push(1);
			var value = _get(subject, key, params);
			controlObject.ongoingGets.pop();
			return value;
		};
		var setting;
		currentDescriptor.set = newValue => {
			if (controlObject.ongoingSets.length) {
				return controlObject.set(newValue);
			}
			// _set() will return here
			// but to call controlObject.set();
			controlObject.ongoingSets.push(1);
			var operation = _set(subject, key, newValue, params);
			controlObject.ongoingSets.pop();
			return operation;
		};
		// ----------
		var controlObject = {
			ongoingGets: [],
			ongoingSets: [],
			get: function() { return originalDescriptor.get ? originalDescriptor.get() : originalDescriptor.value; },
			set: function(value) { if (originalDescriptor.set) { return originalDescriptor.set(value); } else { originalDescriptor.value = value; return true; } },
			restore: function() {
				try {
					if (this.intact()) {
						Object.defineProperty(subject, key, originalDescriptor);
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
		}
		// ----------
		try {
			Object.defineProperty(subject, key, currentDescriptor);
			_internals(subject, 'accessorizedProps').set(key, controlObject);
			return true;
		} catch(e) {}
		return false;
	});
	return _isArray(keys) ? successFlags : successFlags[0];
}
