
/**
 * ---------------------------
 * The Fireable class
 * ---------------------------
 */

export default class {
	
	/**
	 * Initializes the instance.
	 *
	 * @param object|array		subject
	 * @param object			dfn
	 *
	 * @return void
	 */
	constructor(subject, dfn) {
		this.subject = subject;
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
};