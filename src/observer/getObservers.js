/**
 * @imports
 */
import getFirebase from '../getFirebase.js';
import Observers from './Observers.js';

/**
 * Returns Observers List handle.
 * 
 * @param object    subject 
 * @param bool      createIfNotExist 
 * 
 * @returns Observers
 */
export default function(subject, createIfNotExist = true) {
    return getFirebase(subject, 'observers', createIfNotExist ? Observers : null);
};