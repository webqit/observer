
/**
 * @imports
 */
import { _isObject, _isTypeObject, _isFunction, _getType } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import { _, _await, other as otherUtil } from './util.js';
import ListenerRegistry from './core/ListenerRegistry.js';
import TrapsRegistry from './core/TrapsRegistry.js';
import Descriptor from './core/Descriptor.js';
import { unproxy } from './actors.js';

/* ---------------SPECIAL APIs--------------- */

/**
 * Creates a Path array instance from arguments.
 * 
 * @param Array	            ...segments
 *
 * @return Path
 */
class Path extends Array {}
export function path( ...segments ) {
    return new Path( ...segments );
}

/**
 * Reduces a path array against handler.
 * 
 * @param Array|Object	    target
 * @param Array	            path
 * @param Function	        receiver
 * @param Function	        final
 * @param Object	        params
 * 
 * @example reduce( object, [ segement1, segement2 ], observe, ( value, flags ) => {}, params );
 *
 * @return Any
 */
export function reduce( target, path, receiver, final = x => x, params = {} ) {
    if ( !path.length ) return;
    return ( function eat( target, path, $params ) {
        const segment = path[ $params.level ];
        const isLastSegment = $params.level === path.length - 1;
        if ( target instanceof Descriptor && target.operation !== 'get' ) {
            // Always probe event-generated trees
            $params = { ...$params, probe: 'always' };
        } else if ( $params.probe !== 'always' ) {
            // Probe until (before) last segment
            $params = { ...$params, probe: !isLastSegment };
        }
        // ---------------
        return receiver( target, segment, ( result, ...args ) => {
            // -----------
            const addTrail = desc => {
                if ( !( desc instanceof Descriptor ) ) return;
                desc.path = [ desc.key ];
                if ( target instanceof Descriptor ) {
                    desc.path = target.path.concat( desc.key );
                    Object.defineProperty( desc, 'context', { get: () => target, configurable: true } );
                }
            };
            const advance = result => {
                const $value = resolveObj( result/* a Descriptor who's value could be proxied */, false );
                return _await( $value/* could be a promise */, $value => {
                    if ( result instanceof Descriptor ) {
                        result.value = $value; // Update to (fulfilled), unproxied, value
                    } else {
                        result = $value;
                    }
                    const flags = args[ 0 ] || {};
                    return eat( result, path, { ...$params, ...flags, level: $params.level + 1, } );
                } );
            };
            // -----------
            if ( isPropsList( segment ) && Array.isArray( result ) ) {
                result.forEach( addTrail );
                if ( isLastSegment ) return final( result, ...args );
                return result.map( advance );
            }
            // -----------
            addTrail( result );
            if ( isLastSegment ) return final( result, ...args );
            return advance( result );
            // -----------
        }, $params );
    } )( target, path.slice( 0 ), { ...params, level: 0 } );
}

/**
 * Adds an observer to a target's registry.
 *
 * @param Array|Object	    target
 * @param String|Object	    prop
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return AbortController
 */
export function observe( target, prop, receiver, params = {} ) {
    // ---------------
    target = resolveObj( target, !params.level );
	if ( _isFunction( arguments[ 1 ] ) ) {
        [ , receiver, params = {} ] = arguments;
        prop = Infinity;
	}
	if ( !_isFunction( receiver ) ) throw new Error( `Handler must be a function; "${ _getType( receiver ) }" given!` );
    if ( prop instanceof Path ) return reduce( target, prop, observe, receiver, params );
    // ---------------
    params = { ...params, descripted: true };
    delete params.live;
    if ( !_isTypeObject( target ) ) return params.probe && get( target, prop, receiver, params );
    // ---------------
    const emit = bind( target, prop, receiver, params );
    if ( params.probe ) {
        return get( target, prop, emit, params );
    }
    return emit();
}

/**
 * Adds an interceptor object to a target's registry.
 *
 * @param Array|Object	    target
 * @param Object	        traps
 * @param Object		    params
 *
 * @return AbortRegistry
 */
export function intercept( target, traps, params = {} ) {
    // ---------------
    target = resolveObj( target );
    if ( !_isObject( traps ) ) {
        [ /*target*/, /*operation*/, /*handler*/, params = {} ] = arguments;
        traps = { [ arguments[ 1 ] ]: arguments[ 2 ] };
    }
    // ---------------
    return TrapsRegistry.getInstance( target, true, params.namespace ).addRegistration( { traps, params } );
}

/* ---------------QUERY APIs--------------- */

/**
 * Performs a "getOwnPropertyDescriptor" operation.
 *
 * @param Array|Object	    target
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function getOwnPropertyDescriptor( target, prop, receiver = x => x, params = {} ) {
    return exec( target, 'getOwnPropertyDescriptor', { key: prop }, receiver, params );
}

/**
 * Performs a "getOwnPropertyDescriptors" operation.
 * @note this isn't part of the standard Reflect API.
 *
 * @param Array|Object	    target
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function getOwnPropertyDescriptors( target, prop, receiver = x => x, params = {} ) {
    return exec( target, 'getOwnPropertyDescriptors', { key: prop }, receiver, params );
}

/**
 * Performs a "getPrototypeOf" operation.
 *
 * @param Array|Object	    target
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function getPrototypeOf( target, receiver = x => x, params = {} ) {
    return exec( target, 'getPrototypeOf', {}, receiver, params );
}

/**
 * Performs a "isExtensible" operation.
 *
 * @param Array|Object	    target
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function isExtensible( target, receiver = x => x, params = {} ) {
    return exec( target, 'isExtensible', {}, receiver, params );
}

/**
 * Performs a "ownKeys" operation.
 *
 * @param Array|Object	    target
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function ownKeys( target, receiver = x => x, params = {} ) {
    return exec( target, 'ownKeys', {}, receiver, params );
}

/**
 * Performs an operation of the given "type".
 *
 * @param Array|Object	    target
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function has( target, prop, receiver = x => x, params = {} ) {
    return exec( target, 'has', { key: prop }, receiver, params );
}

/**
 * Performs a get operation.
 *
 * @param Array|Object	    target
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object	        params
 *
 * @return Any
 */
export function get( target, prop, receiver = x => x, params = {} ) {
    // ---------------
    let isLive;
    const originalTarget = resolveObj( target, !params.level );
    if ( _isObject( receiver ) ) { [ params, receiver ] = [ receiver, x => x ]; }
    else if ( params.live ) { isLive = true; }
    if ( prop instanceof Path ) return reduce( originalTarget, prop, get, receiver, params );
    // ---------------
    return resolveProps( originalTarget, prop, props => {
        const related = [ ...props ];
        return ( function next( results, _props, _done ) {
            if ( !_props.length ) return _done( results );
            const prop = _props.shift();
            if ( ![ 'string', 'number', 'symbol' ].includes( typeof prop ) ) {
                throw new Error( `Property name/key ${ prop } invalid.` );
            }
            // ---------
            function defaultGet( descriptor, value = undefined ) {
                const _next = value => ( descriptor.value = value, next( [ ...results, params.live || params.descripted ? descriptor : value ]/** not using concat() as value may be an array */, _props, _done ) );
                if ( arguments.length > 1 ) return _next( value );
                if ( !_isTypeObject( originalTarget ) ) return _next( originalTarget?.[ descriptor.key ] );
                const accessorizedProps = _( originalTarget, 'accessorizedProps', false );
                const accessorization = accessorizedProps && accessorizedProps.get( descriptor.key );
                if ( accessorization && accessorization.intact() ) {
                    return _next( accessorization.getValue( params.withPropertyDescriptors ) );
                }
                if ( params.withPropertyDescriptors ) {
                    const desc = Object.getOwnPropertyDescriptor( originalTarget, descriptor.key );
                    if ( 'forceValue' in params &&  'value' in desc ) { desc.value = params.forceValue; }
                    return _next( desc );
                }
                if ( 'forceValue' in params ) { return _next( params.forceValue ); }
                return _next( Reflect.get( originalTarget, descriptor.key/*, ...( params.receiver ? [ params.receiver ] : [] )*//*Throws Illegal invocation error ffor DOM nodes, e.g.*/ ) );
            }
            // ---------
            const descriptor = new Descriptor( originalTarget, {
                type: 'get',
                key: prop,
                value: undefined,
                operation: 'get',
                related,
            } );
            if ( !_isTypeObject( originalTarget ) ) return defaultGet( descriptor );
            const trapsRegistry = TrapsRegistry.getInstance( originalTarget, false, params.namespace );
            if ( trapsRegistry ) {
                return trapsRegistry.emit( descriptor, defaultGet );
            }
            return defaultGet( descriptor );
        } )( [], props.slice( 0 ), results => {
            const result_s = isPropsList( prop/*original*/ ) ? results : results[ 0 ];
            if ( isLive && _isTypeObject( originalTarget ) ) {
                const emit = bind( originalTarget, prop, receiver, params );
                return emit( result_s );
            }
            return receiver( result_s );
        } );
    }, params );
}

/* ---------------MUTATION APIs--------------- */

/**
 * Performs a batch operation.
 * 
 * @param Object	        target
 * @param Function	        callback
 * @param Object	        params
 *
 * @return Void
 */
export function batch( target, callback, params = {} ) {
    target = resolveObj( target );
    return ListenerRegistry.getInstance( target, true, params.namespace ).batch( callback );
}

/**
 * Performs a mirror operation.
 * 
 * @param Object	        source
 * @param Object	        target
 * @param Object	        params
 *
 * @return Void
 */
export function read( source, target, params = {} ) {
    target = resolveObj( target );
    source = resolveObj( source );
    const only = ( params.only || [] ).slice( 0 ), except = ( params.except || [] ).slice( 0 );
    const sourceKeys = ownKeys( params.spread ? [ ...source ] : source ).map( k => !isNaN( k ) ? parseInt( k ) : k );
    const filteredKeys = only.length ? only.filter( k => sourceKeys.includes( k ) ) : sourceKeys.filter( k => !except.includes( k ) );
    const resolveKey = k => {
        if ( !Array.isArray( target ) || isNaN( k ) ) return k;
        return k - except.filter( i => i < k ).length;
    };
    const doSet = key => {
        const descriptor = getOwnPropertyDescriptor( source, key, params );
        if ( ( 'value' in descriptor ) && descriptor.writable && descriptor.enumerable && descriptor.configurable ) {
            set( target, resolveKey( key ), descriptor.value, params );
        } else if ( descriptor.enumerable || params.onlyEnumerable === false ) { defineProperty( target, key, { ...descriptor, configurable: true }, params ); }
    };
    batch( target, () => {
        filteredKeys.forEach( doSet );
    } );
    return observe( source, mutations => {
        //batch( target, () => {
            mutations.filter( m => only.length ? only.includes( m.key ) : !except.includes( m.key ) ).forEach( m => {
                if ( m.operation === 'deleteProperty' ) return deleteProperty( target, resolveKey( m.key ), params );
                if ( m.operation === 'defineProperty' ) {
                    if ( m.value.enumerable || params.onlyEnumerable === false ) {
                        defineProperty( target, resolveKey( m.key ), { ...m.value, configurable: true }, params );
                    }
                    return;
                }
                doSet( m.key );
            } );
        //}, params );
    }, { ...params, withPropertyDescriptors: true } );
}

/**
 * Performs a set operation.
 * 
 * @param Object	        target
 * @param String|Number	    prop
 * @param Any	            value
 * @param Function	        receiver
 * @param Object	        params
 * @param Bool	            def
 *
 * @return Any
 */
export function set( target, prop, value, receiver = x => x, params = {}, def = false ) {
    // ---------------
    const originalTarget = resolveObj( target );
    let entries = [ [ prop, value ] ];
    if ( _isObject( prop ) ) {
        [ /*target*/, /*hash*/, receiver = x => x, params = {}, def = false ] = arguments;
        entries = Object.entries( prop );
    }
    if ( _isObject( receiver ) ) { [ def, params, receiver ] = [ typeof params === 'boolean' ? params : def, receiver, x => x ]; }
    // ---------------
    const related = entries.map( ( [ prop ] ) => prop );
    return ( function next( descriptors, entries, _done ) {
        if ( !entries.length ) return _done( descriptors );
        const [ prop, value ] = entries.shift();
        // ---------
        function defaultSet( descriptor, status = undefined ) {
            const _next = status => ( descriptor.status = status, next( descriptors.concat( descriptor ), entries, _done ) );
            if ( arguments.length > 1 ) return _next( descriptor, status );
            const accessorizedProps = _( originalTarget, 'accessorizedProps', false );
            const accessorization = accessorizedProps && accessorizedProps.get( descriptor.key );
            if ( descriptor.operation === 'defineProperty' ) {
                if ( accessorization && !accessorization.restore() ) _next( false );
                Object.defineProperty( originalTarget, descriptor.key, descriptor.value );
                return _next( true );
            }
            if ( accessorization && accessorization.intact() ) {
                return _next( accessorization.setValue( descriptor.value ) );
            }
            return _next( Reflect.set( originalTarget, descriptor.key, descriptor.value ) );
        }
        // ---------
        function exec( isUpdate, oldValue ) {
            if ( params.diff && value === oldValue ) return next( descriptors, entries, _done );
            const descriptor = new Descriptor( originalTarget, {
                type: def ? 'def' : 'set',
                key: prop,
                value,
                isUpdate,
                oldValue,
                related: [ ...related ],
                operation: def ? 'defineProperty' : 'set',
                detail: params.detail,
            } );
            const trapsRegistry = TrapsRegistry.getInstance( originalTarget, false, params.namespace );
            return trapsRegistry 
                ? trapsRegistry.emit( descriptor, defaultSet ) 
                : defaultSet( descriptor );
        }
        // ---------
        return has( originalTarget, prop, exists => {
            if ( !exists ) return exec( exists );
            const $params = { ...params, withPropertyDescriptors: def };
            if ( 'forceOldValue' in params ) { $params.forceValue = params.forceOldValue; }
            return get( originalTarget, prop, oldValue => exec( exists, oldValue ), $params );
        }, params );
        // ---------
    } )( [], entries.slice( 0 ), descriptors => {
        const listenerRegistry = ListenerRegistry.getInstance( originalTarget, false, params.namespace );
        if ( listenerRegistry ) listenerRegistry.emit( descriptors, def );
        return receiver(
            isPropsList( prop/*original*/ ) ? descriptors.map( opr => opr.status ) : descriptors[ 0 ]?.status
        );
    } );
}

/**
 * Performs a defineProperty operation.
 * 
 * @param Object	        target
 * @param String|Number	    prop
 * @param Object	        descriptor
 * @param Function	        receiver
 * @param Object	        params
 *
 * @return Any
 */
export function defineProperty( target, prop, descriptor, receiver = x => x, params = {} ) {
    return set( target, prop, descriptor, receiver, params, true/*def*/ );
}

/**
 * Performs a defineProperties operation.
 * @note this isn't part of the standard Reflect API.
 * 
 * @param Object	        target
 * @param Object	        descriptors
 * @param Function	        receiver
 * @param Object	        params
 *
 * @return Any
 */
export function defineProperties( target, descriptors, receiver = x => x, params = {} ) {
    return set( target, descriptors, receiver, params, true/*def*/ );
}

/**
 * Performs a delete operation.
 * 
 * @param Object	        target
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object	        params
 *
 * @return Any
 */
export function deleteProperty( target, prop, receiver = x => x, params = {} ) {
    // ---------------
    target = resolveObj( target );
    if ( _isObject( receiver ) ) { [ params, receiver ] = [ receiver, x => x ]; }
    // ---------------
    const props = _arrFrom( prop, false ), related = [ ...props ];
    return ( function next( descriptors, props, _done ) {
        if ( !props.length ) return _done( descriptors );
        const prop = props.shift();
        // ---------
        function defaultDel( descriptor, status = undefined ) {
            const _next = status => ( descriptor.status = status, next( descriptors.concat( descriptor ), props, _done ) );
            if ( arguments.length > 1 ) return _next( descriptor, status );
            const accessorizedProps = _( target, 'accessorizedProps', false );
            const accessorization = accessorizedProps && accessorizedProps.get( descriptor.key );
            if ( accessorization && !accessorization.restore() ) _next( false );
            return _next( Reflect.deleteProperty( target, descriptor.key ) );
        }
        // ---------
        function exec( oldValue ) {
            const descriptor = new Descriptor( target, {
                type: 'delete',
                key: prop,
                oldValue,
                related: [ ...related ],
                operation: 'deleteProperty',
                detail: params.detail,
            } );
            const listenerRegistry = TrapsRegistry.getInstance( target, false, params.namespace );
            return listenerRegistry 
                ? listenerRegistry.emit( descriptor, defaultDel ) 
                : defaultDel( descriptor );
        }
        // ---------
        return get( target, prop, exec, params );
        // ---------
    } )( [], props.slice( 0 ), descriptors => {
        const listenerRegistry = ListenerRegistry.getInstance( target, false, params.namespace );
        if ( listenerRegistry ) listenerRegistry.emit( descriptors );
        return receiver(
            isPropsList( prop/*original*/ ) ? descriptors.map( opr => opr.status ) : descriptors[ 0 ].status
        );
    } );
}

/**
 * @alias deleteProperty()
 */
export function deleteProperties( target, props, receiver = x => x, params = {} ) {
    return deleteProperty( ...arguments );
}

/* ---------------EFFECT APIs--------------- */

/**
 * Performs a "construct" operation.
 *
 * @param Array|Object	    target
 * @param Array			    argumentsList
 * @param Object		    newTarget
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function construct( target, argumentsList, newTarget = null, receiver = x => x, params = {} ) {
    return exec( target, 'construct', arguments.length > 2 ? { argumentsList, newTarget } : { argumentsList }, receiver, params );
}

/**
 * Performs an "apply" operation.
 *
 * @param Array|Object	    target
 * @param Any	            thisArgument
 * @param Array	            argumentsList
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function apply( target, thisArgument, argumentsList, receiver = x => x, params = {} ) {
    return exec( target, 'apply', { thisArgument, argumentsList }, receiver, params );
}

/**
 * Performs a "setPrototypeOf" operation.
 *
 * @param Array|Object	    target
 * @param Anyr	            proto
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function setPrototypeOf( target, proto, receiver = x => x, params = {} ) {
    return exec( target, 'setPrototypeOf', { proto }, receiver, params );
}

/**
 * Performs a "preventExtension" operation.
 *
 * @param Array|Object	    target
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function preventExtensions( target, receiver = x => x, params = {} ) {
    return exec( target, 'preventExtensions', {}, receiver, params );
}

/* ---------------HELPER APIs--------------- */

/**
 * Adds an observer to a target's registry.
 *
 * @param Array|Object	    target
 * @param String|Object	    prop
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Function: AbortController
 */
function bind( target, prop, receiver, params = {} ) {
    let controller;
    if ( !params.signal ) {
        controller = new AbortController;
        params = { ...params, signal: controller.signal };
        otherUtil.setMaxListeners?.( 0, controller.signal );
    }
    const listenerRegistry = ListenerRegistry.getInstance( target, true, params.namespace );
    return function emit( descriptor_s, prevRegistration = null ) {
        prevRegistration?.remove();
        const registrationNext = listenerRegistry.addRegistration( prop, emit, params );
        const flags = { signal: registrationNext.signal, };
        if ( arguments.length ) {
            const handlerReturnValue = receiver( descriptor_s, flags );
            if ( arguments.length > 1 ) return handlerReturnValue;
        }
        return controller;
    };
}

/**
 * Performs an operation of the given "type".
 *
 * @param Array|Object	    target
 * @param String		    operation
 * @param Object		    payload
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
function exec( target, operation, payload = {}, receiver = x => x, params = {} ) {
    // ---------
    target = resolveObj( target );
    if ( _isObject( receiver ) ) { [ params, receiver ] = [ receiver, x => x ]; }    
    // ---------
    function defaultExec( descriptor, result ) {
        if ( arguments.length > 1 ) return receiver( result );
        return receiver( ( Reflect[ operation ] || Object[ operation ] )( target, ...Object.values( payload ) ) );
    }
    // ---------
    const descriptor = new Descriptor( target, { operation, ...payload } );
    const listenerRegistry = TrapsRegistry.getInstance( target, false, params.namespace );
    if ( listenerRegistry ) {
        return listenerRegistry.emit( descriptor, defaultExec );
    }
    return defaultExec( descriptor );
}

// Asks if prop is a multi-result field
function isPropsList( prop ) {
    return prop === Infinity || Array.isArray( prop );
}

// Resolves obj down to it's self
function resolveObj( obj, assert = true ) {
	if ( ( !obj || !_isTypeObject( obj ) ) && assert ) throw new Error( `Object must be of type object or array! "${ _getType( obj ) }" given.` );
    if ( obj instanceof Descriptor ) {
        obj = obj.value;
    }
	return obj && unproxy( obj );
}

// Resolves prop down to actual keys
function resolveProps( obj, prop, receiver, params = {} ) {
    if ( prop === Infinity ) {
        if ( params.level && !_isTypeObject( obj ) ) return receiver( [] );
        return ownKeys( obj, receiver, params );
    }
    return receiver( _arrFrom( prop, false ) );
}
