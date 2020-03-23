
/**
 * @imports
 */
import Event from './Event.js';

/**
 * ---------------------------
 * The QueryEvent class
 * ---------------------------
 */

export default class extends Event {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object		target
	 * @param object			details
	 *
	 * @return void
	 */
	constructor(target, details = {}) {
		super(target, details);
	}
};