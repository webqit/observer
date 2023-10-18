
/**
 * @imports
 */
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import { _isClass, _isFunction, _isTypeObject, _getType } from '@webqit/util/js/index.js';
import { set, deleteProperty, has, get, ownKeys, defineProperty, getOwnPropertyDescriptor } from "./main.js";
import { batch, apply, construct, getPrototypeOf, setPrototypeOf, isExtensible, preventExtensions } from "./main.js";
import { _ } from './util.js';

/* ---------------ACCESSORIZE METHODS--------------- */

/**
 * Accessorizes props.
 *
 * @param Array|Object	target
 * @param String|Array	props
 * @param Object		params
 *
 * @return Array
 */
export function accessorize( target, props, params = {} ) {
    target = resolveTarget( target );
    const accessorizedProps = _( target, 'accessorizedProps' );
    // ---------
    function getDescriptorDeep( prop ) {
        let descriptor, proto = target;
        do {
            descriptor = Object.getOwnPropertyDescriptor( proto, prop );
        } while ( !descriptor && ( proto = Object.getPrototypeOf( proto ) ) );
        return descriptor 
            ? { proto, descriptor } 
            : { descriptor: { value: undefined, configurable: true, enumerable: true, writable: true } };
    }
    // ---------
    function accessorizeProp( prop ) {
        if ( accessorizedProps.has( prop + '' ) ) return true;
        // ------------------
        // Current Descriptor Record
        const currentDescriptorRecord = getDescriptorDeep( prop );
        currentDescriptorRecord.getValue = function( propertyDescriptor = false ) {
            if ( propertyDescriptor ) return this.descriptor;
            return this.descriptor.get ? this.descriptor.get() : this.descriptor.value;
        };
        currentDescriptorRecord.setValue = function( value, propertyDescriptor = false ) {
            this.dirty = true;
            if ( propertyDescriptor ) { this.descriptor = value; return; }
            return this.descriptor.set ? this.descriptor.set( value ) !== false : ( this.descriptor.value = value, true );
        };
        currentDescriptorRecord.intact = function() {
            const currentDescriptor = Object.getOwnPropertyDescriptor( target, prop );
            return currentDescriptor?.get === accessorization.get 
                && currentDescriptor?.set === accessorization.set
                && accessorizedProps.get( prop + '' ) === this;
        };
        currentDescriptorRecord.restore = function() {
            if ( !this.intact() ) return false;
            if ( ( this.proto && this.proto !== target ) || ( !this.proto && !this.dirty ) ) { delete target[ prop ]; }
            else { Object.defineProperty( target, prop, this.descriptor ); }
            accessorizedProps.delete( prop + '' );
            return true;
        };
        accessorizedProps.set( prop + '', currentDescriptorRecord );
        // ------------------
        // enumerable, configurable
        const { enumerable = true } = currentDescriptorRecord.descriptor;
        const accessorization = { enumerable, configurable: true };
        // set, get
        if ( ( 'value' in currentDescriptorRecord.descriptor ) || currentDescriptorRecord.descriptor.set ) {
            accessorization.set = function ( value ) { return set( this, prop, value, params ); };
        }
        if ( ( 'value' in currentDescriptorRecord.descriptor ) || currentDescriptorRecord.descriptor.get ) {
            accessorization.get = function () { return get( this, prop, params ); };
        }
        try {
            Object.defineProperty( target, prop, accessorization );
            return true;
        } catch( e ) {
            accessorizedProps.delete( prop + '' );
            return false;
        }
    }
    const _props = Array.isArray( props ) ? props : (
        props === undefined ? Object.keys( target ) : [ props ]
    );
    const statuses = _props.map( accessorizeProp );
    return props === undefined || Array.isArray( props ) 
        ? statuses 
        : statuses[ 0 ];
}

/**
 * Unaccessorizes previously accessorized props.
 *
 * @param Array|Object	target
 * @param String|Array	props
 * @param Object		params
 *
 * @return Array
 */
export function unaccessorize( target, props, params = {} ) {
    target = resolveTarget( target );
    const accessorizedProps = _( target, 'accessorizedProps' );
    function unaccessorizeProp( prop ) {
        if ( !accessorizedProps.has( prop + '' ) ) return true;
        return accessorizedProps.get( prop + '' ).restore();
    }
    const _props = Array.isArray( props ) ? props : (
        props === undefined ? Object.keys( target ) : [ props ]
    );
    const statuses = _props.map( unaccessorizeProp );
    return props === undefined || Array.isArray( props ) 
        ? statuses 
        : statuses[ 0 ];
}

/* ---------------PROXY METHODS--------------- */

/**
 * Returns an object as a proxy and binds all instance methods
 * to the proxy instead of the object itself.
 *
 * @param Array|Object		target
 * @param Object		    params
 * @param Function		    extendCallback
 *
 * @return Proxy
 */
export function proxy( target, params = {}, extendCallback = undefined ) {
    // Resolve target
    const originalTarget = resolveTarget( target );
    // Return same proxy instance?
    if ( typeof params.membrane === 'boolean' ) throw new Error( `The params.membrane parameter cannot be of type boolean.` );
    if ( params.membrane && _( originalTarget, 'membraneRef' ).has( params.membrane ) ) { return _( originalTarget, 'membraneRef' ).get( params.membrane ); }
    const traps = {
        apply( target, thisArgument, argumentsList ) {
            if ( Array.isArray( thisArgument ) ) {
                // Manually manage the length property
                const originalThis = resolveTarget( thisArgument );
                _( originalThis ).set( '$length', originalThis.length );
                // And array methods have their operations batched
                return batch( originalThis, () =>  apply( target, thisArgument, argumentsList ) );
            }
            return apply( target, thisArgument, argumentsList );
        },
        construct:  ( target, argumentsList, newTarget = null ) => construct( target, argumentsList, newTarget, params ),
        defineProperty:  ( target, propertyKey, attributes ) => defineProperty( target, propertyKey, attributes, params ),
        deleteProperty: ( target, propertyKey ) => deleteProperty( target, propertyKey, params ),
        get: ( target, propertyKey, receiver = null ) => {
            const $params = { ...params, receiver };
            if ( Array.isArray( target ) && propertyKey === 'length' && _( target ).has( '$length' ) ) {
                $params.forceValue = _( target ).get( '$length' );
            }
            const returnValue = get( target, propertyKey, $params );
            if ( Array.isArray( target ) && typeof returnValue === 'function' ) {
                // Return a proxy, but in terms of a membrane. 
                return proxy( returnValue, { ...params, membrane: receiver/* the instance obj that will be the thisArgument at apply(). Much like function.bind() */ } );
            }
            return returnValue;
        },
        getOwnPropertyDescriptor: ( target, propertyKey ) => getOwnPropertyDescriptor( target, propertyKey, params ),
        getPrototypeOf: target => getPrototypeOf( target, params ),
        has: ( target, propertyKey ) => has( target, propertyKey, params ),
        isExtensible: target => isExtensible( target, params ),
        ownKeys: target => ownKeys( target, params ),
        preventExtensions: target => preventExtensions( target, params ),
        set: ( target, propertyKey, value, receiver = null ) => {
            const $params = { ...params, receiver };
            if ( Array.isArray( target ) && propertyKey === 'length' ) {
                $params.forceOldValue = _( target ).get( '$length' );
                _( target ).set( '$length', value );
            }
            return set( target, propertyKey, value, $params );
        },
        setPrototypeOf: ( target, prototype ) => setPrototypeOf( target, prototype, params ),
    };
    // Extend...
    const $traps = extendCallback?.( traps ) || traps;
    // Create proxy
    const $proxy = new Proxy( originalTarget, $traps );
    if ( params.membrane ) { _( originalTarget, 'membraneRef' ).set( params.membrane, $proxy ); }
    _( $proxy ).set( $proxy, originalTarget );
	return $proxy;
}

/**
 * Returns the original object earlier proxied by proxy().
 *
 * @param Proxy|Any		target
 *
 * @return Any
 */
export function unproxy( target ) {
    // Proxy targets are mapped to their own instances internally
    return _( target ).get( target ) || target;
}

/* ---------------HELPERS--------------- */

/** 
 * Ensures target object is an object or array.
 *
 * @param Array|Object	target
 *
 * @return Array|Object
 */
function resolveTarget( target ) {
	if ( !target || !_isTypeObject( target ) ) throw new Error('Target must be of type object!');
	return unproxy( target );
}
