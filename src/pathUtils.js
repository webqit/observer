
/**
 * @imports
 */
import _isArray from '@webqit/util/js/isArray.js';
import _arrFrom from '@webqit/util/arr/from.js';
import _all from '@webqit/util/arr/all.js';

/**
 *  Returns paths in 2-dimensional form.
 * 
 * - key                    => [ [key] ]
 * - [key]                  => [ [key] ]
 * - [ [key] ]              => [ [key] ]
 * - [ [key1, key2] ]       => [ [key1, key2] ]
 * 
 * @param Array|String paths
 * 
 * @return Array
 */
export function paths2D(paths) {
	return (pathsIs2D(paths) ? paths : (_arrFrom(paths).length ? [paths] : []))
		.reduce((multiple, path) => multiple.concat([_arrFrom(path)]), []);
};

/**
 * OTHER HELPERS
 */

export function pathsIs2D(paths) {
	return _arrFrom(paths).reduce((yes, path) => yes || _isArray(path), false);
};
export function pathsIsDynamic(pathArray) {
	return pathArray.filter(seg => !seg && seg !== 0).length;
};
export function paths2DIsDynamic(paths) {
	return paths.filter(pathArray => pathsIsDynamic(_arrFrom(pathArray))).length;
};
export function pathIsSame(a, b) {
	return a.length === b.length && a.reduce((prev, value, i) => prev && value === b[i], true);
};
export function paths2DIsSame(a, b) {
	return a.length === b.length && _all(a, (_a, i) => pathIsSame(_a, b[i]));
};
export function pathStartsWith(a, b) {
	return b.reduce((prev, value, i) => prev && value === a[i], true);
};
export function pathAfter(a, b) {
	return a.slice(b.length);
};