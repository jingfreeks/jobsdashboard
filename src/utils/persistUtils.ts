import { persistor } from '@/config/store';

/**
 * Purge all persisted state
 */
export const purgePersistedState = async (): Promise<boolean> => {
  try {
    await persistor.purge();
    console.log('Persisted state purged successfully');
    return true;
  } catch (error) {
    console.error('Error purging persisted state:', error);
    return false;
  }
};

/**
 * Flush persisted state to storage
 */
export const flushPersistedState = async (): Promise<boolean> => {
  try {
    await persistor.flush();
    console.log('Persisted state flushed successfully');
    return true;
  } catch (error) {
    console.error('Error flushing persisted state:', error);
    return false;
  }
};

/**
 * Pause persistence
 */
export const pausePersistence = (): void => {
  try {
    persistor.pause();
    console.log('Persistence paused');
  } catch (error) {
    console.error('Error pausing persistence:', error);
  }
};

/**
 * Resume persistence
 */
export const resumePersistence = (): void => {
  try {
    persistor.persist();
    console.log('Persistence resumed');
  } catch (error) {
    console.error('Error resuming persistence:', error);
  }
};

/**
 * Check if persistence is ready
 */
export const isPersistenceReady = (): boolean => {
  return persistor.getState().bootstrapped;
};

/**
 * Get persistence state
 */
export const getPersistenceState = () => {
  return persistor.getState();
};

/**
 * Wait for persistence to be ready
 */
export const waitForPersistence = (): Promise<void> => {
  return new Promise((resolve) => {
    if (isPersistenceReady()) {
      resolve();
    } else {
      const unsubscribe = persistor.subscribe(() => {
        if (isPersistenceReady()) {
          unsubscribe();
          resolve();
        }
      });
    }
  });
}; 