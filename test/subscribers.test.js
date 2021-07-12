 
/**
 * @imports
 */
import { expect } from 'chai';
import Observers from '../src/core/Observers.js';
import Interceptors from '../src/core/Interceptors.js';
import observe from '../src/subscribers/observe.js';
import intercept from '../src/subscribers/intercept.js';
import set from '../src/operators/set.js';

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
        
        it(`Should that "events" off the namespace dont't leak.`, function() {
            observe(obj, () => {});
            set(obj, {
                key1: 'value1',
                key2: 'value2',
            });
            expect(_changesRecieved).to.be.an('array').with.lengthOf(0);
            expect(ObserversCustomAddMethodCalled).to.be.false;
            expect(InterceptorsCustomAddMethodCalled).to.be.false;
        });

        it(`Should assert that methods of an Observers namespace class are called.`, function() {
            observe(obj, changes => {
                _changesRecieved.push(changes);
            }, {
                namespace: 'ns1',
            });
            expect(ObserversCustomAddMethodCalled).to.be.true;
        });

        it(`Should assert that methods of an Interceptors namespace class are called.`, function() {
            intercept(obj, 'set', (e, recieved, next) => {
                return next();
            }, {
                namespace: 'ns1',
            });
            expect(InterceptorsCustomAddMethodCalled).to.be.true;
        });
        
        it(`Should assert that "custom events" in the namespace fire.`, function() {
            Observers2.getFirebase(obj).fire([{
                name: 'costum-name', // required
                type: 'costum-set', // required
            }]);
            expect(_changesRecieved[0][0]).to.be.an('object').that.includes({ name: 'costum-name', type: 'costum-set', });
        });
        
        it(`Should that "set" operations in the namespace are recieved.`, function() {
            set(obj, {
                key1: 'value1',
                key2: 'value2',
            }, {
                namespace: 'ns1',
            });
            expect(_changesRecieved[1]).to.be.an('array').with.length(2);
        });

    });
 
 });
  