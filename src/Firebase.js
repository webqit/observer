
/**
 * @imports
 */
import _arrFrom from '@onephrase/util/arr/from.js';
import _intersect from '@onephrase/util/arr/intersect.js';

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
	 * Removes fireables by definition.
	 *
	 * @param object			dfn
	 *
	 * @return array
	 */
	forget(dfn) {
		this.filter(dfn).forEach(fireable => {
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
	filter(dfn) {
		return this.fireables.filter(fireable => {
			var fireableFilter = _arrFrom(fireable.filter);
			var fireableTags = _arrFrom((fireable.params || {}).tags);
			// -----------------------
			var dfnFilter = _arrFrom(dfn.filter);
			var dfnTags = _arrFrom((dfn.params || {}).tags);
			// -----------------------
			return (!dfn.originalHandler || fireable.handler === dfn.originalHandler)
				&& (!dfnFilter.length || (dfnFilter.length === fireableFilter.length && _intersect(fireableFilter, dfnFilter).length === dfnFilter.length))
				&& (!dfnTags.length || (dfnTags.length === fireableTags.length && _intersect(fireableTags, dfnTags).length === dfnTags.length));
		});
	}
};