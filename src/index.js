
/**
 * @imports
 */
// Interceptor
import set from './interceptor/set.js';
import get from './interceptor/get.js';
import has from './interceptor/has.js';
import deleteProperty from './interceptor/deleteProperty.js';
import defineProperty from './interceptor/defineProperty.js';
import keys from './interceptor/keys.js';
import ownKeys from './interceptor/ownKeys.js';
import intercept from './interceptor/intercept.js';
import unintercept from './interceptor/unintercept.js';
import proxy from './interceptor/proxy.js';
// Observer
import observe from './observer/observe.js';
import unobserve from './observer/unobserve.js';
import closure from './observer/closure.js';
import init from './observer/init.js';
import build from './observer/build.js';
import link from './observer/link.js';
import unlink from './observer/unlink.js';

// Now we'll mimick standard Trap properties
// so that can be used as standard Trap out of the box.
const del = deleteProperty;
const def = defineProperty;

/**
 * @exports
 */
export default {
	// Interceptor
	set,
	get,
	has,
	deleteProperty,
	del,
	defineProperty,
	def,
	keys,
	ownKeys,
	intercept,
	unintercept,
	proxy,
	// Observer
	observe,
	unobserve,
	closure,
	init,
	build,
	link,
	unlink,
};