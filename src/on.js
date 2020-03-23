
/**
 * @imports
 */
import _merge from '@web-native-js/commons/obj/merge.js';
import ListenerBase from './internal/ListenerBase.js';
import Listener from './internal/Listener.js';

/**
 * Binds listeners to an element's event controller.
 *
 * @param array|object 				object
 * @param string		 			type
 * @param function		 			callback
 * @param object					params
 *
 * @return object
 */
export default function(object, type, callback, params = {}) {
	var firebase;
	if (!(firebase = ListenerBase.getForTarget(object))) {
		firebase = ListenerBase.createForTarget(object);
	}
	return firebase.addFireable(new Listener(callback, _merge(params, {type})));
};