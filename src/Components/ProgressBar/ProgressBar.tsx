import React from 'react';
import { useTranslation } from 'react-i18next';
import './ProgressBar.scss';

interface ProgressBarProps {
  doneCount: number;
  totalCount: number;
  percent: number;
  percentTime: number;
  start: string;
  end: string;
}

const getPieSlicePath = (cx: number, cy: number, r: number, angle: number) => {
  const rad = (Math.PI / 180) * angle;
  const x = cx + r * Math.sin(rad);
  const y = cy - r * Math.cos(rad);
  const largeArcFlag = angle > 180 ? 1 : 0;
  return `
    M ${cx} ${cy}
    L ${cx} ${cy - r}
    A ${r} ${r} 0 ${largeArcFlag} 1 ${x} ${y}
    Z
  `;
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  doneCount,
  totalCount,
  percent,
  percentTime,
  start,
  end,
}) => {
  const { t } = useTranslation();
  return (
    <div className="progress-bar-container">
      {/* если нет заказов, то ничего не показываем */}
      {/* метка прогресса */}
      <div className="progress-bar-container__label">
        {t('profile.orders.progress')}
        <div className="progress-bar-container__value">
          {doneCount}/{totalCount}
        </div>
      </div>

      {/* сама полоса */}
      <div className="progress-bar-container__bar">
        <div
          className="progress-bar-container__bar-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* дата + круговой индикатор */}
      <div className="progress-bar-container__date">
        <svg
          className="progress-bar-container__date__timer-circle"
          width="24"
          height="24"
          viewBox="0 0 24 24"
        >
          <circle
            cx="12"
            cy="12"
            r="10"
            fill="none"
            stroke="rgba(242, 242, 242, 0.80)"
            strokeWidth="3"
          />
          <circle cx="12" cy="12" r="6" fill="transparent" />
          <path
            d={getPieSlicePath(12, 12, 6, (percentTime / 100) * 360)}
            fill="rgba(242, 242, 242, 0.80)"
          />
        </svg>
        <span className="progress-bar-container__date__text">
          {new Date(start).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'numeric',
          })}
          {' → '}
          {new Date(end).toLocaleDateString(undefined, {
            day: 'numeric',
            month: 'numeric',
          })}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
