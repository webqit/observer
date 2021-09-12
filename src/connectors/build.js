
/**
 * @imports
 */
import { _isTypeObject } from '@webqit/util/js/index.js';
import { _from as _arrFrom } from '@webqit/util/arr/index.js';
import { _before, _after } from '@webqit/util/str/index.js';
import { paths2D } from '../core/utils.js';
import Observers from '../core/Observers.js';
import _get from '../actions/get.js';
import link from './link.js';

/**
 * Recursively "connects" an object's members to the object
 * for observer actions.
 *
 * @param array|object	target
 * @param string|array	paths
 * @param bool			subtree
 * @param String		namespace
 *
 * @return void
 */
export default function build(target, paths = null, subtree = false, namespace = null) {
	if (!target || !_isTypeObject(target)) {
		throw new Error('Target must be of type object!');
	}
	var observers = Observers.getFirebase(target, true, namespace);
	if (!observers || observers.build) {
		return;
	}
	observers.build = subtree;
	// ---------------------------------
	// For paths2D, refer to the comments at class Observer.
	var _paths2D = paths2D(paths);
	// If any path starts with a dot, (a wild card path), all keys at this level is implied
	var rootLevelKeysToObserve = !_paths2D.length || _paths2D.filter(path => /*Starts with an empty segment*/!path[0] && path[0] !== 0).length
		? Object.keys(target)
		: _paths2D.map(path => path[0]);
	var subLevelKeysToObserve = _paths2D.length ? _paths2D.map(path => path.slice(1)).filter(p => p.length) : null;
	observers.subBuild = subLevelKeysToObserve && subLevelKeysToObserve.length ? subLevelKeysToObserve : null;
	rootLevelKeysToObserve.forEach(key => {
		var value = _get(target, key, null, { namespace });
		try {
			if (_isTypeObject(value)) {
				link(target, key, value, null, params);
				if ((observers.subBuild && isUserObject(value)) 
				|| (_isFunction(subtree) ? subtree(value) : (subtree && isUserObject(value)))) {
					build(value, observers.subBuild, subtree, namespace);
				}
			}
		} catch(e) {/* instanceof-ing certain primitives may throw */}
	});
}

/**
 * Tells if an object if a User Object.
 * 
 * @param Object value
 * 
 * @return Bool
 */
export const isUserObject = value => ((value instanceof Object) || (value instanceof Array) || (value instanceof Function))
	&& (typeof window === 'undefined' || value !== window);
