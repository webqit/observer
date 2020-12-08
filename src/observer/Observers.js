
/**
 * @imports
 */
import _arrFrom from '@webqit/util/arr/from.js';
import _remove from '@webqit/util/arr/remove.js';
import Firebase from '../Firebase.js';
import Observer from './Observer.js';
import Delta from './Delta.js';
import Event from './Event.js';

/**
 * ---------------------------
 * The Reactive class
 * ---------------------------
 */

export default class extends Firebase {
	
	/**
	 * @inheritdoc
	 */
	add(dfn) {
		return super.add(new Observer(this.subject, dfn));
	}
	
	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param array|Delta		changes
	 *
	 * @return Event
	 */
	fire(changes) {
		var evt = new Event(this.subject);
		// We accept multiple changes
		changes = _arrFrom(changes, false).map(delta => !(delta instanceof Delta) ? new Delta(this.subject, delta) : delta);
		if (this.currentlyFiring.filter(d => changes.filter(delta => d.type === delta.type && d.name === delta.name).length).length) {
			//return false;
		}
		this.currentlyFiring.push(...changes);
		this.fireables.forEach(observer => {
			if (evt.propagationStopped) {
				return evt;
			}
			evt.respond(observer.fire(changes));
		});
		changes.forEach(delta => _remove(this.currentlyFiring, delta));
		return evt;
	}
};