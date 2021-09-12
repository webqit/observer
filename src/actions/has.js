
/**
 * @imports
 */
import _exec from './_exec.js';

/**
 * Runs a "has" operation on a target.
 *
 * @param array|object	target
 * @param string		name
 * @param object		params
 *
 * @return array
 */
export default function(target, name, params = {}) {
	return _exec('has', target, { name }, params);
}
