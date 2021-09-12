
/**
 * @imports
 */
import _exec from './_exec.js';

/**
 * Runs a "getOwnPropertyDescriptor" operation on a target.
 *
 * @param array|object	target
 * @param string|number name
 * @param object		params
 *
 * @return array
 */
export default function(target, name, params = {}) {
	return _exec('getOwnPropertyDescriptor', target, { name }, params);
}
