
/**
 * @imports
 */
import { expect } from 'chai';
import Observers from '../src/core/Observers.js';
import Interceptors from '../src/core/Interceptors.js';
import observe from '../src/reactions/observe.js';
import intercept from '../src/reactions/intercept.js';
import set from '../src/actions/set.js';
import get from '../src/actions/get.js';
import accessorize from '../src/actors/accessorize.js';
import unaccessorize from '../src/actors/unaccessorize.js';
import proxy from '../src/actors/proxy.js';
import unproxy from '../src/actors/unproxy.js';

describe(`Test: .observe() + .set()`, function() {

    describe(`Observe all changes.`, function() {

        it(`Should recieve an event of one change on setting one prop.`, function() {
            var obj = {}, _changes;
            // -----
            observe(obj, changes => {
                _changes = changes;
            });
            // -----
            set(obj, {
                key1: 'value1',
            });
            // -----
            expect(_changes).to.be.an('array').with.length(1);
        });

        it(`Should recieve an event of two changes on batch-setting two props.`, function() {
            var obj = {}, _changes;
            // -----
            observe(obj, changes => {
                _changes = changes;
            });
            // -----
            set(obj, {
                key1: 'value1',
                key2: 'value2',
            });
            // -----
            expect(_changes).to.be.an('array').with.length(2);
        });

    });

    describe(`Observe with namespaces.`, function() {

        var obj = {},
            ObserversCustomAddMethodCalled = false,
            InterceptorsCustomAddMethodCalled = false,
            _changesRecieved = [];
        class Observers2 extends Observers {
            // Catch when fireables added.
            add(...args) {
                ObserversCustomAddMethodCalled = true;
                return super.add(...args);
            }
        }
        class Interceptors2 extends Interceptors {
            // Catch when fireables added.
            add(...args) {
                InterceptorsCustomAddMethodCalled = true;
                return super.add(...args);
            }
        }
        Observers.namespace('ns1', Observers2);
        Interceptors.namespace('ns1', Interceptors2);

        it(`Should assert that methods of an Observers namespace class are called.`, function() {
            observe(obj, changes => {
                _changesRecieved.push(changes);
            }, {
                namespace: 'ns1',
            });
            expect(ObserversCustomAddMethodCalled).to.be.true;
        });
        
        it(`Should that "events" off the namespace dont't leak.`, function() {
            ObserversCustomAddMethodCalled = false;
            InterceptorsCustomAddMethodCalled = false;
            observe(obj, () => {});
            set(obj, {
                key1: 'value1',
                key2: 'value2',
            });
            expect(_changesRecieved).to.be.an('array').with.lengthOf(0);
            expect(ObserversCustomAddMethodCalled).to.be.false;
            expect(InterceptorsCustomAddMethodCalled).to.be.false;
        });

        it(`Should assert that methods of an Interceptors namespace class are called.`, function() {
            InterceptorsCustomAddMethodCalled = false;
            intercept(obj, 'set', (e, recieved, next) => {
                return next();
            }, {
                namespace: 'ns1',
            });
            expect(InterceptorsCustomAddMethodCalled).to.be.true;
        });

        it(`Should assert that interceptor was called.`, function() {
            var handlerWasCalled;
            intercept(obj, {
                set: (e, recieved, next) => {
                    handlerWasCalled = e.value;
                    return next('new val');
                },
            });
            set(obj, 'someProp', 'some val');
            expect(handlerWasCalled).to.be.eq('some val');
            expect(obj.someProp).to.be.eq('new val');
        });
        
        it(`Should assert that "custom events" in the namespace fire.`, function() {
            _changesRecieved = [];
            Observers2.getFirebase(obj).fire([{
                name: 'costum-name', // required
                type: 'costum-type', // required
            }]);
            expect(_changesRecieved[0][0]).to.be.an('object').that.includes({ name: 'costum-name', type: 'costum-type', });
        });
        
        it(`Should that "set" operations in the namespace are recieved.`, function() {
            _changesRecieved = [];
            set(obj, {
                key1: 'value1',
                key2: 'value2',
            }, {
                namespace: 'ns1',
            });
            expect(_changesRecieved[0]).to.be.an('array').with.length(2);
        });

    });

    describe(`Observe paths.`, function() {

        it(`Observe a one-level path of an object.`, function() {
            var obj = {}, _change;
            // -----
            observe(obj, 'key1', change => {
                _change = change;
            });
            // -----
            set(obj, {
                key1: 'value1',
            });
            // -----
            expect(_change).to.be.an('object').that.includes({ name: 'key1', type: 'set', });
        });

        it(`Observe a two-level path of an object.`, function() {
            var obj = {}, _changes = [];
            // -----
            observe(obj, ['key1', 'sub.key1'], change => {
                _changes.push(change);
            });
            // -----
            set(obj, {
                key1: {},
                key2: {},
            });
            set(obj.key1, {
                'sub.key1': {},
                subkey1: {},
            });
            // -----
            expect(_changes).to.have.lengthOf(1);
            expect(_changes[0]).to.be.an('object').that.deep.includes({ name: 'key1', path: [ 'key1', 'sub.key1' ], type: 'set', });
        });

        it(`Observe path 0 of an array.`, function() {
            var arr = [], _changes = [];
            // -----
            observe(arr, 0, change => {
                _changes.push(change);
            });
            // -----
            set(arr, 0, {});
            // -----
            expect(_changes).to.have.lengthOf(1);
            expect(_changes[0]).to.be.an('object').that.deep.includes({ name: 0, path: [ 0 ], type: 'set', });
        });

        it(`Observe path [0, 'key1'] of an array.`, function() {
            var arr = [], _changes = [];
            // -----
            observe(arr, [0, 'key1'], change => {
                _changes.push(change);
            });
            // -----
            set(arr, 0, {});
            set(arr[0], 'key1', {});
            // -----
            expect(_changes).to.have.lengthOf(1);
            expect(_changes[0]).to.be.an('object').that.deep.includes({ name: 0, path: [ 0, 'key1' ], type: 'set', });
        });

        it(`Observe wildcard paths.`, function() {
            var obj = {}, _changes = [];
            // -----
            observe(obj, ['key1', ,], change => {
                _changes.push(change);
            });
            // -----
            set(obj, {
                key1: {},
                key2: {},
            });
            set(obj.key1, {
                'sub.key1': {},
                subkey1: {},
            });
            // -----
            expect(_changes).to.have.lengthOf(2);
            expect(_changes[0]).to.be.an('object').that.deep.includes({ name: 'key1', path: [ 'key1', 'sub.key1' ], type: 'set', });
        });

        it(`Observe path [0] and subtree of an array.`, function() {
            var arr = [], _changes = [];
            // -----
            observe(arr, 0, change => {
                _changes.push(change);
            }, {subtree: true});
            // -----
            set(arr, 0, {});
            set(arr[0], 'key1', {});
            // -----
            expect(_changes).to.have.lengthOf(2);
            expect(_changes[1][0]).to.be.an('object').that.deep.includes({ name: 0, path: [ 0, 'key1' ], type: 'set', });
        });

    });

    describe(`Accessorize/unaccessorize.`, function() {

        it(`Should report a change on setting an accessorized prop. Should report nothing after unaccessorizing the prop.`, function() {
            var obj = {}, _changes = [];
            // -----
            observe(obj, changes => {
                _changes.push(changes);
            });
            // -----
            var accessorizeFlag = accessorize(obj, 'key1');
            obj.key1 = 'value1'; // Should fire event
            // -----
            var unaccessorizeFlag = unaccessorize(obj, 'key1');
            obj.key1 = 'value1-b'; // Should not fire event
            // -----
            expect(accessorizeFlag).to.be.true;
            expect(unaccessorizeFlag).to.be.true;
            expect(_changes).to.be.an('array').with.length(1);
        });

        it(`Should report a change on setting an immutable accessorized prop. Should be unable to unaccessorize the immutable prop. Should report additional changes`, function() {
            var obj = {}, _changes = [];
            // -----
            observe(obj, changes => {
                _changes.push(changes);
            });
            // -----
            var accessorizeFlag = accessorize(obj, 'key1', { configurable: false });
            obj.key1 = 'value1'; // Should fire event
            // -----
            var unaccessorizeFlag = unaccessorize(obj, 'key1');
            obj.key1 = 'value1-b'; // Should still fire event
            // -----
            expect(accessorizeFlag).to.be.true;
            expect(unaccessorizeFlag).to.be.false;
            expect(_changes).to.be.an('array').with.length(2);
        });

    });

    describe(`Proxy/unproxy.`, function() {

        it(`Should report a change on setting a prop on a proxied instance.`, function() {
            var obj = {}, _changes = [];
            // -----
            observe(obj, changes => {
                _changes.push(changes);
            });
            // -----
            var _obj = proxy(obj);
            _obj.key1 = 'value1'; // Should fire event
            _obj.key2 = 'value2'; // Should fire event
            // -----
            expect(_obj === obj).to.be.false;
            expect(unproxy(_obj) === obj).to.be.true;
            expect(_changes).to.be.an('array').with.length(2);
        });

    });

    describe(`Accessorize/unaccessorize.`, function() {

        it(`Should report just a change on PROGRAMMATICALLY setting an already ACCESSORIZED prop.`, function() {
            var obj = {}, _changes = [];
            // -----
            observe(obj, changes => {
                _changes.push(changes);
            });
            // -----
            accessorize(obj, 'key1');
            set(obj, 'key1', 'value1'); // Should fire just one event
            // -----
            obj.key1 = 'value1-b'; // Should fire event
            // -----
            expect(_changes).to.be.an('array').with.length(2);
        });

        it(`Should report just a change on PROGRAMMATICALLY setting an already ACCESSORIZED prop of a PROXIED instance.`, function() {
            var obj = {}, _changes = [];
            // -----
            observe(obj, changes => {
                _changes.push(changes);
            });
            // -----
            accessorize(obj, 'key1');
            var _obj = proxy(obj);
            set(_obj, 'key1', 'value1'); // Should fire just one event
            // -----
            obj.key1 = 'value1-b'; // Should fire event
            // -----
            expect(_changes).to.be.an('array').with.length(2);
        });

    });

});