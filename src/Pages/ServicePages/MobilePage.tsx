import React, { useState } from 'react';
import { BankGlyph, BankGlyphName } from '../ProfilePage/BankGlyph';
import { useBankLedger } from '../ProfilePage/bankLedger';
import {
  ActionButton,
  downloadTextFile,
  locale,
  ServiceHeader,
  ServiceModal,
  ServicePageProps,
} from './ServicePageShared';
import { useVersionedState } from '../../Hooks/useVersionedState';

export const MobilePage: React.FC<ServicePageProps> = ({
  language,
  onNotice,
}) => {
  const { addPayment } = useBankLedger();
  type MobilePlanId = 'pulse30' | 'pulseMax';
  type RoamingRegion = 'eea' | 'world';
  type RoamingPassId = 'none' | 'worldDay' | 'worldWeek';
  interface MobileEvent {
    id: string;
    title: string;
    caption: string;
    amount?: string;
    icon: BankGlyphName;
  }
  interface MobileState {
    planId: MobilePlanId;
    dataUsed: number;
    dataAllowance: number;
    roamingEnabled: boolean;
    roamingRegion: RoamingRegion;
    roamingPass: RoamingPassId;
    autoPay: boolean;
    device: string;
    events: MobileEvent[];
  }

  const mobilePlans: Record<
    MobilePlanId,
    {
      name: string;
      data: number;
      price: string;
      captionRu: string;
      captionEn: string;
    }
  > = {
    pulse30: {
      name: 'Pulse 30',
      data: 30,
      price: '14,90 €',
      captionRu: '30 GB по ЕС · звонки и SMS без ограничений',
      captionEn: '30 GB across the EU · unlimited calls and SMS',
    },
    pulseMax: {
      name: 'Pulse Max',
      data: 80,
      price: '24,90 €',
      captionRu: '80 GB по ЕС · 25 GB за пределами ЕЭЗ',
      captionEn: '80 GB across the EU · 25 GB beyond the EEA',
    },
  };
  const roamingPasses: Record<
    Exclude<RoamingPassId, 'none'>,
    { nameRu: string; nameEn: string; data: string; price: string }
  > = {
    worldDay: {
      nameRu: 'World Day',
      nameEn: 'World Day',
      data: '1 GB · 24 h',
      price: '4,90 €',
    },
    worldWeek: {
      nameRu: 'World Week',
      nameEn: 'World Week',
      data: '5 GB · 7 days',
      price: '14,90 €',
    },
  };

  const [modal, setModal] = useState<
    'data' | 'esim' | 'roaming' | 'plan' | 'report' | null
  >(null);
  const initialMobileState: MobileState = {
    planId: 'pulse30',
    dataUsed: 18.4,
    dataAllowance: 30,
    roamingEnabled: true,
    roamingRegion: 'eea',
    roamingPass: 'none',
    autoPay: true,
    device: 'iPhone 16 Pro',
    events: [],
  };
  const [mobileState, setMobileState] = useVersionedState<MobileState>({
    key: 'pulse-mobile-state',
    version: 2,
    fallback: initialMobileState,
    migrate: (source) => {
      const parsed = (source ?? {}) as Partial<MobileState>;
      return {
        ...initialMobileState,
        ...parsed,
        events: Array.isArray(parsed.events) ? parsed.events : [],
      };
    },
    validate: (source): source is MobileState => {
      const candidate = source as Partial<MobileState>;
      return (
        typeof candidate?.planId === 'string' && Array.isArray(candidate.events)
      );
    },
  });
  const [roamingDraft, setRoamingDraft] = useState(mobileState.roamingEnabled);
  const [roamingRegionDraft, setRoamingRegionDraft] = useState<RoamingRegion>(
    mobileState.roamingRegion
  );
  const [roamingPassDraft, setRoamingPassDraft] = useState<RoamingPassId>(
    mobileState.roamingPass
  );
  const [planDraft, setPlanDraft] = useState<MobilePlanId>(mobileState.planId);
  const [autoPayDraft, setAutoPayDraft] = useState(mobileState.autoPay);
  const [esimStep, setEsimStep] = useState<'choose' | 'activate'>('choose');
  const [esimDevice, setEsimDevice] = useState('iPhone 17 Pro');
  const selectedPlan = mobilePlans[mobileState.planId];
  const esimActivationCode = 'LPA:1$connect.pulse.eu$PLS-2048-7K9Q';
  const roamingCaption = !mobileState.roamingEnabled
    ? locale(language, 'Выключен', 'Off')
    : mobileState.roamingRegion === 'eea'
      ? locale(language, 'ЕЭЗ включён', 'EEA included')
      : mobileState.roamingPass === 'worldWeek'
        ? 'World Week · 5 GB'
        : 'World Day · 1 GB';

  const eventDate = () =>
    new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-GB', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date());

  const addMobileEvent = (event: Omit<MobileEvent, 'id'>) => {
    setMobileState((current) => ({
      ...current,
      events: [{ ...event, id: `MOB-${Date.now()}` }, ...current.events],
    }));
  };

  const copyEsimCode = async () => {
    try {
      await navigator.clipboard.writeText(esimActivationCode);
      onNotice(
        locale(language, 'Код активации скопирован', 'Activation code copied')
      );
    } catch {
      onNotice(
        locale(
          language,
          'Не удалось скопировать код',
          'The activation code could not be copied'
        )
      );
    }
  };

  return (
    <div className="service-shell service-mobile">
      <ServiceHeader
        eyebrow="Pulse Mobile"
        title={locale(
          language,
          'Связь в вашем банке',
          'Mobile inside your bank'
        )}
        description={locale(
          language,
          'Тариф, eSIM, роуминг и расходы без отдельного приложения.',
          'Plan, eSIM, roaming and spending without another app.'
        )}
        metrics={[
          [locale(language, 'Тариф', 'Plan'), selectedPlan.name],
          [
            locale(language, 'Следующее списание', 'Next charge'),
            selectedPlan.price,
            '2 Nov',
          ],
          [locale(language, 'Номер', 'Number'), '+49 151 ••• 2048'],
        ]}
      />
      <div className="service-mobile-grid" id="service-workspace">
        <section className="service-section service-usage">
          <header>
            <div>
              <span>
                {locale(language, 'Текущий период', 'Current period')}
              </span>
              <h2>{locale(language, 'Использование', 'Usage')}</h2>
            </div>
            <div className="service-usage__period">
              <small>12 Oct – 11 Nov</small>
              <button
                type="button"
                onClick={() => {
                  setPlanDraft(mobileState.planId);
                  setAutoPayDraft(mobileState.autoPay);
                  setModal('plan');
                }}
              >
                {locale(language, 'Управлять тарифом', 'Manage plan')}
              </button>
            </div>
          </header>
          <div className="service-usage__item">
            <div>
              <strong>
                {mobileState.dataUsed.toFixed(1).replace('.', ',')} GB
              </strong>
              <span>
                {locale(
                  language,
                  `из ${mobileState.dataAllowance} GB`,
                  `of ${mobileState.dataAllowance} GB`
                )}
              </span>
            </div>
            <i>
              <b
                style={{
                  width: `${Math.min((mobileState.dataUsed / mobileState.dataAllowance) * 100, 100)}%`,
                }}
              />
            </i>
          </div>
          <div className="service-usage__item">
            <div>
              <strong>214 min</strong>
              <span>{locale(language, 'безлимит', 'unlimited')}</span>
            </div>
            <i>
              <b style={{ width: '32%' }} />
            </i>
          </div>
          <div className="service-usage__item">
            <div>
              <strong>38 SMS</strong>
              <span>{locale(language, 'безлимит', 'unlimited')}</span>
            </div>
            <i>
              <b style={{ width: '14%' }} />
            </i>
          </div>
        </section>
        <section className="service-section service-esim">
          <span>eSIM</span>
          <h2>{locale(language, 'Готова к работе', 'Ready to use')}</h2>
          <p>
            {locale(
              language,
              `Основная линия активна на ${mobileState.device}. Роуминг: ${roamingCaption.toLowerCase()}.`,
              `Primary line is active on ${mobileState.device}. Roaming: ${roamingCaption.toLowerCase()}.`
            )}
          </p>
          <div>
            <span>
              <BankGlyph name="devices" />
            </span>
            <strong>{mobileState.device}</strong>
            <small>eSIM · 5G</small>
          </div>
          <button
            type="button"
            onClick={() => {
              setEsimStep('choose');
              setEsimDevice('iPhone 17 Pro');
              setModal('esim');
            }}
          >
            {locale(language, 'Перенести на устройство', 'Move to a device')}
          </button>
        </section>
      </div>
      <section className="service-tools-grid" id="service-tools">
        <ActionButton
          icon="card"
          title={locale(language, 'Тариф и оплата', 'Plan and billing')}
          caption={`${selectedPlan.name} · ${selectedPlan.price}`}
          onClick={() => {
            setPlanDraft(mobileState.planId);
            setAutoPayDraft(mobileState.autoPay);
            setModal('plan');
          }}
        />
        <ActionButton
          icon="topup"
          title={locale(language, 'Добавить интернет', 'Add data')}
          caption="5 GB · 6,90 €"
          onClick={() => setModal('data')}
        />
        <ActionButton
          icon="exchange"
          title={locale(language, 'Роуминг', 'Roaming')}
          caption={roamingCaption}
          onClick={() => {
            setRoamingDraft(mobileState.roamingEnabled);
            setRoamingRegionDraft(mobileState.roamingRegion);
            setRoamingPassDraft(mobileState.roamingPass);
            setModal('roaming');
          }}
        />
        <ActionButton
          icon="contract"
          title={locale(language, 'Детализация', 'Usage details')}
          caption="October · CSV"
          onClick={() => setModal('report')}
        />
      </section>
      {mobileState.events.length > 0 && (
        <section className="service-section service-mobile-events">
          <header>
            <div>
              <span>{locale(language, 'История', 'History')}</span>
              <h2>{locale(language, 'Изменения по номеру', 'Line changes')}</h2>
            </div>
            <b>{mobileState.events.length}</b>
          </header>
          <div>
            {mobileState.events.slice(0, 5).map((event) => (
              <article key={event.id}>
                <span>
                  <BankGlyph name={event.icon} />
                </span>
                <div>
                  <strong>{event.title}</strong>
                  <small>{event.caption}</small>
                </div>
                {event.amount && <b>{event.amount}</b>}
              </article>
            ))}
          </div>
        </section>
      )}
      {modal && (
        <ServiceModal
          title={locale(
            language,
            modal === 'data'
              ? 'Дополнительный интернет'
              : modal === 'esim'
                ? 'Перенос eSIM'
                : modal === 'roaming'
                  ? 'Роуминг'
                  : modal === 'plan'
                    ? 'Тариф и оплата'
                    : 'Детализация',
            modal === 'data'
              ? 'Additional data'
              : modal === 'esim'
                ? 'Move eSIM'
                : modal === 'roaming'
                  ? 'Roaming'
                  : modal === 'plan'
                    ? 'Plan and billing'
                    : 'Usage details'
          )}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setModal(null)}
        >
          {modal === 'data' ? (
            <form
              className="service-form"
              onSubmit={(event) => {
                event.preventDefault();
                const data = new FormData(event.currentTarget);
                const packageSize = Number(data.get('package'));
                const priceAmount =
                  packageSize === 5 ? 6.9 : packageSize === 10 ? 11.9 : 18.9;
                const price = `${priceAmount.toFixed(2).replace('.', ',')} €`;
                const paid = addPayment({
                  recipient: `Pulse Mobile · ${packageSize} GB`,
                  amount: priceAmount,
                  categoryRu: 'Дополнительный интернет',
                  categoryEn: 'Mobile data add-on',
                  type: 'card',
                  service: 'mobile',
                  sourcePath: '/mobile',
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
                setMobileState((current) => ({
                  ...current,
                  dataAllowance: current.dataAllowance + packageSize,
                }));
                addMobileEvent({
                  title: locale(
                    language,
                    `Пакет ${packageSize} GB`,
                    `${packageSize} GB add-on`
                  ),
                  caption: eventDate(),
                  amount: `−${price}`,
                  icon: 'topup',
                });
                setModal(null);
                onNotice(
                  locale(
                    language,
                    `Пакет ${packageSize} GB подключён`,
                    `${packageSize} GB add-on activated`
                  )
                );
              }}
            >
              <label>
                {locale(language, 'Объём пакета', 'Data package')}
                <select name="package" defaultValue="5">
                  <option value="5">5 GB · 6,90 €</option>
                  <option value="10">10 GB · 11,90 €</option>
                  <option value="20">20 GB · 18,90 €</option>
                </select>
              </label>
              <small>
                {locale(
                  language,
                  'Пакет действует до конца текущего периода.',
                  'The add-on is valid until the end of the current period.'
                )}
              </small>
              <button type="submit">
                {locale(language, 'Подключить', 'Activate')}
              </button>
            </form>
          ) : modal === 'esim' ? (
            esimStep === 'choose' ? (
              <form
                className="service-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  setEsimStep('activate');
                }}
              >
                <div className="service-esim-transfer">
                  <span>
                    <BankGlyph name="devices" />
                  </span>
                  <div>
                    <strong>{mobileState.device}</strong>
                    <small>
                      {locale(
                        language,
                        'Текущее устройство останется активным до завершения переноса.',
                        'Your current device stays active until the transfer is complete.'
                      )}
                    </small>
                  </div>
                </div>
                <label>
                  {locale(language, 'Новое устройство', 'New device')}
                  <select
                    name="device"
                    value={esimDevice}
                    onChange={(event) => setEsimDevice(event.target.value)}
                  >
                    <option value="iPhone 17 Pro">iPhone 17 Pro</option>
                    <option value="Google Pixel 11">Google Pixel 11</option>
                    <option value="Samsung Galaxy S26">
                      Samsung Galaxy S26
                    </option>
                  </select>
                </label>
                <small>
                  {locale(
                    language,
                    'После подтверждения вы получите одноразовый код установки.',
                    'You will receive a one-time installation code after confirmation.'
                  )}
                </small>
                <button type="submit">
                  {locale(language, 'Продолжить', 'Continue')}
                </button>
              </form>
            ) : (
              <div className="service-esim-activation">
                <div className="service-esim-activation__device">
                  <span>
                    <BankGlyph name="mobile" />
                  </span>
                  <div>
                    <small>
                      {locale(language, 'Новое устройство', 'New device')}
                    </small>
                    <strong>{esimDevice}</strong>
                  </div>
                  <b>{locale(language, 'Готово', 'Ready')}</b>
                </div>
                <div className="service-esim-activation__code">
                  <small>
                    {locale(language, 'Код активации', 'Activation code')}
                  </small>
                  <code>{esimActivationCode}</code>
                  <button type="button" onClick={copyEsimCode}>
                    {locale(language, 'Скопировать код', 'Copy code')}
                  </button>
                </div>
                <ol>
                  <li>
                    {locale(
                      language,
                      'Откройте настройки мобильной сети на новом устройстве.',
                      'Open mobile network settings on the new device.'
                    )}
                  </li>
                  <li>
                    {locale(
                      language,
                      'Выберите добавление eSIM и вставьте код вручную.',
                      'Choose add eSIM and enter the code manually.'
                    )}
                  </li>
                </ol>
                <div className="service-esim-activation__actions">
                  <button type="button" onClick={() => setEsimStep('choose')}>
                    {locale(language, 'Назад', 'Back')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileState((current) => ({
                        ...current,
                        device: esimDevice,
                      }));
                      addMobileEvent({
                        title: locale(
                          language,
                          'Перенос eSIM',
                          'eSIM transfer'
                        ),
                        caption: `${esimDevice} · ${eventDate()}`,
                        icon: 'devices',
                      });
                      setModal(null);
                      onNotice(
                        locale(
                          language,
                          `eSIM активирована на ${esimDevice}`,
                          `eSIM activated on ${esimDevice}`
                        )
                      );
                    }}
                  >
                    {locale(
                      language,
                      'Я установил eSIM',
                      'I installed the eSIM'
                    )}
                  </button>
                </div>
              </div>
            )
          ) : modal === 'roaming' ? (
            <form
              className="service-form"
              onSubmit={(event) => {
                event.preventDefault();
                const savedPass =
                  roamingDraft && roamingRegionDraft === 'world'
                    ? roamingPassDraft === 'none'
                      ? 'worldDay'
                      : roamingPassDraft
                    : 'none';
                setMobileState((current) => ({
                  ...current,
                  roamingEnabled: roamingDraft,
                  roamingRegion: roamingRegionDraft,
                  roamingPass: savedPass,
                }));
                const roamingPass =
                  savedPass === 'none' ? null : roamingPasses[savedPass];
                const shouldCharge = Boolean(
                  roamingPass &&
                    (!mobileState.roamingEnabled ||
                      mobileState.roamingRegion !== roamingRegionDraft ||
                      mobileState.roamingPass !== savedPass)
                );
                if (shouldCharge && roamingPass) {
                  const priceAmount = Number(
                    roamingPass.price.replace(' €', '').replace(',', '.')
                  );
                  const paid = addPayment({
                    recipient: `Pulse Mobile · ${roamingPass.nameEn}`,
                    amount: priceAmount,
                    categoryRu: 'Пакет роуминга',
                    categoryEn: 'Roaming pass',
                    type: 'card',
                    service: 'mobile',
                    sourcePath: '/mobile',
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
                }
                addMobileEvent({
                  title: locale(
                    language,
                    'Настройки роуминга',
                    'Roaming settings'
                  ),
                  caption: `${locale(
                    language,
                    roamingDraft
                      ? roamingRegionDraft === 'eea'
                        ? 'ЕЭЗ'
                        : roamingPass
                          ? roamingPass.nameRu
                          : 'Весь мир'
                      : 'Выключен',
                    roamingDraft
                      ? roamingRegionDraft === 'eea'
                        ? 'EEA'
                        : roamingPass
                          ? roamingPass.nameEn
                          : 'Worldwide'
                      : 'Disabled'
                  )} · ${eventDate()}`,
                  amount: roamingPass ? `−${roamingPass.price}` : undefined,
                  icon: 'exchange',
                });
                setModal(null);
                onNotice(
                  locale(
                    language,
                    'Настройки роуминга сохранены',
                    'Roaming settings saved'
                  )
                );
              }}
            >
              <label>
                {locale(language, 'Регион', 'Region')}
                <select
                  value={roamingRegionDraft}
                  onChange={(event) => {
                    const region = event.target.value as RoamingRegion;
                    setRoamingRegionDraft(region);
                    setRoamingPassDraft(
                      region === 'world'
                        ? roamingPassDraft === 'none'
                          ? 'worldDay'
                          : roamingPassDraft
                        : 'none'
                    );
                  }}
                >
                  <option value="eea">
                    {locale(
                      language,
                      'Европейская экономическая зона',
                      'European Economic Area'
                    )}
                  </option>
                  <option value="world">
                    {locale(language, 'Остальной мир', 'Rest of world')}
                  </option>
                </select>
              </label>
              {roamingRegionDraft === 'world' && (
                <div className="service-roaming-packages">
                  <span>
                    {locale(language, 'Пакет для поездки', 'Travel pass')}
                  </span>
                  <div className="service-plan-options" role="group">
                    {(
                      Object.entries(roamingPasses) as Array<
                        [
                          Exclude<RoamingPassId, 'none'>,
                          (typeof roamingPasses)[Exclude<
                            RoamingPassId,
                            'none'
                          >],
                        ]
                      >
                    ).map(([id, roamingPass]) => (
                      <button
                        className={roamingPassDraft === id ? 'active' : ''}
                        type="button"
                        aria-pressed={roamingPassDraft === id}
                        key={id}
                        onClick={() => {
                          setRoamingPassDraft(id);
                          setRoamingDraft(true);
                        }}
                      >
                        <span>
                          <strong>
                            {locale(
                              language,
                              roamingPass.nameRu,
                              roamingPass.nameEn
                            )}
                          </strong>
                          <b>{roamingPass.price}</b>
                        </span>
                        <small>{roamingPass.data}</small>
                        <i aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <button
                className={`service-toggle-control ${roamingDraft ? 'active' : ''}`}
                type="button"
                aria-pressed={roamingDraft}
                onClick={() => setRoamingDraft((value) => !value)}
              >
                <span>
                  {locale(
                    language,
                    roamingDraft ? 'Роуминг включён' : 'Роуминг выключен',
                    roamingDraft ? 'Roaming is on' : 'Roaming is off'
                  )}
                </span>
                <i>
                  <b />
                </i>
              </button>
              <button type="submit">
                {locale(language, 'Сохранить', 'Save')}
              </button>
            </form>
          ) : modal === 'plan' ? (
            <form
              className="service-form service-plan-form"
              onSubmit={(event) => {
                event.preventDefault();
                const previousPlan = mobilePlans[mobileState.planId];
                const nextPlan = mobilePlans[planDraft];
                const addOnData = Math.max(
                  0,
                  mobileState.dataAllowance - previousPlan.data
                );
                setMobileState((current) => ({
                  ...current,
                  planId: planDraft,
                  dataAllowance: nextPlan.data + addOnData,
                  autoPay: autoPayDraft,
                }));
                addMobileEvent({
                  title: locale(language, 'Тариф обновлён', 'Plan updated'),
                  caption: `${nextPlan.name} · ${eventDate()}`,
                  amount: nextPlan.price,
                  icon: 'card',
                });
                setModal(null);
                onNotice(
                  locale(
                    language,
                    `Тариф ${nextPlan.name} подключён`,
                    `${nextPlan.name} is now active`
                  )
                );
              }}
            >
              <div
                className="service-plan-options"
                role="group"
                aria-label={locale(language, 'Выберите тариф', 'Choose a plan')}
              >
                {(
                  Object.entries(mobilePlans) as Array<
                    [MobilePlanId, (typeof mobilePlans)[MobilePlanId]]
                  >
                ).map(([id, plan]) => (
                  <button
                    className={planDraft === id ? 'active' : ''}
                    type="button"
                    aria-pressed={planDraft === id}
                    key={id}
                    onClick={() => setPlanDraft(id)}
                  >
                    <span>
                      <strong>{plan.name}</strong>
                      <b>{plan.price}</b>
                    </span>
                    <small>
                      {locale(language, plan.captionRu, plan.captionEn)}
                    </small>
                    <i aria-hidden="true" />
                  </button>
                ))}
              </div>
              <button
                className={`service-toggle-control ${autoPayDraft ? 'active' : ''}`}
                type="button"
                aria-pressed={autoPayDraft}
                onClick={() => setAutoPayDraft((value) => !value)}
              >
                <span>
                  <strong>
                    {locale(language, 'Автосписание', 'Automatic payment')}
                  </strong>
                  <small>
                    {locale(
                      language,
                      '2-го числа с основного счёта',
                      'On the 2nd from your primary account'
                    )}
                  </small>
                </span>
                <i>
                  <b />
                </i>
              </button>
              <button type="submit">
                {locale(language, 'Сохранить тариф', 'Save plan')}
              </button>
            </form>
          ) : (
            <div className="service-detail-sheet">
              <dl>
                <div>
                  <dt>{locale(language, 'Интернет', 'Data')}</dt>
                  <dd>{mobileState.dataUsed.toFixed(1)} GB</dd>
                </div>
                <div>
                  <dt>{locale(language, 'Звонки', 'Calls')}</dt>
                  <dd>214 min</dd>
                </div>
                <div>
                  <dt>SMS</dt>
                  <dd>38</dd>
                </div>
                <div>
                  <dt>{locale(language, 'Стоимость', 'Charges')}</dt>
                  <dd>{selectedPlan.price}</dd>
                </div>
              </dl>
              <button
                type="button"
                onClick={() => {
                  downloadTextFile(
                    'pulse-mobile-october.csv',
                    `Category,Usage,Allowance,Charge\nData,${mobileState.dataUsed.toFixed(1)} GB,${mobileState.dataAllowance} GB,0.00 EUR\nCalls,214 min,Unlimited,0.00 EUR\nSMS,38,Unlimited,0.00 EUR\nPlan,${selectedPlan.name},,${selectedPlan.price.replace(',', '.').replace(' €', ' EUR')}`
                  );
                  onNotice(
                    locale(
                      language,
                      'Детализация скачана',
                      'Usage details downloaded'
                    )
                  );
                }}
              >
                {locale(language, 'Скачать CSV', 'Download CSV')}
              </button>
            </div>
          )}
        </ServiceModal>
      )}
    </div>
  );
};
