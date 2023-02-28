
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
		if ( !( dfn.type ) ) throw new Error( 'Descriptor type must be given in definition!' );
		Object.assign( this, dfn );
	}
}