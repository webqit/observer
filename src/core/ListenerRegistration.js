
/**
 * @imports
 */
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import Registration from './Registration.js';
import { _await } from '../util.js';

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
		if ( this.handler.recursionTarget && ![ 'inject', 'force-async', 'force-sync' ].includes( this.params.recursions ) ) return;
		let matches = events, filter = this.filter;
		if ( filter !== Infinity && ( filter = _arrFrom( filter, false ) ) ) {
			matches = events.filter( event => filter.includes( event.key ) );
		}
		if ( this.params.diff ) {
			matches = matches.filter( event => event.type !== 'set' || event.value !== event.oldValue );
		}
		if ( matches.length ) {
			if ( this.handler.recursionTarget && this.params.recursions !== 'force-sync' ) {
				this.handler.recursionTarget.push( ...matches );
				return;
			}
			this.handler.recursionTarget = this.params.recursions === 'inject' ? matches : [];
			const $ret = this.filter === Infinity || Array.isArray( this.filter )
				? this.handler( matches, this )
				: this.handler( matches[ 0 ], this );
			return _await( $ret, ret => {
				const recursions = this.handler.recursionTarget;
				delete this.handler.recursionTarget;
				if ( this.params.recursions === 'force-async' ) {
					if ( recursions.length ) return this.fire( recursions );
				}
				return ret;
			} );
		}
	}
}
