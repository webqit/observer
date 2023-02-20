
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
 * @param Array|Object	    context
 * @param Array	            path
 * @param Function	        receiver
 * @param Function	        final
 * @param Object	        params
 * 
 * @example deep( object, [ segement1, segement2 ], observe, ( value, isEvent, listener ) => {}, params );
 *
 * @return Any
 */
export function deep( context, path, receiver, final, params = {} ) {
    return ( function eat( context, _path, _params, ...args ) {
        const segment = _path.shift();
        return receiver( context, segment, ( result, ...args ) => {
            // -----------
            const getParams = () => ( { ..._params, level: _params.level + 1, } );
            const addPath = obj => {
                if ( obj instanceof Event ) { obj.path = ( context instanceof Event ? context.path : [] ).concat( obj.name ); }
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
    } )( context, path.slice( 0 ), { ...params, level: 0 } );
}

/**
 * Adds an observer to an target's registry.
 *
 * @param Array|Object	    context
 * @param String|Object	    prop
 * @param Function	        receiver
 * @param Object		    params
 * @param ListenerRegistration|AbortController controller
 * @param Bool              isEvent
 *
 * @return ListenerRegistration|AbortController
 */
export function observe( context, prop, receiver, params = {}, isEvent = false, controller = null ) {
    // ---------------
    context = resolveObj( context );
	if ( _isFunction( arguments[ 1 ] ) ) {
        [ , receiver, params = {}, controller = null ] = arguments;
        prop = Infinity;
	}
	if ( !_isFunction( receiver ) ) throw new Error( `Handler must be a function; "${ _getType( receiver ) }" given!` );
    if ( !controller ) { controller = new AbortController; }
    // ---------------
    const listenerRegistry = ListenerRegistry.getInstance( context, true, params.namespace );
    get( context, prop, event_s => {
        ( function exec( event_s, prevRegistration = null ) {
            prevRegistration && prevRegistration.remove();
            const registrationNext = listenerRegistry.addRegistration( prop, exec, { ...params, signal: controller.signal } );
            receiver( event_s, ( isEvent || ( prevRegistration ? true : false ) )/* isEvent */, registrationNext );
        } )( event_s );
    }, { ...params, asEvent: true } );
    return controller;
}

/**
 * Adds a events object to an target's registry.
 *
 * @param Array|Object	    context
 * @param Object	        traps
 * @param Object		    params
 *
 * @return AbortRegistry
 */
export function intercept( context, traps, params = {} ) {
    // ---------------
    context = resolveObj( context );
    if ( !_isObject( traps ) ) {
        [ /*context*/, /*type*/, /*handler*/, params = {} ] = arguments;
        traps = { [ arguments[ 1 ] ]: arguments[ 2 ] };
    }
    // ---------------
    return TrapsRegistry.getInstance( context, true, params.namespace ).addRegistration( { traps, params } );
}

/* ---------------QUERY APIs--------------- */

/**
 * Performs a "getOwnPropertyDescriptor" event.
 *
 * @param Array|Object	    context
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function getOwnPropertyDescriptor( context, prop, receiver = x => x, params = {} ) {
    return exec( context, 'getOwnPropertyDescriptor', { name: prop }, receiver, params );
}

/**
 * Performs a "getOwnPropertyDescriptors" event.
 * @note this isn't part of the standard Reflect API.
 *
 * @param Array|Object	    context
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function getOwnPropertyDescriptors( context, prop, receiver = x => x, params = {} ) {
    return exec( context, 'getOwnPropertyDescriptors', { name: prop }, receiver, params );
}

/**
 * Performs a "getPrototypeOf" event.
 *
 * @param Array|Object	    context
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function getPrototypeOf( context, receiver = x => x, params = {} ) {
    return exec( context, 'getPrototypeOf', {}, receiver, params );
}

/**
 * Performs a "isExtensible" event.
 *
 * @param Array|Object	    context
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function isExtensible( context, receiver = x => x, params = {} ) {
    return exec( context, 'isExtensible', {}, receiver, params );
}

/**
 * Performs a "ownKeys" event.
 *
 * @param Array|Object	    context
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function ownKeys( context, receiver = x => x, params = {} ) {
    return exec( context, 'ownKeys', {}, receiver, params );
}

/**
 * Performs an event of the given "type".
 *
 * @param Array|Object	    context
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function has( context, prop, receiver = x => x, params = {} ) {
    return exec( context, 'has', { name: prop }, receiver, params );
}

/**
 * Performs a get event.
 *
 * @param Array|Object	    context
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object	        params
 *
 * @return Any
 */
export function get( context, prop, receiver = x => x, params = {} ) {
    // ---------------
    context = resolveObj( context );
    if ( _isObject( receiver ) ) { [ params, receiver ] = [ receiver, x => x ]; }
    // ---------------
    return resolveProps( context, prop, props => {
        const related = [ ...props ];
        return ( function next( results, _props, _done ) {
            if ( !_props.length ) return _done( results );
            const prop = _props.shift();
            // ---------
            function defaultGet( event, value = undefined ) {
                const _next = value => ( event.value = value, next( results.concat( params.asEvent ? event : value ), _props, _done ) );
                if ( arguments.length > 1 ) return _next( value );
                const accessorizedProps = _internals( context, 'accessorizedProps', false );
                const accessorization = accessorizedProps && accessorizedProps.get( event.name );
                if ( accessorization && accessorization.intact() ) {
                    return _next( accessorization.getValue() );
                }
                return _next( Reflect.get( context, event.name, ...( params.receiver ? [ params.receiver ] : [] ) ) );
            }
            // ---------
            const event = new Event( context, {
                type: 'get',
                name: prop,
                value: undefined,
                related,
            } );
            const listenerRegistry = TrapsRegistry.getInstance( context, false, params.namespace );
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
 * @param Object	        context
 * @param String|Number	    prop
 * @param Any	            value
 * @param Function	        receiver
 * @param Object	        params
 * @param Bool	            def
 *
 * @return Any
 */
export function set( context, prop, value, receiver = x => x, params = {}, def = false ) {
    // ---------------
    context = resolveObj( context );
    let entries = [ [ prop, value ] ];
    if ( _isObject( prop ) ) {
        [ /*context*/, /*hash*/, receiver = x => x, params = {}, def = false ] = arguments;
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
            const accessorizedProps = _internals( context, 'accessorizedProps', false );
            const accessorization = accessorizedProps && accessorizedProps.get( event.name );
            if ( event.type === 'defineProperty' ) {
                if ( accessorization && !accessorization.restore() ) _next( false );
                Object.defineProperty( context, event.name, event.value );
                return _next( true );
            }
            if ( accessorization && accessorization.intact() ) {
                return _next( accessorization.setValue( event.value ) );
            }
            return _next( Reflect.set( context, event.name, event.value ) );
        }
        // ---------
        function exec( isUpdate, oldValue ) {
            const event = new Event( context, {
                type: def ? 'defineProperty' : 'set',
                name: prop,
                value,
                isUpdate,
                oldValue,
                related: [ ...related ],
                detail: params.detail,
            } );
            const listenerRegistry = TrapsRegistry.getInstance( context, false, params.namespace );
            return listenerRegistry 
                ? listenerRegistry.emit( event, defaultSet ) 
                : defaultSet( event );
        }
        // ---------
        return has( context, prop, isUpdate => {
            if ( !isUpdate || params.oldValue !== true ) return exec( isUpdate );
            return get( context, prop, oldValue => exec( isUpdate, oldValue ), params );
        }, params );
        // ---------
    } )( [], entries.slice( 0 ), events => {
        const listenerRegistry = ListenerRegistry.getInstance( context, false, params.namespace );
        if ( listenerRegistry ) listenerRegistry.emit( events );
        return receiver(
            isPropsList( prop/*original*/ ) ? events.map( opr => opr.status ) : events[ 0 ].status
        );
    } );
}

/**
 * Performs a defineProperty event.
 * 
 * @param Object	        context
 * @param String|Number	    prop
 * @param Object	        descriptor
 * @param Function	        receiver
 * @param Object	        params
 *
 * @return Any
 */
export function defineProperty( context, prop, descriptor, receiver = x => x, params = {} ) {
    return set( context, prop, descriptor, receiver, params, true/*def*/ );
}

/**
 * Performs a defineProperties event.
 * @note this isn't part of the standard Reflect API.
 * 
 * @param Object	        context
 * @param Object	        descriptors
 * @param Function	        receiver
 * @param Object	        params
 *
 * @return Any
 */
export function defineProperties( context, descriptors, receiver = x => x, params = {} ) {
    return set( context, descriptors, receiver, params, true/*def*/ );
}

/**
 * Performs a delete event.
 * 
 * @param Object	        context
 * @param String|Number	    prop
 * @param Function	        receiver
 * @param Object	        params
 *
 * @return Any
 */
export function deleteProperty( context, prop, receiver = x => x, params = {} ) {
    // ---------------
    context = resolveObj( context );
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
            const accessorizedProps = _internals( context, 'accessorizedProps', false );
            const accessorization = accessorizedProps && accessorizedProps.get( event.name );
            if ( accessorization && !accessorization.restore() ) _next( false );
            return _next( Reflect.deleteProperty( context, event.name ) );
        }
        // ---------
        function exec( oldValue ) {
            const event = new Event( context, {
                type: 'deleteProperty',
                name: prop,
                oldValue,
                related: [ ...related ],
                detail: params.detail,
            } );
            const listenerRegistry = TrapsRegistry.getInstance( context, false, params.namespace );
            return listenerRegistry 
                ? listenerRegistry.emit( event, defaultDel ) 
                : defaultDel( event );
        }
        // ---------
        if ( params.oldValue === false ) return exec();
        return get( context, prop, exec, params );
        // ---------
    } )( [], props.slice( 0 ), events => {
        const listenerRegistry = ListenerRegistry.getInstance( context, false, params.namespace );
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
 * @param Array|Object	    context
 * @param Array			    argumentsList
 * @param Object		    newTarget
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function construct( context, argumentsList, newTarget = null, receiver = x => x, params = {} ) {
    return exec( context, 'construct', arguments.length > 2 ? { argumentsList, newTarget } : { argumentsList }, receiver, params );
}

/**
 * Performs a "apply" event.
 *
 * @param Array|Object	    context
 * @param Any	            thisArgument
 * @param Array	            argumentsList
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function apply( context, thisArgument, argumentsList, receiver = x => x, params = {} ) {
    return exec( context, 'apply', { thisArgument, argumentsList }, receiver, params );
}

/**
 * Performs a "setPrototypeOf" event.
 *
 * @param Array|Object	    context
 * @param Anyr	            proto
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function setPrototypeOf( context, proto, receiver = x => x, params = {} ) {
    return exec( context, 'setPrototypeOf', { proto }, receiver, params );
}

/**
 * Performs a "preventExtension" event.
 *
 * @param Array|Object	    context
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
export function preventExtensions( context, receiver = x => x, params = {} ) {
    return exec( context, 'preventExtensions', {}, receiver, params );
}

/* ---------------HELPER APIs--------------- */

/**
 * Performs an event of the given "type".
 *
 * @param Array|Object	    context
 * @param String		    type
 * @param Object		    payload
 * @param Function	        receiver
 * @param Object		    params
 *
 * @return Any
 */
function exec( context, type, payload = {}, receiver = x => x, params = {} ) {
    // ---------
    context = resolveObj( context );
    if ( _isObject( receiver ) ) { [ params, receiver ] = [ receiver, x => x ]; }    
    // ---------
    function defaultExec( event, result ) {
        if ( arguments.length > 1 ) return receiver( result );
        return receiver( Reflect[ type ]( context, ...Object.values( payload ) ) );
    }
    // ---------
    const event = new Event( context, { type, ...payload } );
    const listenerRegistry = TrapsRegistry.getInstance( context, false, params.namespace );
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
