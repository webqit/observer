
/**
 * @imports
 */
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import Registration from './Registration.js';

/**
 * ---------------------------
 * The ListenerRegistration class
 * ---------------------------
 */

export default class ListenerRegistration extends Registration {
	
	/**
	 * @constructor
	 */
	constructor() {
		super( ...arguments );
		Object.defineProperty( this, 'abortController', { value: new AbortController } );
		Object.defineProperty( this, 'signal', { value: this.abortController.signal } );
	}

	/**
	 * De-registers the instance.
	 * 
	 * @return Void
	 */
	remove() {
		this.abortController.abort();
		super.remove();
	}

	/**
	 * Calls the observer's handler function
	 * on matching with the event's fields.
	 *
	 * @param Array			 		events
	 *
	 * @return Any
	 */
	fire( events ) {
		let matches = events, filter = this.filter;
		if ( filter !== Infinity && ( filter = _arrFrom( filter ) ) ) {
			matches = events.filter( event => filter.includes( event.key ) );
		}
		if ( this.params.diff ) {
			matches = matches.filter( event => event.type !== 'set' || event.value !== event.oldValue );
		}
		if ( matches.length ) {
			return this.filter === Infinity || Array.isArray( this.filter )
				? this.handler( matches, this )
				: this.handler( matches[ 0 ], this );
		}
	}
}
