
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
		if ( this.params.signal ) {
			this.params.signal.addEventListener( 'abort', () => this.remove() );
		}
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
	 * @param Array			 		operations
	 *
	 * @return Any
	 */
	fire( operations ) {
		let matches = operations, filter = this.filter;
		if ( filter !== Infinity && ( filter = _arrFrom( filter ) ) ) {
			matches = operations.filter( operation => filter.includes( operation.name ) );
		}
		if ( matches.length ) {
			return this.filter === Infinity || Array.isArray( this.filter )
				? this.handler( matches, this )
				: this.handler( matches[ 0 ], this );
		}
	}
}
