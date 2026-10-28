import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BankGlyph } from '../ProfilePage/BankGlyph';
import { getTravelDestination, travelDestinations } from './travelData';
import { useVersionedState } from '../../Hooks/useVersionedState';
import { useAccessibleDialog } from '../../Hooks/useAccessibleDialog';
import './TravelPage.scss';

interface TravelPageProps {
  language: 'ru' | 'en';
  onNotice: (message?: string) => void;
}

interface SavedTrip {
  id: string;
  destination: string;
  travelers: number;
  budget: number;
  routes: string[];
}

const locale = (language: 'ru' | 'en', ru: string, en: string) =>
  language === 'ru' ? ru : en;

const TravelPlanner: React.FC<
  TravelPageProps & { onSave: (trip: Omit<SavedTrip, 'id'>) => void }
> = ({ language, onSave }) => {
  const [travelers, setTravelers] = useState('2');
  const [budget, setBudget] = useState('2400');
  return (
    <section
      className="travel-planner"
      id="travel-planner"
      aria-labelledby="travel-planner-title"
    >
      <div>
        <span>Pulse Trip</span>
        <h2 id="travel-planner-title">
          {locale(language, 'Соберите поездку', 'Build your trip')}
        </h2>
        <p>
          {locale(
            language,
            'Маршрут, бюджет и оплата в одном банковском сценарии.',
            'Route, budget and payment in one banking flow.'
          )}
        </p>
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onSave({
            destination: 'indonesia',
            travelers: Number(travelers),
            budget: Number(budget) || 0,
            routes: [],
          });
        }}
      >
        <label>
          {locale(language, 'Направление', 'Destination')}
          <select defaultValue="indonesia">
            <option value="indonesia">
              {locale(language, 'Индонезия', 'Indonesia')}
            </option>
          </select>
        </label>
        <label>
          {locale(language, 'Путешественники', 'Travellers')}
          <select
            value={travelers}
            onChange={(event) => setTravelers(event.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </label>
        <label>
          {locale(language, 'Бюджет', 'Budget')}
          <div>
            <input
              inputMode="decimal"
              value={budget}
              onChange={(event) => setBudget(event.target.value)}
              aria-label={locale(language, 'Бюджет поездки', 'Trip budget')}
            />
            <span>EUR</span>
          </div>
        </label>
        <button type="submit">
          {locale(language, 'Сохранить поездку', 'Save trip')}
        </button>
      </form>
    </section>
  );
};

const TravelHub: React.FC<
  TravelPageProps & { onSave: (trip: Omit<SavedTrip, 'id'>) => void }
> = ({ language, onNotice, onSave }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const destination = travelDestinations[0];
  const stories = useMemo(
    () =>
      destination.stories.filter((story) =>
        `${story.titleRu} ${story.titleEn} ${story.eyebrowRu} ${story.eyebrowEn}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [destination.stories, query]
  );

  return (
    <div className="travel-shell">
      <section
        className="travel-hero"
        style={{ backgroundImage: `url(${destination.hero})` }}
      >
        <div className="travel-hero__content">
          <span>Pulse Travel · 01</span>
          <h1>{locale(language, 'Индонезия', 'Indonesia')}</h1>
          <p>{locale(language, destination.titleRu, destination.titleEn)}</p>
          <button type="button" onClick={() => navigate('/travel/indonesia')}>
            {locale(language, 'Открыть направление', 'Open destination')}
            <b>↗</b>
          </button>
        </div>
        <div className="travel-hero__index">
          <span>01</span>
          <small>
            {locale(language, 'Первая коллекция', 'First collection')}
          </small>
        </div>
      </section>

      <section className="travel-discovery" id="travel-destinations">
        <header>
          <div>
            <span>Pulse Travel</span>
            <h2>
              {locale(
                language,
                'Исследуйте направление',
                'Explore the destination'
              )}
            </h2>
          </div>
          <label className="travel-search">
            <BankGlyph name="search" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale(language, 'Поиск места', 'Search places')}
            />
          </label>
        </header>
        <div className="travel-story-grid">
          {stories.map((story, index) => (
            <button
              type="button"
              key={story.id}
              className={
                index === 1
                  ? 'travel-story-card travel-story-card--wide'
                  : 'travel-story-card'
              }
              onClick={() => navigate(`/travel/indonesia#${story.id}`)}
            >
              <img src={story.image} alt="" />
              <span>
                {language === 'ru' ? story.eyebrowRu : story.eyebrowEn}
              </span>
              <strong>
                {language === 'ru' ? story.titleRu : story.titleEn}
              </strong>
              <b>↗</b>
            </button>
          ))}
        </div>
        {stories.length === 0 && (
          <div className="travel-empty">
            {locale(
              language,
              'По вашему запросу мест пока нет.',
              'No places match your search yet.'
            )}
          </div>
        )}
      </section>

      <TravelPlanner language={language} onNotice={onNotice} onSave={onSave} />
    </div>
  );
};

const DestinationPage: React.FC<
  TravelPageProps & {
    slug: string;
    onSave: (trip: Omit<SavedTrip, 'id'>) => void;
    onAddRoute: (route: string) => void;
  }
> = ({ language, onNotice, slug, onSave, onAddRoute }) => {
  const navigate = useNavigate();
  const destination = getTravelDestination(slug);
  if (!destination) {
    return (
      <div className="travel-shell">
        <section className="travel-destination-error" role="alert">
          <BankGlyph name="swift" />
          <span>Pulse Travel</span>
          <h1>
            {locale(
              language,
              'Направление не найдено',
              'Destination not found'
            )}
          </h1>
          <p>
            {locale(
              language,
              'Этой коллекции пока нет. Вернитесь к доступным направлениям.',
              'This collection is not available yet. Return to the destinations.'
            )}
          </p>
          <button type="button" onClick={() => navigate('/travel')}>
            {locale(language, 'Все направления', 'All destinations')}
          </button>
        </section>
      </div>
    );
  }
  return (
    <div className="travel-shell travel-destination">
      <button
        className="travel-back"
        type="button"
        onClick={() => navigate('/travel')}
      >
        ← {locale(language, 'Все направления', 'All destinations')}
      </button>
      <section
        className="travel-destination-hero"
        style={{ backgroundImage: `url(${destination.hero})` }}
      >
        <div>
          <span>
            {locale(language, destination.countryRu, destination.countryEn)}
          </span>
          <h1>{locale(language, destination.titleRu, destination.titleEn)}</h1>
          <p>
            {locale(language, destination.summaryRu, destination.summaryEn)}
          </p>
        </div>
      </section>
      <nav
        className="travel-local-nav"
        aria-label={locale(
          language,
          'Разделы направления',
          'Destination sections'
        )}
      >
        {destination.stories.map((story, index) => (
          <a href={`#${story.id}`} key={story.id}>
            <span>0{index + 1}</span>
            {language === 'ru' ? story.eyebrowRu : story.eyebrowEn}
          </a>
        ))}
      </nav>
      <div className="travel-editorial">
        {destination.stories.map((story, index) => (
          <section
            id={story.id}
            className={`travel-editorial__story ${index % 2 ? 'is-reversed' : ''}`}
            key={story.id}
          >
            <img
              src={story.image}
              alt={language === 'ru' ? story.titleRu : story.titleEn}
            />
            <div>
              <span>
                0{index + 1} ·{' '}
                {language === 'ru' ? story.eyebrowRu : story.eyebrowEn}
              </span>
              <h2>{language === 'ru' ? story.titleRu : story.titleEn}</h2>
              <p>{language === 'ru' ? story.bodyRu : story.bodyEn}</p>
              <button type="button" onClick={() => onAddRoute(story.id)}>
                {locale(language, 'Добавить в поездку', 'Add to trip')}
                <b>+</b>
              </button>
            </div>
          </section>
        ))}
      </div>
      <TravelPlanner language={language} onNotice={onNotice} onSave={onSave} />
    </div>
  );
};

const TripsDrawer: React.FC<{
  language: 'ru' | 'en';
  trips: SavedTrip[];
  close: () => void;
  open: () => void;
  remove: (id: string) => void;
  update: (
    id: string,
    changes: Pick<SavedTrip, 'travelers' | 'budget'>
  ) => void;
}> = ({ language, trips, close, open, remove, update }) => {
  const destination = travelDestinations[0];
  const [editingId, setEditingId] = useState<string | null>(null);
  const drawerRef = useAccessibleDialog<HTMLElement>(close);
  return (
    <div className="travel-trips-overlay" onMouseDown={close}>
      <aside
        ref={drawerRef}
        className="travel-trips"
        role="dialog"
        aria-modal="true"
        aria-label={locale(language, 'Мои поездки', 'My trips')}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>Pulse Travel</span>
            <h2>{locale(language, 'Мои поездки', 'My trips')}</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={locale(language, 'Закрыть', 'Close')}
          >
            ×
          </button>
        </header>
        {trips.length ? (
          <div>
            {trips.map((trip) => (
              <article key={trip.id}>
                <button type="button" onClick={open}>
                  <img src={destination.hero} alt="" />
                  <span>
                    {locale(
                      language,
                      destination.countryRu,
                      destination.countryEn
                    )}
                  </span>
                </button>
                <div>
                  <strong>
                    {locale(language, destination.titleRu, destination.titleEn)}
                  </strong>
                  <dl>
                    <div>
                      <dt>
                        {locale(language, 'Путешественники', 'Travellers')}
                      </dt>
                      <dd>{trip.travelers}</dd>
                    </div>
                    <div>
                      <dt>{locale(language, 'Бюджет', 'Budget')}</dt>
                      <dd>{trip.budget.toLocaleString(language)} €</dd>
                    </div>
                    <div>
                      <dt>{locale(language, 'Маршруты', 'Routes')}</dt>
                      <dd>{trip.routes.length}</dd>
                    </div>
                  </dl>
                  {trip.routes.length > 0 && (
                    <ul>
                      {trip.routes.map((route) => {
                        const story = destination.stories.find(
                          (item) => item.id === route
                        );
                        return story ? (
                          <li key={route}>
                            {language === 'ru' ? story.titleRu : story.titleEn}
                          </li>
                        ) : null;
                      })}
                    </ul>
                  )}
                  {editingId === trip.id && (
                    <form
                      className="travel-trip-edit"
                      onSubmit={(event) => {
                        event.preventDefault();
                        const data = new FormData(event.currentTarget);
                        update(trip.id, {
                          travelers: Number(data.get('travelers')),
                          budget: Number(data.get('budget')),
                        });
                        setEditingId(null);
                      }}
                    >
                      <label>
                        {locale(language, 'Путешественники', 'Travellers')}
                        <select name="travelers" defaultValue={trip.travelers}>
                          {[1, 2, 3, 4].map((value) => (
                            <option key={value} value={value}>
                              {value}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label>
                        {locale(language, 'Бюджет', 'Budget')}
                        <div>
                          <input
                            required
                            min="0"
                            step="50"
                            name="budget"
                            type="number"
                            defaultValue={trip.budget}
                          />
                          <span>EUR</span>
                        </div>
                      </label>
                      <button type="submit">
                        {locale(language, 'Сохранить', 'Save changes')}
                      </button>
                    </form>
                  )}
                  <div className="travel-trip-actions">
                    <button
                      type="button"
                      onClick={() =>
                        setEditingId((current) =>
                          current === trip.id ? null : trip.id
                        )
                      }
                    >
                      {editingId === trip.id
                        ? locale(language, 'Отмена', 'Cancel editing')
                        : locale(language, 'Изменить', 'Edit trip')}
                    </button>
                    <button type="button" onClick={() => remove(trip.id)}>
                      {locale(language, 'Удалить', 'Delete')}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="travel-trips__empty">
            <BankGlyph name="swift" />
            <strong>
              {locale(language, 'Сохранённых поездок нет', 'No saved trips')}
            </strong>
            <p>
              {locale(
                language,
                'Соберите первую поездку в планировщике.',
                'Build your first trip in the planner.'
              )}
            </p>
            <button type="button" onClick={close}>
              {locale(language, 'Перейти к планированию', 'Start planning')}
            </button>
          </div>
        )}
      </aside>
    </div>
  );
};

export const TravelPage: React.FC<TravelPageProps> = (props) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [trips, setTrips] = useVersionedState<SavedTrip[]>({
    key: 'pulse-travel-trips',
    version: 2,
    fallback: [],
    migrate: (source) => (Array.isArray(source) ? (source as SavedTrip[]) : []),
    validate: (source): source is SavedTrip[] => Array.isArray(source),
  });
  const saveTrip = (trip: Omit<SavedTrip, 'id'>) => {
    setTrips((current) => [
      { ...trip, id: `PT-${String(Date.now()).slice(-6)}` },
      ...current,
    ]);
    props.onNotice(locale(props.language, 'Поездка сохранена', 'Trip saved'));
  };
  const addRoute = (route: string) => {
    setTrips((current) => {
      if (!current.length)
        return [
          {
            id: `PT-${String(Date.now()).slice(-6)}`,
            destination: 'indonesia',
            travelers: 2,
            budget: 2400,
            routes: [route],
          },
        ];
      return current.map((trip, index) =>
        index === 0 && !trip.routes.includes(route)
          ? { ...trip, routes: [...trip.routes, route] }
          : trip
      );
    });
    props.onNotice(
      locale(
        props.language,
        'Маршрут добавлен в поездку',
        'Route added to your trip'
      )
    );
  };
  return (
    <>
      {slug ? (
        <DestinationPage
          {...props}
          slug={slug}
          onSave={saveTrip}
          onAddRoute={addRoute}
        />
      ) : (
        <TravelHub {...props} onSave={saveTrip} />
      )}
      {searchParams.get('view') === 'trips' && (
        <TripsDrawer
          language={props.language}
          trips={trips}
          close={() => navigate(slug ? `/travel/${slug}` : '/travel')}
          open={() => navigate('/travel/indonesia')}
          update={(id, changes) => {
            setTrips((current) =>
              current.map((trip) =>
                trip.id === id ? { ...trip, ...changes } : trip
              )
            );
            props.onNotice(
              locale(props.language, 'Поездка обновлена', 'Trip updated')
            );
          }}
          remove={(id) =>
            setTrips((current) => current.filter((trip) => trip.id !== id))
          }
        />
      )}
    </>
  );
};

export default TravelPage;
