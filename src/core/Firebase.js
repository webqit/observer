
/**
 * @imports
 */
import _arrFrom from '@webqit/util/arr/from.js';
import _intersect from '@webqit/util/arr/intersect.js';
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _getType from '@webqit/util/js/getType.js';
import _equals from '@webqit/util/arr/equals.js';
import { paths2D } from './pathUtils.js'

/**
 * ---------------------------
 * The Firebase class
 * ---------------------------
 */

export default class Firebase {
	
	/**
	 * Initializes the instance.
	 *
	 * @param object	subject
	 * 
	 * @return void
	 */
	constructor(subject) {
		this.subject = subject;
		this.fireables = [];
		this.currentlyFiring = [];
	}
	
	/**
	 * Adds an Fireable instance
	 * with optional tags.
	 *
	 * @param Fireable			fireable
	 *
	 * @return Fireable
	 */
	add(fireable) {
		this.fireables.push(fireable);
		return fireable;
	}
	
	/**
	 * Removes fireables by instance.
	 *
	 * @param Fireable			fireable
	 *
	 * @return void
	 */
	remove(fireable) {
		this.fireables = this.fireables.filter(_fireable => _fireable !== fireable);
	}
	
	/**
	 * Removes fireables by definition.
	 *
	 * @param object			dfn
	 *
	 * @return void
	 */
	removeMatches(dfn) {
		this.match(dfn).forEach(fireable => {
			this.fireables = this.fireables.filter(_fireable => _fireable !== fireable);
		});
	}
	
	/**
	 * Finds fireables by definition.
	 *
	 * @param object			dfn
	 *
	 * @return array
	 */
	match(dfn) {
		return this.fireables.filter(fireable => {
			var fireableFilter = paths2D(fireable.filter);
			var fireableTags = _arrFrom((fireable.params || {}).tags);
			// -----------------------
			var dfnFilter = paths2D(dfn.filter);
			var dfnTags = _arrFrom((dfn.params || {}).tags);
			// -----------------------
			return (!dfn.originalHandler || fireable.handler === dfn.originalHandler)
				&& (!dfnFilter.length || _equals(dfnFilter, fireableFilter))
				&& (!dfnTags.length || (dfnTags.length === fireableTags.length && _intersect(fireableTags, dfnTags).length === dfnTags.length));
		});
	}
		
	/**
	 * Returns a observer-specific object embedded on an element.
	 *
	 * @param array|object	subject
	 * @param bool      	createIfNotExists
	 * @param string      	namespace
	 *
	 * @return Firebase
	 */
	static getFirebase(subject, createIfNotExists = true, namespace = null) {
		var ImplementationClass = this;
		if (namespace && this._namespaces && this._namespaces.has(namespace)) {
			ImplementationClass = this._namespaces.get(namespace);
		}
		if (!_isTypeObject(subject)) {
			throw new Error('Subject must be of type object; "' + _getType(subject) + '" given!');
		}
		var webqitFootprint, webqitFootprintSymbol = Symbol.for('.webqit');
		if (!(webqitFootprint = subject[webqitFootprintSymbol])) {
			webqitFootprint = {};
			Object.defineProperty(subject, webqitFootprintSymbol, {value: webqitFootprint, enumerable: false});
		}
		if (!webqitFootprint.observer) {
			webqitFootprint.observer = new Map;
		}
		if (!webqitFootprint.observer.has(ImplementationClass) && createIfNotExists) {
			webqitFootprint.observer.set(ImplementationClass, new ImplementationClass(subject));
		}
		return webqitFootprint.observer.get(ImplementationClass);
	}

	/**
	 * Extend a Fireable Class with a namespace.
	 *
	 * @param string		namespace
	 * @param class      	ImplementationClass
	 *
	 * @return void|class
	 */
	static namespace(namespace, ImplementationClass = null) {
		if (!this._namespaces) {
			this._namespaces = new Map;
		}
		if (arguments.length === 1) {
			return this._namespaces.get(namespace);
		}
		if (!(ImplementationClass.prototype instanceof this)) {
			throw new Error(`The implementation of the namespace ${this.name}.${namespace} must be a subclass of ${this.name}.`);
		}
		this._namespaces.set(namespace, ImplementationClass);
	}
}