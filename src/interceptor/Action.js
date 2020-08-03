
/**
 * @imports
 */
import _each from '@web-native-js/commons/obj/each.js';

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
		if (!dfn.type) {
			throw new Error('Action type must be given in definition!');
		}
		_each(dfn, (key, value) => {
			Object.defineProperty(this, key, {value, enumerable:true});
		});
		Object.seal(this);
	}
};