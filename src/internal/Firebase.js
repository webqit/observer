
/**
 * @imports
 */
import _intersect from '@web-native-js/commons/arr/intersect.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import Fireable from './Fireable.js';

/**
 * ---------------------------
 * The Firebase class
 * ---------------------------
 */

export default class {
	
	/**
	 * Initializes the instance.
	 *
	 * @return void
	 */
	constructor() {
		this.fireables = [];
		this.currentlyFiringEvents = [];
	}
	
	/**
	 * Adds an Fireable instance
	 * with optional tags.
	 *
	 * @param Fireable			fireable
	 *
	 * @return Fireable
	 */
	addFireable(fireable) {
		this.fireables.push(fireable);
		return fireable;
	}
	
	/**
	 * Removes an Fireable instance
	 * with optional tags.
	 *
	 * @param Fireable			fireable
	 * @param array				tags
	 *
	 * @return void
	 */
	removeFireable(fireable, tags = []) {
		this.fireables = this.fireables.filter(_fireable => _fireable !== fireable);
	}
	
	/**
	 * Finds the Observer instances
	 * with the given query parameters.
	 *
	 * @param object			query
	 *
	 * @return array
	 */
	findFireables(query) {
		return this.fireables.filter(observer => {
			var observerParams = observer.params || {};
			var observerTags = observerParams.tags || [];
			var queryParams = query.params || {};
			var queryTags = queryParams.tags || [];
			return (!query.handler || observer.handler === query.handler)
				&& (!queryParams.type || observerParams.type === queryParams.type)
				&& (
					(!queryTags.length && !observerTags.length) 
					|| _intersect(observerTags, queryTags).length === observerTags.length
				);
		});
	}
	
	/**
	 * Create an object's firebase.
	 *
	 * @param array|object	object
	 * @param string		type
	 *
	 * @return Firebase
	 */
	static createForTarget (object, type, Base) {
		if (object && _isTypeObject(object)) {
			var firebases;
			if (!(firebases = object[firebaseKey])) {
				firebases = {};
				Object.defineProperty(object, firebaseKey, {
					get:() => firebases,
					set:value => {
						if (value !== firebases) {
							throw new Error('Attempt to overwrite the "' + firebaseKey + '" special property!');
						}
					},
					enumerable:false,
				});
			}
			firebases[type] = type === 'listeners' ? new Base(object) : new Base;
			return firebases[type];
		}
	}
	
	/**
	 * Returns an object's firebase.
	 *
	 * @param array|object	object
	 * @param string		type
	 *
	 * @return Firebase
	 */
	static getForTarget(object, type) {
		var firebases;
		if (object && _isTypeObject(object) && (firebases = object[firebaseKey])) {
			return firebases[type];
		}
	}
};

/**
 * @var string
 */
const firebaseKey = '.reflex';
