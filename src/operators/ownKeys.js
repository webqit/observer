
/**
 * @imports
 */
import _getProps from './_getProps.js';

/**
 * Runs a "ownKeys" query operation on a target.
 * Fires any such query observers that may be bound to target.
 *
 * @param array|object	subject
 * @param string		param
 *
 * @return array
 */
export default function(subject, param = {}) {
	return _getProps(true/*ownKeys*/, ...arguments);
}
