
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
     var webqitFootprint, webqitFootprintSymbol = Symbol.for('.webqit');
     if (!(webqitFootprint = subject[webqitFootprintSymbol])) {
         webqitFootprint = {};
         Object.defineProperty(subject, webqitFootprintSymbol, {value: webqitFootprint, enumerable: false});
     }
     if (!webqitFootprint.observer) {
         webqitFootprint.observer = {};
     }
     if (!webqitFootprint.observer[prop] && Base) {
         webqitFootprint.observer[prop] = new Base(subject);
     }
     return webqitFootprint.observer[prop];
 }