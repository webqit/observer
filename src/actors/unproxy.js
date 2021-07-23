
/**
 * @imports
 */
import { _internals } from '@webqit/util/js/index.js';

/**
 * Returns the original object earlier proxied by proxy().
 *
 * @param Proxy|Any		subject
 *
 * @return Any
 */
export default function(subject) {
    // Proxy targets are mapped to their own instances internally
    return _internals(subject, false).get(subject) || subject;
}
