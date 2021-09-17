
/**
 * @imports
 */
import Firebase from './Firebase.js';
import Interceptor from './Interceptor.js';
import Action from './Action.js';

/**
 * ---------------------------
 * The Reactive class
 * ---------------------------
 */

export default class Interceptors extends Firebase {
	
	/**
	 * @inheritdoc
	 */
	add(dfn) {
		return super.add(new Interceptor(this.target, dfn));
	}

	/**
	 * Fires all interceptors with the given action.
	 *
	 * @param Action			action
	 * @param function			defaultHandler
	 *
	 * @return mixed
	 */
	fire(action, defaultHandler = null) {
		if (!(action instanceof Action)) {
			action = new Action(this.target, action);
		}
		if (this.currentlyFiring.filter(a => a.type === action.type && a.name === action.name).length) {
			return defaultHandler ? defaultHandler() : undefined;
		}
		this.currentlyFiring.push(action);
		const next = (index, ..._args) => {
			var interceptor = this.fireables[index];
			if (interceptor) {
				return interceptor.fire(action, (...args) => {
					return next(index + 1, ...args);
				}/*next*/, ..._args);
			}
			return defaultHandler ? defaultHandler(..._args) : _args[0];
		};
		var value = next(0);
		this.currentlyFiring.pop();
		return value;
	}

	static getFirebase(target, createIfNotExists = true, namespace = null) {
		return super._getFirebase('interceptors', ...arguments);
	}

	static namespace(namespace, ImplementationClass = null) {
		return super._namespace('interceptors', ...arguments);
	}
}