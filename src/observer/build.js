
/**
 * @imports
 */
import _isTypeObject from '@onephrase/util/js/isTypeObject.js';
import _arrFrom from '@onephrase/util/arr/from.js';
import _before from '@onephrase/util/str/before.js';
import _after from '@onephrase/util/str/after.js';
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
	if (observers.build) {
		return;
	}
	observers.build = true;
	// ---------------------------------
	paths = _arrFrom(paths);
	// If any path starts with a dot, (a wild card path), all keys at this level is implied
	var keys = !paths.length || paths.filter(path => path.startsWith('.')).length
		? _keys(subject).filter(k => k.indexOf('.') === -1) 
		: paths.map(path => _before(path, '.'));
	var subkeys = paths.length ? paths.map(path => _after(path, '.')) : null;
	keys.forEach(key => {
		var value = _get(subject, key);
		if (_isTypeObject(value)) {
			link(subject, key, value);
			if ((subkeys || subtree)) {
				build(value, subkeys, subtree);
			}
		}
	});
}
