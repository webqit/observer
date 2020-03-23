
/**
 * @imports
 */
import _setProp from './_setProp.js';

/**
 * Executes a "set" operation on a target.
 * Fires any observers that may be bound to target.
 *
 * @param array|object	target
 * @param string|array	keysOrPayload
 * @param mixed			value
 * @param bool			returnEvent
 *
 * @return bool|Event
 */
export default function(target, keysOrPayload, value = null, returnEvent = false) {
	return _setProp(false/*define*/, ...arguments);
}
