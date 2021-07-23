
/**
 * @imports
 */
import { _copy } from '@webqit/util/obj/index.js';
import { _unique } from '@webqit/util/arr/index.js';
import { _isArray, _isTypeObject } from '@webqit/util/js/index.js';
import Observers from '../core/Observers.js';
import unlink from '../connectors/unlink.js';
import link from '../connectors/link.js';

/**
 * Executes a callback function on a subject in "closure" mode.
 * Fires any observers that may be bound to subject on recorded changes.
 *
 * @param function		callback
 * @param array			...subjects
 *
 * @return array|Event
 */
export default function(callback, ...subjects) {
	var context = subjects.map(subject => {
		if (!_isTypeObject(subject)) {
			throw new Error('Target must be of type object!');
		}
		return {
			subject,
			subjectCopy: _isArray(subject) ? subject.slice(0) : _copy(subject),
		};
	});
	// ---------------------------------
	var result = callback(...subjects);
	// ---------------------------------
	const fireDiffs = () => {
		context.map(cntxt => {
			var initialKeys = Object.keys(cntxt.subjectCopy);
			var currentKeys = Object.keys(cntxt.subject);
			var related = [];
			var changes = _unique(initialKeys.concat(currentKeys)).map(key => {
				if (cntxt.subjectCopy[key] !== cntxt.subject[key]) {
					related.push(key);
					// ---------------------------------
					// The event object
					var e = {
						name:key,
						related,
						buffered: true,
					};
					if (currentKeys.includes(key)) {
						e.type = 'set';
						e.value = cntxt.subject[key];
						if (initialKeys.includes(key)) {
							e.isUpdate = true;
						}
					} else {
						e.type = 'del';
					}
					if (initialKeys.includes(key)) {
						e.oldValue = cntxt.subjectCopy[key];
					}
					// ---------------------------------
					// Unobserve outgoing value for bubbling
					if (_isTypeObject(cntxt.subjectCopy[key])) {
						unlink(cntxt.subject, key, cntxt.subjectCopy[key]);
					}
					// Observe incoming value for bubbling
					if (_isTypeObject(cntxt.subject[key])) {
						link(cntxt.subject, key, cntxt.subject[key]);
					}
					return e;
				}
			}).filter(c => c);
			// ---------------------------------
			var observers;
			if (changes.length && (observers = Observers.getFirebase(cntxt.subject, false))) {
				return observers.fire(changes);
			}
		});
	};
	if (result instanceof Promise) {
		result.then(fireDiffs);
	} else {
		fireDiffs();
	}
	return result;
}
