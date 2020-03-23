
/**
 * @imports
 */
import Firebase from './Firebase.js';

/**
 * ---------------------------
 * The ListenerBase class
 * ---------------------------
 */				
export default class ListenerBase extends Firebase {
	
	/**
	 * Fires all observers with the given evt (change).
	 *
	 * @param Event				evt
	 *
	 * @return Event
	 */
	fire(evt) {
		this.fireables.forEach(listener => {
			if (evt.propagationStopped) {
				return;
			}
			listener.fire(evt);
		});
		return evt;
	}
	
	/**
	 * @inheritdoc
	 */
	static createForTarget(object, Static = ListenerBase) {
		return super.createForTarget(object, 'listeners', Static);
	}
	
	/**
	 * @inheritdoc
	 */
	static getForTarget(object) {
		return super.getForTarget(object, 'listeners');
	}
};