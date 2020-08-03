
/**
 * @imports
 */
import _getProps from './_getProps.js';

/**
 * Runs a "keys" query operation on a subject.
 * Fires any such query observers that may be bound to subject.
 *
 * @param array|object	subject
 *
 * @return array
 */
export default function(subject) {
	return _getProps(false/*ownKeys*/, ...arguments);
}
