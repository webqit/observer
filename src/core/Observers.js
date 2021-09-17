
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
	 * @param object	target
	 * 
	 * @return void
	 */
	constructor(target) {
		super(target);
		this.buffers = [];
	}
	
	/**
	 * @inheritdoc
	 */
	add(dfn) {
		return super.add(new Observer(this.target, dfn));
	}
	
	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param array|Mutation		changes
	 * @param bool				cancellable
	 *
	 * @return Event
	 */
	fire(changes, cancellable) {
		var evt = new Event(this.target, cancellable);
		// We accept multiple changes
		changes = _arrFrom(changes, false).map(delta => !(delta instanceof Mutation) ? new Mutation(this.target, delta) : delta);
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

	static getFirebase(target, createIfNotExists = true, namespace = null) {
		return super._getFirebase('observer', ...arguments);
	}

	static namespace(namespace, ImplementationClass = null) {
		return super._namespace('observer', ...arguments);
	}
}