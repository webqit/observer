
/**
 * ---------------------------
 * The Operation class
 * ---------------------------
 */

export default class Operation {
	
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
		if ( !( dfn.type ) ) throw new Error( 'Operation type must be given in definition!' );
		Object.assign( this, dfn );
	}
}