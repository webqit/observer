
/**
 * @imports
 */
import _exec from './_exec.js';

/**
 * Runs a "ownKeys" operation on a target.
 *
 * @param array|object	target
 * @param object		params
 *
 * @return array
 */
export default function(target, params = {}) {
	return _exec('ownKeys', target, {}, params);
}
