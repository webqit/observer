
/**
 * @imports
 */
import _crossJoin from '@webqit/util/arr/crossJoin.js';
import _any from '@webqit/util/arr/any.js';
import _arrFrom from '@webqit/util/arr/from.js';
import _isNumeric from '@webqit/util/js/isNumeric.js';
import _isFunction from '@webqit/util/js/isFunction.js';
import _isArray from '@webqit/util/js/isArray.js';
import _isObject from '@webqit/util/js/isObject.js';
import _commonsGet from '@webqit/util/obj/get.js';
import _get from '../interceptor/get.js';
import Fireable from '../Fireable.js';
import Delta from './Delta.js';
import Event from './Event.js';
import {
	paths2D, pathsIs2D, pathIsSame, pathsIsDynamic, paths2DIsDynamic, pathStartsWith, pathAfter
} from '../pathUtils.js'

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
			var observerPathArray_Resolved_Exploded = [];
			var matches = this.filters2D.filter((observerPathArray, i) => {
				observerPathArray_Resolved_Exploded[i] = [];
				// one observerPathArray can turn out to be two if dynamic
				// and evt.originatingFields is multiple
				return changes.filter(delta => {
					var observerPathArray_Resolved = this.filtersIsDynamic 
						? observerPathArray.map((seg, k) => seg || seg === 0 ? seg : delta.path[k] || '')
						: observerPathArray;
					if (!observerPathArray_Resolved_Exploded[i].filter(_dynamicFieldOutcome => pathIsSame(_dynamicFieldOutcome, observerPathArray_Resolved)).length) {
						observerPathArray_Resolved_Exploded[i].push(observerPathArray_Resolved);
					}
					return (pathIsSame(observerPathArray_Resolved, delta.path)
						|| (this.params.suptree !== false && pathStartsWith(observerPathArray_Resolved, delta.path) && (!_isNumeric(this.params.suptree) || pathAfter(observerPathArray_Resolved, delta.path).length <= this.params.suptree))
						|| (this.params.subtree && pathStartsWith(delta.path, observerPathArray_Resolved) && (!_isNumeric(this.params.subtree) || pathAfter(delta.path, observerPathArray_Resolved).length <= this.params.subtree))
					) && (!this.filtersIsDynamic || !pathsIsDynamic(observerPathArray_Resolved)) && diff(delta);
				}).length;
			}).length;
			if (matches) {
				_crossJoin(observerPathArray_Resolved_Exploded).forEach(pathArrays => {
					var _changes = this.formatChanges(pathArrays, changes);
					if (this.filtersIsOriginally2D) {
						var changesObject = _changes;
						if (_isObject(this.filter)) {
							changesObject = {};
							_each(this.filter, (name, pathArray, i) => {
								changesObject[name] = _changes[i];
							});
						}
						evt.respondWith(this.handler(changesObject, evt));
					} else {
						evt.respondWith(this.handler(_changes[0], evt));
					}
				});
			}
		} else if ((this.params.subtree || changes.filter(delta => pathIsSame(delta.path, [delta.name])).length === changes.length) && changes.filter(delta => diff(delta)).length) {
			evt.respondWith(this.handler(changes, evt));
		}
		return evt;
	}
	
	/**
	 * Validates a proposed fire operation.
	 *
	 * @param array		 	pathArrays
	 * @param array			changes
	 *
	 * @return bool
	 */
	formatChanges(pathArrays, changes) {
		return this.params.data === false ? [] : pathArrays.map(pathArray => {
			// --------------------------
			var match = changes.reduce((match, delta) => match || (
				pathIsSame(pathArray, delta.path)
				|| (this.params.suptree && pathStartsWith(pathArray, delta.path))
				|| (this.params.subtree && pathStartsWith(delta.path, pathArray))
				? delta : null
			), null);
			if (!match) {
				var paddableMatch = changes.reduce(
					(match, delta) => match || pathStartsWith(pathArray, delta.path) ? delta : null, null
				);
				if (paddableMatch) {
					var pathArrayPadding = pathAfter(pathArray, paddableMatch.path);
					var delta = {
						type: paddableMatch.type,
						name: paddableMatch.name,
						derived: true,
						src: paddableMatch,
					};
					if (paddableMatch.type === 'del' || paddableMatch.isUpdate) {
						delta.oldValue = _commonsGet(paddableMatch.oldValue, pathArrayPadding, {get:_get});
					}
					if (paddableMatch.type !== 'del') {
						delta.value = _commonsGet(paddableMatch.value, pathArrayPadding, {get:_get});
					}
					match = new Delta(paddableMatch.subject, delta);
				} else {
					match = new Delta(this.subject, {
						type: 'get',
						name: pathArray[0],
						path: pathArray,
						value: _commonsGet(this.subject, pathArray, {get:_get}),
						derived: true,
					});
				}
			}
			return match;
		});
	}
};
