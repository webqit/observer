
/**
 * @imports
 */
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _getType from '@webqit/util/js/getType.js';

/**
 * Returns a observer-specific object embedded on an element.
 *
 * @param array|object	subject
 * @param string      	firebaseKeyType
 * @param object      	Base
 *
 * @return Firebase
 */
export default function(subject, prop, Base = null) {
    if (!_isTypeObject(subject)) {
        throw new Error('Subject must be of type object; "' + _getType(subject) + '" given!');
    }
    var webqitStub, webqitStubSymbol = Symbol.for('.webqit');
    if (!(webqitStub = subject[webqitStubSymbol])) {
        Object.defineProperty(subject, webqitStubSymbol, {value: {}, enumerable: false});
    }
    if (!webqitStub.observer) {
        webqitStub.observer = {};
    }
    if (!webqitStub.observer[prop] && Base) {
        webqitStub.observer[prop] = new Base(subject);
    }
    return webqitStub.observer[prop];
}