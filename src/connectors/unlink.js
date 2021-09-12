
/**
 * @imports
 */
import { _merge } from '@webqit/util/obj/index.js';
import { _isObject } from '@webqit/util/js/index.js';
import Observers from '../core/Observers.js';
import unobserve from '../reactions/unobserve.js';
import { linkTag } from './link.js';

/**
 * Unbubble helper
 *
 * @param array|object	target
 * @param string		field
 * @param array|object	object
 * @param object		event
 * @param object		params
 *
 * @return void
 */
export default function(target, field, value, event = null, params = {}) {
	unobserve(value, null, null, {...params, tags:[linkTag, field, target]});
	var observers;
	if (_isObject(event) && (observers = Observers.getFirebase(target, false, params.namespace))) {
		// The event object
		var _event = _merge({
			name: field,
			type: 'del',
			oldValue: value,
			related: [field],
		}, event);
		observers.fire(_event, params.cancellable);
	}
}
