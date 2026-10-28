import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './Support.scss';
import FormInput from '../FormInput/FormInput';
import supportIcon from '../../Assets/Icons/support.svg';
import cursorIcon from '../../Assets/Icons/cursor.svg';

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export const Support: React.FC = () => {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: t('profile.support.greeting'),
      isUser: false,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: t('profile.support.userQuestion'),
      isUser: true,
      timestamp: new Date(Date.now() - 5 * 60000),
    },
    {
      id: 3,
      text: t('profile.support.supportResponse1'),
      isUser: false,
      timestamp: new Date(Date.now() - 4 * 60000),
    },
    {
      id: 4,
      text: t('profile.support.orderNumber'),
      isUser: true,
      timestamp: new Date(Date.now() - 3 * 60000),
    },
    {
      id: 5,
      text: t('profile.support.supportResponse2'),
      isUser: false,
      timestamp: new Date(Date.now() - 2 * 60000),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Функция для прокрутки к последнему сообщению внутри контейнера
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };

  // Прокручиваем вниз при получении новых сообщений
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Добавляем сообщение пользователя
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue('');

    // Имитация ответа от поддержки через 1 секунду
    setTimeout(() => {
      const supportMessage: Message = {
        id: messages.length + 2,
        text: t('profile.support.autoResponse'),
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, supportMessage]);
    }, 1000);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="support">
      <div className="chat-container">
        <div className="messages" ref={messagesContainerRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.isUser ? 'user-message' : 'support-message'}`}
            >
              {!message.isUser && (
                <div className="message-icon">
                  <img src={supportIcon} alt="Support" />
                </div>
              )}
              <div className="message-content">
                <div className="message-text">{message.text}</div>
                <div className="message-time">
                  {formatTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <form className="message-input-form" onSubmit={handleSubmit}>
          <div className="chat-input-container">
            <input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              placeholder={t('profile.support.inputPlaceholder')}
              className="chat-input"
              onKeyPress={handleKeyPress}
            />
            <button
              type="submit"
              className="send-button-icon"
              aria-label={t('profile.support.send')}
            >
              <img src={cursorIcon} alt={t('profile.support.send')} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Support;
