
/**
 * @imports
 */
import _isFunction from '@webqit/util/js/isFunction.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _getType from '@webqit/util/js/getType.js';
import getInterceptors from './getInterceptors.js';

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
	var interceptors = getInterceptors(subject);
	var dfn = {filter, handler, params,}, existing;
	if (dfn.params.unique && (existing = interceptors.match(dfn)).length) {
		if (dfn.params.unique !== 'replace') {
			return existing[0];
		}
		interceptors.remove(existing[0]);
	}
	return interceptors.add(dfn);
}
