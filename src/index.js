
/**
 * @imports
 */
import * as main from './main.js';
import * as actors from './actors.js';

export const Observer = { ...main, ...actors };

export { default as ListenerRegistry } from './core/ListenerRegistry.js';
export { default as TrapsRegistry } from './core/TrapsRegistry.js';

export default Observer;