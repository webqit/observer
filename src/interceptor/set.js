
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
 * @param any			detail
 * @param object		params
 *
 * @return bool
 */
export default function(subject, keysOrPayload, value = null, detail = null, params = {}) {
	return _setProp(false/*define*/, ...arguments);
}
