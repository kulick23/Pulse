import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import OrderDetailsModal from '../../popUps/OrderDetailsModal/OrderDetailsModal';
import doneMarkIcon from '../../Assets/Icons/doneMark.svg';
import notDoneMarkIcon from '../../Assets/Icons/notDoneMark.svg';
import whiteNotificationIcon from '../../Assets/Icons/whiteNotification.svg';
import notificationBlue from '../../Assets/Icons/notificationblue.svg';
import ProgressBar from '../ProgressBar/ProgressBar';
import type { OrderInfo } from '../../redux/order/types';
import './OrderCard.scss';
import receipt from '../../Assets/Icons/receipt.svg'

export interface OrderCardProps {
  order: OrderInfo & { notificationsCount?: number };
}

export const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { t } = useTranslation();
  const { name, deadline_start, deadline_end, is_payed, is_done, tasks } = order;
  // count unread tasks
  const unreadCount = tasks.filter((t) => !t.is_read).length;

  // прогресс по задачам
  const doneCount = tasks.filter((t) => t.is_done).length;
  const totalCount = tasks.length;
  const percent = totalCount ? (doneCount / totalCount) * 100 : 0;

  // прогресс по времени
  const now = Date.now();
  const t0 = new Date(deadline_start).getTime();
  const t1 = new Date(deadline_end).getTime();
  const percentTime =
    t1 > t0 ? Math.min(Math.max(((now - t0) / (t1 - t0)) * 100, 0), 100) : 0;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showTasks, setShowTasks] = useState(false);

  return (
    <>
      <div
        className={`order-card${is_done ? ' paid' : ''}`}
        onClick={() => setIsModalOpen(true)}
        style={{ cursor: 'pointer' }}
      >
        <div className="order-card__header">
          <div className="order-card__status">
            <span
              className={`order-card__status-text${is_payed ? ' paid' : ''}`}
            >
              {is_payed
                ? t('profile.orders.paid')
                : t('profile.orders.waitingPayment')}
            </span>
          </div>
          <div className="order-card__notification">
            {unreadCount > 0 && (
              <span className="order-card__notification-badge">
                {unreadCount}
              </span>
            )}
            <img
              src={unreadCount > 0 ? notificationBlue : whiteNotificationIcon}
              alt="Notifications"
            />
          </div>
        </div>

        <div className="order-card__title">{name}</div>

        <div className="order-card__progress">
          <ProgressBar
            doneCount={doneCount}
            totalCount={totalCount}
            percent={percent}
            percentTime={percentTime}
            start={deadline_start}
            end={deadline_end}
          />
        </div>

        <div className="order-card__tasks-container">
          <div
            className={`order-card__tasks-list${
              showTasks ? ' order-card__tasks-list--open' : ''
            }`}
          >
            {tasks.slice(0, 3).map((task, idx) => (
              <div key={idx} className="order-card__task-item">
                <img
                  src={task.is_done ? doneMarkIcon : notDoneMarkIcon}
                  alt={task.is_done ? 'Completed' : 'Not completed'}
                />
                <span
                  className={`order-card__task-text${
                    task.is_done ? ' done' : ''
                  }`}
                >
                  {task.name}
                </span>
                {!task.is_read && (
                  <span className="order-card__task-badge">1</span>
                )}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="order-card__tasks-btn"
          aria-expanded={showTasks}
          onClick={(e) => {
            e.stopPropagation();
            setShowTasks(!showTasks);
          }}
        />
      </div>

      {isModalOpen && (
        <OrderDetailsModal
          order={order}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
};

export default OrderCard;
