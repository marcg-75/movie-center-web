/**
 * JS file containing convenience methods for (session or local) storage caching.
 */

import {environment} from '../env/environment';
import { STORAGE_TYPE, StoredData } from '../models/storage.model';

const getDefaultStorageType = (): STORAGE_TYPE => {
    const fallbackStorageType = STORAGE_TYPE.SESSION;
    const cacheStorageDefault = environment.cacheStorageDefault?.toUpperCase();

    return environment.cacheStorageDefault || fallbackStorageType;
};

const DEFAULT_STORAGE_TYPE: STORAGE_TYPE = getDefaultStorageType();
const EXPIRATION_TIME_MINUTES: number = environment.cacheExpTimeMinutes || 0;

/**
 * Retrieve cached data.
 *
 * @param {String} storageKey - The cache key.
 * @param {STORAGE_TYPE} storageType - Session or local storage (Configured, but fallback is session storage).
 * @param {Boolean} ignoreExpiration - If true, then the cached item will not be removed from the cache if expired.
 * @returns {Object}
 */
export const getStoredData = (storageKey: string,
                              ignoreExpiration: Boolean = false,
                              storageType: STORAGE_TYPE = DEFAULT_STORAGE_TYPE): Object | null => {
    if (storageKey && storageKey.trim().length > 0) {
        const storage = getStorage(storageType);

        if (storage) {
            let strData = storage.getItem(storageKey);

            if (strData) {
                const data = JSON.parse(strData) as StoredData;

                if (!ignoreExpiration && data.timestamp) {
                    const now = new Date();
                    const expiration = new Date(data.timestamp);
                    expiration.setMinutes(expiration.getMinutes() + EXPIRATION_TIME_MINUTES);

                    // Only return the content if it hasn't expired. Remove otherwise.
                    if (now.getTime() > expiration.getTime()) {
                        storage.removeItem(storageKey);
                    } else {
                        return data.content;
                    }
                }
                return data.content;
            }
        } else {
            console.error('storageUtils.getStoredData - Storage for storage type \'' + storageType + '\' could not be found.');
        }
    }
    return null;
};

export const setStoredData = (storageKey: string,
                              content: Object,
                              storageType: STORAGE_TYPE = DEFAULT_STORAGE_TYPE): void => {
    if (storageKey && storageKey.trim().length > 0) {
        const storage = getStorage(storageType);

        if (storage) {
            const data: StoredData = {
                timestamp: new Date(),
                content
            };

            storage.setItem(storageKey, JSON.stringify(data));
        } else {
            console.error('storageUtils.setStoredData - Storage for storage type \'' + storageType + '\' could not be found.');
        }
    } else {
        console.warn('storageUtils.setStoredData - Could not add data to storage. Storage key missing.');
    }
};

export const clearStoredData = (storageType: STORAGE_TYPE = DEFAULT_STORAGE_TYPE): void => {
    const storage = getStorage(storageType);

    if (storage) {
        storage.clear();
    } else {
        console.error('storageUtils.clearStoredData - Storage for storage type \'' + storageType + '\' could not be found.');
    }
};

const getStorage = (storageType: STORAGE_TYPE = DEFAULT_STORAGE_TYPE): Storage | null => {
    let storage;

    switch (storageType) {
        case STORAGE_TYPE.LOCAL:
            storage = window.localStorage ? window.localStorage : null;
            break;
        case STORAGE_TYPE.SESSION:
        default:
            storage = window.sessionStorage ? window.sessionStorage : null;
    }
    return storage;
};
