
/**
 * @imports
 */
import _exec from './_exec.js';

/**
 * Runs a "setPrototypeOf" operation on a target.
 *
 * @param array|object	target
 * @param object		prototype
 * @param object		params
 *
 * @return array
 */
export default function(target, prototype, params = {}) {
	return _exec('setPrototypeOf', target, { prototype }, params);
}
