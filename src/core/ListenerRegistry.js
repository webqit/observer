
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
		return super._getInstance( 'listeners', ...arguments );
	}

	static namespace( namespace, ImplementationClass = null ) {
		return super._namespace( 'listeners', ...arguments );
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
	 * @param Arrayn events
	 *
	 * @return Void
	 */
	emit( events ) {
		this.entries.forEach( listener => listener.fire( events ) );
	}
}