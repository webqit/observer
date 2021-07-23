
/**
 * @imports
 */
import { _each, _merge } from '@webqit/util/obj/index.js';
import { _isObject } from '@webqit/util/js/index.js';
import Mutation from '../core/Mutation.js';
import Observers from '../core/Observers.js';
import observe from '../reactions/observe.js';

/**
 * Bubble helper
 *
 * @param array|object	subject
 * @param string		field
 * @param array|object	value
 * @param object		event
 * @param object		params
 *
 * @return void
 */
export default function(subject, field, value, event = null, params = {}) {
	if (subject === value) {
		return;
	}
	var observers;
	observe(value, (changes, eventObject) => {
		if (observers = Observers.getFirebase(subject, false, params.namespace)) {
			var _changes = changes.map(delta => {
				// ------------
				// Recursive events must not propagate
				// ------------
				var d = delta;
				do {
					if (d.subject === subject) {
						return;
					}
				} while(d = d.src);
				// ------------
				// Create propagation
				// ------------
				var dfn = {}; _each(delta, (key, value) => {
					if (key !== 'subject' && key !== 'name' && key !== 'path' && key !== 'src') {
						dfn[key] = value;
					}
				});
				dfn.name = field;
				dfn.path = [field].concat(delta.path);
				dfn.originalSubject = delta.originalSubject;
				dfn.src = delta;
				return new Mutation(subject, dfn);
			}).filter(c => c);
			if (_changes.length) {
				return observers.fire(_changes, eventObject.cancellable);
			}
		}
	}, {subtree: true, ...params, unique: true, tags: [linkTag, field, subject]});
	if (_isObject(event) && (observers = Observers.getFirebase(subject, false, params.namespace))) {
		// The event object
		var _event = _merge({
			name: field,
			type: 'set',
			value,
			related: [field],
		}, event);
		let eventObject = observers.fire(_event, params.cancellable);
		if (params.eventReturnType) {
			return eventObject;
		}
	}
}

/**
 * @var object
 */
export const linkTag = {};