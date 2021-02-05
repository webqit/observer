
/**
 * @imports
 */
import _any from '@webqit/util/arr/any.js';
import _isNumeric from '@webqit/util/js/isNumeric.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _isObject from '@webqit/util/js/isObject.js';
import Fireable from '../Fireable.js';
import { paths2D, pathsIs2D, pathIsSame, pathsIsDynamic, paths2DIsDynamic, pathStartsWith, pathAfter } from '../pathUtils.js'
import Event from './Event.js';

/**
 * ---------------------------
 * The Observer class
 * ---------------------------
 */

export default class extends Fireable {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object		subject
	 * @param object			dfn
	 *
	 * @return void
	 */
	constructor(subject, dfn) {
		super(subject, dfn);
		// The rest of this code is designed for a 2-dimensional array.
		this.filters2D = paths2D(this.filter);
		this.filtersIsOriginally2D = pathsIs2D(this.filter);
		this.filtersIsDynamic = paths2DIsDynamic(this.filters2D);
		if (this.filtersIsDynamic && this.filters2D.length > 1) {
			throw new Error('Only one "Dynamic Filter" must be observed at a time! "' + this.filters2D.map(pathArray => '[' + pathArray.join(', ') + ']').join(', ') + '" have been bound together.');
		}

	}
	
	/**
	 * Calls the observer's handler function
	 * on matching with the event's filter.
	 *
	 * @param array			 	changes
	 *
	 * @return void
	 */
	fire(changes) {
		if (this.disconnected || (this.params.type && !_any(changes, delta => this.params.type === delta.type))) {
			return;
		}
		const diff = delta => ['set', 'def'].includes(delta.type) 
			&& (!this.params.diff || (_isFunction(this.params.diff) ? this.params.diff(delta.value, delta.oldValue) : delta.value !== delta.oldValue));
		var evt = new Event(this.subject);
		if (this.filters2D.length) {
			var matches = changes.filter(delta => {
				// one observerPathArray can turn out to be two if dynamic
				// OR evt.originatingFields is multiple and this.params.subtree
				return this.filters2D.filter((observerPathArray, i) => {
					var observerPathArray_Resolved = this.filtersIsDynamic 
						? observerPathArray.map((seg, k) => seg || seg === 0 ? seg : delta.path[k] || '')
						: observerPathArray;
					return (!this.filtersIsDynamic || !pathsIsDynamic(observerPathArray_Resolved)) && diff(delta) && ((!this.params.subtree && pathIsSame(observerPathArray_Resolved, delta.path))
						|| (!this.params.subtree && this.params.suptree && pathStartsWith(observerPathArray_Resolved, delta.path) && (!_isNumeric(this.params.suptree) || pathAfter(observerPathArray_Resolved, delta.path).length <= this.params.suptree))
						|| (this.params.subtree && delta.path.length > observerPathArray_Resolved.length && pathStartsWith(delta.path, observerPathArray_Resolved) && (!_isNumeric(this.params.subtree) || pathAfter(delta.path, observerPathArray_Resolved).length <= this.params.subtree))
					);
				}).length;
			});
			if (matches.length) {
				if (this.filtersIsOriginally2D || this.params.subtree) {
					var changesObject = matches;
					if (_isObject(this.filter)) {
						changesObject = {...this.filter};
						changes.forEach((e, i) => {
							changesObject[e.name] = e;
						});
					}
					evt.respondWith(this.handler(changesObject, evt));
				} else {
					changes.forEach((e, i) => {
						evt.respondWith(this.handler(e, evt));
					});
				}
			}
		} else if ((this.params.subtree || changes.filter(delta => pathIsSame(delta.path, [delta.name])).length === changes.length) && changes.filter(delta => diff(delta)).length) {
			evt.respondWith(this.handler(changes, evt));
		}
		return evt;
	}
};
