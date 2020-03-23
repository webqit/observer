
/**
 * @imports
 */
import _objFrom from '@web-native-js/commons/obj/from.js';
import MutationEvent from './internal/MutationEvent.js';
import ObserverBase from './internal/ObserverBase.js';
import observe from './observe.js';

/**
 * Bubble helper
 *
 * @param array|object	target
 * @param string		field
 * @param array|object	object
 *
 * @return void
 */
export default function(target, field, object) {
	var firebase;
	observe(object, (entries, _entries, e) => {
		if (firebase = ObserverBase.getForTarget(target)) {
			var base = _objFrom(field, object);
			return firebase.fire(new MutationEvent(target, {type:e.type, bubbling:true, data:base, _data:base, srcEvt:e}));
		}
	}, {observeDown:true, tags:['#e-bubbling', target]});
}
