
/**
 * @imports
 */
import _each from '@webqit/util/obj/each.js';
import _merge from '@webqit/util/obj/merge.js';
import _isObject from '@webqit/util/js/isObject.js';
import getObservers from './getObservers.js';
import observe from './observe.js';
import Delta from './Delta.js';

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
	observe(value, (changes, responseObject) => {
		if (observers = getObservers(subject, false)) {
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
				return new Delta(subject, dfn);
			}).filter(c => c);
			if (_changes.length) {
				return observers.fire(_changes, responseObject.cancellable);
			}
		}
	}, {subtree: 'auto', unique: true, tags: [linkTag, field, subject]});
	if (_isObject(event) && (observers = getObservers(subject, false))) {
		// The event object
		var _event = _merge({
			name: field,
			type: 'set',
			value,
			related: [field],
		}, event);
		let response = observers.fire(_event, params.cancellable);
		if (params.responseObject) {
			return response;
		}
	}
};

/**
 * @var object
 */
export const linkTag = {};