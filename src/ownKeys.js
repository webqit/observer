
/**
 * @imports
 */
import _getProps from './_getProps.js';

/**
 * Runs a "ownKeys" query operation on a target.
 * Fires any such query observers that may be bound to target.
 *
 * @param array|object	target
 *
 * @return array
 */
export default function(target) {
	return _getProps(true/*ownKeys*/, ...arguments);
}
