
/**
 * @imports
 */
import _isTypeObject from '@webqit/util/js/isTypeObject.js';

/**
 * Returns the original object earlier proxied by proxy().
 *
 * @param Proxy|Any		subject
 *
 * @return Any
 */
export default function(subject) {
    var proxyTarget;
	if (_isTypeObject(subject) && (proxyTarget = subject[Symbol.for('.observer.proxy.target')])) {
		return proxyTarget();
    }
    return subject;
}
