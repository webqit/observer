
/**
 * @imports
 */
import _crossJoin from '@web-native-js/commons/arr/crossJoin.js';
import _pushUnique from '@web-native-js/commons/arr/pushUnique.js';
import _arrFrom from '@web-native-js/commons/arr/from.js';
import _strAfter from '@web-native-js/commons/str/after.js';
import _isString from '@web-native-js/commons/js/isString.js';
import _isArray from '@web-native-js/commons/js/isArray.js';
import _commonsGet from '@web-native-js/commons/obj/get.js';
import Fireable from './Fireable.js';
import MutationEvent from './MutationEvent.js';
import reflexGet from '../get.js';

/**
 * ---------------------------
 * The Observer class
 * ---------------------------
 */

export default class extends Fireable {
	
	/**
	 * Initializes the instance.
	 *
	 * @param function		handler
	 * @param string|array	fields
	 * @param object		params
	 *
	 * @return void
	 */
	constructor(handler, fields = null, params = {}) {
		super();
		this.handler = handler;
		this.fields = fields;
		this.params = params;
		// -----------------------
		this.fieldsArray = _arrFrom(this.fields);
		this.isDynamicField = this.fieldsArray.filter(
			field => field.indexOf('..') > -1 || field.startsWith('.') || field.endsWith('.')
		).length;
		if (this.isDynamicField && this.fieldsArray.length > 1) {
			throw new Error('Only one "Dynamic Field" must be observed at a time! "' + this.fieldsArray.join(', ') + '" have been bound together.');
		}

	}
	
	/**
	 * Calls the observer's handler function
	 * on matching with the event's fields.
	 *
	 * @param MutationEvent			 	evt
	 *
	 * @return void
	 */
	fire(evt) {
		if (this.disconnected || (this.params.type && this.params.type !== evt.type)) {
			return;
		}
		if (evt.dataEven && this.params.diff !== false) {
			return;
		}
		this.fireCallback(evt, fields => {
			if (fields) {
				// Call listener...
				var data = [];
				var _data = [];
				if (this.params.data !== false) {
					fields.forEach(field => {
						// --------------------------
						// The NEW/OLD values of the change of field which could be a path
						var fieldData = evt.originatingFields.reduce((fieldData, originatingField) => {
							// So field is the exact originatingField path?
							var value = evt.originatingData[originatingField];
							var _value = evt._originatingData[originatingField];
							if (!fieldData && field === originatingField) {
								return [value, _value];
							}
							// Field matches, but is deeper than, originatingField path?
							if (!fieldData && (field + '.').startsWith((originatingField + '.'))) {
								var fieldQuery = _strAfter(field, originatingField + '.');
								return [
									// Notice we're using _commonsGet to dig the path
									// but with reflexGet as trap for "reactive getting"
									_commonsGet(value, fieldQuery.split('.'), {get:reflexGet}),
									_commonsGet(_value, fieldQuery.split('.'), {get:reflexGet})
								];
							}
							return fieldData;
						}, null);
						// --------------------------
						if (fieldData) {
							data.push(fieldData.shift());
							_data.push(fieldData.shift());
						} else {
							var currentValue = _commonsGet(evt.target, _isString(field) ? field.split('.') : field, {get:reflexGet});
							data.push(currentValue);
							_data.push(currentValue);
						}
					});
				}
				return _isArray(this.fields) // NOTE:we're asking the original format!
					? evt.response(this.handler(data, _data, evt))
					: evt.response(this.handler(data[0], _data[0], evt));
			}
			var data = {};
			var _data = {};
			evt.fields.forEach(field => {
				// Remeber that evt.originatingData might actually be bubbling
				// in which case we don't expect to see eventName key.
				var currentValue = field in evt.data 
					? evt.data[field] 
					: reflexGet(evt.target, field);
				var prevValue = field in evt._data
					? evt._data[field] 
					: currentValue;
				data[field] = currentValue;
				_data[field] = prevValue;
			});
			// Call listener...
			return evt.response(this.handler(data, _data, evt));
		});
	}
	
	/**
	 * Validates a proposed fire operation.
	 *
	 * @param MutationEvent		 	evt
	 *
	 * @return bool
	 */
	fireCallback(evt, callback) {
		if (this.fieldsArray.length) {
			var dynamicFieldOutcomes = [];
			var matches = this.fieldsArray.filter((observedField, i) => {
				observedField = _isString(observedField) 
					? observedField.replace(/`/g, '')
					: observedField;
				dynamicFieldOutcomes[i] = [];
				// one observedField can turn out to be two if dynamic
				// and evt.originatingFields is multiple
				return evt.originatingFields.filter(inputOriginatingField => {
					var inputOriginatingFieldSplit = inputOriginatingField.split('.');
					var observedDynamicFieldOutcome = this.isDynamicField 
						? observedField.split('.').map((seg, k) => seg || inputOriginatingFieldSplit[k] || '').join('.')
						: observedField;
					_pushUnique(dynamicFieldOutcomes[i], observedDynamicFieldOutcome);
					return (observedDynamicFieldOutcome === inputOriginatingField && !evt.srcEvt
						|| (this.params.observeUp !== false && (observedDynamicFieldOutcome + '.').startsWith(inputOriginatingField + '.'))
						|| (this.params.observeDown && (inputOriginatingField + '.').startsWith(observedDynamicFieldOutcome + '.'))
					) && (!this.isDynamicField || !observedDynamicFieldOutcome.split('.').filter(seg => !seg).length);
				}).length;
			}).length;
			if (matches) {
				_crossJoin(dynamicFieldOutcomes).forEach(callback);
			}
		} else if (!evt.srcEvt || this.params.observeDown) {
			callback();
		}
	}
};