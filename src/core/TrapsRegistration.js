
/**
 * @imports
 */
import Registration from './Registration.js';

/**
 * ---------------------------
 * The TrapsRegistration class
 * ---------------------------
 */

export default class TrapsRegistration extends Registration {
	
	/**
	 * Calls the observer's handler function
	 * on matching with the event's fields.
	 *
	 * @param Operation			 		operation
	 * @param function					next
	 * @param mixed					 	recieved
	 *
	 * @return void
	 */
	exec( operation, next, recieved ) {
		if ( this.running || !this.traps[ operation.type ] ) {
			return next( ...Array.prototype.slice.call( arguments, 2 ) );
		}
		this.running = true;
		return this.traps[ operation.type ]( operation, recieved, ( ...args ) => {
			this.running = false;
			return next( ...args );
		} );
	}
}