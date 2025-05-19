
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
	emit( events, { eventsArePropertyDescriptors = false, eventIsArrayMethodDescriptor = false } = {} ) {
		if ( this.batches.length ) {
			const arrayMethodName = this.batches[ 0 ].params.arrayMethodName;
			this.batches[ 0 ].snapshots.push( {
				events: [ ...events ],
				arrayMethodName, // Typically from array operations
				eventsArePropertyDescriptors, // Typically from defineProperty() operations
				eventIsArrayMethodDescriptor // Typically from array method operations
			} );
			return
		}
		this.$emit( this.entries, [ {
			events, 
			eventsArePropertyDescriptors, // Typically from defineProperty() operations
			eventIsArrayMethodDescriptor // Typically from array method operations
		} ] );
	}

	$emit( listeners, snapshots ) {
		// Analyse listener modes
		let listenersLength = 0,
		listenersAskingEventsWithPropertyDescriptors = 0,
		listenersAskingArrayMethodDescriptors = 0;
		for ( const listener of listeners ) {
			listenersLength += 1;
			if ( listener.params.withPropertyDescriptors ) {
				listenersAskingEventsWithPropertyDescriptors += 1;
			}
			if ( listener.params.withArrayMethodDescriptors ) {
				listenersAskingArrayMethodDescriptors += 1;
			}
		}
		// Sort events
		const events_with_PropertyDescriptors_with_ArrayMethodDescriptors = [], events_with_PropertyDescriptors_without_ArrayMethodDescriptors = [];
		const events_without_PropertyDescriptors_with_ArrayMethodDescriptors = [], events_without_PropertyDescriptors_without_ArrayMethodDescriptors = [];
		for ( const snapshot of snapshots ) {
			const arrayMethodName = snapshot.arrayMethodName;
			const eventsArePropertyDescriptors = snapshot.eventsArePropertyDescriptors;
			const eventIsArrayMethodDescriptor = snapshot.eventIsArrayMethodDescriptor;
			for ( const event of snapshot.events ) {
				if ( arrayMethodName ) {
					event.operation = arrayMethodName;
				}
				// Some opting in to PropertyDescriptors
				if ( listenersAskingEventsWithPropertyDescriptors ) {
					//if ( !arrayMethodName ) { }
					listenersAskingArrayMethodDescriptors && // Some opting in to ArrayMethodDescriptors
					events_with_PropertyDescriptors_with_ArrayMethodDescriptors.push( event );
					if ( !eventIsArrayMethodDescriptor ) {
						listenersAskingArrayMethodDescriptors !== listenersLength && // Some opting out of ArrayMethodDescriptors
						events_with_PropertyDescriptors_without_ArrayMethodDescriptors.push( event );
					}
				}
				// Some opting out of PropertyDescriptors
				if ( listenersAskingEventsWithPropertyDescriptors !== listenersLength ) {
					let $event = event;
					if ( eventsArePropertyDescriptors ) {
						const { target, type, ...details } = event;
						$event = new Descriptor( target, { type: 'set', ...details } );
						Object.defineProperty( $event, 'value', 'get' in details.value ? { get: () => details.value.get() } : { value: details.value.value } )
						if ( details.oldValue ) {
							Object.defineProperty( $event, 'oldValue', 'get' in details.oldValue ? { get: () => details.oldValue.get() } : { value: details.oldValue.value } )
						}
					}
					//if ( !arrayMethodName/*Although eedless as is typically mutually exclusive to eventsArePropertyDescriptors*/ ) { }
					listenersAskingArrayMethodDescriptors && // Some opting in to ArrayMethodDescriptors
					events_without_PropertyDescriptors_with_ArrayMethodDescriptors.push( $event );
					if ( !eventIsArrayMethodDescriptor ) { // Although eedless as is typically already implied by eventsArePropertyDescriptors
						listenersAskingArrayMethodDescriptors !== listenersLength && // Some opting out of ArrayMethodDescriptors
						events_without_PropertyDescriptors_without_ArrayMethodDescriptors.push( $event );
					}
				}
			}
		}
		// Dispatch
		for ( const listener of listeners ) {
			if ( listener.params.withPropertyDescriptors ) {
				if ( listener.params.withArrayMethodDescriptors ) {
					events_with_PropertyDescriptors_with_ArrayMethodDescriptors.length &&
					listener.fire( events_with_PropertyDescriptors_with_ArrayMethodDescriptors );
				} else {
					events_with_PropertyDescriptors_without_ArrayMethodDescriptors.length &&
					listener.fire( events_with_PropertyDescriptors_without_ArrayMethodDescriptors );
				}
			} else {
				if ( listener.params.withArrayMethodDescriptors ) {
					events_without_PropertyDescriptors_with_ArrayMethodDescriptors.length &&
					listener.fire( events_without_PropertyDescriptors_with_ArrayMethodDescriptors );
				} else {
					events_without_PropertyDescriptors_without_ArrayMethodDescriptors.length &&
					listener.fire( events_without_PropertyDescriptors_without_ArrayMethodDescriptors );
				}
			}
		}
	}

	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param Arrayn events
	 *
	 * @return Void
	 */
	batch( callback, params = {} ) {
		this.batches.unshift( { entries: [ ...this.entries ], snapshots: [], params } );
		const returnValue = callback();
		return _await( returnValue, returnValue => {
			const batch = this.batches.shift();
			if ( !batch.snapshots.length ) return returnValue;
			this.$emit( batch.entries, batch.snapshots );
			return returnValue;
		} );
	}

}
