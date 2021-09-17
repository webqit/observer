
/**
 * @imports
 */
import { _isTypeObject, _isFunction, _getType, _internals } from '@webqit/util/js/index.js';
import { _from as _arrFrom, _intersect, _equals as _arrEquals } from '@webqit/util/arr/index.js';
import { paths2D } from './utils.js'

/**
 * ---------------------------
 * The Firebase class
 * ---------------------------
 */

export default class Firebase {
	
	/**
	 * Initializes the instance.
	 *
	 * @param object	target
	 * 
	 * @return void
	 */
	constructor(target) {
		this.target = target;
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
				&& (!dfnFilter.length || _arrEquals(dfnFilter, fireableFilter))
				&& (!dfnTags.length || (dfnTags.length === fireableTags.length && _intersect(fireableTags, dfnTags).length === dfnTags.length));
		});
	}
		
	/**
	 * Returns a observer-specific object embedded on an element.
	 *
	 * @param string		type
	 * @param array|object	target
	 * @param bool      	createIfNotExists
	 * @param string      	namespace
	 *
	 * @return Firebase
	 */
	static _getFirebase(type, target, createIfNotExists = true, namespace = this.__namespace) {
		if (!_isTypeObject(target)) {
			throw new Error('Subject must be of type object; "' + _getType(target) + '" given!');
		}
		var ImplementationClass = this;
		if (namespace && globalThis.WebQitObserverNamespaceRegistry.has(type + '-' + namespace)) {
			ImplementationClass = globalThis.WebQitObserverNamespaceRegistry.get(type + '-' + namespace);
			type += '-' + namespace
		}
		if (!_internals(target, 'firebases').has(type) && createIfNotExists) {
			_internals(target, 'firebases').set(type, new ImplementationClass(target));
		}
		return _internals(target, 'firebases').get(type);
	}

	/**
	 * Extend a Fireable Class with a namespace.
	 *
	 * @param string		namespace
	 * @param class      	ImplementationClass
	 *
	 * @return void|class
	 */
	static _namespace(type, namespace, ImplementationClass = null) {
		type += '-' + namespace;
		if (arguments.length === 2) {
			return globalThis.WebQitObserverNamespaceRegistry.get(type);
		}
		if (!(ImplementationClass.prototype instanceof this)) {
			throw new Error(`The implementation of the namespace ${this.name}.${namespace} must be a subclass of ${this.name}.`);
		}
		globalThis.WebQitObserverNamespaceRegistry.set(type, ImplementationClass);
		ImplementationClass.__namespace = namespace;
	}
}

if (!globalThis.WebQitObserverNamespaceRegistry) {
	globalThis.WebQitObserverNamespaceRegistry = new Map();
}
