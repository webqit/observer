import { _isObject, _isTypeObject, _isFunction, _getType } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import { _wq, _await, env } from './util.js';
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
 * Creates a "Subtree" directive.
 * 
 * @return Subtree
 */
class Subtree extends Array {}
export function subtree() {
    return new Subtree;
}

/**
 * Creates an "Infinity" directive.
 * 
 * @return Infinity
 */
export function any() {
    return Infinity;
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
    const _isSubtree = path instanceof Subtree;
    if ( !_isSubtree && !path?.length ) return;
    return ( function eat( target, path, $params, $isSubtree ) {
        const isSubtree = $isSubtree || path[ $params.level ] instanceof Subtree;
        const segment = isSubtree ? Infinity : path[ $params.level ];
        const isLastSegment = isSubtree ? false : $params.level === path.length - 1;
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
            const addTrail = ( desc ) => {
                if ( !( desc instanceof Descriptor ) ) return;
                desc.path = 'key' in desc ? [ desc.key ] : [];
                if ( target instanceof Descriptor ) {
                    desc.path = 'key' in desc ? target.path.concat( desc.key ) : target.path.slice( 0 );
                    Object.defineProperty( desc, 'context', { get: () => target, configurable: true } );
                }
            };
            const flags = args[ 0 ] || {};
            const advance = ( result ) => {
                if ( result instanceof Descriptor && 'argumentsList' in result ) {
                    return;
                }
                const $value = resolveObj( result/* a Descriptor who's value could be proxied */, false );
                return _await( $value/* could be a promise */, $value => {
                    if ( result instanceof Descriptor ) {
                        result.value = $value; // Update to (fulfilled), unproxied, value
                    } else {
                        result = $value;
                    }
                    return eat( result, path, { ...$params, ...flags, keyInParent: result.key, level: $params.level + 1, }, isSubtree );
                } );
            };
            // -----------
            if ( isPropsList( segment ) && Array.isArray( result ) ) {
                result.forEach( addTrail );
                if ( isLastSegment ) {
                    return final( result, ...args );
                }
                if ( isSubtree && result[ 0 ] instanceof Descriptor && ( result[ 0 ].operation !== 'get' || params.asGet ) ) {
                    final( result, ...args );
                }
                for ( const entry of result ) {
                    advance( entry );
                }
                return;
            }
            // -----------
            addTrail( result );
            if ( isLastSegment ) {
                return final( result, ...args );
            }
            return advance( result );
            // -----------
        }, $params );
    } )( target, path.slice( 0 ), { ...params, level: 0 }, _isSubtree );
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
    const originalTarget = resolveObj( target, !params.level );
	if ( _isFunction( arguments[ 1 ] ) ) {
        [ , receiver, params = {} ] = arguments;
        prop = Infinity;
	}
	if ( !_isFunction( receiver ) ) throw new Error( `Handler must be a function; "${ _getType( receiver ) }" given!` );
    if ( prop instanceof Path || prop instanceof Subtree ) return reduce( originalTarget, prop, observe, receiver, params );
    // ---------------
    params = { ...params, descripted: true };
    delete params.live;
    if ( !_isTypeObject( originalTarget ) ) return params.probe && get( originalTarget, prop, receiver, params ) || undefined;
    // ---------------
    const emit = bind( originalTarget, prop, receiver, params );
    if ( params.probe ) {
        return get( originalTarget, prop, emit, params );
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
    const originalTarget = resolveObj( target );
    if ( !_isObject( traps ) ) {
        [ /*target*/, /*operation*/, /*handler*/, params = {} ] = arguments;
        traps = { [ arguments[ 1 ] ]: arguments[ 2 ] };
    }
    // ---------------
    return TrapsRegistry.getInstance( originalTarget, true, params.namespace ).addRegistration( { traps, params } );
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
    if ( _isObject( receiver ) ) {
        [ params, receiver ] = [ receiver, x => x ];
    } else if ( params.live ) { isLive = true; }
    if ( prop instanceof Path || prop instanceof Subtree ) return reduce( originalTarget, prop, get, receiver, { ...params, asGet: true } );
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
                const accessorizedProps = _wq( originalTarget, 'accessorizedProps', false );
                const accessorization = accessorizedProps && accessorizedProps.get( descriptor.key );
                if ( accessorization && accessorization.intact() ) {
                    return _next( accessorization.getValue( params.withPropertyDescriptors ) );
                }
                if ( params.withPropertyDescriptors ) {
                    const desc = Object.getOwnPropertyDescriptor( originalTarget, descriptor.key );
                    return _next( desc );
                }
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
                const emit = bind( originalTarget, prop, receiver, params, target.key );
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
    const originalTarget = resolveObj( target );
    return ListenerRegistry.getInstance( originalTarget, true, params.namespace ).batch( callback, params );
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
export function map( source, target, params = {} ) {
    target = resolveObj( target );
    source = resolveObj( source );
    const only = ( params.only || [] ).slice( 0 ), except = ( params.except || [] ).slice( 0 );
    const sourceKeys = Object.keys( params.spread ? [ ...source ] : source ).map( k => !isNaN( k ) ? parseInt( k ) : k );
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
                if ( m.type === 'delete' ) return deleteProperty( target, resolveKey( m.key ), params );
                if ( m.type === 'def' ) {
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
            const accessorizedProps = _wq( originalTarget, 'accessorizedProps', false );
            const accessorization = accessorizedProps && accessorizedProps.get( descriptor.key );
            if ( descriptor.type === 'def' ) {
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
            if ( prop === 'length' && Array.isArray( originalTarget ) && _wq( originalTarget ).has( '$length' ) ) {
                return exec( true, _wq( originalTarget ).get( '$length' ) );
            }
            const $params = { ...params, withPropertyDescriptors: def };
            return get( originalTarget, prop, oldValue => exec( exists, oldValue ), $params );
        }, params );
        // ---------
    } )( [], entries.slice( 0 ), descriptors => {
        const listenerRegistry = ListenerRegistry.getInstance( originalTarget, false, params.namespace );
        if ( listenerRegistry ) listenerRegistry.emit( descriptors, { eventsArePropertyDescriptors: !!def } );
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
    const originalTarget = resolveObj( target );
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
            const accessorizedProps = _wq( originalTarget, 'accessorizedProps', false );
            const accessorization = accessorizedProps && accessorizedProps.get( descriptor.key );
            if ( accessorization && !accessorization.restore() ) _next( false );
            return _next( Reflect.deleteProperty( originalTarget, descriptor.key ) );
        }
        // ---------
        function exec( oldValue ) {
            const descriptor = new Descriptor( originalTarget, {
                type: 'delete',
                key: prop,
                oldValue,
                related: [ ...related ],
                operation: 'deleteProperty',
                detail: params.detail,
            } );
            const trapsRegistry = TrapsRegistry.getInstance( originalTarget, false, params.namespace );
            return trapsRegistry 
                ? trapsRegistry.emit( descriptor, defaultDel ) 
                : defaultDel( descriptor );
        }
        // ---------
        return get( originalTarget, prop, exec, params );
        // ---------
    } )( [], props.slice( 0 ), descriptors => {
        const listenerRegistry = ListenerRegistry.getInstance( originalTarget, false, params.namespace );
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
    const originalThis = unproxy( thisArgument );
    let returnValue;
    if ( Array.isArray( thisArgument ) ) {
        if ( params.arrayMethodName ) {
            const descriptor = new Descriptor( originalThis, {
                operation: params.arrayMethodName,
                argumentsList
            } );
            const listenerRegistry = ListenerRegistry.getInstance( originalThis, false, params.namespace );
            listenerRegistry?.emit( [ descriptor ], { eventIsArrayMethodDescriptor: true } );
        }
        _wq( originalThis ).set( '$length', originalThis.length );
        returnValue = batch(
            originalThis,
            () => exec( target, 'apply', { thisArgument/*proxy wrappers allowed; in fact is why it works*/, argumentsList }, receiver, params ),
            params
        );
        _wq( originalThis ).delete( '$length' );
    } else {
        returnValue = exec( target, 'apply', { thisArgument: originalThis, argumentsList }, receiver, params );
    }
    return returnValue;
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
    const controller = new AbortController;
    env.setMaxListeners?.( 0, controller.signal );
    if ( params.signal ) { params.signal.addEventListener( 'abort', () => controller.abort() ); }
    const $params = { ...params, signal: controller.signal };
    const listenerRegistry = ListenerRegistry.getInstance( target, true, $params.namespace );
    const childRegistrations = new Map;
    return function emit( descriptor_s = [], prevRegistration = null ) {
        let flags, registrationNext, isExisting;
        if ( isPropsList( prop ) ) {
            if ( prevRegistration ) {
                isExisting = true;
                registrationNext = prevRegistration;
                for ( const descriptor of descriptor_s ) {
                    childRegistrations.get( descriptor.key )?.remove();
                    childRegistrations.delete( descriptor.key );
                }
            } else {
                registrationNext = listenerRegistry.addRegistration( prop, emit, $params );
            }
            flags = { signal: registrationNext.signal, childRegistrations };
        } else {
            prevRegistration?.remove();
            registrationNext = listenerRegistry.addRegistration( prop, emit, $params );
            flags = { signal: registrationNext.signal };
        }
        // ------------------
        if ( $params.childRegistrations && $params.keyInParent ) {
            $params.childRegistrations.set( $params.keyInParent, registrationNext );
        }
        // ------------------
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
    const trapsRegistry = TrapsRegistry.getInstance( target, false, params.namespace );
    if ( trapsRegistry ) {
        return trapsRegistry.emit( descriptor, defaultExec );
    }
    return defaultExec( descriptor );
}

// Asks if prop is a multi-result field
function isPropsList( prop ) {
    return prop === Infinity || Array.isArray( prop );
}

// Resolves obj down to it's self
function resolveObj( obj, assert = true, probePropertyDescriptors = true ) {
	if ( ( !obj || !_isTypeObject( obj ) ) && assert ) throw new Error( `Object must be of type object or array! "${ _getType( obj ) }" given.` );
    if ( obj instanceof Descriptor ) {
        if ( obj.type === 'def' && probePropertyDescriptors ) {
            obj = typeof obj.value.get === 'function' ? obj.value.get() : obj.value.value;
        } else {
            obj = obj.value;
        }
    }
	return obj && unproxy( obj );
}

// Resolves prop down to actual keys
function resolveProps( obj, prop, receiver, params = {} ) {
    if ( prop === Infinity ) {
        if ( params.level && !_isTypeObject( obj ) ) return receiver( [] );
        return receiver( Object.keys( obj ) );
    }
    return receiver( _arrFrom( prop, false ) );
}
