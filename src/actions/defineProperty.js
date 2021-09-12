
/**
 * @imports
 */
import _setOrDefine from './_setOrDefine.js';

/**
 * Executes a "defineProperty" operation on a target.
 * Fires any observers that may be bound to target.
 *
 * @param array|object	target
 * @param string|array	keysOrPayload
 * @param mixed			value
 * @param object		params
 *
 * @return bool
 */
export default function(target, keysOrPayload, value = null, params = {}) {
	return _setOrDefine(true/*define*/, target, { keysOrPayload, value }, params);
}
