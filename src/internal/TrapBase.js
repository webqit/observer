
/**
 * @imports
 */
import _even from '@web-native-js/commons/obj/even.js';
import QueryEvent from './QueryEvent.js';
import Firebase from './Firebase.js';
import Trap from './Trap.js';

/**
 * ---------------------------
 * The Reactive class
 * ---------------------------
 */

export default class TrapBase extends Firebase {
	
	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param Event				evt
	 * @param function			defaultHandler
	 *
	 * @return mixed
	 */
	fire(evt, defaultHandler = null) {
		if (this.currentlyFiringEvents.filter(e => e.type === evt.type && e.query === evt.query).length) {
			return defaultHandler ? defaultHandler() : undefined;
		}
		this.currentlyFiringEvents.push(evt);
		const next = (index, ..._args) => {
			var trap = this.fireables[index];
			if (trap) {
				return trap.fire(evt, (...args) => {
					return next(index + 1, ...args);
				}/*next*/, ..._args);
			}
			return defaultHandler ? defaultHandler(..._args) : _args[0];
		};
		var value = next(0);
		this.currentlyFiringEvents.pop();
		return value;
	}
	
	/**
	 * @inheritdoc
	 */
	static createForTarget(object) {
		return super.createForTarget(object, 'traps', TrapBase);
	}
	
	/**
	 * @inheritdoc
	 */
	static getForTarget(object) {
		return super.getForTarget(object, 'traps');
	}
};