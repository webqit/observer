
/**
 * @imports
 */
import { paths2D } from '../pathUtils.js'
import _isTypeObject from '@webqit/util/js/isTypeObject.js';
import _arrFrom from '@webqit/util/arr/from.js';
import _before from '@webqit/util/str/before.js';
import _after from '@webqit/util/str/after.js';
import _keys from '../interceptor/keys.js';
import _get from '../interceptor/get.js';
import getObservers from './getObservers.js';
import link from './link.js';

/**
 * Recursively "connects" an object's members to the object
 * for observer actions.
 *
 * @param array|object	subject
 * @param string|array	paths
 * @param bool			subtree
 *
 * @return void
 */
export default function build(subject, paths = null, subtree = false) {
	if (!subject || !_isTypeObject(subject)) {
		throw new Error('Target must be of type object!');
	}
	var observers = getObservers(subject);
	if (!observers || observers.build) {
		return;
	}
	observers.build = subtree;
	// ---------------------------------
	// For paths2D, refer to the comments at class Observer.
	var _paths2D = paths2D(paths);
	// If any path starts with a dot, (a wild card path), all keys at this level is implied
	var rootLevelKeysToObserve = !_paths2D.length || _paths2D.filter(path => /*Starts with an empty segment*/!path[0] && path[0] !== 0).length
		? _keys(subject)
		: _paths2D.map(path => path[0]);
	var subLevelKeysToObserve = _paths2D.length ? _paths2D.map(path => path.slice(1)).filter(p => p.length) : null;
	observers.subBuild = subLevelKeysToObserve && subLevelKeysToObserve.length ? subLevelKeysToObserve : null;
	rootLevelKeysToObserve.forEach(key => {
		var value = _get(subject, key);
		try {
			if (_isTypeObject(value)) {
				link(subject, key, value);
				if ((observers.subBuild && isUserObject(value)) 
				|| (_isFunction(subtree) ? subtree(value) : (subtree && isUserObject(value)))) {
					build(value, observers.subBuild, subtree);
				}
			}
		} catch(e) {/* instanceof-ing certain primitives may throw */}
	});
};

/**
 * Tells if an object if a User Object.
 * 
 * @param Object value
 * 
 * @return Bool
 */
export const isUserObject = value => ((value instanceof Object) || (value instanceof Array) || (value instanceof Function))
	&& (typeof window === 'undefined' || value !== window);
