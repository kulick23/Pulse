import React, { useState } from 'react';
import { BankGlyph } from '../ProfilePage/BankGlyph';
import { useBankLedger } from '../ProfilePage/bankLedger';
import {
  locale,
  ServiceHeader,
  ServiceModal,
  ServicePageProps,
} from './ServicePageShared';
import { useVersionedState } from '../../Hooks/useVersionedState';

export const InvestingPage: React.FC<ServicePageProps> = ({
  language,
  onNotice,
}) => {
  const { eurBalance, addPayment, addCredit } = useBankLedger();
  interface MarketAsset {
    ticker: string;
    name: string;
    price: number;
    change: string;
  }
  interface InvestmentOrder {
    id: string;
    ticker: string;
    name: string;
    amount: number;
    units: number;
    type: 'market' | 'limit';
    date: string;
    side: 'buy' | 'sell';
    status: 'filled' | 'pending' | 'cancelled';
  }
  interface InvestmentPosition {
    ticker: string;
    name: string;
    units: number;
  }
  interface OrderDraft {
    amount: number;
    type: 'market' | 'limit';
    units: number;
  }

  const [asset, setAsset] = useState<string | null>(null);
  const [sellTicker, setSellTicker] = useState<string | null>(null);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);
  const [period, setPeriod] = useState<'1Y' | '3Y' | 'MAX'>('1Y');
  const [updatedAt, setUpdatedAt] = useState('10:42');
  const migrateOrders = (source: unknown) =>
    (Array.isArray(source) ? source : []).map((order) => ({
      ...(order as InvestmentOrder),
      side: order.side === 'sell' ? 'sell' : 'buy',
      status:
        order.status === 'pending' || order.status === 'cancelled'
          ? order.status
          : 'filled',
    }));
  const [orders, setOrders] = useVersionedState<InvestmentOrder[]>({
    key: 'pulse-invest-orders',
    version: 2,
    fallback: [],
    migrate: migrateOrders,
    validate: (source): source is InvestmentOrder[] => Array.isArray(source),
  });
  const initialPositions: InvestmentPosition[] = [
    { ticker: 'VWCE', name: 'Vanguard FTSE All-World', units: 86.42 },
    { ticker: 'EUNL', name: 'iShares Core MSCI World', units: 54.18 },
    { ticker: 'SXR8', name: 'iShares Core S&P 500', units: 8.25 },
  ];
  const [positions, setPositions] = useVersionedState<InvestmentPosition[]>({
    key: 'pulse-invest-positions',
    version: 2,
    fallback: initialPositions,
    migrate: (source) =>
      Array.isArray(source)
        ? (source as InvestmentPosition[])
        : initialPositions,
    validate: (source): source is InvestmentPosition[] => Array.isArray(source),
  });
  const chartData = {
    '1Y': {
      result: '+7,99%',
      from: 'Oct 2025',
      to: 'Oct 2026',
      path: 'M0 228 C70 220 84 184 150 192 S244 150 302 164 S386 92 438 120 S520 84 580 96 S675 42 800 28',
    },
    '3Y': {
      result: '+18,42%',
      from: 'Oct 2023',
      to: 'Oct 2026',
      path: 'M0 220 C65 180 112 206 164 166 S250 190 310 132 S390 152 450 104 S560 130 622 72 S712 84 800 24',
    },
    MAX: {
      result: '+31,06%',
      from: 'May 2021',
      to: 'Oct 2026',
      path: 'M0 236 C74 224 110 146 176 176 S270 116 330 148 S414 66 476 108 S566 58 632 76 S724 38 800 18',
    },
  };
  const assets: MarketAsset[] = [
    {
      ticker: 'VWCE',
      name: 'Vanguard FTSE All-World',
      price: 118.42,
      change: '+1,28%',
    },
    {
      ticker: 'EUNL',
      name: 'iShares Core MSCI World',
      price: 102.86,
      change: '+0,74%',
    },
    {
      ticker: 'SXR8',
      name: 'iShares Core S&P 500',
      price: 592.1,
      change: '−0,31%',
    },
    {
      ticker: 'EXSA',
      name: 'STOXX Europe 600',
      price: 51.04,
      change: '+0,42%',
    },
  ];
  const selectedAsset = assets.find((item) => item.ticker === asset);
  const selectedSellPosition = positions.find(
    (position) => position.ticker === sellTicker
  );
  const selectedSellAsset = assets.find((item) => item.ticker === sellTicker);
  const positionsValue = positions.reduce((sum, position) => {
    const marketAsset = assets.find((item) => item.ticker === position.ticker);
    return sum + position.units * (marketAsset?.price ?? 0);
  }, 0);
  const cash = eurBalance;
  const euro = (amount: number) =>
    new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);

  const closeOrder = () => {
    setAsset(null);
    setOrderDraft(null);
  };
  const formatOrderDate = () =>
    new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());
  const cancelInvestmentOrder = (order: InvestmentOrder) => {
    if (order.status !== 'pending') return;
    addCredit({
      sender: `Pulse Invest · ${order.ticker}`,
      amount: order.amount,
      categoryRu: 'Возврат резерва по заявке',
      categoryEn: 'Order reserve released',
      service: 'investing',
      sourcePath: '/investing',
    });
    setOrders((current) =>
      current.map((item) =>
        item.id === order.id ? { ...item, status: 'cancelled' } : item
      )
    );
    onNotice(
      locale(
        language,
        'Заявка отменена, резерв возвращён',
        'Order cancelled, reserve returned'
      )
    );
  };

  const confirmOrder = () => {
    if (!selectedAsset || !orderDraft) return;
    const paid = addPayment({
      recipient: `Pulse Invest · ${selectedAsset.ticker}`,
      amount: orderDraft.amount,
      categoryRu: 'Покупка инвестиционного актива',
      categoryEn: 'Investment purchase',
      service: 'investing',
      sourcePath: '/investing',
    });
    if (!paid) {
      onNotice(
        locale(
          language,
          'Недостаточно средств на EUR-счёте',
          'Insufficient funds in your EUR account'
        )
      );
      return;
    }
    const status: InvestmentOrder['status'] =
      orderDraft.type === 'market' ? 'filled' : 'pending';
    setOrders((current) => [
      {
        id: `ORD-${Date.now()}`,
        ticker: selectedAsset.ticker,
        name: selectedAsset.name,
        amount: orderDraft.amount,
        units: orderDraft.units,
        type: orderDraft.type,
        side: 'buy',
        status,
        date: formatOrderDate(),
      },
      ...current,
    ]);
    if (status === 'filled') {
      setPositions((current) => {
        const existing = current.find(
          (position) => position.ticker === selectedAsset.ticker
        );
        return existing
          ? current.map((position) =>
              position.ticker === selectedAsset.ticker
                ? { ...position, units: position.units + orderDraft.units }
                : position
            )
          : [
              ...current,
              {
                ticker: selectedAsset.ticker,
                name: selectedAsset.name,
                units: orderDraft.units,
              },
            ];
      });
    }
    closeOrder();
    onNotice(
      status === 'filled'
        ? locale(language, 'Заявка исполнена', 'Order filled')
        : locale(language, 'Лимитная заявка размещена', 'Limit order placed')
    );
  };
  return (
    <div className="service-shell service-investing">
      <ServiceHeader
        eyebrow="Pulse Invest"
        title={locale(
          language,
          'Портфель без шума',
          'A portfolio without noise'
        )}
        description={locale(
          language,
          'ETF, цели и аналитика риска понятным языком.',
          'ETFs, goals and risk analytics in plain language.'
        )}
        metrics={[
          [
            locale(language, 'Стоимость портфеля', 'Portfolio value'),
            euro(positionsValue),
          ],
          [locale(language, 'Результат', 'Return'), '+1 842,16 €', '+7,99%'],
          [locale(language, 'Свободные средства', 'Cash'), euro(cash)],
        ]}
      />
      <div className="service-invest-grid" id="service-workspace">
        <section className="service-section service-portfolio-chart">
          <header>
            <div>
              <span>{locale(language, 'Динамика', 'Performance')}</span>
              <h2>{chartData[period].result}</h2>
            </div>
            <div>
              {(['1Y', '3Y', 'MAX'] as const).map((item) => (
                <button
                  className={period === item ? 'active' : ''}
                  type="button"
                  key={item}
                  onClick={() => setPeriod(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </header>
          <svg
            viewBox="0 0 800 260"
            role="img"
            aria-label={locale(
              language,
              'График стоимости портфеля',
              'Portfolio value chart'
            )}
            preserveAspectRatio="none"
          >
            <path
              d={chartData[period].path}
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M0 228 H800"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".16"
            />
            <path
              d="M0 150 H800"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".1"
            />
            <path
              d="M0 72 H800"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".1"
            />
          </svg>
          <footer>
            <span>{chartData[period].from}</span>
            <span>{chartData[period].to}</span>
          </footer>
        </section>
        <section className="service-section service-allocation">
          <span>{locale(language, 'Распределение', 'Allocation')}</span>
          <h2>{locale(language, 'По классам активов', 'By asset class')}</h2>
          <div>
            <i style={{ width: '68%' }} />
            <i style={{ width: '22%' }} />
            <i style={{ width: '10%' }} />
          </div>
          <dl>
            <div>
              <dt>
                <i />
                ETF
              </dt>
              <dd>68%</dd>
            </div>
            <div>
              <dt>
                <i />
                {locale(language, 'Облигации', 'Bonds')}
              </dt>
              <dd>22%</dd>
            </div>
            <div>
              <dt>
                <i />
                Cash
              </dt>
              <dd>10%</dd>
            </div>
          </dl>
        </section>
      </div>
      <section className="service-section service-invest-holdings">
        <header>
          <div>
            <span>{locale(language, 'Портфель', 'Portfolio')}</span>
            <h2>{locale(language, 'Мои активы', 'My holdings')}</h2>
          </div>
          <b>{euro(positionsValue)}</b>
        </header>
        {positions.length > 0 ? (
          <div>
            {positions.map((position) => {
              const marketAsset = assets.find(
                (item) => item.ticker === position.ticker
              );
              return (
                <article key={position.ticker}>
                  <span>{position.ticker.slice(0, 1)}</span>
                  <div>
                    <strong>
                      {position.ticker} · {position.name}
                    </strong>
                    <small>
                      {position.units.toFixed(4)}{' '}
                      {locale(language, 'доли', 'units')}
                    </small>
                  </div>
                  <p>
                    <strong>
                      {euro(position.units * (marketAsset?.price ?? 0))}
                    </strong>
                    <small>{marketAsset?.change}</small>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSellTicker(position.ticker)}
                  >
                    {locale(language, 'Продать', 'Sell')}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="service-invest-empty">
            <BankGlyph name="invest" />
            <strong>
              {locale(
                language,
                'Портфель пока пуст',
                'Your portfolio is empty'
              )}
            </strong>
            <p>
              {locale(
                language,
                'Выберите ETF в списке рынков, чтобы сделать первую покупку.',
                'Choose an ETF from Markets to make your first purchase.'
              )}
            </p>
          </div>
        )}
      </section>
      <section
        className="service-section service-table-section"
        id="service-tools"
      >
        <header>
          <div>
            <span>Watchlist · {updatedAt}</span>
            <h2>{locale(language, 'Рынки', 'Markets')}</h2>
          </div>
          <button
            type="button"
            onClick={() => {
              setUpdatedAt(
                new Intl.DateTimeFormat(language, {
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date())
              );
              onNotice(
                locale(language, 'Котировки обновлены', 'Quotes updated')
              );
            }}
          >
            {locale(language, 'Обновить', 'Refresh')}
          </button>
        </header>
        <div className="service-market-table">
          {assets.map((marketAsset) => (
            <button
              type="button"
              key={marketAsset.ticker}
              onClick={() => setAsset(marketAsset.ticker)}
            >
              <b>{marketAsset.ticker}</b>
              <strong>{marketAsset.name}</strong>
              <span>{euro(marketAsset.price)}</span>
              <em
                className={
                  marketAsset.change.startsWith('+') ? 'positive' : 'negative'
                }
              >
                {marketAsset.change}
              </em>
              <i>{locale(language, 'Купить', 'Buy')}</i>
            </button>
          ))}
        </div>
      </section>
      {orders.length > 0 && (
        <section className="service-section service-invest-orders">
          <header>
            <div>
              <span>{locale(language, 'Заявки', 'Orders')}</span>
              <h2>
                {locale(language, 'Последние покупки', 'Recent purchases')}
              </h2>
            </div>
            <b>{orders.length}</b>
          </header>
          <div>
            {orders.slice(0, 5).map((order) => (
              <article key={order.id} className={`is-${order.status}`}>
                <span>{order.ticker.slice(0, 1)}</span>
                <div>
                  <strong>
                    {order.side === 'sell'
                      ? locale(language, 'Продажа', 'Sell')
                      : locale(language, 'Покупка', 'Buy')}{' '}
                    · {order.ticker} · {order.name}
                  </strong>
                  <small>
                    {order.date} · {order.units.toFixed(4)}{' '}
                    {locale(language, 'доли', 'units')}
                  </small>
                </div>
                <p>
                  <strong>
                    {order.side === 'sell' ? '+' : '−'}
                    {euro(order.amount)}
                  </strong>
                  <small>{order.type === 'market' ? 'Market' : 'Limit'}</small>
                </p>
                <em>
                  {order.status === 'filled'
                    ? locale(language, 'Исполнена', 'Filled')
                    : order.status === 'pending'
                      ? locale(language, 'Ожидает', 'Pending')
                      : locale(language, 'Отменена', 'Cancelled')}
                </em>
                {order.status === 'pending' && (
                  <button
                    type="button"
                    onClick={() => cancelInvestmentOrder(order)}
                  >
                    {locale(language, 'Отменить', 'Cancel')}
                  </button>
                )}
              </article>
            ))}
          </div>
        </section>
      )}
      {selectedSellPosition && selectedSellAsset && (
        <ServiceModal
          title={`${locale(language, 'Продать', 'Sell')} ${selectedSellPosition.ticker}`}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setSellTicker(null)}
        >
          <form
            className="service-form"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const units = Number.parseFloat(
                String(data.get('units') ?? '').replace(',', '.')
              );
              if (!units || units > selectedSellPosition.units) {
                onNotice(
                  locale(
                    language,
                    'Проверьте количество доступных долей',
                    'Check the number of available units'
                  )
                );
                return;
              }
              const amount = Number(
                (units * selectedSellAsset.price).toFixed(2)
              );
              addCredit({
                sender: `Pulse Invest · ${selectedSellPosition.ticker}`,
                amount,
                categoryRu: 'Продажа инвестиционного актива',
                categoryEn: 'Investment sale',
                service: 'investing',
                sourcePath: '/investing',
              });
              setPositions((current) =>
                current
                  .map((position) =>
                    position.ticker === selectedSellPosition.ticker
                      ? { ...position, units: position.units - units }
                      : position
                  )
                  .filter((position) => position.units > 0.0001)
              );
              setOrders((current) => [
                {
                  id: `ORD-${Date.now()}`,
                  ticker: selectedSellPosition.ticker,
                  name: selectedSellPosition.name,
                  amount,
                  units,
                  type: 'market',
                  side: 'sell',
                  status: 'filled',
                  date: formatOrderDate(),
                },
                ...current,
              ]);
              setSellTicker(null);
              onNotice(
                locale(
                  language,
                  'Продажа исполнена, деньги зачислены',
                  'Sale filled, funds credited'
                )
              );
            }}
          >
            <div className="service-order-asset">
              <span>{selectedSellPosition.ticker.slice(0, 1)}</span>
              <div>
                <strong>{selectedSellPosition.name}</strong>
                <small>
                  {euro(selectedSellAsset.price)} ·{' '}
                  {selectedSellPosition.units.toFixed(4)}{' '}
                  {locale(language, 'доступно', 'available')}
                </small>
              </div>
            </div>
            <label>
              {locale(language, 'Количество долей', 'Units to sell')}
              <input
                required
                min="0.0001"
                max={selectedSellPosition.units}
                step="0.0001"
                name="units"
                type="number"
                inputMode="decimal"
                defaultValue={Math.min(1, selectedSellPosition.units)}
              />
            </label>
            <button type="submit">
              {locale(language, 'Подтвердить продажу', 'Confirm sale')}
            </button>
            <small>
              {locale(
                language,
                'Рыночная заявка исполняется сразу по демо-котировке.',
                'The market order fills immediately at the demo quote.'
              )}
            </small>
          </form>
        </ServiceModal>
      )}
      {selectedAsset && (
        <ServiceModal
          title={`${locale(language, 'Купить', 'Buy')} ${selectedAsset.ticker}`}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={closeOrder}
        >
          {orderDraft ? (
            <div className="service-order-review">
              <div className="service-order-review__asset">
                <span>{selectedAsset.ticker.slice(0, 1)}</span>
                <div>
                  <strong>{selectedAsset.name}</strong>
                  <small>
                    {selectedAsset.ticker} · {euro(selectedAsset.price)}
                  </small>
                </div>
              </div>
              <dl>
                <div>
                  <dt>{locale(language, 'Сумма', 'Amount')}</dt>
                  <dd>{euro(orderDraft.amount)}</dd>
                </div>
                <div>
                  <dt>{locale(language, 'Количество', 'Units')}</dt>
                  <dd>{orderDraft.units.toFixed(4)}</dd>
                </div>
                <div>
                  <dt>{locale(language, 'Тип заявки', 'Order type')}</dt>
                  <dd>{orderDraft.type === 'market' ? 'Market' : 'Limit'}</dd>
                </div>
                <div>
                  <dt>{locale(language, 'Комиссия', 'Fee')}</dt>
                  <dd>0,00 €</dd>
                </div>
              </dl>
              <button type="button" onClick={confirmOrder}>
                {locale(language, 'Подтвердить покупку', 'Confirm purchase')}
              </button>
              <button type="button" onClick={() => setOrderDraft(null)}>
                {locale(language, 'Изменить', 'Edit')}
              </button>
              <small>
                {locale(
                  language,
                  'Цена исполнения может незначительно измениться.',
                  'The execution price may change slightly.'
                )}
              </small>
            </div>
          ) : (
            <form
              className="service-form"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const amount = Number.parseFloat(
                  String(data.get('amount') ?? '').replace(',', '.')
                );
                const type = String(data.get('type')) as 'market' | 'limit';
                if (!amount || amount > cash) {
                  onNotice(
                    locale(
                      language,
                      'Недостаточно свободных средств',
                      'Not enough available cash'
                    )
                  );
                  return;
                }
                setOrderDraft({
                  amount,
                  type,
                  units: amount / selectedAsset.price,
                });
              }}
            >
              <div className="service-order-asset">
                <span>{selectedAsset.ticker.slice(0, 1)}</span>
                <div>
                  <strong>{selectedAsset.name}</strong>
                  <small>
                    {euro(selectedAsset.price)} · {selectedAsset.change}
                  </small>
                </div>
              </div>
              <label>
                {locale(language, 'Сумма инвестиции', 'Investment amount')}
                <div>
                  <input
                    required
                    name="amount"
                    inputMode="decimal"
                    defaultValue="250"
                  />
                  <span>EUR</span>
                </div>
              </label>
              <label>
                {locale(language, 'Тип заявки', 'Order type')}
                <select name="type" defaultValue="market">
                  <option value="market">Market</option>
                  <option value="limit">Limit</option>
                </select>
              </label>
              <button type="submit">
                {locale(language, 'Проверить заявку', 'Review order')}
              </button>
              <small>
                {locale(
                  language,
                  `Доступно ${euro(cash)} · Не является инвестиционной рекомендацией.`,
                  `${euro(cash)} available · This is not investment advice.`
                )}
              </small>
            </form>
          )}
        </ServiceModal>
      )}
    </div>
  );
};
