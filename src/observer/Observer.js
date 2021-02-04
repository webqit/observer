
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
			var observerPathArray_Dynamic_Exploded = [];
			var eventsPathArray_Subtree_Combined = [];
			var matches = this.filters2D.filter((observerPathArray, i) => {
				// one observerPathArray can turn out to be two if dynamic
				// OR evt.originatingFields is multiple and this.params.subtree
				return changes.filter(delta => {
					var observerPathArray_Resolved = this.filtersIsDynamic 
						? observerPathArray.map((seg, k) => seg || seg === 0 ? seg : delta.path[k] || '')
						: observerPathArray;
					var eventPathMatch = (pathIsSame(observerPathArray_Resolved, delta.path)
						|| (this.params.suptree !== false && pathStartsWith(observerPathArray_Resolved, delta.path) && (!_isNumeric(this.params.suptree) || pathAfter(observerPathArray_Resolved, delta.path).length <= this.params.suptree))
						|| (this.params.subtree && pathStartsWith(delta.path, observerPathArray_Resolved) && (!_isNumeric(this.params.subtree) || pathAfter(delta.path, observerPathArray_Resolved).length <= this.params.subtree))
					) && (!this.filtersIsDynamic || !pathsIsDynamic(observerPathArray_Resolved)) && diff(delta);
					if (eventPathMatch) {
						// Add delta.path if is subtree path
						if (delta.path.length > observerPathArray_Resolved.length) {
							// Add delta.path if not already exists
							if (!eventsPathArray_Subtree_Combined.filter(_path => pathIsSame(_path, delta.path)).length) {
								eventsPathArray_Subtree_Combined.push(delta.path);
							}
						} else {
							if (!observerPathArray_Dynamic_Exploded[i]) {
								observerPathArray_Dynamic_Exploded[i] = [];
							}
							// Add observerPathArray_Resolved if not already exists
							if (!observerPathArray_Dynamic_Exploded[i].filter(_dynamicFieldOutcome => pathIsSame(_dynamicFieldOutcome, observerPathArray_Resolved)).length) {
								observerPathArray_Dynamic_Exploded[i].push(observerPathArray_Resolved);
							}
						}
						return true;
					}
				}).length;
			}).length;
			if (matches) {
				/**
				 * observerPathArray_Dynamic_Exploded is 3D of this.filters2D, i.e:
				 * this.filters2D: 								[ 0:path1, 1:path2, 2:path3, ]
				 * this.observerPathArray_Dynamic_Exploded: 	[ 0:[path1], 1:[path2], 2:[path3], ]
				 * 
				 * This structure especially becomes useful where this.filters2D has dynamic paths,
				 * OR where evt.originatingFields is multiple and this.params.subtree, i.e:
				 * this.filters2D: 								[ 0:explodable_path1, 1:explodable_path2, 2:path3, ]
				 * this.observerPathArray_Dynamic_Exploded: 	[ 0:[path1_a, path1_b], 1:[path2_a, path2_b], 2:[path3], ]
				 * 
				 * Now, _crossJoin([ ['path1_a', 'path1_b'], ['path2_a', 'path2_b'], ['path3'], ]);
				 * [["path1_a","path2_a","path3"],["path1_a","path2_b","path3"],["path1_b","path2_a","path3"],["path1_b","path2_b","path3"]]
				 * 
				 * Thus, in the case of the dynamic paths, handler is called 4 times - all possible combination of paths
				 */
				var deliveryBatches = [];
				if (eventsPathArray_Subtree_Combined.length) {
					// As one batch
					deliveryBatches.push(eventsPathArray_Subtree_Combined);
				}
				if (observerPathArray_Dynamic_Exploded.length) {
					// As multiple batches
					deliveryBatches.push(..._crossJoin(observerPathArray_Dynamic_Exploded));
				}
				deliveryBatches.forEach(deliveryBatch => {
					var _changes = this.formatChanges(deliveryBatch, changes);
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
