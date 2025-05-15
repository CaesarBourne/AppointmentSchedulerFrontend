
/**
 * Storage service for persisting data locally
 */

// Define storage keys
const STORAGE_KEYS = {
  PARTICIPANTS: 'app_participants',
  APPOINTMENTS: 'app_appointments',
};

/**
 * Get data from local storage
 */
export function getStoredData<T>(key: string, defaultValue: T): T {
  try {
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving data from storage for key ${key}:`, error);
    return defaultValue;
  }
}

/**
 * Store data to local storage
 */
export function storeData(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error storing data for key ${key}:`, error);
  }
}

export { STORAGE_KEYS };
