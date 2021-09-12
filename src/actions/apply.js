
/**
 * @imports
 */
import _exec from './_exec.js';

/**
 * Runs an "apply" operation on a target.
 *
 * @param array|object	target
 * @param object		thisArgument
 * @param array			argumentsList
 * @param object		params
 *
 * @return array
 */
export default function(target, thisArgument, argumentsList, params = {}) {
	return _exec('apply', target, { thisArgument, argumentsList }, params);
}
