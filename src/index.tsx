import React from 'react';
import ReactDOM from 'react-dom/client';
import AppWrapper from './App';
import './i18n';
import { isLocalStorageAvailable } from './utils/storage';

/**
 * Отображает предупреждение, если localStorage недоступен
 */
const showStorageWarningIfNeeded = () => {
  if (!isLocalStorageAvailable()) {
    // Добавляем предупреждение для пользователя, если localStorage недоступен
    const warningElement = document.createElement('div');
    warningElement.style.position = 'fixed';
    warningElement.style.top = '0';
    warningElement.style.left = '0';
    warningElement.style.right = '0';
    warningElement.style.padding = '10px';
    warningElement.style.backgroundColor = '#ff4c4c';
    warningElement.style.color = 'white';
    warningElement.style.zIndex = '9999';
    warningElement.style.textAlign = 'center';
    warningElement.innerText =
      'Внимание: Хранилище данных недоступно. Возможно, у вас включен режим инкогнито или отключены cookies.';
    document.body.appendChild(warningElement);
  }
};

// Проверяем localStorage до рендеринга React
showStorageWarningIfNeeded();

// Инициализация React-приложения
const rootElement = document.getElementById('root');
if (!rootElement)
  throw new Error('Не найден корневой элемент для монтирования приложения');

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);
