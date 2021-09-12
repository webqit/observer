
/**
 * @imports
 */
import { _each } from '@webqit/util/obj/index.js';

/**
 * ---------------------------
 * The QueryEvent class
 * ---------------------------
 */

export default class Action {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object	target
	 * @param object		dfn
	 *
	 * @return void
	 */
	constructor(target, dfn) {
		this.target = target;
		if (!dfn.type) {
			throw new Error('Action type must be given in definition!');
		}
		_each(dfn, (key, value) => {
			Object.defineProperty(this, key, {value, enumerable:true});
		});
		Object.seal(this);
	}
}