
/**
 * @imports
 */
import unobserve from './unobserve.js';
import { linkTag } from './link.js';

/**
 * Unbubble helper
 *
 * @param array|object	subject
 * @param string		field
 * @param array|object	object
 *
 * @return void
 */
export default function(subject, field, value) {
	unobserve(value, null, null, {tags:[linkTag, field, subject]});
}
