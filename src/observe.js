
/**
 * @imports
 */
import _isFunction from '@web-native-js/commons/js/isFunction.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import _getType from '@web-native-js/commons/js/getType.js';
import ObserverBase from './internal/ObserverBase.js';
import Observer from './internal/Observer.js';

/**
 * Adds an observer to an object's firebase.
 *
 * @param array|object				object
 * @param string|array|function		fields
 * @param function					callback
 * @param object					params
 *
 * @return Observer
 */
export default function(object, fields, callback = null, params = {}) {
	if (!object || !_isTypeObject(object)) {
		throw new Error('Object must be of type object!');
	}
	if (_isFunction(fields)) {
		params = arguments.length > 2 ? callback : {};
		callback = fields;
		fields = null;
	}
	if (!_isFunction(callback)) {
		throw new Error('Callback must be a function; "' + _getType(callback) + '" given!');
	}
	var firebase;
	if (!(firebase = ObserverBase.getForTarget(object))) {
		firebase = ObserverBase.createForTarget(object);
	}
	return firebase.addFireable(new Observer(callback, fields, params));
}
