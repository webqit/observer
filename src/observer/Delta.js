
/**
 * @imports
 */
import _each from '@onephrase/util/obj/each.js';

/**
 * ---------------------------
 * The QueryEvent class
 * ---------------------------
 */

export default class {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object	subject
	 * @param object		dfn
	 *
	 * @return void
	 */
	constructor(subject, dfn) {
		this.subject = subject;
		if (!dfn.originalSubject) {
			this.originalSubject = subject;
		}
		if (!('type' in dfn)) {
			throw new Error('Delta type must be given in definition!');
		}
		if (!('name' in dfn)) {
			throw new Error('Property name must be given in definition!');
		}
		_each(dfn, (key, value) => {
			Object.defineProperty(this, key, {value, enumerable:true});
		});
		if (!this.path) {
			Object.defineProperty(this, 'path', {value:dfn.name, enumerable:true});
		}
		Object.seal(this);
	}
};