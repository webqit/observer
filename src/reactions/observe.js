
/**
 * @imports
 */
import { _isFunction, _isTypeObject, _getType } from '@webqit/util/js/index.js';
import build, { isUserObject } from '../connectors/build.js';
import _unproxy from '../actors/unproxy.js';
import Observers from '../core/Observers.js';

/**
 * Adds an observer to an target's firebase.
 *
 * @param array|object				target
 * @param string|array|function		filter
 * @param function					handler
 * @param object					params
 *
 * @return Observer
 */
export default function(target, filter, handler = null, params = {}) {
	target = _unproxy(target);
	if (!target || !_isTypeObject(target)) {
		throw new Error('Observable subjects must be of type object; "' + _getType(target) + '" given!');
	}
	if (_isFunction(filter)) {
		params = arguments.length > 2 ? handler : {};
		handler = filter;
		filter = null;
	}
	if (!_isFunction(handler)) {
		throw new Error('Handler must be a function; "' + _getType(handler) + '" given!');
	}
	var existing, observers = Observers.getFirebase(target, true, params.namespace);
	var dfn = {filter, handler, params,};
	if (dfn.filter || dfn.params.subtree === '*' || (dfn.params.subtree && isUserObject(target))) {
		build(target, dfn.filter, dfn.params.subtree, params.namespace);
	}
	if (dfn.params.unique && (existing = observers.match({filter, params})).length) {
		if (dfn.params.unique !== 'replace') {
			return existing[0];
		}
		observers.remove(existing[0]);
	}
	return observers.add(dfn);
}
