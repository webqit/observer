
/**
 * @imports
 */
import _exec from './_exec.js';

/**
 * Runs a "construct" operation on a target.
 *
 * @param array|object	target
 * @param array			argumentsList
 * @param object		newTarget
 * @param object		params
 *
 * @return array
 */
export default function(target, argumentsList, newTarget = null, params = {}) {
	return _exec('construct', target, arguments.length > 2 ? { argumentsList, newTarget } : { argumentsList }, params);
}
