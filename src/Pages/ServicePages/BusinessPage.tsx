import React, { FormEvent, useState } from 'react';
import { BankGlyph } from '../ProfilePage/BankGlyph';
import { useVersionedState } from '../../Hooks/useVersionedState';
import {
  ActionButton,
  downloadTextFile,
  locale,
  ServiceHeader,
  ServiceModal,
  ServicePageProps,
} from './ServicePageShared';

export const BusinessPage: React.FC<ServicePageProps> = ({
  language,
  onNotice,
}) => {
  type InvoiceStatus = 'paid' | 'pending' | 'draft' | 'cancelled';
  interface Invoice {
    id: string;
    company: string;
    amount: number;
    date: string;
    status: InvoiceStatus;
    description: string;
  }
  interface BusinessPayment {
    id: string;
    company: string;
    amount: number;
    date: string;
    iban: string;
  }
  interface BusinessCard {
    id: string;
    holder: string;
    monthlyLimit: number;
    transactionLimit: number;
    spent: number;
    lastFour: string;
  }
  type TeamRole = 'owner' | 'admin' | 'finance' | 'member';
  interface TeamMember {
    id: string;
    name: string;
    email: string;
    initials: string;
    role: TeamRole;
    status: 'active' | 'invited';
  }
  type BusinessModal =
    | 'invoice'
    | 'invoice-edit'
    | 'card'
    | 'card-limit'
    | 'supplier'
    | 'team-add'
    | 'team-edit';

  const defaultInvoices: Invoice[] = [
    {
      id: 'INV-0248',
      company: 'Northstar GmbH',
      amount: 8400,
      date: '18 Oct',
      status: 'paid',
      description: 'Product design services',
    },
    {
      id: 'INV-0249',
      company: 'Lumen Studio',
      amount: 3260,
      date: '24 Oct',
      status: 'pending',
      description: 'October retainer',
    },
    {
      id: 'INV-0250',
      company: 'Alpine Works',
      amount: 1890,
      date: '29 Oct',
      status: 'draft',
      description: 'Research and strategy',
    },
  ];
  const formatEuro = (amount: number) =>
    new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-IE', {
      style: 'currency',
      currency: 'EUR',
    }).format(amount);
  const formatBusinessDate = () =>
    new Intl.DateTimeFormat(language === 'ru' ? 'ru-RU' : 'en-GB', {
      day: 'numeric',
      month: 'short',
    }).format(new Date());
  const parseAmount = (value: FormDataEntryValue | null) => {
    const normalized = String(value ?? '')
      .replace(/\s/g, '')
      .replace(',', '.');
    return Number.parseFloat(normalized) || 0;
  };

  const [modal, setModal] = useState<BusinessModal | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [confirmDraftCancel, setConfirmDraftCancel] = useState(false);
  const [confirmMemberRemove, setConfirmMemberRemove] = useState(false);
  const [invoices, setInvoices] = useVersionedState<Invoice[]>({
    key: 'pulse-business-invoices',
    version: 2,
    fallback: defaultInvoices,
    migrate: (source) =>
      Array.isArray(source) ? (source as Invoice[]) : defaultInvoices,
    validate: (source): source is Invoice[] => Array.isArray(source),
  });
  const [payments, setPayments] = useVersionedState<BusinessPayment[]>({
    key: 'pulse-business-payments',
    version: 2,
    fallback: [],
    migrate: (source) =>
      Array.isArray(source) ? (source as BusinessPayment[]) : [],
    validate: (source): source is BusinessPayment[] => Array.isArray(source),
  });
  const defaultCards: BusinessCard[] = [
    {
      id: 'card-primary',
      holder: 'Danila Kulinkovich',
      monthlyLimit: 5000,
      transactionLimit: 1500,
      spent: 1240,
      lastFour: '2048',
    },
  ];
  const migrateCards = (source: unknown) => {
    const stored = Array.isArray(source)
      ? (source as Array<Partial<BusinessCard> & { limit?: number }>)
      : defaultCards;
    return stored.map((card, index): BusinessCard => {
      const monthlyLimit = Math.max(
        0,
        Number(card.monthlyLimit ?? card.limit ?? 5000)
      );
      return {
        id: String(card.id ?? `card-${index}`),
        holder: String(card.holder ?? 'Pulse team'),
        monthlyLimit,
        transactionLimit: Math.max(
          0,
          Number(card.transactionLimit ?? Math.min(monthlyLimit, 1500))
        ),
        spent: Math.max(0, Number(card.spent ?? (index === 0 ? 1240 : 0))),
        lastFour: String(card.lastFour ?? '2048'),
      };
    });
  };
  const [businessCards, setBusinessCards] = useVersionedState<BusinessCard[]>({
    key: 'pulse-business-cards',
    version: 2,
    fallback: defaultCards,
    migrate: migrateCards,
    validate: (source): source is BusinessCard[] => Array.isArray(source),
  });
  const defaultTeam: TeamMember[] = [
    {
      id: 'team-owner',
      name: 'Danila Kulinkovich',
      email: 'danila@pulse.eu',
      initials: 'DK',
      role: 'owner',
      status: 'active',
    },
    {
      id: 'team-sofia',
      name: 'Sofia Laurent',
      email: 'sofia@pulse.eu',
      initials: 'SL',
      role: 'finance',
      status: 'active',
    },
    {
      id: 'team-marc',
      name: 'Marc Klein',
      email: 'marc@pulse.eu',
      initials: 'MK',
      role: 'member',
      status: 'active',
    },
    {
      id: 'team-emma',
      name: 'Emma Müller',
      email: 'emma@pulse.eu',
      initials: 'EM',
      role: 'member',
      status: 'invited',
    },
  ];
  const [teamMembers, setTeamMembers] = useVersionedState<TeamMember[]>({
    key: 'pulse-business-team',
    version: 2,
    fallback: defaultTeam,
    migrate: (source) =>
      Array.isArray(source) ? (source as TeamMember[]) : defaultTeam,
    validate: (source): source is TeamMember[] => Array.isArray(source),
  });

  const getInitials = (name: string) =>
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('') || 'TM';
  const teamRoleLabel = (role: TeamRole) => {
    const labels: Record<TeamRole, [string, string]> = {
      owner: ['Владелец', 'Owner'],
      admin: ['Администратор', 'Admin'],
      finance: ['Финансы', 'Finance'],
      member: ['Сотрудник', 'Member'],
    };
    return locale(language, ...labels[role]);
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!modal) return;
    const data = new FormData(event.currentTarget as HTMLFormElement);
    const party = String(data.get('party') ?? '').trim();
    const details = String(data.get('details') ?? '').trim();
    const amount = parseAmount(data.get('amount'));

    if (modal === 'invoice' || modal === 'invoice-edit') {
      if (modal === 'invoice-edit' && selectedInvoice) {
        setInvoices((current) =>
          current.map((invoice) =>
            invoice.id === selectedInvoice && invoice.status === 'draft'
              ? {
                  ...invoice,
                  company: party,
                  amount,
                  description: details,
                  date: formatBusinessDate(),
                }
              : invoice
          )
        );
        setSelectedInvoice(null);
        onNotice(locale(language, 'Черновик обновлён', 'Draft updated'));
        setModal(null);
        return;
      }
      const number = Math.max(
        ...invoices.map((invoice) => Number(invoice.id.replace(/\D/g, ''))),
        250
      );
      const invoice: Invoice = {
        id: `INV-${String(number + 1).padStart(4, '0')}`,
        company: party,
        amount,
        date: formatBusinessDate(),
        status: 'draft',
        description: details,
      };
      setInvoices((current) => [invoice, ...current]);
      onNotice(locale(language, 'Счёт сохранён', 'Invoice saved'));
    } else if (modal === 'supplier') {
      setPayments((current) => [
        {
          id: `PAY-${Date.now()}`,
          company: party,
          amount,
          date: formatBusinessDate(),
          iban: details,
        },
        ...current,
      ]);
      onNotice(locale(language, 'Платёж создан', 'Payment created'));
    } else if (modal === 'card') {
      const monthlyLimit = parseAmount(data.get('details'));
      const transactionLimit = parseAmount(data.get('transactionLimit'));
      setBusinessCards((current) => [
        ...current,
        {
          id: `CARD-${Date.now()}`,
          holder: party,
          monthlyLimit,
          transactionLimit,
          spent: 0,
          lastFour: String(Math.floor(1000 + Math.random() * 9000)),
        },
      ]);
      onNotice(locale(language, 'Карта выпущена', 'Card issued'));
    } else if (modal === 'card-limit' && selectedCard) {
      const monthlyLimit = parseAmount(data.get('monthlyLimit'));
      const transactionLimit = parseAmount(data.get('transactionLimit'));
      setBusinessCards((current) =>
        current.map((card) =>
          card.id === selectedCard
            ? { ...card, monthlyLimit, transactionLimit }
            : card
        )
      );
      setSelectedCard(null);
      onNotice(
        locale(language, 'Лимиты карты обновлены', 'Card limits updated')
      );
    } else if (modal === 'team-add') {
      const role = String(data.get('role') ?? 'member') as TeamRole;
      const email = String(data.get('email') ?? '').trim();
      setTeamMembers((current) => [
        ...current,
        {
          id: `TEAM-${Date.now()}`,
          name: party,
          email,
          initials: getInitials(party),
          role,
          status: 'invited',
        },
      ]);
      onNotice(locale(language, 'Приглашение отправлено', 'Invitation sent'));
    } else if (modal === 'team-edit' && selectedMember) {
      const role = String(data.get('role') ?? 'member') as TeamRole;
      const email = String(data.get('email') ?? '').trim();
      setTeamMembers((current) =>
        current.map((member) =>
          member.id === selectedMember
            ? {
                ...member,
                name: party,
                email,
                initials: getInitials(party),
                role: member.role === 'owner' ? 'owner' : role,
              }
            : member
        )
      );
      setSelectedMember(null);
      onNotice(locale(language, 'Роль обновлена', 'Role updated'));
    }
    setModal(null);
  };
  const selectedInvoiceData = invoices.find(
    (invoice) => invoice.id === selectedInvoice
  );
  const selectedMemberData = teamMembers.find(
    (member) => member.id === selectedMember
  );
  const selectedCardData = businessCards.find(
    (card) => card.id === selectedCard
  );
  const closeBusinessModal = () => {
    setModal(null);
    setSelectedInvoice(null);
    setSelectedMember(null);
    setSelectedCard(null);
    setConfirmDraftCancel(false);
    setConfirmMemberRemove(false);
  };
  const modalTitles: Record<BusinessModal, [string, string]> = {
    invoice: ['Новый счёт', 'New invoice'],
    'invoice-edit': ['Редактировать черновик', 'Edit draft'],
    card: ['Новая бизнес-карта', 'New business card'],
    'card-limit': ['Лимиты карты', 'Card limits'],
    supplier: ['Платёж поставщику', 'Supplier payment'],
    'team-add': ['Добавить сотрудника', 'Add team member'],
    'team-edit': ['Управление доступом', 'Manage access'],
  };
  const isInvoiceModal = modal === 'invoice' || modal === 'invoice-edit';
  return (
    <div className="service-shell service-business">
      <ServiceHeader
        eyebrow="Pulse Business"
        title={locale(language, 'Финансы команды', 'Team finance')}
        description={locale(
          language,
          'Счета, карты, роли и документы компании в одном рабочем пространстве.',
          'Company accounts, cards, roles and documents in one workspace.'
        )}
        metrics={[
          [locale(language, 'Доступно', 'Available'), '86 420,18 €'],
          [
            locale(language, 'Поступления', 'Income'),
            '+24 800 €',
            locale(language, 'за октябрь', 'in October'),
          ],
          [
            locale(language, 'Расходы', 'Expenses'),
            '−16 380 €',
            locale(language, 'на 12% ниже сентября', '12% below September'),
          ],
        ]}
      />
      <div className="service-layout" id="service-workspace">
        <main>
          <section className="service-section service-cashflow">
            <header>
              <div>
                <span>{locale(language, 'Движение денег', 'Cash flow')}</span>
                <h2>{locale(language, 'Октябрь', 'October')}</h2>
              </div>
              <button
                type="button"
                onClick={() => {
                  downloadTextFile(
                    'pulse-business-october.csv',
                    'Date,Description,Direction,Amount,Currency\n2026-10-04,Northstar GmbH,Income,8400.00,EUR\n2026-10-11,Cloud hosting,Expense,-890.00,EUR\n2026-10-18,Payroll,Expense,-9200.00,EUR\n2026-10-24,Lumen Studio,Income,3260.00,EUR'
                  );
                  onNotice(
                    locale(language, 'Выписка скачана', 'Statement downloaded')
                  );
                }}
              >
                {locale(language, 'Скачать выписку', 'Download statement')}
              </button>
            </header>
            <div
              className="service-bars"
              aria-label={locale(
                language,
                'Движение денег по неделям',
                'Weekly cash flow'
              )}
            >
              {[62, 48, 81, 70, 92, 58, 76, 65, 88, 72, 95, 84].map(
                (height, index) => (
                  <i key={index} style={{ height: `${height}%` }}>
                    <span>{index + 1}</span>
                  </i>
                )
              )}
            </div>
            <footer>
              <span>
                <i />
                {locale(language, 'Поступления', 'Income')}
              </span>
              <span>
                <i />
                {locale(language, 'Расходы', 'Expenses')}
              </span>
            </footer>
          </section>
          <section className="service-section service-table-section">
            <header>
              <div>
                <span>{locale(language, 'Документы', 'Documents')}</span>
                <h2>
                  {locale(language, 'Последние счета', 'Latest invoices')}
                </h2>
              </div>
              <button type="button" onClick={() => setModal('invoice')}>
                + {locale(language, 'Новый счёт', 'New invoice')}
              </button>
            </header>
            <div className="service-table">
              {invoices.map((invoice) => (
                <button
                  type="button"
                  key={invoice.id}
                  onClick={() => setSelectedInvoice(invoice.id)}
                >
                  <span>{invoice.id}</span>
                  <strong>{invoice.company}</strong>
                  <span>{invoice.date}</span>
                  <b>{formatEuro(invoice.amount)}</b>
                  <em className={`is-${invoice.status}`}>
                    {invoice.status === 'paid'
                      ? locale(language, 'Оплачен', 'Paid')
                      : invoice.status === 'pending'
                        ? locale(language, 'Ожидает', 'Pending')
                        : invoice.status === 'cancelled'
                          ? locale(language, 'Отменён', 'Cancelled')
                          : locale(language, 'Черновик', 'Draft')}
                  </em>
                </button>
              ))}
            </div>
          </section>
          {payments.length > 0 && (
            <section className="service-section service-business-payments">
              <header>
                <div>
                  <span>{locale(language, 'Платежи', 'Payments')}</span>
                  <h2>
                    {locale(language, 'Последние исходящие', 'Latest outgoing')}
                  </h2>
                </div>
                <b>{payments.length}</b>
              </header>
              <div>
                {payments.slice(0, 4).map((payment) => (
                  <article key={payment.id}>
                    <span>
                      <BankGlyph name="between" />
                    </span>
                    <div>
                      <strong>{payment.company}</strong>
                      <small>
                        {payment.date} · {payment.iban}
                      </small>
                    </div>
                    <b>−{formatEuro(payment.amount)}</b>
                  </article>
                ))}
              </div>
            </section>
          )}
        </main>
        <aside id="service-tools">
          <section className="service-section">
            <span>{locale(language, 'Быстрые действия', 'Quick actions')}</span>
            <ActionButton
              icon="contract"
              title={locale(language, 'Выставить счёт', 'Create invoice')}
              caption={locale(language, 'EUR · SEPA', 'EUR · SEPA')}
              onClick={() => setModal('invoice')}
            />
            <ActionButton
              icon="card"
              title={locale(language, 'Выпустить карту', 'Issue a card')}
              caption={locale(
                language,
                'Физическая или виртуальная',
                'Physical or virtual'
              )}
              onClick={() => setModal('card')}
            />
            <ActionButton
              icon="between"
              title={locale(language, 'Платёж поставщику', 'Pay a supplier')}
              caption={locale(language, 'По IBAN', 'By IBAN')}
              onClick={() => setModal('supplier')}
            />
          </section>
          <section className="service-section service-team">
            <header>
              <div>
                <span>{locale(language, 'Команда', 'Team')}</span>
                <h2>{locale(language, 'Доступы', 'Access')}</h2>
              </div>
              <button type="button" onClick={() => setModal('team-add')}>
                + {locale(language, 'Добавить', 'Add')}
              </button>
            </header>
            {teamMembers.map((member) => (
              <button
                type="button"
                key={member.id}
                onClick={() => {
                  setSelectedMember(member.id);
                  setModal('team-edit');
                }}
              >
                <i>{member.initials}</i>
                <span>
                  <strong>{member.name}</strong>
                  <small>
                    {teamRoleLabel(member.role)}
                    {member.status === 'invited' &&
                      ` · ${locale(language, 'приглашён', 'invited')}`}
                  </small>
                </span>
                <b>›</b>
              </button>
            ))}
          </section>
          <section className="service-section service-business-cards">
            <header>
              <span>{locale(language, 'Карты команды', 'Team cards')}</span>
              <b>{businessCards.length}</b>
            </header>
            {businessCards
              .slice(-3)
              .reverse()
              .map((card) => (
                <button
                  type="button"
                  key={card.id}
                  onClick={() => {
                    setSelectedCard(card.id);
                    setModal('card-limit');
                  }}
                >
                  <span>
                    <BankGlyph name="card" />
                  </span>
                  <div>
                    <strong>{card.holder}</strong>
                    <small>
                      Pulse Business · •{card.lastFour} ·{' '}
                      {formatEuro(card.spent)}{' '}
                      {locale(language, 'потрачено', 'spent')}
                    </small>
                  </div>
                  <b>{formatEuro(card.monthlyLimit)}</b>
                </button>
              ))}
          </section>
        </aside>
      </div>
      {modal && (
        <ServiceModal
          title={locale(language, ...modalTitles[modal])}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={closeBusinessModal}
        >
          {(modal === 'team-add' || modal === 'team-edit') && (
            <form className="service-form" onSubmit={submit}>
              <label>
                {locale(language, 'Имя и фамилия', 'Full name')}
                <input
                  required
                  name="party"
                  autoComplete="name"
                  defaultValue={selectedMemberData?.name ?? ''}
                  placeholder="Sofia Laurent"
                />
              </label>
              <label>
                {locale(language, 'Рабочая почта', 'Work email')}
                <input
                  required
                  type="email"
                  name="email"
                  autoComplete="email"
                  defaultValue={selectedMemberData?.email ?? ''}
                  placeholder="sofia@company.eu"
                />
              </label>
              <label>
                {locale(language, 'Роль', 'Role')}
                <select
                  name="role"
                  defaultValue={selectedMemberData?.role ?? 'member'}
                  disabled={selectedMemberData?.role === 'owner'}
                >
                  <option value="member">
                    {locale(language, 'Сотрудник', 'Member')}
                  </option>
                  <option value="finance">
                    {locale(language, 'Финансы', 'Finance')}
                  </option>
                  <option value="admin">
                    {locale(language, 'Администратор', 'Admin')}
                  </option>
                  {selectedMemberData?.role === 'owner' && (
                    <option value="owner">
                      {locale(language, 'Владелец', 'Owner')}
                    </option>
                  )}
                </select>
              </label>
              <button type="submit">
                {modal === 'team-add'
                  ? locale(language, 'Отправить приглашение', 'Send invitation')
                  : locale(language, 'Сохранить изменения', 'Save changes')}
              </button>
              {modal === 'team-edit' &&
                selectedMemberData &&
                selectedMemberData.role !== 'owner' && (
                  <div className="service-destructive-action">
                    {!confirmMemberRemove ? (
                      <button
                        type="button"
                        onClick={() => setConfirmMemberRemove(true)}
                      >
                        {locale(language, 'Отозвать доступ', 'Remove access')}
                      </button>
                    ) : (
                      <div role="alert">
                        <p>
                          {locale(
                            language,
                            'Сотрудник потеряет доступ к бизнес-кабинету. Выпущенные карты останутся в истории.',
                            'This member will lose workspace access. Issued cards will remain in the history.'
                          )}
                        </p>
                        <div>
                          <button
                            type="button"
                            onClick={() => setConfirmMemberRemove(false)}
                          >
                            {locale(language, 'Назад', 'Back')}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setTeamMembers((current) =>
                                current.filter(
                                  (member) =>
                                    member.id !== selectedMemberData.id
                                )
                              );
                              closeBusinessModal();
                              onNotice(
                                locale(
                                  language,
                                  'Доступ сотрудника отозван',
                                  'Team access removed'
                                )
                              );
                            }}
                          >
                            {locale(language, 'Отозвать', 'Remove')}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
            </form>
          )}
          {modal === 'card-limit' && selectedCardData && (
            <form className="service-form" onSubmit={submit}>
              <div className="service-card-limit-summary">
                <span>
                  <BankGlyph name="card" />
                </span>
                <div>
                  <strong>{selectedCardData.holder}</strong>
                  <small>Pulse Business · •{selectedCardData.lastFour}</small>
                </div>
                <b>{formatEuro(selectedCardData.spent)}</b>
              </div>
              <label>
                {locale(language, 'Месячный лимит', 'Monthly limit')}
                <div>
                  <input
                    required
                    type="number"
                    min={selectedCardData.spent}
                    step="1"
                    name="monthlyLimit"
                    defaultValue={selectedCardData.monthlyLimit}
                  />
                  <span>EUR</span>
                </div>
                <small>
                  {locale(
                    language,
                    `Уже потрачено ${formatEuro(selectedCardData.spent)}`,
                    `${formatEuro(selectedCardData.spent)} already spent`
                  )}
                </small>
              </label>
              <label>
                {locale(language, 'Лимит на одну покупку', 'Per-payment limit')}
                <div>
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    name="transactionLimit"
                    defaultValue={selectedCardData.transactionLimit}
                  />
                  <span>EUR</span>
                </div>
              </label>
              <button type="submit">
                {locale(language, 'Сохранить лимиты', 'Save limits')}
              </button>
            </form>
          )}
          {(isInvoiceModal || modal === 'card' || modal === 'supplier') && (
            <form className="service-form" onSubmit={submit}>
              <label>
                {locale(
                  language,
                  isInvoiceModal
                    ? 'Получатель'
                    : modal === 'card'
                      ? 'Сотрудник'
                      : 'Компания',
                  isInvoiceModal
                    ? 'Customer'
                    : modal === 'card'
                      ? 'Team member'
                      : 'Company'
                )}
                <input
                  required
                  name="party"
                  defaultValue={
                    modal === 'invoice-edit'
                      ? selectedInvoiceData?.company
                      : undefined
                  }
                  placeholder={
                    isInvoiceModal
                      ? 'Northstar GmbH'
                      : modal === 'card'
                        ? 'Sofia Laurent'
                        : 'Alpine Works'
                  }
                />
              </label>
              {modal !== 'card' && (
                <label>
                  {locale(language, 'Сумма', 'Amount')}
                  <div>
                    <input
                      required
                      type="number"
                      min="0.01"
                      step="0.01"
                      name="amount"
                      inputMode="decimal"
                      defaultValue={
                        modal === 'invoice-edit'
                          ? selectedInvoiceData?.amount
                          : undefined
                      }
                      placeholder="0,00"
                    />
                    <span>EUR</span>
                  </div>
                </label>
              )}
              <label>
                {locale(
                  language,
                  isInvoiceModal
                    ? 'Описание'
                    : modal === 'card'
                      ? 'Месячный лимит'
                      : 'IBAN',
                  isInvoiceModal
                    ? 'Description'
                    : modal === 'card'
                      ? 'Monthly limit'
                      : 'IBAN'
                )}
                <input
                  required
                  type={modal === 'card' ? 'number' : 'text'}
                  min={modal === 'card' ? '1' : undefined}
                  step={modal === 'card' ? '1' : undefined}
                  name="details"
                  defaultValue={
                    modal === 'invoice-edit'
                      ? selectedInvoiceData?.description
                      : undefined
                  }
                  placeholder={
                    isInvoiceModal
                      ? 'Product design services'
                      : modal === 'card'
                        ? '2500'
                        : 'AT61 1904 3002 3457 3201'
                  }
                />
              </label>
              {modal === 'card' && (
                <label>
                  {locale(
                    language,
                    'Лимит на одну покупку',
                    'Per-payment limit'
                  )}
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    name="transactionLimit"
                    placeholder="1000"
                  />
                </label>
              )}
              <button type="submit">
                {modal === 'invoice-edit'
                  ? locale(language, 'Сохранить черновик', 'Save draft')
                  : locale(language, 'Продолжить', 'Continue')}
              </button>
            </form>
          )}
        </ServiceModal>
      )}
      {selectedInvoiceData && !modal && (
        <ServiceModal
          title={selectedInvoiceData.id}
          closeLabel={locale(language, 'Закрыть', 'Close')}
          onClose={() => setSelectedInvoice(null)}
        >
          <div className="service-detail-sheet">
            <dl>
              <div>
                <dt>{locale(language, 'Получатель', 'Customer')}</dt>
                <dd>{selectedInvoiceData.company}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Сумма', 'Amount')}</dt>
                <dd>{formatEuro(selectedInvoiceData.amount)}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Срок оплаты', 'Due date')}</dt>
                <dd>{selectedInvoiceData.date}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Описание', 'Description')}</dt>
                <dd>{selectedInvoiceData.description}</dd>
              </div>
              <div>
                <dt>{locale(language, 'Статус', 'Status')}</dt>
                <dd>
                  {selectedInvoiceData.status === 'paid'
                    ? locale(language, 'Оплачен', 'Paid')
                    : selectedInvoiceData.status === 'pending'
                      ? locale(language, 'Ожидает', 'Pending')
                      : selectedInvoiceData.status === 'cancelled'
                        ? locale(language, 'Отменён', 'Cancelled')
                        : locale(language, 'Черновик', 'Draft')}
                </dd>
              </div>
              <div>
                <dt>IBAN</dt>
                <dd>DE89 3704 0044 0532 0130 00</dd>
              </div>
            </dl>
            <div className="service-detail-actions">
              <button
                type="button"
                onClick={() => {
                  downloadTextFile(
                    `${selectedInvoiceData.id}.csv`,
                    `Invoice,Customer,Amount,Currency,Description\n${selectedInvoiceData.id},${selectedInvoiceData.company},${selectedInvoiceData.amount},EUR,${selectedInvoiceData.description}`
                  );
                  onNotice(
                    locale(language, 'Счёт скачан', 'Invoice downloaded')
                  );
                }}
              >
                {locale(language, 'Скачать', 'Download')}
              </button>
              {selectedInvoiceData.status === 'draft' && (
                <button type="button" onClick={() => setModal('invoice-edit')}>
                  {locale(language, 'Редактировать', 'Edit')}
                </button>
              )}
            </div>
            {selectedInvoiceData.status === 'draft' && (
              <div className="service-destructive-action">
                {!confirmDraftCancel ? (
                  <button
                    type="button"
                    onClick={() => setConfirmDraftCancel(true)}
                  >
                    {locale(language, 'Отменить черновик', 'Cancel draft')}
                  </button>
                ) : (
                  <div role="alert">
                    <p>
                      {locale(
                        language,
                        'Черновик останется в истории со статусом «Отменён».',
                        'The draft will stay in the history with a Cancelled status.'
                      )}
                    </p>
                    <div>
                      <button
                        type="button"
                        onClick={() => setConfirmDraftCancel(false)}
                      >
                        {locale(language, 'Назад', 'Back')}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInvoices((current) =>
                            current.map((invoice) =>
                              invoice.id === selectedInvoiceData.id
                                ? { ...invoice, status: 'cancelled' }
                                : invoice
                            )
                          );
                          setSelectedInvoice(null);
                          setConfirmDraftCancel(false);
                          onNotice(
                            locale(
                              language,
                              'Черновик отменён',
                              'Draft cancelled'
                            )
                          );
                        }}
                      >
                        {locale(language, 'Отменить черновик', 'Cancel draft')}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </ServiceModal>
      )}
    </div>
  );
};
