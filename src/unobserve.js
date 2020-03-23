
/**
 * @imports
 */
import _isNull from '@web-native-js/commons/js/isNull.js';
import _isFunction from '@web-native-js/commons/js/isFunction.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import _isUndefined from '@web-native-js/commons/js/isUndefined.js';
import ObserverBase from './internal/ObserverBase.js';

/**
 * Removes an observer from an object's firebase.
 *
 * @param array|object				object
 * @param string|array|function		fields
 * @param function					originalCallback
 * @param object					params
 *
 * @return void
 */
export default function(object, fields, originalCallback = null, params = {}) {
	if (!object || !_isTypeObject(object)) {
		throw new Error('Object must be of type object!');
	}
	if (_isFunction(fields) || _isNull(fields) || _isUndefined(fields)) {
		params = arguments.length > 2 ? originalCallback : {};
		originalCallback = fields;
		fields = null;
	}
	var firebase;
	if (firebase = ObserverBase.getForTarget(object)) {
		firebase.findFireables({handler:originalCallback, fields, params}).forEach(observer => {
			firebase.removeFireable(observer);
		});
	}
}
