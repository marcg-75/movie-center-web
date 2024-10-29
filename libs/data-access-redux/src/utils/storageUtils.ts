/**
 * JS file containing convenience methods for (session or local) storage caching.
 */

import { STORAGE_TYPE, StoredData } from '../models/storage.model';

const getDefaultStorageType = (): STORAGE_TYPE => {
  const strStorageType = process.env.NX_CACHE_STORAGE_DEFAULT?.toUpperCase();
  const fallbackStorageType = STORAGE_TYPE.SESSION;
  let cacheStorageDefault: STORAGE_TYPE | undefined;

  if (strStorageType === 'SESSION') {
    cacheStorageDefault = STORAGE_TYPE.SESSION;
  } else if (strStorageType === 'LOCAL') {
    cacheStorageDefault = STORAGE_TYPE.LOCAL;
  }

  return cacheStorageDefault || fallbackStorageType;
};

const DEFAULT_STORAGE_TYPE: STORAGE_TYPE = getDefaultStorageType();

const strCacheExptime = process.env.NX_CACHE_EXP_TIME_MINUTES;
const EXPIRATION_TIME_MINUTES: number = strCacheExptime
  ? parseInt(strCacheExptime)
  : 0;

/**
 * Retrieve cached data.
 *
 * @param {String} storageKey - The cache key.
 * @param {STORAGE_TYPE} storageType - Session or local storage (Configured, but fallback is session storage).
 * @param {Boolean} ignoreExpiration - If true, then the cached item will not be removed from the cache if expired.
 * @returns {Object}
 */
export const getStoredData = (
  storageKey: string,
  ignoreExpiration: boolean = false,
  storageType: STORAGE_TYPE = DEFAULT_STORAGE_TYPE
): unknown | null => {
  if (storageKey && storageKey.trim().length > 0) {
    const storage = getStorage(storageType);

    if (storage) {
      const strData = storage.getItem(storageKey);

      if (strData) {
        const data = JSON.parse(strData) as StoredData;

        if (!ignoreExpiration && data.timestamp) {
          const now = new Date();
          const expiration = new Date(data.timestamp);
          expiration.setMinutes(
            expiration.getMinutes() + EXPIRATION_TIME_MINUTES
          );

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
      console.error(
        "storageUtils.getStoredData - Storage for storage type '" +
          storageType +
          "' could not be found."
      );
    }
  }
  return null;
};

export const setStoredData = (
  storageKey: string,
  content: unknown,
  storageType: STORAGE_TYPE = DEFAULT_STORAGE_TYPE
): void => {
  if (storageKey && storageKey.trim().length > 0) {
    const storage = getStorage(storageType);

    if (storage) {
      const data: StoredData = {
        timestamp: new Date(),
        content,
      };

      storage.setItem(storageKey, JSON.stringify(data));
    } else {
      console.error(
        "storageUtils.setStoredData - Storage for storage type '" +
          storageType +
          "' could not be found."
      );
    }
  } else {
    console.warn(
      'storageUtils.setStoredData - Could not add data to storage. Storage key missing.'
    );
  }
};

export const clearStoredData = (
  storageType: STORAGE_TYPE = DEFAULT_STORAGE_TYPE
): void => {
  const storage = getStorage(storageType);

  if (storage) {
    storage.clear();
  } else {
    console.error(
      "storageUtils.clearStoredData - Storage for storage type '" +
        storageType +
        "' could not be found."
    );
  }
};

const getStorage = (
  storageType: STORAGE_TYPE = DEFAULT_STORAGE_TYPE
): Storage | null => {
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
