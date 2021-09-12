
/**
 * @imports
 */
import _setOrDefine from './_setOrDefine.js';

/**
 * Executes a "set" operation on a target.
 * Fires any observers that may be bound to target.
 *
 * @param array|object	target
 * @param string|array	keysOrPayload
 * @param mixed			value
 * @param object		receiver
 * @param object		params
 *
 * @return bool
 */
export default function(target, keysOrPayload, value = null, receiver = null, params = {}) {
	return _setOrDefine(false/*define*/, target, arguments.length > 3 ? { keysOrPayload, value, receiver } : { keysOrPayload, value }, params);
}
