
/**
 * @imports
 */
import Fireable from './Fireable.js';

/**
 * ---------------------------
 * The Listener class
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
	 *
	 * @return void
	 */
	fire(evt) {
		if (this.params.type === evt.type) {
			evt.response(this.handler.call(this.target, evt.e));
		}
	}
};