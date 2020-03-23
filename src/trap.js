
/**
 * @imports
 */
import _isFunction from '@web-native-js/commons/js/isFunction.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import _getType from '@web-native-js/commons/js/getType.js';
import TrapBase from './internal/TrapBase.js';
import Trap from './internal/Trap.js';

/**
 * Adds a trap to an object's firebase.
 *
 * @param array|object				object
 * @param function					callback
 * @param object					params
 *
 * @return Trap
 */
export default function(object, callback, params = {}) {
	if (!object || !_isTypeObject(object)) {
		throw new Error('Object must be of type object!');
	}
	if (!_isFunction(callback)) {
		throw new Error('Callback must be a function; "' + _getType(callback) + '" given!');
	}
	var firebase;
	if (!(firebase = TrapBase.getForTarget(object))) {
		firebase = TrapBase.createForTarget(object);
	}
	return firebase.addFireable(new Trap(callback, params));
}
