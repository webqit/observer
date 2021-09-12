
/**
 * @imports
 */
import { _isArray, _isObject, _internals } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';

/**
 * Removes previously initialized "Reflxive getter/setter" traps from the target.
 *
 * @param array|object	target
 * @param string|array	keys
 * @param object		params
 *
 * @return bool|array
 */
export default function(target, keys = [], params = {}) {
	params = _isObject(keys) ? keys : params;
	var successFlags = (arguments.length === 1 ? Object.keys(target) : _arrFrom(keys)).map(key => {
		if (_internals(target, 'accessorizedProps', false).has(key)) {
			return _internals(target, 'accessorizedProps').get(key).restore();
		}
		return true;
	});
	return _isArray(keys) ? successFlags : successFlags[0];
}
