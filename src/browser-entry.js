
/**
 * @imports
 */
import Observer from './index.js';

// As globals
if (!window.WN) {
	window.WN = {};
}
window.WN.Observer = Observer;
if (!window.WebNative) {
	window.WebNative = {};
}
window.WebNative.Observer = Observer;
