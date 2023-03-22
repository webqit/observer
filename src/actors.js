
/**
 * @imports
 */
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import { _isClass, _isFunction, _isTypeObject, _getType } from '@webqit/util/js/index.js';
import { set, deleteProperty, has, get, ownKeys, defineProperty, getOwnPropertyDescriptor } from "./main.js";
import { apply, construct, getPrototypeOf, setPrototypeOf, isExtensible, preventExtensions } from "./main.js";
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
        while ( !descriptor && ( proto = Object.getPrototypeOf( proto ) ) ) {
            descriptor = Object.getOwnPropertyDescriptor( proto, prop );
        }
        return descriptor 
            ? { proto, descriptor } 
            : { descriptor: { value: undefined } };
    }
    // ---------
    function accessorizeProp( prop ) {
        if ( accessorizedProps.has( prop ) ) return true;
        // ------------------
        // Current Descriptor Record
        const currentDescriptorRecord = getDescriptorDeep( prop );
        currentDescriptorRecord.getValue = function() {
            return 'get' in this.descriptor ? this.descriptor.get() : this.descriptor.value;
        };
        currentDescriptorRecord.setValue = function( value ) {
            return 'set' in this.descriptor ? this.descriptor.set( value ) : ( this.descriptor.value = value )
        };
        currentDescriptorRecord.intact = function() {
            const currentDescriptor = Object.getOwnPropertyDescriptor( target, prop );
            return currentDescriptor.get === accessorization.get 
                && currentDescriptor.set === accessorization.set
                && accessorizedProps.get( prop ) === this;
        };
        currentDescriptorRecord.restore = function() {
            if ( !this.intact() ) return false;
            if ( this.proto !== target ) { delete target[ prop ]; }
            else { Object.defineProperty( target, prop, this.descriptor ); }
            accessorizedProps.delete( prop );
            return true;
        };
        accessorizedProps.set( prop, currentDescriptorRecord );
        // ------------------
        // enumerable, configurable
        const { enumerable = true, configurable = true } = currentDescriptorRecord.descriptor;
        const accessorization = { enumerable, configurable };
        // set, get
        if ( [ 'value', 'set' ].some( x => x in currentDescriptorRecord.descriptor ) ) {
            accessorization.set = function ( value ) { return set( this, prop, value, params ); };
        }
        if ( [ 'value', 'get' ].some( x => x in currentDescriptorRecord.descriptor ) ) {
            accessorization.get = function () { return get( this, prop, params ); };
        }
        try {
            Object.defineProperty( target, prop, accessorization );
            return true;
        } catch( e ) {
            accessorizedProps.delete( prop );
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
        if ( !accessorizedProps.has( prop ) ) return true;
        return accessorizedProps.get( prop ).restore();
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
 *
 * @return Proxy
 */
export function proxy( target, params = {} ) {
    target = resolveTarget( target );
    const proxy = new Proxy( target, {
        apply:  ( target, thisArgument, argumentsList ) => apply( target, thisArgument, argumentsList, params ),
        construct:  ( target, argumentsList, newTarget = null ) => construct( target, argumentsList, newTarget, params ),
        defineProperty:  ( target, propertyKey, attributes ) => defineProperty( target, propertyKey, attributes, params ),
        deleteProperty: ( target, propertyKey ) => deleteProperty( target, propertyKey, params ),
        get: ( target, propertyKey, receiver = null ) => {
            const val = get( target, propertyKey, { ...params, receiver } );
            if ( params.proxyAutoBinding !== false && _isFunction( val ) && !_isClass( val )) {
                return val.bind( proxy );
            }
            return val;
        },
        getOwnPropertyDescriptor: ( target, propertyKey ) => getOwnPropertyDescriptor( target, propertyKey, params ),
        getPrototypeOf: target => getPrototypeOf( target, params ),
        has: ( target, propertyKey ) => has( target, propertyKey, params ),
        isExtensible: target => isExtensible( target, params ),
        ownKeys: target => ownKeys( target, params ),
        preventExtensions: target => preventExtensions( target, params ),
        set: ( target, propertyKey, value, receiver = null ) => set( target, propertyKey, value, { ...params, receiver } ),
        setPrototypeOf: ( target, prototype ) => setPrototypeOf( target, prototype, params ),
    });
    _( proxy ).set( proxy, target );
	return proxy;
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
