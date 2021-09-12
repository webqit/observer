
/**
 * @imports
 */
import { _internals } from '@webqit/util/js/index.js';

/**
 * Returns the original object earlier proxied by proxy().
 *
 * @param Proxy|Any		target
 *
 * @return Any
 */
export default function(target) {
    // Proxy targets are mapped to their own instances internally
    return _internals(target, false).get(target) || target;
}
