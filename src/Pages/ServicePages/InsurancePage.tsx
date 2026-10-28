import React, { useState } from 'react';
import { BankGlyph, BankGlyphName } from '../ProfilePage/BankGlyph';
import { useBankLedger } from '../ProfilePage/bankLedger';
import {
  downloadTextFile,
  locale,
  ServiceHeader,
  ServiceModal,
  ServicePageProps,
} from './ServicePageShared';
import { useVersionedState } from '../../Hooks/useVersionedState';

export const InsurancePage: React.FC<ServicePageProps> = ({
  language,
  onNotice,
}) => {
  const { addPayment } = useBankLedger();
  interface InsurancePolicy {
    id: string;
    icon: BankGlyphName;
    titleRu: string;
    titleEn: string;
    cover: number;
    renewal: string;
    territoryRu: string;
    territoryEn: string;
    deductible: number;
    number: string;
    monthlyPremium: number;
    autoRenew: boolean;
  }
  interface InsuranceClaim {
    id: string;
    policyId: string;
    description: string;
    eventDate: string;
    createdAt: string;
    status: 'draft' | 'submitted' | 'approved';
    attachments: string[];
    amount: number;
    submittedAt?: string;
    reviewBy?: string;
    payout?: number;
    reviewedAt?: string;
  }

  const defaultPolicies: InsurancePolicy[] = [
    {
      id: 'travel-europe',
      icon: 'swift',
      titleRu: 'Travel Europe',
      titleEn: 'Travel Europe',
      cover: 50000,
      renewal: '18 Nov',
      territoryRu: 'Страны ЕЭЗ',
      territoryEn: 'EEA countries',
      deductible: 0,
      number: 'PC-EU-4821-2026',
      monthlyPremium: 7.9,
      autoRenew: true,
    },
    {
      id: 'purchase',
      icon: 'shield',
      titleRu: 'Защита покупок',
      titleEn: 'Purchase protection',
      cover: 25000,
      renewal: '06 Dec',
      territoryRu: 'Европейский союз',
      territoryEn: 'European Union',
      deductible: 25,
      number: 'PC-PP-3187-2026',
      monthlyPremium: 4.9,
      autoRenew: true,
    },
    {
      id: 'card',
      icon: 'card',
      titleRu: 'Защита карты',
      titleEn: 'Card protection',
      cover: 10000,
      renewal: 'Monthly',
      territoryRu: 'Весь мир',
      territoryEn: 'Worldwide',
      deductible: 0,
      number: 'PC-CP-2048-2026',
      monthlyPremium: 2.9,
      autoRenew: true,
    },
  ];
  const catalogPolicies: InsurancePolicy[] = [
    {
      id: 'health',
      icon: 'emergency',
      titleRu: 'Медицинская защита',
      titleEn: 'Health cover',
      cover: 100000,
      renewal: '02 Nov',
      territoryRu: 'Европейский союз',
      territoryEn: 'European Union',
      deductible: 50,
      number: 'PC-HC-7304-2026',
      monthlyPremium: 8.9,
      autoRenew: true,
    },
    {
      id: 'devices',
      icon: 'devices',
      titleRu: 'Защита техники',
      titleEn: 'Device cover',
      cover: 5000,
      renewal: '02 Nov',
      territoryRu: 'Европейский союз',
      territoryEn: 'European Union',
      deductible: 75,
      number: 'PC-DC-5619-2026',
      monthlyPremium: 6.4,
      autoRenew: true,
    },
    {
      id: 'winter',
      icon: 'swift',
      titleRu: 'Зимние виды спорта',
      titleEn: 'Winter sports',
      cover: 20000,
      renewal: '18 Nov',
      territoryRu: 'Европа',
      territoryEn: 'Europe',
      deductible: 0,
      number: 'PC-WS-8842-2026',
      monthlyPremium: 3.2,
      autoRenew: true,
    },
  ];

  const [claimOpen, setClaimOpen] = useState(false);
  const [catalogOpen, setCatalogOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<string | null>(null);
  const [selectedClaim, setSelectedClaim] = useState<string | null>(null);
  const [cancelPolicyId, setCancelPolicyId] = useState<string | null>(null);
  const migratePolicies = (source: unknown) => {
    if (!Array.isArray(source)) return defaultPolicies;
    const knownPolicies = [...defaultPolicies, ...catalogPolicies];
    return (source as Array<Partial<InsurancePolicy>>).map((policy) => {
      const known = knownPolicies.find((item) => item.id === policy.id);
      return {
        ...(known ?? defaultPolicies[0]),
        ...policy,
        monthlyPremium: policy.monthlyPremium ?? known?.monthlyPremium ?? 0,
        autoRenew: policy.autoRenew ?? true,
      } as InsurancePolicy;
    });
  };
  const [policies, setPolicies] = useVersionedState<InsurancePolicy[]>({
    key: 'pulse-insurance-policies',
    version: 2,
    fallback: defaultPolicies,
    migrate: migratePolicies,
    validate: (source): source is InsurancePolicy[] => Array.isArray(source),
  });
  const migrateClaims = (source: unknown) =>
    (Array.isArray(source) ? source : []).map((claim) => ({
      ...(claim as InsuranceClaim),
      attachments: Array.isArray(claim.attachments) ? claim.attachments : [],
      amount: typeof claim.amount === 'number' ? claim.amount : 0,
      status:
        claim.status === 'approved' || claim.status === 'submitted'
          ? claim.status
          : 'draft',
    }));
  const [claims, setClaims] = useVersionedState<InsuranceClaim[]>({
    key: 'pulse-insurance-claims',
    version: 2,
    fallback: [],
    migrate: migrateClaims,
    validate: (source): source is InsuranceClaim[] => Array.isArray(source),
  });
  const policyTitle = (policy: InsurancePolicy) =>
    language === 'ru' ? policy.titleRu : policy.titleEn;
  const selectedPolicyData = policies.find(
    (policy) => policy.id === selectedPolicy
  );
  const selectedClaimData = claims.find((claim) => claim.id === selectedClaim);
  const claimPolicy = selectedClaimData
    ? policies.find((policy) => policy.id === selectedClaimData.policyId)
    : null;
  const totalCover = policies.reduce((sum, policy) => sum + policy.cover, 0);
  const euro = (amount: number) =>
    new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0,
    }).format(amount);
  const premiumEuro = (amount: number) =>
    new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  const claimStatusLabel = (status: InsuranceClaim['status']) => {
    if (status === 'draft') return locale(language, 'Черновик', 'Draft');
    if (status === 'approved') return locale(language, 'Выплачено', 'Paid');
    return locale(language, 'На проверке', 'Under review');
  };
  const formatClaimDate = (date = new Date()) =>
    new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    }).format(date);

  const addPolicy = (policy: InsurancePolicy) => {
    if (policies.some((item) => item.id === policy.id)) {
      onNotice(
        locale(language, 'Полис уже подключён', 'Policy already active')
      );
      return;
    }
    const paid = addPayment({
      recipient: `Pulse Cover · ${policy.titleEn}`,
      amount: policy.monthlyPremium,
      categoryRu: 'Страховая премия',
      categoryEn: 'Insurance premium',
      service: 'insurance',
      sourcePath: '/insurance',
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
    setPolicies((current) => [...current, policy]);
    setCatalogOpen(false);
    onNotice(locale(language, 'Защита подключена', 'Protection activated'));
  };

  return (
    <div className="service-shell service-insurance">
      <ServiceHeader
        eyebrow="Pulse Cover"
        title={locale(
          language,
          'Защита без мелкого шрифта',
          'Protection without fine print'
        )}
        description={locale(
          language,
          'Полисы, покрытие и обращения рядом с картами и поездками.',
          'Policies, coverage and claims next to your cards and trips.'
        )}
        metrics={[
          [
            locale(language, 'Активные полисы', 'Active policies'),
            String(policies.length),
          ],
          [locale(language, 'Общее покрытие', 'Total cover'), euro(totalCover)],
          [
            locale(language, 'Следующее продление', 'Next renewal'),
            '18 Nov',
            'Pulse Travel',
          ],
        ]}
      />
      <div className="service-insurance-grid" id="service-workspace">
        <section className="service-section service-policies">
          <header>
            <div>
              <span>{locale(language, 'Моя защита', 'My protection')}</span>
              <h2>{locale(language, 'Активные полисы', 'Active policies')}</h2>
            </div>
            <button type="button" onClick={() => setCatalogOpen(true)}>
              + {locale(language, 'Добавить', 'Add')}
            </button>
          </header>
          {policies.map((policy) => (
            <button
              type="button"
              key={policy.id}
              onClick={() => setSelectedPolicy(policy.id)}
            >
              <span>
                <BankGlyph name={policy.icon} />
              </span>
              <div>
                <strong>{policyTitle(policy)}</strong>
                <small>
                  {locale(language, 'Покрытие', 'Cover')} · {euro(policy.cover)}
                </small>
              </div>
              <time>{policy.renewal}</time>
              <b>›</b>
            </button>
          ))}
        </section>
        <section className="service-section service-claim-start">
          <span>
            <BankGlyph name="shield" />
          </span>
          <h2>
            {locale(
              language,
              'Произошёл страховой случай?',
              'Need to make a claim?'
            )}
          </h2>
          <p>
            {locale(
              language,
              'Ответьте на несколько вопросов и приложите документы. Черновик сохранится автоматически.',
              'Answer a few questions and attach documents. Your draft saves automatically.'
            )}
          </p>
          <button type="button" onClick={() => setClaimOpen(true)}>
            {locale(language, 'Начать обращение', 'Start a claim')}
          </button>
        </section>
      </div>
      <section
        className="service-section service-table-section"
        id="service-tools"
      >
        <header>
          <div>
            <span>{locale(language, 'История', 'History')}</span>
            <h2>{locale(language, 'Последние события', 'Recent events')}</h2>
          </div>
        </header>
        <div className="service-event-list">
          {claims.map((claim) => {
            const policy = policies.find((item) => item.id === claim.policyId);
            return (
              <button
                type="button"
                key={claim.id}
                onClick={() => setSelectedClaim(claim.id)}
              >
                <span>
                  <BankGlyph name="contract" />
                </span>
                <strong>
                  {locale(language, 'Обращение', 'Claim')} ·{' '}
                  {policy ? policyTitle(policy) : claim.policyId}
                </strong>
                <time>{claim.createdAt}</time>
                <b className={`service-claim-status is-${claim.status}`}>
                  {claimStatusLabel(claim.status)}
                </b>
              </button>
            );
          })}
          {[
            [
              locale(
                language,
                'Полис Travel Europe продлён',
                'Travel Europe renewed'
              ),
              '18 Oct',
              '50 000 €',
            ],
            [
              locale(
                language,
                'Чек добавлен в защиту покупок',
                'Receipt added to purchase protection'
              ),
              '12 Oct',
              '329,00 €',
            ],
            [
              locale(
                language,
                'Страховой сертификат загружен',
                'Insurance certificate downloaded'
              ),
              '04 Oct',
              'PDF',
            ],
          ].map(([title, date, value]) => (
            <button type="button" key={title} onClick={() => onNotice(title)}>
              <span>
                <BankGlyph name="shield" />
              </span>
              <strong>{title}</strong>
              <time>{date}</time>
              <b>{value}</b>
            </button>
          ))}
        </div>
      </section>
      {claimOpen && (
        <ServiceModal
          title={locale(language, 'Новое обращение', 'New claim')}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setClaimOpen(false)}
        >
          <form
            className="service-form"
            onSubmit={(event) => {
              event.preventDefault();
              const data = new FormData(event.currentTarget);
              const documentInput = event.currentTarget.elements.namedItem(
                'documents'
              ) as HTMLInputElement;
              const claim: InsuranceClaim = {
                id: `CLM-${Date.now().toString().slice(-8)}`,
                policyId: String(data.get('policy')),
                description: String(data.get('description')),
                eventDate: String(data.get('eventDate')),
                createdAt: new Intl.DateTimeFormat(
                  language === 'ru' ? 'ru-RU' : 'en-GB',
                  { day: 'numeric', month: 'short' }
                ).format(new Date()),
                status: 'draft',
                amount: Number(data.get('amount')),
                attachments: Array.from(documentInput.files ?? []).map(
                  (file) => file.name
                ),
              };
              setClaims((current) => [claim, ...current]);
              setClaimOpen(false);
              onNotice(
                locale(
                  language,
                  'Обращение сохранено как черновик',
                  'Claim saved as a draft'
                )
              );
            }}
          >
            <label>
              {locale(language, 'Полис', 'Policy')}
              <select name="policy" defaultValue={policies[0]?.id}>
                {policies.map((policy) => (
                  <option key={policy.id} value={policy.id}>
                    {policyTitle(policy)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              {locale(language, 'Что произошло', 'What happened')}
              <textarea
                required
                name="description"
                rows={4}
                placeholder={locale(
                  language,
                  'Кратко опишите ситуацию',
                  'Briefly describe the situation'
                )}
              />
            </label>
            <label>
              {locale(language, 'Сумма ущерба', 'Claim amount')}
              <div>
                <input
                  required
                  min="1"
                  max="100000"
                  step="0.01"
                  name="amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                />
                <span>EUR</span>
              </div>
            </label>
            <label>
              {locale(language, 'Дата события', 'Event date')}
              <input
                required
                name="eventDate"
                type="date"
                max={new Date().toISOString().slice(0, 10)}
              />
            </label>
            <label>
              {locale(
                language,
                'Документы и фотографии',
                'Documents and photos'
              )}
              <input
                multiple
                name="documents"
                type="file"
                accept="image/*,.pdf"
              />
            </label>
            <small>
              {locale(
                language,
                'Можно сохранить черновик без документов и добавить их позже.',
                'You can save without documents and add them to the draft later.'
              )}
            </small>
            <button type="submit">
              {locale(language, 'Сохранить черновик', 'Save draft')}
            </button>
          </form>
        </ServiceModal>
      )}
      {catalogOpen && (
        <ServiceModal
          title={locale(language, 'Добавить защиту', 'Add protection')}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setCatalogOpen(false)}
        >
          <div className="service-product-list">
            {catalogPolicies.map((policy, index) => (
              <button
                type="button"
                key={policy.id}
                onClick={() => addPolicy(policy)}
              >
                <span>
                  <BankGlyph name={policy.icon} />
                </span>
                <div>
                  <strong>{policyTitle(policy)}</strong>
                  <small>
                    {locale(language, 'Покрытие до', 'Cover up to')}{' '}
                    {euro(policy.cover)}
                  </small>
                </div>
                <b>{premiumEuro(policy.monthlyPremium)} / month</b>
              </button>
            ))}
          </div>
        </ServiceModal>
      )}
      {selectedPolicyData && (
        <ServiceModal
          title={policyTitle(selectedPolicyData)}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setSelectedPolicy(null)}
        >
          <div className="service-detail-sheet">
            <dl>
              <div>
                <dt>{locale(language, 'Статус', 'Status')}</dt>
                <dd>{locale(language, 'Активен', 'Active')}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Территория', 'Territory')}</dt>
                <dd>
                  {language === 'ru'
                    ? selectedPolicyData.territoryRu
                    : selectedPolicyData.territoryEn}
                </dd>
              </div>
              <div>
                <dt>{locale(language, 'Франшиза', 'Deductible')}</dt>
                <dd>{euro(selectedPolicyData.deductible)}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Номер полиса', 'Policy number')}</dt>
                <dd>{selectedPolicyData.number}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Стоимость', 'Premium')}</dt>
                <dd>
                  {premiumEuro(selectedPolicyData.monthlyPremium)} /{' '}
                  {locale(language, 'месяц', 'month')}
                </dd>
              </div>
            </dl>
            <button
              className={`service-toggle-control service-policy-renewal ${selectedPolicyData.autoRenew ? 'active' : ''}`}
              type="button"
              aria-pressed={selectedPolicyData.autoRenew}
              onClick={() => {
                setPolicies((current) =>
                  current.map((policy) =>
                    policy.id === selectedPolicyData.id
                      ? { ...policy, autoRenew: !policy.autoRenew }
                      : policy
                  )
                );
                onNotice(
                  locale(
                    language,
                    selectedPolicyData.autoRenew
                      ? 'Автопродление выключено'
                      : 'Автопродление включено',
                    selectedPolicyData.autoRenew
                      ? 'Automatic renewal disabled'
                      : 'Automatic renewal enabled'
                  )
                );
              }}
            >
              <span>
                <strong>
                  {locale(language, 'Автопродление', 'Automatic renewal')}
                </strong>
                <small>
                  {selectedPolicyData.autoRenew
                    ? locale(
                        language,
                        `Следующее списание ${selectedPolicyData.renewal}`,
                        `Next charge ${selectedPolicyData.renewal}`
                      )
                    : locale(
                        language,
                        'Полис завершится в дату продления',
                        'The policy ends on the renewal date'
                      )}
                </small>
              </span>
              <i>
                <b />
              </i>
            </button>
            <button
              type="button"
              onClick={() => {
                downloadTextFile(
                  'pulse-cover-policy.txt',
                  `Pulse Cover\nPolicy: ${policyTitle(selectedPolicyData)}\nStatus: Active\nTerritory: ${selectedPolicyData.territoryEn}\nPolicy number: ${selectedPolicyData.number}`
                );
                onNotice(
                  locale(
                    language,
                    'Сертификат скачан',
                    'Certificate downloaded'
                  )
                );
              }}
            >
              {locale(language, 'Скачать сертификат', 'Download certificate')}
            </button>
            {cancelPolicyId === selectedPolicyData.id ? (
              <div className="service-policy-cancel">
                <p>
                  {locale(
                    language,
                    'Покрытие прекратится сразу. Активные обращения сохранятся.',
                    'Coverage will end immediately. Existing claims will remain available.'
                  )}
                </p>
                <div>
                  <button type="button" onClick={() => setCancelPolicyId(null)}>
                    {locale(language, 'Оставить полис', 'Keep policy')}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPolicies((current) =>
                        current.filter(
                          (policy) => policy.id !== selectedPolicyData.id
                        )
                      );
                      setSelectedPolicy(null);
                      setCancelPolicyId(null);
                      onNotice(
                        locale(language, 'Полис отменён', 'Policy cancelled')
                      );
                    }}
                  >
                    {locale(
                      language,
                      'Подтвердить отмену',
                      'Confirm cancellation'
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="service-policy-cancel-button"
                type="button"
                onClick={() => setCancelPolicyId(selectedPolicyData.id)}
              >
                {locale(language, 'Отменить полис', 'Cancel policy')}
              </button>
            )}
          </div>
        </ServiceModal>
      )}
      {selectedClaimData && claimPolicy && (
        <ServiceModal
          title={`${locale(language, 'Обращение', 'Claim')} ${selectedClaimData.id.replace('CLM-', '#')}`}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setSelectedClaim(null)}
        >
          <div className="service-detail-sheet service-claim-detail">
            <dl>
              <div>
                <dt>{locale(language, 'Полис', 'Policy')}</dt>
                <dd>{policyTitle(claimPolicy)}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Дата события', 'Event date')}</dt>
                <dd>{selectedClaimData.eventDate}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Описание', 'Description')}</dt>
                <dd>{selectedClaimData.description}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Статус', 'Status')}</dt>
                <dd>{claimStatusLabel(selectedClaimData.status)}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Заявленная сумма', 'Claim amount')}</dt>
                <dd>{premiumEuro(selectedClaimData.amount)}</dd>
              </div>
              <div className="service-claim-detail__documents">
                <dt>{locale(language, 'Документы', 'Documents')}</dt>
                <dd>
                  {selectedClaimData.attachments.length > 0
                    ? selectedClaimData.attachments.join(', ')
                    : locale(language, 'Не добавлены', 'Not added')}
                </dd>
              </div>
            </dl>
            {selectedClaimData.status === 'draft' && (
              <div className="service-claim-files">
                <label>
                  <span>
                    {selectedClaimData.attachments.length > 0
                      ? locale(language, 'Добавить ещё файлы', 'Add more files')
                      : locale(language, 'Добавить документы', 'Add documents')}
                  </span>
                  <input
                    multiple
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(event) => {
                      const names = Array.from(event.target.files ?? []).map(
                        (file) => file.name
                      );
                      if (names.length === 0) return;
                      setClaims((current) =>
                        current.map((claim) =>
                          claim.id === selectedClaimData.id
                            ? {
                                ...claim,
                                attachments: Array.from(
                                  new Set([...claim.attachments, ...names])
                                ),
                              }
                            : claim
                        )
                      );
                      onNotice(
                        locale(
                          language,
                          'Документы добавлены',
                          'Documents added'
                        )
                      );
                      event.target.value = '';
                    }}
                  />
                </label>
                <button
                  type="button"
                  disabled={selectedClaimData.attachments.length === 0}
                  onClick={() => {
                    const submittedAt = formatClaimDate();
                    const reviewDate = new Date();
                    reviewDate.setDate(reviewDate.getDate() + 2);
                    setClaims((current) =>
                      current.map((claim) =>
                        claim.id === selectedClaimData.id
                          ? {
                              ...claim,
                              status: 'submitted',
                              submittedAt,
                              reviewBy: formatClaimDate(reviewDate),
                            }
                          : claim
                      )
                    );
                    setSelectedClaim(null);
                    onNotice(
                      locale(
                        language,
                        'Обращение отправлено',
                        'Claim submitted'
                      )
                    );
                  }}
                >
                  {locale(language, 'Отправить обращение', 'Submit claim')}
                </button>
                {selectedClaimData.attachments.length === 0 && (
                  <small>
                    {locale(
                      language,
                      'Для отправки добавьте хотя бы один документ или фотографию.',
                      'Add at least one document or photo before submitting.'
                    )}
                  </small>
                )}
              </div>
            )}
            {selectedClaimData.status !== 'draft' && (
              <div className="service-claim-progress" aria-live="polite">
                <header>
                  <div>
                    <span>
                      {locale(language, 'Статус обращения', 'Claim status')}
                    </span>
                    <strong>
                      {claimStatusLabel(selectedClaimData.status)}
                    </strong>
                  </div>
                  <b>{selectedClaimData.id}</b>
                </header>
                <ol>
                  <li className="is-complete">
                    <i aria-hidden="true" />
                    <div>
                      <strong>
                        {locale(
                          language,
                          'Документы получены',
                          'Documents received'
                        )}
                      </strong>
                      <small>
                        {selectedClaimData.submittedAt ??
                          selectedClaimData.createdAt}
                      </small>
                    </div>
                  </li>
                  <li className="is-complete">
                    <i aria-hidden="true" />
                    <div>
                      <strong>
                        {locale(
                          language,
                          'Проверка покрытия',
                          'Coverage review'
                        )}
                      </strong>
                      <small>
                        {selectedClaimData.status === 'approved'
                          ? locale(
                              language,
                              'Проверка завершена',
                              'Review complete'
                            )
                          : locale(
                              language,
                              `Решение ожидается до ${selectedClaimData.reviewBy ?? formatClaimDate()}`,
                              `Decision expected by ${selectedClaimData.reviewBy ?? formatClaimDate()}`
                            )}
                      </small>
                    </div>
                  </li>
                  <li
                    className={
                      selectedClaimData.status === 'approved'
                        ? 'is-complete'
                        : ''
                    }
                  >
                    <i aria-hidden="true" />
                    <div>
                      <strong>
                        {locale(
                          language,
                          'Решение и выплата',
                          'Decision and payout'
                        )}
                      </strong>
                      <small>
                        {selectedClaimData.status === 'approved'
                          ? locale(
                              language,
                              `${premiumEuro(selectedClaimData.payout ?? 0)} зачислено на EUR-счёт`,
                              `${premiumEuro(selectedClaimData.payout ?? 0)} credited to your EUR account`
                            )
                          : locale(language, 'Следующий этап', 'Next step')}
                      </small>
                    </div>
                  </li>
                </ol>
                {selectedClaimData.status === 'submitted' && (
                  <button
                    type="button"
                    onClick={() => {
                      const payout = Math.max(
                        0,
                        Math.min(selectedClaimData.amount, claimPolicy.cover) -
                          claimPolicy.deductible
                      );
                      if (payout <= 0) {
                        onNotice(
                          locale(
                            language,
                            'Сумма ниже франшизы по полису',
                            'The amount is below the policy deductible'
                          )
                        );
                        return;
                      }
                      addCredit({
                        sender: `Pulse Cover · ${selectedClaimData.id}`,
                        amount: payout,
                        categoryRu: 'Страховая выплата',
                        categoryEn: 'Insurance payout',
                        service: 'insurance',
                        sourcePath: '/insurance',
                      });
                      setClaims((current) =>
                        current.map((claim) =>
                          claim.id === selectedClaimData.id
                            ? {
                                ...claim,
                                status: 'approved',
                                payout,
                                reviewedAt: formatClaimDate(),
                              }
                            : claim
                        )
                      );
                      onNotice(
                        locale(
                          language,
                          'Проверка завершена, выплата зачислена',
                          'Review complete, payout credited'
                        )
                      );
                    }}
                  >
                    {locale(
                      language,
                      'Завершить демо-проверку',
                      'Complete demo review'
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        </ServiceModal>
      )}
    </div>
  );
};
