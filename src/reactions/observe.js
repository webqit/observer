
/**
 * @imports
 */
import { _isFunction, _isTypeObject, _getType } from '@webqit/util/js/index.js';
import build, { isUserObject } from '../connectors/build.js';
import _unproxy from '../actors/unproxy.js';
import Observers from '../core/Observers.js';

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
	subject = _unproxy(subject);
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Observable subjects must be of type object; "' + _getType(subject) + '" given!');
	}
	if (_isFunction(filter)) {
		params = arguments.length > 2 ? handler : {};
		handler = filter;
		filter = null;
	}
	if (!_isFunction(handler)) {
		throw new Error('Handler must be a function; "' + _getType(handler) + '" given!');
	}
	var existing, observers = Observers.getFirebase(subject, true, params.namespace);
	var dfn = {filter, handler, params,};
	if (dfn.filter || dfn.params.subtree === '*' || (dfn.params.subtree && isUserObject(subject))) {
		build(subject, dfn.filter, dfn.params.subtree, params.namespace);
	}
	if (dfn.params.unique && (existing = observers.match({filter, params})).length) {
		if (dfn.params.unique !== 'replace') {
			return existing[0];
		}
		observers.remove(existing[0]);
	}
	return observers.add(dfn);
}
