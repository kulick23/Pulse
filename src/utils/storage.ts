/**
 * Утилиты для работы с localStorage
 * Включает проверку доступности, обертки для более надежного хранения и получения данных
 */

// Названия ключей для localStorage
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_DATA: 'userData',
};

/**
 * Проверяет доступность localStorage
 * @returns boolean - доступен ли localStorage
 */
export const isLocalStorageAvailable = (): boolean => {
  try {
    // Проверяем, что localStorage доступен
    const testKey = 'testStorage';
    localStorage.setItem(testKey, testKey);
    const retrievedItem = localStorage.getItem(testKey);
    localStorage.removeItem(testKey);

    return retrievedItem === testKey;
  } catch (error) {
    console.error('Error checking localStorage availability:', error);
    return false;
  }
};

/**
 * Сохраняет данные в localStorage с обработкой ошибок
 * @param key - ключ для сохранения
 * @param value - значение для сохранения
 * @returns boolean - успешно ли сохранены данные
 */
export const setItem = (key: string, value: string): boolean => {
  try {
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage is not available');
      return false;
    }

    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Получает данные из localStorage с обработкой ошибок
 * @param key - ключ для получения значения
 * @returns string | null - полученное значение или null при ошибке
 */
export const getItem = (key: string): string | null => {
  try {
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage is not available');
      return null;
    }

    return localStorage.getItem(key);
  } catch (error) {
    console.error(`Error getting item from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Удаляет данные из localStorage с обработкой ошибок
 * @param key - ключ для удаления
 * @returns boolean - успешно ли удалены данные
 */
export const removeItem = (key: string): boolean => {
  try {
    if (!isLocalStorageAvailable()) {
      console.error('LocalStorage is not available');
      return false;
    }

    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage (${key}):`, error);
    return false;
  }
};

/**
 * Сохраняет объект в localStorage, сериализуя его в JSON
 * @param key - ключ для сохранения
 * @param value - объект для сохранения
 * @returns boolean - успешно ли сохранены данные
 */
export const setObject = <T>(key: string, value: T): boolean => {
  try {
    const jsonValue = JSON.stringify(value);
    return setItem(key, jsonValue);
  } catch (error) {
    console.error(
      `Error serializing and storing object in localStorage (${key}):`,
      error
    );
    return false;
  }
};

/**
 * Получает объект из localStorage, десериализуя его из JSON
 * @param key - ключ для получения объекта
 * @returns T | null - полученный объект или null при ошибке
 */
export const getObject = <T>(key: string): T | null => {
  try {
    const jsonValue = getItem(key);
    if (!jsonValue) return null;

    const parsedValue = JSON.parse(jsonValue);
    // Проверяем, что значение не null и не undefined
    if (parsedValue === null || parsedValue === undefined) {
      console.warn(`Parsed value for key ${key} is null or undefined`);
      return null;
    }
    // Проверяем, что значение - это объект
    if (typeof parsedValue !== 'object') {
      console.warn(
        `Parsed value for key ${key} is not an object, but ${typeof parsedValue}`
      );
      return null;
    }
    return parsedValue as T;
  } catch (error) {
    console.error(`Error parsing object from localStorage (${key}):`, error);
    return null;
  }
};

/**
 * Очищает все данные авторизации
 */
export const clearAuthData = (): void => {
  removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  removeItem(STORAGE_KEYS.USER_DATA);
};

/**
 * Сохраняет данные авторизации
 * @param accessToken - токен доступа
 * @param refreshToken - токен обновления
 * @param userData - данные пользователя
 */
export const saveAuthData = (
  accessToken: string,
  refreshToken: string,
  userData?: any
): void => {
  setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);

  if (userData) {
    setObject(STORAGE_KEYS.USER_DATA, userData);
  }
};
