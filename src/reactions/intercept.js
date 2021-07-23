
/**
 * @imports
 */
import { _isFunction, _isTypeObject, _getType } from '@webqit/util/js/index.js';
import Interceptors from '../core/Interceptors.js';

/**
 * Adds a trap to an subject's firebase.
 *
 * @param array|object				subject
 * @param string|array|function		filter
 * @param function					handler
 * @param object					params
 *
 * @return Interceptor
 */
export default function(subject, filter, handler, params = {}) {
	if (!_isTypeObject(subject)) {
		throw new Error('Object must be of type subject; "' + _getType(handler) + '" given!');
	}
	if (_isFunction(filter)) {
		params = arguments.length > 2 ? handler : {};
		handler = filter;
		filter = null;
	}
	if (!_isFunction(handler)) {
		throw new Error('Callback must be a function; "' + _getType(handler) + '" given!');
	}
	var interceptors = Interceptors.getFirebase(subject, true, params.namespace);
	var dfn = {filter, handler, params,}, existing;
	if (dfn.params.unique && (existing = interceptors.match(dfn)).length) {
		if (dfn.params.unique !== 'replace') {
			return existing[0];
		}
		interceptors.remove(existing[0]);
	}
	return interceptors.add(dfn);
}
