
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
		const getDescriptorDeep = () => {
			var descriptor, proto = subject;
			while (!descriptor && (proto = Object.getPrototypeOf(proto))) {
				descriptor = Object.getOwnPropertyDescriptor(proto, key);
			}
			return descriptor;
		};
		// ----------
		var originalOwnDescriptor = Object.getOwnPropertyDescriptor(subject, key),
			altOriginalOwnDescriptor,
			activeIsAltOriginalOwnDescriptor;
		if (!originalOwnDescriptor) {
			// Not an own property
			// and maybe not even defined at all in the prototype chain
			altOriginalOwnDescriptor = {
				writable: true,
				enumerable: key in subject ? false/* existing but inherited*/ : true,
				configurable: params.configurable !== false,
			};
		}
		// ----------
		var reactiveOwnDescriptor = { ...(originalOwnDescriptor || altOriginalOwnDescriptor) };
		if ('value' in reactiveOwnDescriptor) {
			delete reactiveOwnDescriptor.value;
		}
		if ('writable' in reactiveOwnDescriptor) {
			delete reactiveOwnDescriptor.writable;
		}
		// ----------
		reactiveOwnDescriptor.get = () => {
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
		reactiveOwnDescriptor.set = newValue => {
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
			get: function() {
				// ---------------------
				var descriptor = originalOwnDescriptor;
				if (!descriptor) {
					if (activeIsAltOriginalOwnDescriptor) {
						// Already switched to altOriginalOwnDescriptor
						descriptor = altOriginalOwnDescriptor;
					} else {
						// getDescriptorDeep() or altOriginalOwnDescriptor
						descriptor = getDescriptorDeep() || altOriginalOwnDescriptor;
					}
				}
				// ---------------------
				return descriptor.get ? descriptor.get.call(subject) : descriptor.value;
			},
			set: function(value) {
				// ---------------------
				var descriptor = originalOwnDescriptor;
				if (!descriptor) {
					if (activeIsAltOriginalOwnDescriptor) {
						// Already switched to altOriginalOwnDescriptor
						descriptor = altOriginalOwnDescriptor;
					} else if (descriptor = getDescriptorDeep()) {
						if (('value' in descriptor)) {
							// Deep is data property.
							// We should rather switch to altOriginalOwnDescriptor
							descriptor = altOriginalOwnDescriptor;
							activeIsAltOriginalOwnDescriptor = true;
						}
					} else {
						// Not yet switched to altOriginalOwnDescriptor
						// and no getDescriptorDeep()
						descriptor = altOriginalOwnDescriptor;
						activeIsAltOriginalOwnDescriptor = true;
					}
				}
				// ---------------------
				if (descriptor.set || descriptor.get) {
					if (!descriptor.set) {
						return false;
					}
					// Can sometimes return undefined
					return descriptor.set.call(subject, value);
				}
				descriptor.value = value;
				return true;
			},
			restore: function() {
				try {
					if (this.intact()) {
						if (originalOwnDescriptor || activeIsAltOriginalOwnDescriptor /* switched */) {
							Object.defineProperty(subject, key, originalOwnDescriptor || altOriginalOwnDescriptor /* switch target */);
						} else {
							delete subject[key];
						}
						_internals(subject, 'accessorizedProps').delete(key);
					}
					return true;
				} catch(e) {}
				return false;
			},
			intact: function() {
				return (Object.getOwnPropertyDescriptor(subject, key) || {}).get === reactiveOwnDescriptor.get;
			},
			touch: function(attemptRestore = false) {
				// If intact, or not intact but not restorable, return true - "valid"
				return this.intact() || (attemptRestore ? !this.restore() : false);
			},
		}
		// ----------
		try {
			Object.defineProperty(subject, key, reactiveOwnDescriptor);
			_internals(subject, 'accessorizedProps').set(key, controlObject);
			return true;
		} catch(e) {}
		return false;
	});
	return _isArray(keys) ? successFlags : successFlags[0];
}
