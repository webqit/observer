
/**
 * @imports
 */
import unobserve from './unobserve.js';

/**
 * Unbubble helper
 *
 * @param array|object	target
 * @param string		field
 * @param array|object	object
 *
 * @return void
 */
export default function(target, field, object) {
	unobserve(object, null, {tags:['#e-bubbling', target]});
}
