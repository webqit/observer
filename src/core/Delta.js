
/**
 * @imports
 */
import _each from '@webqit/util/obj/each.js';
import { DotSafePath } from './utils.js';

/**
 * ---------------------------
 * The QueryEvent class
 * ---------------------------
 */

export default class Delta {
	
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
			if (key === 'path') {
				value = DotSafePath.resolve(value);
			}
			Object.defineProperty(this, key, {value, enumerable:true});
		});
		if (!this.path) {
			Object.defineProperty(this, 'path', {value: DotSafePath.resolve([dfn.name]), enumerable:true});
		}
		Object.seal(this);
	}
}