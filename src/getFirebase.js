
/**
 * @imports
 */
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _getType from '@webqit/util/js/getType.js';

/**
 * Returns an subject's firebase.
 *
 * @param array|object	subject
 * @param string      	firebaseKeyType
 * @param object      	Base
 *
 * @return Firebase
 */
export default function(subject, firebaseKeyType, Base = null) {
    if (!_isTypeObject(subject)) {
        throw new Error('Object must be of type subject; "' + _getType(subject) + '" given!');
    }
    var firebase, firebaseKeyTypeSymbol = Symbol.for(firebaseKeyType);
    if (!(firebase = subject[firebaseKeyTypeSymbol]) && Base) {
        firebase = new Base(subject);
        Object.defineProperty(subject, firebaseKeyTypeSymbol, {get: () => firebase, enumerable: false});
    }
    return firebase;
};