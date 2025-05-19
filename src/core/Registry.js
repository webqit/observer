
/**
 * @imports
 */
import { _isTypeObject, _getType } from '@webqit/util/js/index.js';
import { _from as _arrFrom, _intersect, _equals as _arrEquals } from '@webqit/util/arr/index.js';
import { _wq } from '../util.js';

/**
 * ---------------------------
 * The Registry class
 * ---------------------------
 */

export default class Registry {
	
	/**
	 * Initializes the instance.
	 *
	 * @param object	target
	 * 
	 * @return void
	 */
	constructor( target ) {
		this.target = target;
		this.entries = [];
	}
	
	/**
	 * Adds an Registration instance
	 * with optional tags.
	 *
	 * @param Registration		registration
	 *
	 * @return Registration
	 */
	addRegistration( registration ) {
		this.entries.push( registration );
		return registration;
	}
	
	/**
	 * Removes registrations by reference.
	 *
	 * @param Registration		registration
	 *
	 * @return void
	 */
	removeRegistration( registration ) {
		this.entries = this.entries.filter( _entry => _entry !== registration );
	}
		
	/**
	 * Returns a observer-specific object embedded on an element.
	 *
	 * @param string		type
	 * @param array|object	target
	 * @param bool      	createIfNotExists
	 * @param string      	namespace
	 *
	 * @return Registry
	 */
	static _getInstance( type, target, createIfNotExists = true, namespace = this.__namespace ) {
		if ( !_isTypeObject( target ) ) throw new Error( `Subject must be of type object; "${ _getType( target ) }" given!` );
		let ImplementationClass = this;
		if ( namespace && _wq( globalThis, 'observerAPI', 'namespaces' ).has( type + '-' + namespace ) ) {
			ImplementationClass = _wq( globalThis, 'observerAPI', 'namespaces' ).get( type + '-' + namespace );
			type += '-' + namespace
		}
		if ( !_wq( target, 'registry' ).has( type ) && createIfNotExists ) {
			_wq( target, 'registry' ).set( type, new ImplementationClass( target ) );
		}
		return _wq( target, 'registry' ).get( type );
	}

	/**
	 * Extend a Fireable Class with a namespace.
	 *
	 * @param string		namespace
	 * @param class      	ImplementationClass
	 *
	 * @return void|class
	 */
	static _namespace( type, namespace, ImplementationClass = null ) {
		type += '-' + namespace;
		if ( arguments.length === 2 ) return _wq( globalThis, 'observerAPI', 'namespaces' ).get( type );
		if ( !( ImplementationClass.prototype instanceof this ) ) {
			throw new Error( `The implementation of the namespace ${ this.name }.${ namespace } must be a subclass of ${ this.name }.` );
		}
		_wq( globalThis, 'observerAPI', 'namespaces' ).set( type, ImplementationClass );
		ImplementationClass.__namespace = namespace;
	}
}