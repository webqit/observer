
/**
 * @imports
 */
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import ObserverBase from './internal/ObserverBase.js';

/**
 * Removes a trap from an object's firebase.
 *
 * @param array|object				object
 * @param function					originalCallback
 * @param object					params
 *
 * @return void
 */
export default function(object, originalCallback = null, params = {}) {
	if (!object || !_isTypeObject(object)) {
		throw new Error('Object must be of type object!');
	}
	var firebase;
	if (firebase = ObserverBase.getForTarget(object)) {
		firebase.findFireables({handler:originalCallback, params}).forEach(trap => {
			firebase.removeFireable(trap);
		});
	}
}
