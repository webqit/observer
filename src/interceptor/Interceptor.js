
/**
 * @imports
 */
import Fireable from '../Fireable.js';

/**
 * ---------------------------
 * The Trap class
 * ---------------------------
 */

export default class extends Fireable {
	
	/**
	 * Calls the observer's handler function
	 * on matching with the event's fields.
	 *
	 * @param Event			 			event
	 * @param function					next
	 * @param mixed					 	recieved
	 *
	 * @return void
	 */
	fire(event, next, recieved) {
		if (this.disconnected || (this.filter && this.filter !== event.type)) {
			return next(...Array.prototype.slice.call(arguments, 2));
		}
		return this.handler(event, recieved, next);
	}
};