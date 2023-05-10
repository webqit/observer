
/**
 * @imports
 */
import { _internals } from '@webqit/util/js/index.js';

export const _ = ( ...args ) => _internals( 'observer-api', ...args );

export const _await = ( value, callback ) => value instanceof Promise ? value.then( callback ) : callback( value );
