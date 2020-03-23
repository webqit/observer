
/**
 * @imports
 */
import _even from '@web-native-js/commons/obj/even.js';
import _arrFrom from '@web-native-js/commons/arr/from.js';
import _intersect from '@web-native-js/commons/arr/intersect.js';
import _concatUnique from '@web-native-js/commons/arr/concatUnique.js';
import _exclude from '@web-native-js/commons/arr/exclude.js';
import _isUndefined from '@web-native-js/commons/js/isUndefined.js';
import _isNull from '@web-native-js/commons/js/isNull.js';
import MutationEvent from './MutationEvent.js';
import Firebase from './Firebase.js';

/**
 * ---------------------------
 * The Reactive class
 * ---------------------------
 */

export default class ObserverBase extends Firebase {
	
	/**
	 * Finds the Observer instances
	 * with the given query parameters.
	 *
	 * @param object			query
	 *
	 * @return array
	 */
	findFireables(query) {
		return super.findFireables(query).filter(observer => {
			return _isNull(query.fields) || _isUndefined(query.fields) || _even(_arrFrom(observer.fields), _arrFrom(query.fields));
		});
	}
	
	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param Event				evt
	 *
	 * @return Event
	 */
	fire(evt) {
		if (this.currentlyFiringEvents.filter(e => e.type === evt.type && e.fields === evt.fields).length) {
			return evt;
		}
		this.currentlyFiringEvents.push(evt);
		this.fireables.forEach(observer => {
			if (evt.propagationStopped || (observer.params.type && observer.params.type !== evt.type)) {
				return;
			}
			observer.fire(evt);
		});
		this.currentlyFiringEvents.pop();
		return evt;
	}
	
	/**
	 * @inheritdoc
	 */
	static createForTarget(object) {
		return super.createForTarget(object, 'observers', ObserverBase);
	}
	
	/**
	 * @inheritdoc
	 */
	static getForTarget(object) {
		return super.getForTarget(object, 'observers');
	}
};