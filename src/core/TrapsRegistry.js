
/**
 * @imports
 */
import TrapsRegistration from './TrapsRegistration.js';
import Registry from './Registry.js';

/**
 * ---------------------------
 * The TrapsRegistry class
 * ---------------------------
 */

export default class TrapsRegistry extends Registry {

	static getInstance( target, createIfNotExists = true, namespace = null ) {
		return super._getInstance( 'operations', ...arguments );
	}

	static namespace( namespace, ImplementationClass = null ) {
		return super._namespace( 'operations', ...arguments );
	}
	
	/**
	 * @inheritdoc
	 */
	addRegistration( dfn ) {
		return super.addRegistration( new TrapsRegistration( this, dfn ) );
	}

	/**
	 * Fires all interceptors with the given action.
	 *
	 * @param Operation			operation
	 * @param function			defaultHandler
	 *
	 * @return mixed
	 */
	emit( operation, defaultHandler = null ) {
		const $this = this;
		return ( function next( index, ..._args ) {
			const registration = $this.entries[ index ];
			if ( registration ) {
				return registration.exec( operation, ( ...args ) => {
					return next( index + 1, ...args );
				}/*next*/, ..._args );
			}
			return defaultHandler ? defaultHandler( operation, ..._args ) : _args[ 0 ];
		} )( 0 );
	}
}