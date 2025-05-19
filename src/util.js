
/**
 * @imports
 */
import { _wq as __wq } from '@webqit/util/js/index.js';

export const _wq = ( target, ...args ) => __wq( target, 'observerAPI', ...args );

export const _await = ( value, callback ) => value instanceof Promise ? value.then( callback ) : callback( value );

export const env = {};
