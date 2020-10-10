
/**
 * @imports
 */
import _isTypeObject from '@onephrase/util/js/isTypeObject.js';
import _isFunction from '@onephrase/util/js/isFunction.js';
import _getType from '@onephrase/util/js/getType.js';

/**
 * Returns an subject's firebase.
 *
 * @param array|object	subject
 * @param string      	firebaseKey
 * @param object      	Base
 *
 * @return Firebase
 */
export default function(subject, firebaseKey, Base = null) {
    if (!_isTypeObject(subject)) {
        throw new Error('Object must be of type subject; "' + _getType(subject) + '" given!');
    }
    var firebase;
    if (!(firebase = subject[firebaseKey]) && Base) {
        try {
            firebase = new Base(subject);
            Object.defineProperty(subject, firebaseKey, {
                get:() => firebase,
                set:value => {
                    if (value !== firebase) {
                        throw new Error('Attempt to overwrite the "' + firebaseKey + '" special property!');
                    }
                },
                enumerable:false,
            });
        } catch(e) {}
    }
    return firebase;
};