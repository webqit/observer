
/**
 * @imports
 */
import { _isArray } from '@webqit/util/js/index.js';
import { _from as _arrFrom, _all } from '@webqit/util/arr/index.js';


/**
 *  Returns paths in 2-dimensional form.
 * 
 * - key                    => [ [key] ]
 * - [key]                  => [ [key] ]
 * - [key, key2]            => [ [key, key2] ]
 * - [ [key] ]              => [ [key] ]
 * - [ [key1, key2] ]       => [ [key1, key2] ]
 * 
 * @param Array|String paths
 * 
 * @return Array
 */
export function paths2D(paths) {
	return (pathsIs2D(paths) ? paths : (_arrFrom(paths).length ? [paths] : []))
		.reduce((multiple, path) => multiple.concat([_arrFrom(path)]), [])
		.map(path => DotSafePath.resolve(path));
}
export class DotSafePath extends Array {
	static resolve(path) {
		// Note the concat() below...
		// the spread operator: new DotSafePath(...path) doesn't work when path is [0].
		return path.every(v => !(v + '').includes('.')) ? (new DotSafePath).concat(path) : path;
	}
	get dotSafe() { return true }
}

/**
 * OTHER HELPERS
 */

export function pathsIs2D(paths) {
	return _arrFrom(paths).reduce((yes, path) => yes || _isArray(path), false);
}
export function pathsIsDynamic(pathArray) {
	// Note that trying to simply match empty slots, as in: pathArray.filter(seg => !seg && seg !== 0).length
	// doesn't work when the empty slots are really empty slote, as in: [ 'key', <1 empty item> ]
	return pathArray.filter(seg => seg || seg === 0).length !== pathArray.length;
}
export function paths2DIsDynamic(paths) {
	return paths.filter(pathArray => pathsIsDynamic(_arrFrom(pathArray))).length > 0;
}

