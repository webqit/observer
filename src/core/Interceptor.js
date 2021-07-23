
/**
 * @imports
 */
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import { _intersect } from '@webqit/util/arr/index.js';
import Fireable from './Fireable.js';

/**
 * ---------------------------
 * The Trap class
 * ---------------------------
 */

export default class Interceptor extends Fireable {
	
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
		if (this.disconnected || (this.filter && !_intersect(_arrFrom(this.filter), [event.type]).length)) {
			return next(...Array.prototype.slice.call(arguments, 2));
		}
		return this.handler(event, recieved, next);
	}
}