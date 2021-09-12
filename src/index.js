
/**
 * @imports
 */
// Actions
import apply from './actions/apply.js';
import construct from './actions/construct.js';
import defineProperty from './actions/defineProperty.js';
import deleteProperty from './actions/deleteProperty.js';
import get from './actions/get.js';
import getOwnPropertyDescriptor from './actions/getOwnPropertyDescriptor.js';
import getPrototypeOf from './actions/getPrototypeOf.js';
import has from './actions/has.js';
import isExtensible from './actions/isExtensible.js';
import ownKeys from './actions/ownKeys.js';
import preventExtensions from './actions/preventExtensions.js';
import set from './actions/set.js';
import setPrototypeOf from './actions/setPrototypeOf.js';
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

/**
 * @exports
 */
export default {
	// Actions
	apply,
	construct,
	defineProperty,
	deleteProperty,
	get,
	getOwnPropertyDescriptor,
	getPrototypeOf,
	has,
	isExtensible,
	ownKeys,
	preventExtensions,
	set,
	setPrototypeOf,
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