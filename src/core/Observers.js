
/**
 * @imports
 */
import { _from as _arrFrom, _remove, _last } from '@webqit/util/arr/index.js';
import Firebase from './Firebase.js';
import Observer from './Observer.js';
import Mutation from './Mutation.js';
import Event from './Event.js';

/**
 * ---------------------------
 * The Reactive class
 * ---------------------------
 */

export default class Observers extends Firebase {
	
	/**
	 * Initializes the instance.
	 *
	 * @param object	subject
	 * 
	 * @return void
	 */
	constructor(subject) {
		super(subject);
		this.buffers = [];
	}
	
	/**
	 * @inheritdoc
	 */
	add(dfn) {
		return super.add(new Observer(this.subject, dfn));
	}
	
	/**
	 * Fires all observers with the given evt (change).
	 *
<<<<<<< HEAD
	 * @param array|Mutation		changes
=======
	 * @param array|Delta		changes
>>>>>>> 61da1201f3c0964bfa06d65c69f2e564f3ef6e38
	 * @param bool				cancellable
	 *
	 * @return Event
	 */
	fire(changes, cancellable) {
		var evt = new Event(this.subject, cancellable);
		// We accept multiple changes
<<<<<<< HEAD
		changes = _arrFrom(changes, false).map(delta => !(delta instanceof Mutation) ? new Mutation(this.subject, delta) : delta);
=======
		changes = _arrFrom(changes, false).map(delta => !(delta instanceof Delta) ? new Delta(this.subject, delta) : delta);
>>>>>>> 61da1201f3c0964bfa06d65c69f2e564f3ef6e38
		if (this.buffers.length) {
			_last(this.buffers)(changes);
			return evt;
		}
		if (this.currentlyFiring.filter(d => changes.filter(delta => d.type === delta.type && d.name === delta.name).length).length) {
			//return false;
		}
		//this.currentlyFiring.push(...changes);
		this.fireables.forEach(observer => {
			if (evt.propagationStopped && cancellable) {
				return evt;
			}
			evt.respondWith(observer.fire(changes));
		});
		//changes.forEach(delta => _remove(this.currentlyFiring, delta));
		return evt;
	}
}