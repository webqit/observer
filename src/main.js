
/**
 * @imports
 */
import { _internals, _isObject, _isTypeObject, _isFunction, _getType } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import ListenerRegistry from './core/ListenerRegistry.js';
import TrapsRegistry from './core/TrapsRegistry.js';
import Event from './core/Event.js';
import { unproxy } from './actors.js';

/* ---------------SPECIAL APIs--------------- */

/**
 * Reduces a path array against handler.
 * 
 * @param Array|Object	    target
 * @param Array	            path
 * @param Function	        receiver
 * @param Function	        final
 * @param Object	        params
 * 
 * @example deep( object, [ segement1, segement2 ], observe, ( value, isEvent, listener ) => {}, params );
 *
 * @return Any
 */
export function deep( target, path, receiver, final, params = {} ) {
    return ( function eat( target, _path, _params, ...args ) {
        const segment = _path.shift();
        return receiver( target, segment, ( result, ...args ) => {
            // -----------
            const getParams = () => ( { ..._params, level: _params.level + 1, } );
            const addPath = obj => {
                if ( !( obj instanceof Event ) ) return;
                obj.path = [ obj.key ];
                if ( target instanceof Event ) {
                    obj.path = target.path.concat( obj.key );
                    obj.context = target;
                }
            };
            // -----------
            if ( isPropsList( segment ) && Array.isArray( result ) ) {
                // -----------
                result.forEach( addPath );
                if ( !_path.length || ( !result.length && _params.midWayResults ) ) return final( result, ...args );
                return result.map( entry => eat( entry, _path.slice( 0 ), getParams(), ...args ) )
                // -----------
            }
            // -----------
            addPath( result );
            const $isTypeObject = _isTypeObject( resolveObj( result ) );
            if ( !_path.length || ( !$isTypeObject && _params.midWayResults ) ) return final( result, ...args );
            return $isTypeObject && eat( result, _path, getParams(), ...args );
            // -----------
        }, _params, ...args );
    } )( target, path.slice( 0 ), { ...params, level: 0 } );
}

/**
 * Adds an observer to a target's registry.
 *
 * @param Array|Object	    target
 * @param String|Object	    prop
 * @param Function	        receiver
 * @param Object		    params
 * @param ListenerRegistration|AbortController controller
 * @param Bool              isEvent
 *
 * @return ListenerRegistration|AbortController
 */
export function observe( target, prop, receiver, params = {}, isEvent = false, controller = null ) {
    // ---------------
    target = resolveObj( target );
	if ( _isFunction( arguments[ 1 ] ) ) {
        [ , receiver, params = {}, controller = null ] = arguments;
        prop = Infinity;
	}
	if ( !_isFunction( receiver ) ) throw new Error( `Handler must be a function; "${ _getType( receiver ) }" given!` );
    if ( !controller ) { controller = new AbortController; }
    // ---------------
    const listenerRegistry = ListenerRegistry.getInstance( target, true, params.namespace );
    get( target, prop, event_s => {
        ( function exec( event_s, prevRegistration = null ) {
            prevRegistration && prevRegistration.remove();
            const registrationNext = listenerRegistry.addRegistration( prop, exec, { ...params, signal: controller.signal } );
            receiver( event_s, ( isEvent || ( prevRegistration ? true : false ) )/* isEvent */, registrationNext );
        } )( event_s );
    }, { ...params, asEvent: true } );
    return controller;
}

/**
 * Adds an event object to a target's registry.
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
        [ /*target*/, /*type*/, /*handler*/, params = {} ] = arguments;
        traps = { [ arguments[ 1 ] ]: arguments[ 2 ] };
    }
    // ---------------
    return TrapsRegistry.getInstance( target, true, params.namespace ).addRegistration( { traps, params } );
}

/* ---------------QUERY APIs--------------- */

/**
 * Performs a "getOwnPropertyDescriptor" event.
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
 * Performs a "getOwnPropertyDescriptors" event.
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
 * Performs a "getPrototypeOf" event.
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
 * Performs a "isExtensible" event.
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
 * Performs a "ownKeys" event.
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
 * Performs an event of the given "type".
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
 * Performs a get event.
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
    target = resolveObj( target );
    if ( _isObject( receiver ) ) { [ params, receiver ] = [ receiver, x => x ]; }
    // ---------------
    return resolveProps( target, prop, props => {
        const related = [ ...props ];
        return ( function next( results, _props, _done ) {
            if ( !_props.length ) return _done( results );
            const prop = _props.shift();
            // ---------
            function defaultGet( event, value = undefined ) {
                const _next = value => ( event.value = value, next( results.concat( params.asEvent ? event : value ), _props, _done ) );
                if ( arguments.length > 1 ) return _next( value );
                const accessorizedProps = _internals( target, 'accessorizedProps', false );
                const accessorization = accessorizedProps && accessorizedProps.get( event.key );
                if ( accessorization && accessorization.intact() ) {
                    return _next( accessorization.getValue() );
                }
                return _next( Reflect.get( target, event.key, ...( params.receiver ? [ params.receiver ] : [] ) ) );
            }
            // ---------
            const event = new Event( target, {
                type: 'get',
                key: prop,
                value: undefined,
                related,
            } );
            const listenerRegistry = TrapsRegistry.getInstance( target, false, params.namespace );
            if ( listenerRegistry ) {
                return listenerRegistry.emit( event, defaultGet );
            }
            return defaultGet( event );
        } )( [], props, results => {
            return receiver( isPropsList( prop/*original*/ ) ? results : results[ 0 ] );
        } );
    } );
}

/* ---------------MUTATION APIs--------------- */

/**
 * Performs a set event.
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
    target = resolveObj( target );
    let entries = [ [ prop, value ] ];
    if ( _isObject( prop ) ) {
        [ /*target*/, /*hash*/, receiver = x => x, params = {}, def = false ] = arguments;
        entries = Object.entries( prop );
    }
    if ( _isObject( receiver ) ) { [ def, params, receiver ] = [ typeof params === 'boolean' ? params : false, receiver, x => x ]; }
    // ---------------
    const related = entries.map( ( [ prop ] ) => prop );
    return ( function next( events, entries, _done ) {
        if ( !entries.length ) return _done( events );
        const [ prop, value ] = entries.shift();
        // ---------
        function defaultSet( event, status = undefined ) {
            const _next = status => ( event.status = status, next( events.concat( event ), entries, _done ) );
            if ( arguments.length > 1 ) return _next( event, status );
            const accessorizedProps = _internals( target, 'accessorizedProps', false );
            const accessorization = accessorizedProps && accessorizedProps.get( event.key );
            if ( event.type === 'defineProperty' ) {
                if ( accessorization && !accessorization.restore() ) _next( false );
                Object.defineProperty( target, event.key, event.value );
                return _next( true );
            }
            if ( accessorization && accessorization.intact() ) {
                return _next( accessorization.setValue( event.value ) );
            }
            return _next( Reflect.set( target, event.key, event.value ) );
        }
        // ---------
        function exec( isUpdate, oldValue ) {
            const event = new Event( target, {
                type: def ? 'defineProperty' : 'set',
                key: prop,
                value,
                isUpdate,
                oldValue,
                related: [ ...related ],
                detail: params.detail,
            } );
            const listenerRegistry = TrapsRegistry.getInstance( target, false, params.namespace );
            return listenerRegistry 
                ? listenerRegistry.emit( event, defaultSet ) 
                : defaultSet( event );
        }
        // ---------
        return has( target, prop, isUpdate => {
            if ( !isUpdate || params.oldValue !== true ) return exec( isUpdate );
            return get( target, prop, oldValue => exec( isUpdate, oldValue ), params );
        }, params );
        // ---------
    } )( [], entries.slice( 0 ), events => {
        const listenerRegistry = ListenerRegistry.getInstance( target, false, params.namespace );
        if ( listenerRegistry ) listenerRegistry.emit( events );
        return receiver(
            isPropsList( prop/*original*/ ) ? events.map( opr => opr.status ) : events[ 0 ].status
        );
    } );
}

/**
 * Performs a defineProperty event.
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
 * Performs a defineProperties event.
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
 * Performs a delete event.
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
    const props = _arrFrom( prop ), related = [ ...props ];
    return ( function next( events, props, _done ) {
        if ( !props.length ) return _done( events );
        const prop = props.shift();
        // ---------
        function defaultDel( event, status = undefined ) {
            const _next = status => ( event.status = status, next( events.concat( event ), props, _done ) );
            if ( arguments.length > 1 ) return _next( event, status );
            const accessorizedProps = _internals( target, 'accessorizedProps', false );
            const accessorization = accessorizedProps && accessorizedProps.get( event.key );
            if ( accessorization && !accessorization.restore() ) _next( false );
            return _next( Reflect.deleteProperty( target, event.key ) );
        }
        // ---------
        function exec( oldValue ) {
            const event = new Event( target, {
                type: 'deleteProperty',
                key: prop,
                oldValue,
                related: [ ...related ],
                detail: params.detail,
            } );
            const listenerRegistry = TrapsRegistry.getInstance( target, false, params.namespace );
            return listenerRegistry 
                ? listenerRegistry.emit( event, defaultDel ) 
                : defaultDel( event );
        }
        // ---------
        if ( params.oldValue === false ) return exec();
        return get( target, prop, exec, params );
        // ---------
    } )( [], props.slice( 0 ), events => {
        const listenerRegistry = ListenerRegistry.getInstance( target, false, params.namespace );
        if ( listenerRegistry ) listenerRegistry.emit( events );
        return receiver(
            isPropsList( prop/*original*/ ) ? events.map( opr => opr.status ) : events[ 0 ].status
        );
    } );
}

/* ---------------EFFECT APIs--------------- */

/**
 * Performs a "construct" event.
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
 * Performs a "apply" event.
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
 * Performs a "setPrototypeOf" event.
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
 * Performs a "preventExtension" event.
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
 * Performs an event of the given "type".
 *
 * @param Array|Object	    target
 * @param String		    type
 * @param Object		    payload
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
function exec( target, type, payload = {}, receiver = x => x, params = {} ) {
    // ---------
    target = resolveObj( target );
    if ( _isObject( receiver ) ) { [ params, receiver ] = [ receiver, x => x ]; }    
    // ---------
    function defaultExec( event, result ) {
        if ( arguments.length > 1 ) return receiver( result );
        return receiver( Reflect[ type ]( target, ...Object.values( payload ) ) );
    }
    // ---------
    const event = new Event( target, { type, ...payload } );
    const listenerRegistry = TrapsRegistry.getInstance( target, false, params.namespace );
    if ( listenerRegistry ) {
        return listenerRegistry.emit( event, defaultExec );
    }
    return defaultExec( event );
}

// Asks if prop is a multi-result field
function isPropsList( prop ) {
    return prop === Infinity || Array.isArray( prop );
}

// Resolves obj down to it's self
function resolveObj( obj ) {
	if ( !obj || !_isTypeObject( obj ) ) throw new Error('Object must be of type object or array!');
    if ( obj instanceof Event ) {
        obj = obj.value;
    }
	return unproxy( obj );
}

// Resolves prop down to actual keys
function resolveProps( obj, prop, receiver ) {
    if ( prop === Infinity )  return ownKeys( obj, receiver );
    return receiver( _arrFrom( prop ) );
}
