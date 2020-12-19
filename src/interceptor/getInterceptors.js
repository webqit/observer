/**
 * @imports
 */
import getFirebase from '../getFirebase.js';
import Interceptors from './Interceptors.js';

/**
 * Returns Interceptors List handle.
 * 
 * @param object    subject 
 * @param bool      createIfNotExist 
 * 
 * @returns Observers
 */
export default function(subject, createIfNotExist = true) {
    return getFirebase(subject, '.observer.interceptors', createIfNotExist ? Interceptors : null);
};