
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
	 * on matching with the descriptor's fields.
	 *
	 * @param Descriptor			 	descriptor
	 * @param function					next
	 * @param mixed					 	recieved
	 *
	 * @return void
	 */
	exec( descriptor, next, recieved ) {
		if ( this.running || !this.traps[ descriptor.type ] ) {
			return next( ...Array.prototype.slice.call( arguments, 2 ) );
		}
		this.running = true;
		return this.traps[ descriptor.type ]( descriptor, recieved, ( ...args ) => {
			this.running = false;
			return next( ...args );
		} );
	}
}