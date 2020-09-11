
/**
 * @imports
 */
import _crossJoin from '@onephrase/util/arr/crossJoin.js';
import _pushUnique from '@onephrase/util/arr/pushUnique.js';
import _any from '@onephrase/util/arr/any.js';
import _arrFrom from '@onephrase/util/arr/from.js';
import _strAfter from '@onephrase/util/str/after.js';
import _isString from '@onephrase/util/js/isString.js';
import _isArray from '@onephrase/util/js/isArray.js';
import _commonsGet from '@onephrase/util/obj/get.js';
import _get from '../interceptor/get.js';
import Fireable from '../Fireable.js';
import Delta from './Delta.js';

/**
 * ---------------------------
 * The Observer class
 * ---------------------------
 */

export default class extends Fireable {
	
	/**
	 * Initializes the instance.
	 *
	 * @param array|object		subject
	 * @param object			dfn
	 *
	 * @return void
	 */
	constructor(subject, dfn) {
		super(subject, dfn);
		// -----------------------
		this.filterArray = _arrFrom(this.filter);
		this.isDynamicFilter = this.filterArray.filter(
			filter => _isString(filter) && (filter.indexOf('..') > -1 || filter.startsWith('.') || filter.endsWith('.'))
		).length;
		if (this.isDynamicFilter && this.filterArray.length > 1) {
			throw new Error('Only one "Dynamic Filter" must be observed at a time! "' + this.filterArray.join(', ') + '" have been bound together.');
		}

	}
	
	/**
	 * Calls the observer's handler function
	 * on matching with the event's filter.
	 *
	 * @param array			 	changes
	 *
	 * @return void
	 */
	fire(changes) {
		if (this.disconnected || (this.params.type && !_any(changes, delta => this.params.type === delta.type))) {
			return;
		}
		if (this.filterArray.length) {
			var dynamicFieldOutcomes = [];
			var matches = this.filterArray.filter((observedField, i) => {
				observedField = _isString(observedField) 
					? observedField.replace(/`/g, '')
					: observedField;
				dynamicFieldOutcomes[i] = [];
				// one observedField can turn out to be two if dynamic
				// and evt.originatingFields is multiple
				return changes.filter(delta => {
					var deltaNameSplit = delta.path.split('.');
					var observedDynamicFieldOutcome = this.isDynamicFilter 
						? observedField.split('.').map((seg, k) => seg || deltaNameSplit[k] || '').join('.')
						: observedField;
					_pushUnique(dynamicFieldOutcomes[i], observedDynamicFieldOutcome);
					return (observedDynamicFieldOutcome === delta.name
						|| (this.params.suptree !== false && (observedDynamicFieldOutcome + '.').startsWith(delta.path + '.'))
						|| (this.params.subtree && (delta.path + '.').startsWith(observedDynamicFieldOutcome + '.'))
					) && (!this.isDynamicFilter || !observedDynamicFieldOutcome.split('.').filter(seg => !seg).length);
				}).length;
			}).length;
			if (matches) {
				_crossJoin(dynamicFieldOutcomes).forEach(fields => {
					var _changes = this.formatChanges(fields, changes);
					this.handler(_isArray(this.filter) ? _changes : _changes[0]);
				});
			}
		} else if (!this.filter/** if this.filterArray is empty because this.filter is null */
		&& (this.params.subtree || changes.filter(delta => delta.path === delta.name).length === changes.length)) {
			this.handler(changes);
		}
	}
	
	/**
	 * Validates a proposed fire operation.
	 *
	 * @param array		 	fields
	 * @param array			changes
	 *
	 * @return bool
	 */
	formatChanges(fields, changes) {
		return this.params.data === false ? [] : fields.map(field => {
			// --------------------------
			var fieldDelta = changes.reduce((_delta, delta) => {
				if (_delta) {
					return _delta;
				}
				if (field + '' === delta.path + '') {
					return delta;
				}
				if ((field + '.').startsWith(delta.path + '.')) {
					var _field = _isString(field) ? _strAfter(field, delta.path + '.').split('.') : field;
					var _delta = new Delta(delta.subject, {
						type: delta.type,
						name: field,
					});
					if (delta.type === 'del' || delta.isUpdate) {
						_delta.oldValue = _commonsGet(delta.oldValue, _field, {get:_get});
					}
					if (delta.type !== 'del') {
						_delta.value = _commonsGet(delta.value, _field, {get:_get});
					}
					return _delta;
				}
			}, null);
			// --------------------------
			if (!fieldDelta) {
				fieldDelta = new Delta(this.subject, {
					type: 'get',
					name: field,
					value: _commonsGet(this.subject, _isString(field) ? field.split('.') : field, {get:_get}),
				});
			}
			// --------------------------
			return fieldDelta;
		});
	}
};