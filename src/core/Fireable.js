
/**
 * ---------------------------
 * The Fireable class
 * ---------------------------
 */

export default class Fireable {
	
	/**
	 * Initializes the instance.
	 *
	 * @param object|array		target
	 * @param object			dfn
	 *
	 * @return void
	 */
	constructor(target, dfn) {
		this.target = target;
		this.handler = dfn.handler;
		this.filter = dfn.filter;
		this.params = dfn.params;

	}

	/**
	 * Sets a "disconnected" flag on the Fireable.
	 *
	 * @return void
	 */
	disconnect() {
		this.disconnected = true;
	}
}