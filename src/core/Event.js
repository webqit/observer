
/**
 * ---------------------------
 * The Event class
 * ---------------------------
 */

export default class Event {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object	target
	 * @param object		dfn
	 *
	 * @return void
	 */
	constructor( target, dfn ) {
		this.target = target;
		if ( !( dfn.type ) ) throw new Error( 'Event type must be given in definition!' );
		Object.assign( this, dfn );
	}
}