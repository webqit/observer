
/**
 * @imports
 */
import ListenerBase from './internal/ListenerBase.js';

/**
 * Unbinds listeners from an element's event controller.
 *
 * @param array|object 				object
 * @param string		 			type
 * @param function		 			originalCallback
 * @param object					params
 *
 * @return void
 */
export default function(object, type, originalCallback = null, params = {}) {
	var firebase;
	if (firebase = ListenerBase.getForTarget(object)) {
		firebase.findFireables({handler:originalCallback, type, params}).forEach(listener => {
			firebase.removeFireable(listener);
		});
	}
};