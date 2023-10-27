
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
			this.batches[ 0 ].snapshots.push( { events: [ ...events ], isPropertyDescriptors } );
			return
		}
		this.$emit( this.entries, [ { events, isPropertyDescriptors } ] );
	}

	$emit( entries, snapshots ) {
		const needsEventsWithDescriptors = entries.filter( listener => listener.params.withPropertyDescriptors ).length;
		const hasEventsToTransform = snapshots.some( snapshot => snapshot.isPropertyDescriptors );
		const eventsAsIs = [], eventsTransformed = [], entriesLength = entries.length;
		snapshots.forEach( snapshot => {
			// Some need it untransformed (as-is)
			if ( needsEventsWithDescriptors || !hasEventsToTransform ) { eventsAsIs.push( ...snapshot.events ); }
			// It might not be all that need it untransformed, and there might be events to transform
			if ( needsEventsWithDescriptors !== entriesLength && hasEventsToTransform ) {
				if ( snapshot.isPropertyDescriptors ) {
					eventsTransformed.push( ...snapshot.events.map( e => {
						let { target, type, ...details } = e;
						const desc = new Descriptor( target, { type: 'set', ...details } );
						Object.defineProperty( desc, 'value', 'get' in details.value ? { get: () => details.value.get() } : { value: details.value.value } )
						if ( details.oldValue ) {
							Object.defineProperty( desc, 'oldValue', 'get' in details.oldValue ? { get: () => details.oldValue.get() } : { value: details.oldValue.value } )
						}
						return desc;
					} ) );
				} else { eventsTransformed.push( ...snapshot.events ); }
			}
		} );
		entries.forEach( listener => {
			if ( listener.params.withPropertyDescriptors ) {
				listener.fire( eventsAsIs.length ? eventsAsIs : eventsTransformed );
			} else { listener.fire( eventsTransformed.length ? eventsTransformed : eventsAsIs ); }
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
		this.batches.unshift( { entries: [ ...this.entries ], snapshots: [] } );
		const returnValue = callback();
		return _await( returnValue, returnValue => {
			const batch = this.batches.shift();
			if ( !batch.snapshots.length ) return returnValue;
			this.$emit( batch.entries, batch.snapshots );
			return returnValue;
		} )
	}

}