import React from 'react';
import { useTranslation } from 'react-i18next';
import './OrdersList.scss';
import OrderCard from '../OrderCard/OrderCard';
import { useGetMyOrdersQuery } from '../../redux/order/api';

export const OrdersList: React.FC = () => {
  const { t } = useTranslation();
  // получаем свои заказы с сервера
  const { data: orders = [], isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading orders</p>;

  // Заказы в работе (is_done === false) и завершённые (is_done === true)
  const inProgress = orders.filter((o) => o.is_done === false);
  const completed = orders.filter((o) => o.is_done === true);

  const fmt = (s: string) => new Date(s).toLocaleDateString();

  return (
    <div className="orders-list">
      <div className="order-columns">
        <div className="order-column">
          <div className="column-header inProgress">
            <h2>
              {t('profile.orders.inProgress')} ({inProgress.length})
            </h2>
          </div>
          <div className="column-cards">
            {inProgress.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        </div>

        <div className="order-column">
          <div className="column-header completed">
            <h2>
              {t('profile.orders.completed')} ({completed.length})
            </h2>
          </div>
          <div className="column-cards">
            {completed.map((o) => (
              <OrderCard key={o.id} order={o} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
