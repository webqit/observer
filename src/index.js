
/**
 * @imports
 */
import build from './build.js';
import observe from './observe.js';
import unobserve from './unobserve.js';
import trap from './trap.js';
import untrap from './untrap.js';
import def from './def.js';
import set from './set.js';
import del from './del.js';
import link from './link.js';
import unlink from './unlink.js';
import transaction from './transaction.js';
import get from './get.js';
import has from './has.js';
import init from './init.js';
import keys from './keys.js';
import ownKeys from './ownKeys.js';
import on from './on.js';
import off from './off.js';
import trigger from './trigger.js';
import MutationEvent from './internal/MutationEvent.js';
import QueryEvent from './internal/QueryEvent.js';
import Event from './internal/Event.js';

// Now we'll mimick standard Trap properties
// so that can be used as standard Trap out of the box.
const deleteProperty = del;
const defineProperty = def;

/**
 * @exports
 */
export default {
	build,
	observe,
	unobserve,
	trap,
	untrap,
	def,
	defineProperty,
	set,
	del,
	deleteProperty,
	link,
	unlink,
	transaction,
	get,
	has,
	init,
	keys,
	ownKeys,
	on,
	off,
	trigger,
	// Events
	MutationEvent,
	QueryEvent,
	Event,
};