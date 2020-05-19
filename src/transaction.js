
/**
 * @imports
 */
import _copy from '@web-native-js/commons/obj/copy.js';
import _merge from '@web-native-js/commons/obj/merge.js';
import _unique from '@web-native-js/commons/arr/unique.js';
import _isTypeObject from '@web-native-js/commons/js/isTypeObject.js';
import _isArray from '@web-native-js/commons/js/isArray.js';
import MutationEvent from './internal/MutationEvent.js';
import ObserverBase from './internal/ObserverBase.js';
import unlink from './unlink.js';
import link from './link.js';

/**
 * Executes a callback function on a target in "transaction" mode.
 * Fires any observers that may be bound to target on recorded changes.
 *
 * @param array			targets
 * @param function		callback
 * @param array			keys
 * @param bool			returnEvent
 *
 * @return array|Event
 */
export default function(targets, callback, keys = [], returnEvent = false) {
	var context = targets.map((target, i) => {
		if (!target || !_isTypeObject(target)) {
			throw new Error('Target must be of type object!');
		}
		return {
			target,
			targetCopy: _copy(target, keys),
			setData: {},
			_setData: {},
			delData: {}, 
			_delData: {},
			created: [],
			deleted: [],
		};
	});
	// ---------------------------------
	var result = callback(...targets);
	// ---------------------------------
	context.map(cntxt => {
		var initialKeys = Object.keys(cntxt.targetCopy);
		var currentKeys = Object.keys(cntxt.target);
		var changedKeys = _unique(initialKeys.concat(currentKeys)).filter(key => {
			if ((keys.length && !keys.includes(key)) 
			|| (_isArray(cntxt.target) && (key === 'length' || key === '.reflex'))) {
				return;
			}
			if (!currentKeys.includes(key)) {
				cntxt._delData[key] = cntxt.targetCopy[key];
				cntxt.delData[key] = undefined;
				cntxt.deleted.push(key);
			} else {
				cntxt._setData[key] = cntxt.targetCopy[key];
				cntxt.setData[key] = cntxt.target[key];
				if (!initialKeys.includes(key)) {
					cntxt.created.push(key);
				} 
			}
			if (cntxt.targetCopy[key] !== cntxt.target[key]) {
				// Unobserve outgoing value for bubbling
				if (cntxt.targetCopy[key] && _isTypeObject(cntxt.targetCopy[key])) {
					unlink(cntxt.target, key, cntxt.targetCopy[key]);
				}
				// Observe incoming value for bubbling
				if (cntxt.target[key] && _isTypeObject(cntxt.target[key])) {
					link(cntxt.target, key, cntxt.target[key]);
				}
				return true;
			}
			delete cntxt.setData[key];
			delete cntxt._setData[key];
		});
		// ---------------------------------
		var evt, mutationBase;
		if ((mutationBase = ObserverBase.getForTarget(cntxt.target)) || returnEvent) {
			evt = new MutationEvent(cntxt.target, {
				type:'transaction', 
				data:_merge(cntxt.setData, cntxt.delData),
				_data:_merge(cntxt._setData, cntxt._delData),
				created:cntxt.created,
				deleted:cntxt.deleted
			});
			if (mutationBase) {
				if (Object.keys(cntxt.delData).length) {
					evt.response(mutationBase.fire(
						new MutationEvent(cntxt.target, {type:'del', data:cntxt.delData, _data:cntxt._delData, deleted:cntxt.deleted})
					));
				}
				if (Object.keys(cntxt.setData).length) {
					evt.response(mutationBase.fire(
						new MutationEvent(cntxt.target, {type:'set', data:cntxt.setData, _data:cntxt._setData, created:cntxt.created})
					));
				}
			}
		}
		return returnEvent ? evt : changedKeys;
	});
	return result;
}
