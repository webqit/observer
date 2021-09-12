
/**
 * @imports
 */
import { _isFunction, _isTypeObject, _isObject, _getType } from '@webqit/util/js/index.js';
import _unproxy from '../actors/unproxy.js';
import Interceptors from '../core/Interceptors.js';

/**
 * Adds a trap to an target's firebase.
 *
 * @param array|object				target
 * @param object					trap
 * @param object					params
 *
 * @return Interceptor
 */
export default function(target, trap, params = {}) {
	target = _unproxy(target);
	if (!_isTypeObject(target)) {
		throw new Error('Object must be of type target; "' + _getType(handler) + '" given!');
	}
	var returnObj = {}, isOriginallyObj = true;
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
	var interceptors = Interceptors.getFirebase(target, true, params.namespace);
	Object.keys(trap).forEach(filter => {
		if (!_isFunction(trap[filter])) {
			throw new Error('Callback' + (filter === null ? '' : ' for ' + filter) + ' must be a function; "' + _getType(trap[filter]) + '" given!');
		}
		var dfn = { filter, handler: trap[filter], params }, existing;
		if (dfn.params.unique && (existing = interceptors.match(dfn)).length) {
			if (dfn.params.unique !== 'replace') {
				return existing[0];
			}
			interceptors.remove(existing[0]);
		}
		if (isOriginallyObj) {
			returnObj[filter] = interceptors.add(dfn);
		} else {
			returnObj = interceptors.add(dfn);
		}
	});
	return returnObj;
}
