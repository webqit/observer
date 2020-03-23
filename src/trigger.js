
/**
 * @imports
 */
import _merge from '@web-native-js/commons/obj/merge.js';
import ListenerBase from './internal/ListenerBase.js';
import Event from './internal/Event.js';

/**
 * Fires an event on an object's listenerBase.
 *
 * @param array|object 			object
 * @param string                type
 * @param object                data
 *
 * @return Event
 */
export default function(object, type, data = {}) {
	var firebase;
	if (firebase = ListenerBase.getForTarget(object)) {
		return firebase.fire(new Event(object, _merge(data, {type})));
	}
};