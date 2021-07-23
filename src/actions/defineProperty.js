
/**
 * @imports
 */
import _setProp from './_setProp.js';

/**
 * Executes a "set" operation on a subject.
 * Fires any observers that may be bound to subject.
 *
 * @param array|object	subject
 * @param string|array	keysOrPayload
 * @param mixed			value
 * @param object		detail
 *
 * @return bool
 */
export default function(subject, keysOrPayload, value = null, params = {}) {
	return _setProp(true/*define*/, ...arguments);
}
