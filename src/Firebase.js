
/**
 * @imports
 */
import { paths2D, paths2DIsSame } from './pathUtils.js'
import _arrFrom from '@webqit/util/arr/from.js';
import _intersect from '@webqit/util/arr/intersect.js';

/**
 * ---------------------------
 * The Firebase class
 * ---------------------------
 */

export default class {
	
	/**
	 * Initializes the instance.
	 *
	 * @param object	subject
	 * 
	 * @return void
	 */
	constructor(subject) {
		this.subject = subject;
		this.fireables = [];
		this.currentlyFiring = [];
	}
	
	/**
	 * Adds an Fireable instance
	 * with optional tags.
	 *
	 * @param Fireable			fireable
	 *
	 * @return Fireable
	 */
	add(fireable) {
		this.fireables.push(fireable);
		return fireable;
	}
	
	/**
	 * Removes fireables by instance.
	 *
	 * @param Fireable			fireable
	 *
	 * @return void
	 */
	remove(fireable) {
		this.fireables = this.fireables.filter(_fireable => _fireable !== fireable);
	}
	
	/**
	 * Removes fireables by definition.
	 *
	 * @param object			dfn
	 *
	 * @return void
	 */
	forget(dfn) {
		this.match(dfn).forEach(fireable => {
			this.fireables = this.fireables.filter(_fireable => _fireable !== fireable);
		});
	}
	
	/**
	 * Finds fireables by definition.
	 *
	 * @param object			dfn
	 *
	 * @return array
	 */
	match(dfn) {
		return this.fireables.filter(fireable => {
			var fireableFilter = paths2D(fireable.filter);
			var fireableTags = _arrFrom((fireable.params || {}).tags);
			// -----------------------
			var dfnFilter = paths2D(dfn.filter);
			var dfnTags = _arrFrom((dfn.params || {}).tags);
			// -----------------------
			return (!dfn.originalHandler || fireable.handler === dfn.originalHandler)
				&& (!dfnFilter.length || paths2DIsSame(dfnFilter, fireableFilter))
				&& (!dfnTags.length || (dfnTags.length === fireableTags.length && _intersect(fireableTags, dfnTags).length === dfnTags.length));
		});
	}
};