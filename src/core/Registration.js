
/**
 * ---------------------------
 * The Registration class
 * ---------------------------
 */

export default class Registration {
	
	/**
	 * Initializes the instance.
	 *
	 * @param Registry			registry
	 * @param object			dfn
	 *
	 * @return void
	 */
	constructor( registry, dfn ) {
		this.registry = registry;
		Object.assign( this, { ...dfn, target: registry.target } );
		if ( this.params.signal ) {
			this.params.signal.addEventListener( 'abort', () => this.remove() );
		}
	}

	/**
	 * Sets a "disconnected" flag on the Registration.
	 *
	 * @return void
	 */
	remove() {
		this.removed = true;
		return this.registry.removeRegistration( this );
	}
}