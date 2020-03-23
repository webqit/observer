
/**
 * @imports
 */
import _isUndefined from '@web-native-js/commons/js/isUndefined.js';
import _isObject from '@web-native-js/commons/js/isObject.js';
import _each from '@web-native-js/commons/obj/each.js';

/**
 * ---------------------------
 * The Event class
 * ---------------------------
 */

export default class {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object		target
	 * @param object			details
	 *
	 * @return void
	 */
	constructor(target, details = {}) {
		this.$ = {};
		this.$.target = target;
		this.$.details = details;
		this.$.propagationStopped = false;
		this.$.defaultPrevented = false;
		this.$.promisesInstance = null;
		this.$.promises = [];
		// -----------------------
		_each(details, (prop, value) => {
			if (prop !== '$') {
				Object.defineProperty(this, prop, {value});
			}
		});
	}

	/**
	 * Gets the "target" object.
	 *
	 * @return array|object
	 */
	get target() {
		return this.$.target;
	}

	/**
	 * Gets the "details" object.
	 *
	 * @return object
	 */
	get details() {
		return this.$.details;
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
		this.$.propagationStopped = true;
	}
		
	/**
	 * (Readonly) tells if stopPropagation() has been called.
	 *
	 * @return bool
	 */
	get propagationStopped() {
		return this.$.propagationStopped;
	}
		
	/**
	 * Sets a disposition that asks event initiator not to
	 * proceed with default action.
	 *
	 * @return void
	 */
	preventDefault() {
		this.$.defaultPrevented = true;
	}
		
	/**
	 * (Readonly) tells if preventDefault() has been called.
	 *
	 * @return bool
	 */
	get defaultPrevented() {
		return this.$.defaultPrevented;
	}
		
	/**
	 * Sets a Promise disposition.
	 *
	 * @param Promise	promise
	 *
	 * @return void
	 */
	promise(promise) {
		if (!(promise instanceof Promise)) {
			throw new Error('Event.promise() must be called with a Promise.');
		}
		this.$.promises.push(promise);
		this.$.promisesInstance = null;
	}
		
	/**
	 * (Readonly) returns all promises.
	 *
	 * @return Promise|null
	 */
	get promises() {
		if (!this.$.promisesInstance && this.$.promises.length) {
			this.$.promisesInstance = Promise.all(this.$.promises);
		}
		return this.$.promisesInstance;
	}
		
	/**
	 * Evaluates the given disposition value and
	 * calls an appropriate disposition method.
	 *
	 * @params mixed 	rspns
	 *
	 * @return void
	 */
	response(rspns) {
		var proms;
		var isEvent = _isObject(rspns) && !_isUndefined(rspns.propagationStopped) && !_isUndefined(rspns.defaultPrevented)
		if ((rspns === false) || (isEvent && rspns.propagationStopped)) {
			this.stopPropagation();
		} else if ((rspns === false) || (isEvent && rspns.defaultPrevented)) {
			this.preventDefault();
		} else if ((rspns instanceof Promise && (proms = rspns))
		|| (isEvent && (proms = rspns.promises))) {
			this.promise(proms);
		}
	}
};