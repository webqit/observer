
/**
 * @imports
 */
import ListenerRegistration from './ListenerRegistration.js';
import Registry from './Registry.js';

/**
 * ---------------------------
 * The ListenerRegistry class
 * ---------------------------
 */

export default class ListenerRegistry extends Registry {

	static getInstance( target, createIfNotExists = true, namespace = null ) {
		return super._getInstance( 'events', ...arguments );
	}

	static namespace( namespace, ImplementationClass = null ) {
		return super._namespace( 'events', ...arguments );
	}
	
	/**
	 * @inheritdoc
	 */
	addRegistration( filter, handler, params ) {
		return super.addRegistration( new ListenerRegistration( this, { filter, handler, params } ) );
	}
	
	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param Arrayn operations
	 *
	 * @return Void
	 */
	emit( operations ) {
		this.entries.forEach( listener => listener.fire( operations ) );
	}
}