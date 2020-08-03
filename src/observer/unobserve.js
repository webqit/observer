
/**
 * @imports
 */
import _isFunction from '@web-native-js/commons/js/isFunction.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import _getType from '@web-native-js/commons/js/getType.js';
import getObservers from './getObservers.js';

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
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Object must be of type subject; "' + _getType(subject) + '" given!');
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
	if (observers = getObservers(subject, false)) {
		return observers.forget({filter, originalHandler, params,});
	}
}
