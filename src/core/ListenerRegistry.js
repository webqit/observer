
/**
 * @imports
 */
import ListenerRegistration from './ListenerRegistration.js';
import Registry from './Registry.js';
import { _await } from '../util.js';
import Descriptor from './Descriptor.js';

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
	addRegistration( filter, emit, params ) {
		return super.addRegistration( new ListenerRegistration( this, { filter, emit, params } ) );
	}
	
	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param Arrayn events
	 *
	 * @return Void
	 */
	emit( events, isPropertyDescriptors = false ) {
		if ( this.batches.length ) {
			this.batches[ 0 ].events.push( ...events );
			return
		}
		let eventsWithValues;
		this.entries.forEach( listener => {
			if ( isPropertyDescriptors && !listener.params.propertyDescriptors ) {
				eventsWithValues = eventsWithValues || events.map( e => {
					let { target, value, oldValue, type, ...details } = e;
					value = value.get ? value.get() : value.value;
					oldValue = oldValue?.get ? oldValue.get() : oldValue?.value;
					return new Descriptor( target, { type: 'set', value, oldValue, ...details } );
				} );
				listener.fire( eventsWithValues );
				return;
			}
			listener.fire( events );
		} );
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
		const returnValue = callback();
		return _await( returnValue, returnValue => {
			const batch = this.batches.shift();
			if ( batch.events.length ) {
				batch.entries.forEach( listener => listener.fire( batch.events ) );
			}
			return returnValue;
		} )
	}

}