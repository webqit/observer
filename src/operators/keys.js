
/**
 * @imports
 */
import _getProps from './_getProps.js';

/**
 * Runs a "keys" query operation on a subject.
 * Fires any such query observers that may be bound to subject.
 *
 * @param array|object	subject
 * @param string		param
 *
 * @return array
 */
export default function(subject, param = {}) {
	return _getProps(false/*ownKeys*/, ...arguments);
}
