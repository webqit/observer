
/**
 * @imports
 */
import _even from '@web-native-js/commons/obj/even.js';
import Event from './Event.js';

/**
 * ---------------------------
 * The MutationEvent class
 * ---------------------------
 */

export default class extends Event {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object		target
	 * @param object			details
	 *
	 * @return void
	 */
	constructor(target, details = {}) {
		if (details.data) {
			details.fields = Object.keys(details.data);
		}
		super(target, details);
		// -----------------------
		if (this.srcEvt) {
			this.dataEven = this.srcEvt.dataEven;
			this.originatingTarget = this.srcEvt.originatingTarget;
			this.originatingType = this.srcEvt.originatingType;
			this.originatingFields = [];
			this.originatingData = {};
			this._originatingData = {};
			var field = this.fields[0];
			Object.keys(this.srcEvt.originatingData).forEach(path => {
				var _path = field + '.' + path;
				this.originatingFields.push(_path);
				this.originatingData[_path] = this.srcEvt.originatingData[path];
				this._originatingData[_path] = this.srcEvt._originatingData[path];
			});
			this.originatingCreated = this.srcEvt.originatingCreated;
			this.originatingDeleted = this.srcEvt.originatingDeleted;
		} else {
			this.dataEven = _even(this.data, this._data);
			this.originatingTarget = this.target;
			this.originatingType = this.type;
			this.originatingFields = this.fields;
			this.originatingData = this.data;
			this._originatingData = this._data;
			this.originatingCreated = this.created;
			this.originatingDeleted = this.deleted;
		}
	}
};