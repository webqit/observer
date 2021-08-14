
/**
 * @imports
 */
import { _isFunction, _isTypeObject, _getType } from '@webqit/util/js/index.js';
import _unproxy from '../actors/unproxy.js';
import Observers from '../core/Observers.js';

/**
 * Removes observers from an subject's firebase.
 *
 * @param array|object				subject
 * @param string|array|function		filter
 * @param function					originalHandler
 * @param object					params
 *
 * @return void
 */
export default function(subject, filter, originalHandler = null, params = {}) {
	subject = _unproxy(subject);
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Observable subjects must be of type object; "' + _getType(subject) + '" given!');
	}
	if (_isFunction(filter)) {
		params = arguments.length > 2 ? originalHandler : {};
		originalHandler = filter;
		filter = null;
	}
	if (originalHandler && !_isFunction(originalHandler)) {
		throw new Error('Handler must be a function; "' + _getType(originalHandler) + '" given!');
	}
	var observers;
	if (observers = Observers.getFirebase(subject, false, params.namespace)) {
		return observers.removeMatches({filter, originalHandler, params});
	}
}
