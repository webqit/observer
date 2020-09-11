
/**
 * @imports
 */
import _isFunction from '@onephrase/util/js/isFunction.js';
import _isTypeObject from '@onephrase/util/js/isTypeObject.js';
import _getType from '@onephrase/util/js/getType.js';
import getObservers from './getObservers.js';
import build from './build.js';

/**
 * Adds an observer to an subject's firebase.
 *
 * @param array|object				subject
 * @param string|array|function		filter
 * @param function					handler
 * @param object					params
 *
 * @return Observer
 */
export default function(subject, filter, handler = null, params = {}) {
	if (!subject || !_isTypeObject(subject)) {
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
	var dfn = {filter, handler, params,};
	if (dfn.filter || dfn.params.subtree) {
		build(subject, dfn.filter, dfn.params.subtree);
	}
	var observers = getObservers(subject);
	var existing;
	if (dfn.params.unique && (existing = observers.filter({filter, params})).length) {
		return existing[0];
	}
	return observers.add(dfn);
}
