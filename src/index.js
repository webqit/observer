
/**
 * @imports
 */
// Operators
import set from './operators/set.js';
import get from './operators/get.js';
import has from './operators/has.js';
import deleteProperty from './operators/deleteProperty.js';
import defineProperty from './operators/defineProperty.js';
import keys from './operators/keys.js';
import ownKeys from './operators/ownKeys.js';
import accessorize from './operators/accessorize.js';
import unaccessorize from './operators/unaccessorize.js';
import proxy from './operators/proxy.js';
import unproxy from './operators/unproxy.js';
// Hierarchy
import build from './hierarchy/build.js';
import link from './hierarchy/link.js';
import unlink from './hierarchy/unlink.js';
// Subscribers
import observe from './subscribers/observe.js';
import unobserve from './subscribers/unobserve.js';
import intercept from './subscribers/intercept.js';
import unintercept from './subscribers/unintercept.js';
import closure from './subscribers/closure.js';
// Now we'll mimick standard Trap properties
// so that can be used as standard Trap out of the box.
const del = deleteProperty;
const def = defineProperty;
// Core
import Observers from './core/Observers.js';
import Interceptors from './core/Interceptors.js';

/**
 * @exports
 */
export default {
	// Operators
	set,
	get,
	has,
	deleteProperty,
	del,
	defineProperty,
	def,
	keys,
	ownKeys,
	accessorize,
	unaccessorize,
	proxy,
	unproxy,
	// Hierarchy
	build,
	link,
	unlink,
	// Subscribers
	observe,
	unobserve,
	intercept,
	unintercept,
	closure,
	// Core
	Observers,
	Interceptors,
}