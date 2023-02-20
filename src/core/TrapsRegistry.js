
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
		return super._getInstance( 'traps', ...arguments );
	}

	static namespace( namespace, ImplementationClass = null ) {
		return super._namespace( 'traps', ...arguments );
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
	 * @param Event				event
	 * @param function			defaultHandler
	 *
	 * @return mixed
	 */
	emit( event, defaultHandler = null ) {
		const $this = this;
		return ( function next( index, ..._args ) {
			const registration = $this.entries[ index ];
			if ( registration ) {
				return registration.exec( event, ( ...args ) => {
					return next( index + 1, ...args );
				}/*next*/, ..._args );
			}
			return defaultHandler ? defaultHandler( event, ..._args ) : _args[ 0 ];
		} )( 0 );
	}
}