import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ProgressBar from '../../Components/ProgressBar/ProgressBar';
import type { OrderInfo, Task } from '../../redux/order/types';
import {
  useUploadChequeMutation,
  useMarkTasksReadMutation,
} from '../../redux/order/api';
import './OrderDetailsModal.scss';
import doneIcon from '../../Assets/Icons/doneMark.svg';
import NotdoneIcon from '../../Assets/Icons/notDoneMark.svg';
import receipt from '../../Assets/Icons/receipt.svg'

interface Props {
  order: OrderInfo;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<Props> = ({ order, onClose }) => {
  const { t } = useTranslation();
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [uploadCheque, { isLoading }] = useUploadChequeMutation();
  const [markTasksRead] = useMarkTasksReadMutation();

  useEffect(() => {
    // mark all tasks in this order as read on open
    markTasksRead({ order_id: order.id });
  }, [order.id, markTasksRead]);

  const doneCount = order.tasks.filter((t) => t.is_done).length;
  const totalCount = order.tasks.length;
  const percentTime = (() => {
    const now = Date.now(),
      t0 = new Date(order.deadline_start).getTime(),
      t1 = new Date(order.deadline_end).getTime();
    return t1 > t0
      ? Math.min(Math.max(((now - t0) / (t1 - t0)) * 100, 0), 100)
      : 0;
  })();

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadCheque({
        user_id: order.user_id,
        order_id: order.id,
        file,
      }).unwrap();
      alert(t('profile.orders.chequeUploaded'));
    } catch {
      alert(t('profile.orders.uploadError'));
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="OrderDetailsModal" onClick={(e) => e.stopPropagation()}>
        <div className="OrderDetailsModal__header">
          <div className="OrderDetailsModal__header--block">
            <span className={`status ${order.is_payed ? 'paid' : ''}`}>
              {order.is_payed
                ? t('profile.orders.paid')
                : t('profile.orders.waitingPayment')}
            </span>
            {order.payment_cheque ? (
              <a href={order.payment_cheque} download className="cheque">
                {t('popup.download')}
                <img src={receipt} alt="receipt" />

              </a>
            ) : (
              <label className="cheque">
                {isLoading ? t('popup.uploading') : t('popup.upload')}
                <input type="file" onChange={onFileChange} hidden />
              </label>
            )}
          </div>
          <span className="OrderDetailsModal__header--name">{order.name}</span>
        </div>
        <p className="OrderDetailsModal__desc">{order.description}</p>

        <ProgressBar
          doneCount={doneCount}
          totalCount={totalCount}
          percent={(doneCount / totalCount) * 100}
          percentTime={percentTime}
          start={order.deadline_start}
          end={order.deadline_end}
        />

        <div className="OrderDetailsModal__tasks">
          {order.tasks.map((task: Task, i) => (
            <div key={i} className="OrderDetailsModal__tasks-item">
              <button
                className={`OrderDetailsModal__tasks-toggle${task.is_done ? ' done' : ''}`}
                aria-expanded={expandedIdx === i}
                onClick={() => setExpandedIdx(expandedIdx === i ? null : i)}
              >
                <img
                  className="OrderDetailsModal__tasks-icon"
                  src={task.is_done ? doneIcon : NotdoneIcon}
                  alt={task.is_done ? 'done' : 'not done'}
                />
                <span className="OrderDetailsModal__tasks-title">
                  {task.name}
                </span>
                {!task.is_read && (
                  <span className="OrderDetailsModal__tasks-badge">1</span>
                )}
              </button>
              <div
                className={`OrderDetailsModal__tasks-content${expandedIdx === i ? ' expanded' : ''
                  }`}
              >
                <p className="OrderDetailsModal__tasks-desc">
                  {task.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
