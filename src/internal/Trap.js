
/**
 * @imports
 */
import _arrFrom from '@web-native-js/commons/arr/from.js';
import QueryEvent from './QueryEvent.js';
import Fireable from './Fireable.js';

/**
 * ---------------------------
 * The Trap class
 * ---------------------------
 */

export default class extends Fireable {
	
	/**
	 * Initializes the instance.
	 *
	 * @param function		handler
	 * @param object		params
	 *
	 * @return void
	 */
	constructor(handler, params = {}) {
		super();
		this.handler = handler;
		this.params = params;

	}
	
	/**
	 * Calls the observer's handler function
	 * on matching with the event's fields.
	 *
	 * @param MutationEvent			 	evt
	 * @param function					next
	 * @param mixed					 	recieved
	 *
	 * @return void
	 */
	fire(evt, next, recieved) {
		if (this.disconnected || (this.params.type && this.params.type !== evt.type)) {
			return next(..._arrFrom(arguments).slice(2));
		}
		return this.handler(evt, recieved, next);
	}
};