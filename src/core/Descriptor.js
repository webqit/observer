
/**
 * ---------------------------
 * The Descriptor class
 * ---------------------------
 */

export default class Descriptor {
	
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
		if ( !( dfn.operation ) ) throw new Error( 'Descriptor operation must be given in definition!' );
		Object.assign( this, dfn );
	}
}