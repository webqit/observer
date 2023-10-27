
/**
 * @imports
 */
import { expect } from 'chai';
import Observer from '../src/index.js';
import TrapsRegistry from '../src/core/TrapsRegistry.js';
import ListenerRegistry from '../src/core/ListenerRegistry.js';

/*
const a = { one: 'val-one', two: 'val-two', three: 'val-three', four: 'val-four', five: 'val-five' }, b = {};
Observer.observe( b, m => {
    console.log( '----\\\\\\\\\\\\\\\----', m[0] );
} );
Observer.read( a, b, { only: ['one', 'two', 'seven'] } );
Observer.set( a, 'six', 'six' );
Observer.deleteProperty( a, 'two' );
Observer.defineProperty( a, 'seven', { get: () => 'seven', enumerable: true } );
console.log( '--------', b );
*/

describe( `Test: .observe() + .set()`, function() {

    describe( `Observe all changes.`, function() {

        it( `Should recieve an event of one change on setting one prop.`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.observe( obj, changes => {
                _changes.push( ...changes );
            } );
            // -----
            Observer.set( obj, {
                key1: 'value1',
            } );
            Observer.set( obj, {
                key1: 'value1',
            }, { diff: true } );
            // -----
            expect( _changes ).to.be.an( 'array' ).with.length( 1 );
        } );

        it( `Should recieve an event of two changes on batch-setting two props.`, function() {
            let obj = {}, _changes;
            // -----
            Observer.observe( obj, changes => {
                _changes = changes;
            } );
            // -----
            Observer.set( obj, {
                key1: 'value1',
                key2: 'value2',
            } );
            // -----
            expect( _changes ).to.be.an( 'array' ).with.length( 2 );
        } );

    } );

    describe( `Observe batched changes.`, function() {

        it( `Should recieve multiple event of different mutation types.`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.observe( obj, changes => {
                _changes.push( ...changes );
            } );
            // -----
            Observer.batch( obj, () => {
                // This call to observe will not recieve events from the batch
                Observer.observe( obj, changes => {
                    _changes.push( ...changes );
                } );
                Observer.set( obj, {
                    key1: 'value1',
                } );
                Observer.deleteProperty( obj, 'key1' );
            } );
            // -----
            expect( _changes ).to.be.an( 'array' ).with.length( 2 );
        } );
    } );

    describe( `Observe with namespaces.`, function() {

        let obj = {},
            ListenerRegistryCustomAddMethodCalled = false,
            TrapsRegistryCustomAddMethodCalled = false,
            _changesRecieved = [];
        class ListenerRegistry2 extends ListenerRegistry {
            // Catch when fireables added.
            addRegistration( ...args ) {
                ListenerRegistryCustomAddMethodCalled = true;
                return super.addRegistration( ...args );
            }
        }
        class TrapsRegistry2 extends TrapsRegistry {
            // Catch when fireables added.
            addRegistration( ...args ) {
                TrapsRegistryCustomAddMethodCalled = true;
                return super.addRegistration( ...args );
            }
        }
        ListenerRegistry.namespace( 'ns1', ListenerRegistry2 );
        TrapsRegistry.namespace( 'ns1', TrapsRegistry2 );

        it( `Should assert that methods of an Observers namespace class are called.`, function() {
            Observer.observe( obj, changes => {
                _changesRecieved.push( changes );
            }, {
                namespace: 'ns1',
            } );
            expect( ListenerRegistryCustomAddMethodCalled ).to.be.true;
        } );
        
        it( `Should that "events" off the namespace dont't leak.`, function() {
            _changesRecieved = [];
            ListenerRegistryCustomAddMethodCalled = false;
            TrapsRegistryCustomAddMethodCalled = false;
            Observer.observe( obj, () => {} );
            Observer.set( obj, {
                key1: 'value1',
                key2: 'value2',
            } );
            expect( _changesRecieved ).to.be.an( 'array' ).with.lengthOf( 0 );
            expect( ListenerRegistryCustomAddMethodCalled ).to.be.false;
            expect( TrapsRegistryCustomAddMethodCalled ).to.be.false;
        } );

        it( `Should assert that methods of an Interceptors namespace class are called.`, function() {
            TrapsRegistryCustomAddMethodCalled = false;
            Observer.intercept( obj, 'set', ( e, recieved, next ) => {
                return next();
            }, {
                namespace: 'ns1',
            } );
            expect( TrapsRegistryCustomAddMethodCalled ).to.be.true;
        } );

        it( `Should assert that interceptor was called.`, function() {
            let handlerWasCalled;
            Observer.intercept( obj, {
                set: ( e, recieved, next ) => {
                    handlerWasCalled = e.value;
                    e.value = 'new val';
                    return next();
                },
            } );
            Observer.set( obj, 'someProp', 'some val' );
            expect( handlerWasCalled ).to.be.eq( 'some val' );
            expect( obj.someProp ).to.be.eq( 'new val' );
        } );
        
        it( `Should assert that "custom events" in the namespace fire.`, function() {
            _changesRecieved = [];
            ListenerRegistry2.getInstance( obj ).emit( [ {
                key: 'costum-name', // required
                type: 'costum-type', // required
            } ] );
            expect( _changesRecieved[ 0 ][ 0 ] ).to.be.an( 'object' ).that.includes( { key: 'costum-name', type: 'costum-type', } );
        } );
        
        it( `Should that "set" events in the namespace are recieved.`, function() {
            _changesRecieved = [];
            Observer.set( obj, {
                key1: 'value1',
                key2: 'value2',
            }, {
                namespace: 'ns1',
            } );
            expect( _changesRecieved[ 0 ] ).to.be.an( 'array' ).with.length( 2 );
        } );

    } );

    describe( `Observe paths.`, function() {

        it( `Observe a one-level path of an object.`, function() {
            let obj = {}, _change;
            // -----
            Observer.observe( obj, 'key1', change => {
                _change = change;
            } );
            // -----
            Observer.set( obj, {
                key1: 'value1',
            } );
            // -----
            expect( _change ).to.be.an( 'object' ).that.includes( { key: 'key1', type: 'set', } );
        } );

        it( `Observe a two-level path of an object. (Using Observer.observe() with preflight option.)`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.reduce( obj, [ 'key1', 'sub.key1' ], Observer.observe, change => {
                _changes.push( change );
            }, { preflight: true } );
            // -----
            Observer.set( obj, {
                key1: {},
                key2: {},
            } );
            Observer.set( obj.key1, {
                'sub.key1': {},
                subkey1: {},
            } );
            // -----
            expect( _changes ).to.have.lengthOf( 2 );
            expect( _changes[ 0 ] ).to.be.an( 'object' ).that.deep.includes( { key: 'sub.key1', path: [ 'key1', 'sub.key1' ], type: 'get', value: undefined, } );
            expect( _changes[ 1 ] ).to.be.an( 'object' ).that.deep.includes( { key: 'sub.key1', path: [ 'key1', 'sub.key1' ], type: 'set', value: {}, } );
        } );

        it( `Observe a two-level path of an object. (Using Observer.get() with "live" option.)`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.reduce( obj, [ 'key1', 'sub.key1' ], Observer.get, change => {
                _changes.push( change );
            }, { live: true } );
            // -----
            Observer.set( obj, {
                key1: {},
                key2: {},
            } );
            Observer.set( obj.key1, {
                'sub.key1': {},
                subkey1: {},
            } );
            // -----
            expect( _changes ).to.have.lengthOf( 3 );
            expect( _changes[ 1 ] ).to.be.an( 'object' ).that.deep.includes( { key: 'sub.key1', path: [ 'key1', 'sub.key1' ], type: 'get', value: undefined, } );
            expect( _changes[ 2 ] ).to.be.an( 'object' ).that.deep.includes( { key: 'sub.key1', path: [ 'key1', 'sub.key1' ], type: 'set', value: {}, } );
        } );

        it( `Observe path 0 of an array.`, function() {
            let arr = [], _changes = [];
            // -----
            Observer.observe( arr, 0, change => {
                _changes.push( change );
            } );
            // -----
            Observer.set( arr, 0, {} );
            // -----
            expect( _changes ).to.have.lengthOf( 1 );
            expect( _changes[ 0 ] ).to.be.an( 'object' ).that.deep.includes( { key: 0, type: 'set', } );
        } );

        it( `Observe path [ 0, 'key1' ] of an array.`, function() {
            let arr = [], _changes = [];
            // -----
            Observer.reduce( arr, [ 0, 'key1' ], Observer.observe, change => {
                _changes.push( change );
            }, { preflight: true } );
            // -----
            Observer.set( arr, 0, {} );
            Observer.set( arr[ 0 ], 'key1', {} );
            // -----
            expect( _changes ).to.have.lengthOf( 2 );
            expect( _changes[ 0 ] ).to.be.an( 'object' ).that.deep.includes( { key: 'key1', path: [ 0, 'key1' ], type: 'get', } );
            expect( _changes[ 1 ] ).to.be.an( 'object' ).that.deep.includes( { key: 'key1', path: [ 0, 'key1' ], type: 'set', } );
        } );

        it( `Observe wildcard paths.`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.reduce( obj, [ 'key1', Infinity ], Observer.observe, change => {
                _changes.push( change );
            }, { preflight: true } );
            // -----
            Observer.set( obj, {
                key1: {},
                key2: {},
            } );
            Observer.set( obj.key1, {
                'sub.key1': {},
                subkey1: {},
            } );
            // -----
            expect( _changes ).to.have.lengthOf( 2 );
            expect( _changes[ 0 ] ).to.be.an( 'array' ).lengthOf( 0 );
            expect( _changes[ 1 ] ).to.be.an( 'array' ).lengthOf( 2 );
            expect( _changes[ 1 ][ 0 ] ).to.be.an( 'object' ).that.deep.includes( { key: 'sub.key1', path: [ 'key1', 'sub.key1' ], type: 'set', } );
        } );

    } );

    describe( `Accessorize/unaccessorize.`, function() {

        it( `Should report a change on setting an accessorized prop. Should report nothing after unaccessorizing the prop.`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.observe( obj, changes => {
                _changes.push( changes );
            } );
            // -----
            let accessorizeFlag = Observer.accessorize( obj, 'key11111' );
            obj.key11111 = 'value1'; // Should fire event
            // -----
            let unaccessorizeFlag = Observer.unaccessorize( obj, 'key11111' );
            obj.key11111 = 'value1-b'; // Should not fire event
            // -----
            expect( accessorizeFlag ).to.be.true;
            expect( unaccessorizeFlag ).to.be.true;
            expect( _changes ).to.be.an( 'array' ).with.length( 1 );
        } );

    } );

    describe( `Proxy/unproxy.`, function() {

        it( `Should report a change on setting a prop on a proxied instance.`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.observe( obj, changes => {
                _changes.push( changes );
            } );
            // -----
            let _obj = Observer.proxy( obj );
            _obj.key1 = 'value1'; // Should fire event
            _obj.key2 = 'value2'; // Should fire event
            // -----
            expect( _changes ).to.be.an( 'array' ).with.length( 2 );
            expect( _obj === obj ).to.be.false;
            expect( Observer.unproxy( _obj ) === obj ).to.be.true;
        } );

    } );

    describe( `Accessorize/unaccessorize.`, function() {

        it( `Should report just a change on PROGRAMMATICALLY setting an already ACCESSORIZED prop.`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.observe( obj, changes => {
                _changes.push( changes );
            } );
            // -----
            Observer.accessorize( obj, 'key1' );
            Observer.set( obj, 'key1', 'value1' ); // Should fire just one event
            // -----
            obj.key1 = 'value1-b'; // Should fire event
            // -----
            expect( _changes ).to.be.an( 'array' ).with.length( 2 );
        } );

        it( `Should report just a change on PROGRAMMATICALLY setting an already ACCESSORIZED prop of a PROXIED instance.`, function() {
            let obj = {}, _changes = [];
            // -----
            Observer.observe( obj, changes => {
                _changes.push( changes );
            } );
            // -----
            Observer.accessorize( obj, 'key1' );
            let _obj = Observer.proxy( obj );
            Observer.set( _obj, 'key1', 'value1' ); // Should fire just one event
            // -----
            obj.key1 = 'value1-b'; // Should fire event
            // -----
            expect( _changes ).to.be.an( 'array' ).with.length( 2 );
        } );

    } );

} );