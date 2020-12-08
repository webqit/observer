
/**
 * @imports
 */
import _each from '@webqit/util/obj/each.js';
import getObservers from './getObservers.js';
import observe from './observe.js';
import Delta from './Delta.js';

/**
 * Bubble helper
 *
 * @param array|object	subject
 * @param string		field
 * @param array|object	value
 *
 * @return void
 */
export default function(subject, field, value) {
	if (subject === value) {
		return;
	}
	var observers;
	observe(value, changes => {
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
				return observers.fire(_changes);
			}
		}
	}, {subtree:true, unique:true, tags:[linkTag, field, subject]});
};

/**
 * @var object
 */
export const linkTag = {};