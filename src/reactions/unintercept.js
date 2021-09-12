
/**
 * @imports
 */
import { _isFunction, _isTypeObject, _getType } from '@webqit/util/js/index.js';
import _unproxy from '../actors/unproxy.js';
import Interceptors from '../core/Interceptors.js';

/**
 * Removes traps from an target's firebase.
 *
 * @param array|object				target
 * @param object					trap
 * @param object					params
 *
 * @return void
 */
export default function(target, trap = null, params = {}) {
	target = _unproxy(target);
	if (!target || !_isTypeObject(target)) {
		throw new Error('Object must be of type target; "' + _getType(target) + '" given!');
	}
	var interceptors = Interceptors.getFirebase(target, false, params.namespace);
	if (!_isObject(trap)) {
		// Backwards compatibility
		if (_isFunction(trap)) {
			trap = { [null]: trap };
		} else if (_isFunction(params)) {
			trap = { [trap]: params };
			params = arguments.length > 3 ? arguments[3] : {};
		}
		isOriginallyObj = false;
	}
	if (interceptors = Interceptors.getFirebase(target, false, params.namespace)) {
		Object.keys(trap).forEach(filter => {
			if (!_isFunction(trap[filter])) {
				throw new Error('Callback' + (filter === null ? '' : ' for ' + filter) + ' must be a function; "' + _getType(trap[filter]) + '" given!');
			}
			var dfn = { filter, originalHandler: trap[filter], params };
			return interceptors.removeMatches(dfn);
		});
	}
}
