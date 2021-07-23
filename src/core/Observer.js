
/**
 * @imports
 */
import {
	_after as _arrAfter, _startsWith as _arrStartsWith,
	_any, _equals as _arrEquals,
} from '@webqit/util/arr/index.js';
import { _isNumeric, _isFunction, _isObject } from '@webqit/util/js/index.js';
import { paths2D, pathsIs2D, pathsIsDynamic, paths2DIsDynamic } from './utils.js'
import Fireable from './Fireable.js';
import Event from './Event.js';

/**
 * ---------------------------
 * The Observer class
 * ---------------------------
 */

export default class Observer extends Fireable {
	
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
		const diff = delta => !['set', 'def'].includes(delta.type) || (
			!this.params.diff || (_isFunction(this.params.diff) ? this.params.diff(delta.value, delta.oldValue) : delta.value !== delta.oldValue)
		);
		var evt = new Event(this.subject);
		if (this.filters2D.length) {
			var matches = changes.filter(delta => {
				// one observerPathArray can turn out to be two if dynamic
				// OR evt.originatingFields is multiple and this.params.subtree
				return this.filters2D.filter((observerPathArray, i) => {
					var observerPathArray_Resolved = observerPathArray.slice();
					if (this.filtersIsDynamic) {
						// Note that if we had tried to loop thru observerPathArray_Resolved,
						// we wouldn't be able tp access slots that are truly empty, as in: [ 'key', <1 empty item> ]
						delta.path.forEach((_seg, i) => {
							observerPathArray_Resolved[i] = observerPathArray_Resolved[i] || observerPathArray_Resolved[i] === 0 
								? observerPathArray_Resolved[i]
								: _seg;
						});
					}
<<<<<<< HEAD
					return (!this.filtersIsDynamic || !pathsIsDynamic(observerPathArray_Resolved)) && diff(delta) && ((!this.params.subtree && _arrEquals(observerPathArray_Resolved, delta.path))
=======
					return (!this.filtersIsDynamic || !pathsIsDynamic(observerPathArray_Resolved)) && diff(delta) && ((!this.params.subtree && _equals(observerPathArray_Resolved, delta.path))
>>>>>>> 61da1201f3c0964bfa06d65c69f2e564f3ef6e38
						|| (this.params.suptree && _arrStartsWith(observerPathArray_Resolved, delta.path) && (!_isNumeric(this.params.suptree) || _arrAfter(observerPathArray_Resolved, delta.path).length <= this.params.suptree))
						|| (this.params.subtree && delta.path.length >= observerPathArray_Resolved.length && _arrStartsWith(delta.path, observerPathArray_Resolved) && (!_isNumeric(this.params.subtree) || _arrAfter(delta.path, observerPathArray_Resolved).length <= this.params.subtree))
					);
				}).length;
			});
			if (matches.length) {
				if (this.filtersIsOriginally2D || this.params.subtree) {
					var changesObject = matches;
					if (_isObject(this.filter)) {
						changesObject = {...this.filter};
						matches.forEach((e, i) => {
							changesObject[e.name] = e;
						});
					}
					evt.respondWith(this.handler(changesObject, evt));
				} else {
					matches.forEach((e, i) => {
						evt.respondWith(this.handler(e, evt));
					});
				}
			}
<<<<<<< HEAD
		} else if ((this.params.subtree || changes.filter(delta => _arrEquals(delta.path, [delta.name])).length === changes.length) && changes.filter(delta => diff(delta)).length) {
=======
		} else if ((this.params.subtree || changes.filter(delta => _equals(delta.path, [delta.name])).length === changes.length) && changes.filter(delta => diff(delta)).length) {
>>>>>>> 61da1201f3c0964bfa06d65c69f2e564f3ef6e38
			evt.respondWith(this.handler(changes, evt));
		}
		return evt;
	}
}
