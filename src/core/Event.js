
/**
 * @imports
 */
import _isUndefined from '@webqit/util/js/isUndefined.js';
import _isObject from '@webqit/util/js/isObject.js';
import _each from '@webqit/util/obj/each.js';

/**
 * ---------------------------
 * The Event class
 * ---------------------------
 */

export default class Event {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object		target
	 * @param bool				cancellable
	 *
	 * @return void
	 */
	constructor(target, cancellable = false) {
		this._ = {};
		this._.target = target;
		this._.cancellable = cancellable;
		this._.propagationStopped = false;
		this._.defaultPrevented = false;
		this._.promisesInstance = null;
		this._.promises = [];
	}

	/**
	 * Gets the "target" object.
	 *
	 * @return array|object
	 */
	get target() {
		return this._.target;
	}

	/**
	 * Gets the "cancellable" flag.
	 *
	 * @return bool
	 */
	get cancellable() {
		return this._.cancellable;
	}

	/**
	 * -----------------------
	 * RESPONSE HANDLERS
	 * -----------------------
	 */

	/**
	 * Stops the evnt from reaching other listeners.
	 *
	 * @return bool
	 */
	stopPropagation() {
		this._.propagationStopped = true;
	}
		
	/**
	 * (Readonly) tells if stopPropagation() has been called.
	 *
	 * @return bool
	 */
	get propagationStopped() {
		return this._.propagationStopped;
	}
		
	/**
	 * Sets a disposition that asks event initiator not to
	 * proceed with default action.
	 *
	 * @return void
	 */
	preventDefault() {
		this._.defaultPrevented = true;
	}
		
	/**
	 * (Readonly) tells if preventDefault() has been called.
	 *
	 * @return bool
	 */
	get defaultPrevented() {
		return this._.defaultPrevented;
	}
		
	/**
	 * Sets a Promise disposition.
	 *
	 * @param Promise	promise
	 *
	 * @return void
	 */
	waitUntil(promise) {
		if (promise instanceof Promise) {
			this._.promises.push(promise);
			this._.promisesInstance = null;
		}
	}
		
	/**
	 * (Readonly) returns all promises.
	 *
	 * @return Promise|null
	 */
	get promises() {
		if (!this._.promisesInstance && this._.promises.length) {
			this._.promisesInstance = Promise.all(this._.promises);
		}
		return this._.promisesInstance;
	}
		
	/**
	 * Evaluates the given disposition value and
	 * calls an appropriate disposition method.
	 *
	 * @params mixed 	rspns
	 *
	 * @return void
	 */
	respondWith(rspns) {
		var proms;
		var isEvent = _isObject(rspns) && !_isUndefined(rspns.propagationStopped) && !_isUndefined(rspns.defaultPrevented)
		if ((rspns === false) || (isEvent && rspns.propagationStopped)) {
			this.stopPropagation();
		} else if ((rspns === false) || (isEvent && rspns.defaultPrevented)) {
			this.preventDefault();
		} else if ((rspns instanceof Promise && (proms = rspns))
		|| (isEvent && (proms = rspns.promises))) {
			this.waitUntil(proms);
		}
	}
}