
/**
 * @imports
 */
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import Registration from './Registration.js';
import { _await, env } from '../util.js';

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
		this.emit.currentRegistration = this;
		Object.defineProperty( this, 'abortController', { value: new AbortController } );
		Object.defineProperty( this, 'signal', { value: this.abortController.signal } );
		env.setMaxListeners?.( 0, this.signal );
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
		if ( this.emit.recursionTarget && ![ 'inject', 'force-async', 'force-sync' ].includes( this.params.recursions ) ) return;
		let matches = events, filter = this.filter;
		if ( filter !== Infinity && ( filter = _arrFrom( filter, false ) ) ) {
			matches = events.filter( event => filter.includes( event.key ) );
		}
		if ( this.params.diff ) {
			matches = matches.filter( event => event.type !== 'set' || event.value !== event.oldValue );
		}
		if ( matches.length ) {
			if ( this.emit.recursionTarget && this.params.recursions !== 'force-sync' ) {
				this.emit.recursionTarget.push( ...matches );
				return;
			}
			this.emit.recursionTarget = this.params.recursions === 'inject' ? matches : [];
			const $ret = this.filter === Infinity || Array.isArray( this.filter )
				? this.emit( matches, this )
				: this.emit( matches[ 0 ], this );
			// NOTEL: on calling emit(), this registration has expired and a new one active!!!
			return _await( $ret, ret => {
				const recursions = this.emit.recursionTarget;
				delete this.emit.recursionTarget;
				if ( this.params.recursions === 'force-async' ) {
					if ( recursions.length ) return this.emit.currentRegistration.fire( recursions );
				}
				return ret;
			} );
		}
	}
}
