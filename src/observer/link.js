
/**
 * @imports
 */
import _each from '@web-native-js/commons/obj/each.js';
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
	var observers;
	observe(value, changes => {
		if (observers = getObservers(subject, false)) {
			var _changes = changes.map(delta => {
				var dfn = {}; _each(delta, (key, value) => {
					if (key !== 'subject' && key !== 'name' && key !== 'path') {
						dfn[key] = value;
					}
				});
				dfn.name = field;
				dfn.path = field + '.' + delta.path;
				dfn.originalSubject = delta.originalSubject;
				return new Delta(subject, dfn);
			});
			return observers.fire(_changes);
		}
	}, {subtree:true, unique:true, tags:[linkTag, field, subject]});
};

/**
 * @var object
 */
export const linkTag = {};