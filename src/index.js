
/**
 * @imports
 */
// Actions
import set from './actions/set.js';
import get from './actions/get.js';
import has from './actions/has.js';
import deleteProperty from './actions/deleteProperty.js';
import defineProperty from './actions/defineProperty.js';
import ownKeys from './actions/ownKeys.js';
import keys from './actions/keys.js';
// Actors
import accessorize from './actors/accessorize.js';
import unaccessorize from './actors/unaccessorize.js';
import proxy from './actors/proxy.js';
import unproxy from './actors/unproxy.js';
// Reactions
import observe from './reactions/observe.js';
import unobserve from './reactions/unobserve.js';
import intercept from './reactions/intercept.js';
import unintercept from './reactions/unintercept.js';
import closure from './reactions/closure.js';
// Connectors
import build from './connectors/build.js';
import link from './connectors/link.js';
import unlink from './connectors/unlink.js';
// Core
import Observers from './core/Observers.js';
import Interceptors from './core/Interceptors.js';
// Now we'll mimick standard Trap properties
// so that can be used as standard Trap out of the box.
const del = deleteProperty;
const def = defineProperty;

/**
 * @exports
 */
export default {
	// Actions
	set,
	get,
	has,
	deleteProperty,
	del,
	defineProperty,
	def,
	ownKeys,
	keys,
	// Actors
	accessorize,
	unaccessorize,
	proxy,
	unproxy,
	// Reactions
	observe,
	unobserve,
	intercept,
	unintercept,
	closure,
	// Connectors
	build,
	link,
	unlink,
	// Core
	Observers,
	Interceptors,
}