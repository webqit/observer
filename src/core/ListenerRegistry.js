
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
	 * @constructor
	 */
	constructor( target ) {
		super( target );
		this.batches = [];
	}
	
	/**
	 * @addRegistration
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
		if ( this.batches.length ) {
			this.batches[ 0 ].events.push( ...events );
			return
		}
		this.entries.forEach( listener => listener.fire( events ) );
	}

	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param Arrayn events
	 *
	 * @return Void
	 */
	batch( callback ) {
		this.batches.unshift( { entries: [ ...this.entries ], events: [] } );
		callback();
		const batch = this.batches.shift();
		if ( !batch.events.length ) return;
		batch.entries.forEach( listener => listener.fire( batch.events ) );
	}

}