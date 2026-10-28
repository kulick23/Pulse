import React, { useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { BankGlyph } from '../ProfilePage/BankGlyph';
import { useBankLedger } from '../ProfilePage/bankLedger';
import { useAccessibleDialog } from '../../Hooks/useAccessibleDialog';
import { useVersionedState } from '../../Hooks/useVersionedState';
import {
  getShopProduct,
  ShopCategory,
  ShopProduct,
  shopProducts,
} from './shopData';
import './ShopPage.scss';

interface ShopPageProps {
  language: 'ru' | 'en';
  onNotice: (message?: string) => void;
}

interface CartLine {
  product: ShopProduct;
  quantity: number;
}

const useShopDialog = (close: () => void) => {
  return useAccessibleDialog<HTMLElement>(close);
};

interface ShopOrder {
  id: string;
  date: string;
  total: number;
  lines: Array<{ slug: string; quantity: number }>;
  status: 'paid' | 'cancelled';
}

const locale = (language: 'ru' | 'en', ru: string, en: string) =>
  language === 'ru' ? ru : en;
const money = (value: number) => `${value.toFixed(2).replace('.', ',')} €`;

const ProductCard: React.FC<{
  product: ShopProduct;
  language: 'ru' | 'en';
  onOpen: () => void;
  onAdd: () => void;
  saved: boolean;
  onToggleSaved: () => void;
}> = ({ product, language, onOpen, onAdd, saved, onToggleSaved }) => (
  <article className="shop-product-card">
    <button
      className="shop-product-card__image"
      type="button"
      onClick={onOpen}
      aria-label={`${locale(language, 'Открыть', 'Open')} ${product.name}`}
    >
      <img src={product.image} alt={product.name} />
      <span>
        {Math.round((product.cashback / product.price) * 100)}%{' '}
        {locale(language, 'баллами', 'back')}
      </span>
    </button>
    <button
      className={`shop-save-button ${saved ? 'active' : ''}`}
      type="button"
      onClick={onToggleSaved}
      aria-pressed={saved}
      aria-label={locale(
        language,
        saved ? 'Убрать из избранного' : 'Сохранить товар',
        saved ? 'Remove from saved' : 'Save product'
      )}
    >
      <BankGlyph name="bookmark" />
    </button>
    <div>
      <button type="button" onClick={onOpen}>
        <strong>{product.name}</strong>
        <small>
          {locale(
            language,
            product.category === 'audio' ? 'Аудио' : 'Аксессуары',
            product.category === 'audio' ? 'Audio' : 'Accessories'
          )}
        </small>
      </button>
      <div>
        <b>{money(product.price)}</b>
        <button
          type="button"
          onClick={onAdd}
          aria-label={`${locale(language, 'Добавить в корзину', 'Add to cart')} ${product.name}`}
        >
          +
        </button>
      </div>
    </div>
  </article>
);

const ShopCatalog: React.FC<
  ShopPageProps & {
    onAdd: (product: ShopProduct) => void;
    cartCount: number;
    openCart: () => void;
    saved: string[];
    toggleSaved: (slug: string) => void;
  }
> = ({ language, onAdd, cartCount, openCart, saved, toggleSaved }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<'all' | ShopCategory>('all');
  const featured = shopProducts[0];
  const products = useMemo(
    () =>
      shopProducts.filter(
        (product) =>
          (category === 'all' || product.category === category) &&
          product.name.toLowerCase().includes(query.toLowerCase())
      ),
    [category, query]
  );
  return (
    <div className="shop-shell">
      <section className="shop-featured">
        <div>
          <span>Pulse Select · Audio</span>
          <h1>{featured.name}</h1>
          <p>
            {language === 'ru'
              ? featured.descriptionRu
              : featured.descriptionEn}
          </p>
          <div>
            <strong>{money(featured.price)}</strong>
            <button type="button" onClick={() => onAdd(featured)}>
              {locale(language, 'В корзину', 'Add to cart')}
            </button>
            <button
              type="button"
              onClick={() => navigate(`/shop/product/${featured.slug}`)}
            >
              {locale(language, 'Подробнее', 'Details')} →
            </button>
          </div>
        </div>
        <button
          type="button"
          className="shop-featured__image"
          onClick={() => navigate(`/shop/product/${featured.slug}`)}
          aria-label={locale(language, 'Открыть товар', 'Open product')}
        >
          <img src={featured.image} alt={featured.name} />
        </button>
        <span className="shop-featured__cashback">
          + {money(featured.cashback)}
          <small>
            {locale(language, 'вернётся баллами', 'returned in points')}
          </small>
        </span>
      </section>

      <section className="shop-catalog" id="shop-catalog">
        <header>
          <div>
            <span>Pulse Shop</span>
            <h2>
              {locale(
                language,
                'Техника с банковской выгодой',
                'Technology with banking benefits'
              )}
            </h2>
          </div>
          <button className="shop-cart-button" type="button" onClick={openCart}>
            {locale(language, 'Корзина', 'Cart')}
            <b>{cartCount}</b>
          </button>
        </header>
        <div className="shop-catalog__tools">
          <label>
            <BankGlyph name="search" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={locale(language, 'Поиск товаров', 'Search products')}
            />
          </label>
          <div>
            {(
              [
                ['all', 'Все', 'All'],
                ['audio', 'Аудио', 'Audio'],
                ['accessories', 'Аксессуары', 'Accessories'],
              ] as const
            ).map(([id, ru, en]) => (
              <button
                type="button"
                key={id}
                className={category === id ? 'active' : ''}
                onClick={() => setCategory(id)}
              >
                {language === 'ru' ? ru : en}
              </button>
            ))}
          </div>
        </div>
        <div className="shop-product-grid">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              product={product}
              language={language}
              onOpen={() => navigate(`/shop/product/${product.slug}`)}
              onAdd={() => onAdd(product)}
              saved={saved.includes(product.slug)}
              onToggleSaved={() => toggleSaved(product.slug)}
            />
          ))}
        </div>
        {products.length === 0 && (
          <div className="shop-empty">
            {locale(
              language,
              'Таких товаров пока нет.',
              'No products match your search.'
            )}
          </div>
        )}
      </section>
    </div>
  );
};

const ShopProductView: React.FC<
  ShopPageProps & {
    product: ShopProduct;
    onAdd: (product: ShopProduct) => void;
    saved: boolean;
    onToggleSaved: () => void;
  }
> = ({ language, product, onAdd, saved, onToggleSaved }) => {
  const navigate = useNavigate();
  const [image, setImage] = useState(product.gallery[0]);
  return (
    <div className="shop-shell shop-product-view">
      <button
        className="shop-back"
        type="button"
        onClick={() => navigate('/shop')}
      >
        ← {locale(language, 'Каталог', 'Catalog')}
      </button>
      <section className="shop-product-hero">
        <div className="shop-product-gallery">
          <div>
            <img src={image} alt={product.name} />
          </div>
          <nav
            aria-label={locale(language, 'Варианты товара', 'Product variants')}
          >
            {product.gallery.map((item, index) => (
              <button
                type="button"
                className={image === item ? 'active' : ''}
                key={item}
                onClick={() => setImage(item)}
                aria-label={`${locale(language, 'Вариант', 'Variant')} ${index + 1}`}
              >
                <img src={item} alt="" />
              </button>
            ))}
          </nav>
        </div>
        <div className="shop-product-info">
          <span>
            Pulse Shop ·{' '}
            {locale(
              language,
              product.category === 'audio' ? 'Аудио' : 'Аксессуары',
              product.category === 'audio' ? 'Audio' : 'Accessories'
            )}
          </span>
          <h1>{product.name}</h1>
          <p>
            {language === 'ru' ? product.descriptionRu : product.descriptionEn}
          </p>
          <div className="shop-product-info__price">
            <strong>{money(product.price)}</strong>
            <small>
              + {money(product.cashback)}{' '}
              {locale(language, 'баллами', 'in points')}
            </small>
          </div>
          <div className="shop-product-info__actions">
            <button type="button" onClick={() => onAdd(product)}>
              {locale(language, 'Добавить в корзину', 'Add to cart')}
            </button>
            <button
              type="button"
              className={saved ? 'active' : ''}
              aria-pressed={saved}
              onClick={onToggleSaved}
            >
              <BankGlyph name="bookmark" />
              {locale(
                language,
                saved ? 'Сохранено' : 'Сохранить',
                saved ? 'Saved' : 'Save'
              )}
            </button>
          </div>
          <small>
            {locale(
              language,
              'Оплата любой картой Pulse · Доставка рассчитывается на следующем шаге',
              'Pay with any Pulse card · Delivery is calculated at the next step'
            )}
          </small>
        </div>
      </section>
      <section className="shop-specs">
        <header>
          <span>Designed for everyday</span>
          <h2>
            {locale(
              language,
              'Главное без лишнего шума',
              'The essentials without noise'
            )}
          </h2>
        </header>
        <div>
          {product.features.map(([value, ru, en]) => (
            <article key={value}>
              <strong>{value}</strong>
              <span>{language === 'ru' ? ru : en}</span>
            </article>
          ))}
        </div>
      </section>
      <section className="shop-in-box">
        <img
          src={
            product.slug === 'travel-kit'
              ? product.image
              : shopProducts[5].image
          }
          alt=""
        />
        <div>
          <span>Pulse Complete</span>
          <h2>
            {locale(
              language,
              'В комплекте всё необходимое',
              'Everything you need in the box'
            )}
          </h2>
          <ul>
            <li>
              {locale(
                language,
                'Наушники и защитный кейс',
                'Headphones and protective case'
              )}
            </li>
            <li>{locale(language, 'Кабель USB-C', 'USB-C cable')}</li>
            <li>
              {locale(language, 'Краткое руководство', 'Quick start guide')}
            </li>
            <li>
              {locale(language, 'Двухлетняя гарантия', 'Two-year warranty')}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
};

const CartDrawer: React.FC<{
  language: 'ru' | 'en';
  cart: CartLine[];
  close: () => void;
  change: (slug: string, delta: number) => void;
  checkout: () => void;
}> = ({ language, cart, close, change, checkout }) => {
  const dialogRef = useShopDialog(close);
  const total = cart.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );
  return (
    <div className="shop-cart-overlay" onMouseDown={close}>
      <aside
        ref={dialogRef}
        className="shop-cart"
        role="dialog"
        aria-modal="true"
        aria-label={locale(language, 'Корзина', 'Cart')}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>Pulse Shop</span>
            <h2>{locale(language, 'Корзина', 'Cart')}</h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={locale(language, 'Закрыть', 'Close')}
          >
            ×
          </button>
        </header>
        {cart.length ? (
          <>
            <div className="shop-cart__lines">
              {cart.map((line) => (
                <article key={line.product.slug}>
                  <img src={line.product.image} alt="" />
                  <div>
                    <strong>{line.product.name}</strong>
                    <span>{money(line.product.price)}</span>
                    <div>
                      <button
                        type="button"
                        onClick={() => change(line.product.slug, -1)}
                      >
                        −
                      </button>
                      <b>{line.quantity}</b>
                      <button
                        type="button"
                        onClick={() => change(line.product.slug, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <footer>
              <div>
                <span>{locale(language, 'Итого', 'Total')}</span>
                <strong>{money(total)}</strong>
              </div>
              <button type="button" onClick={checkout}>
                {locale(
                  language,
                  'Оплатить картой Pulse',
                  'Pay with Pulse card'
                )}
              </button>
              <small>
                {locale(
                  language,
                  'Сумма будет списана с основного EUR-счёта',
                  'The amount will be charged to your primary EUR account'
                )}
              </small>
            </footer>
          </>
        ) : (
          <div className="shop-cart__empty">
            <strong>
              {locale(language, 'Корзина пуста', 'Your cart is empty')}
            </strong>
            <p>
              {locale(
                language,
                'Добавьте товар из каталога.',
                'Add a product from the catalog.'
              )}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

const ShopCollectionDrawer: React.FC<{
  language: 'ru' | 'en';
  view: 'saved' | 'orders';
  savedProducts: ShopProduct[];
  orders: ShopOrder[];
  close: () => void;
  openProduct: (slug: string) => void;
  add: (product: ShopProduct) => void;
  cancelOrder: (id: string) => void;
  reorder: (order: ShopOrder) => void;
}> = ({
  language,
  view,
  savedProducts,
  orders,
  close,
  openProduct,
  add,
  cancelOrder,
  reorder,
}) => {
  const dialogRef = useShopDialog(close);
  return (
    <div className="shop-cart-overlay" onMouseDown={close}>
      <aside
        ref={dialogRef}
        className="shop-cart shop-collection"
        role="dialog"
        aria-modal="true"
        aria-label={locale(
          language,
          view === 'saved' ? 'Избранное' : 'Заказы',
          view === 'saved' ? 'Saved' : 'Orders'
        )}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header>
          <div>
            <span>Pulse Shop</span>
            <h2>
              {locale(
                language,
                view === 'saved' ? 'Избранное' : 'Заказы',
                view === 'saved' ? 'Saved' : 'Orders'
              )}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={locale(language, 'Закрыть', 'Close')}
          >
            ×
          </button>
        </header>
        {view === 'saved' ? (
          savedProducts.length ? (
            <div className="shop-collection__products">
              {savedProducts.map((product) => (
                <article key={product.slug}>
                  <button
                    type="button"
                    onClick={() => openProduct(product.slug)}
                  >
                    <img src={product.image} alt="" />
                  </button>
                  <div>
                    <strong>{product.name}</strong>
                    <span>{money(product.price)}</span>
                    <button type="button" onClick={() => add(product)}>
                      {locale(language, 'В корзину', 'Add to cart')}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="shop-cart__empty">
              <BankGlyph name="bookmark" />
              <strong>
                {locale(
                  language,
                  'Пока ничего не сохранено',
                  'Nothing saved yet'
                )}
              </strong>
              <p>
                {locale(
                  language,
                  'Нажмите на значок закладки у товара.',
                  'Use the bookmark icon on a product.'
                )}
              </p>
            </div>
          )
        ) : orders.length ? (
          <div className="shop-order-list">
            {orders.map((order) => (
              <article key={order.id}>
                <header>
                  <div>
                    <strong>{order.id}</strong>
                    <span>{order.date}</span>
                  </div>
                  <b>{money(order.total)}</b>
                </header>
                <div>
                  {order.lines.map((line) => {
                    const product = getShopProduct(line.slug);
                    return product ? (
                      <button
                        type="button"
                        key={line.slug}
                        onClick={() => openProduct(line.slug)}
                      >
                        <img src={product.image} alt="" />
                        <span>
                          {product.name}
                          <small>
                            {line.quantity} × {money(product.price)}
                          </small>
                        </span>
                        <b>›</b>
                      </button>
                    ) : null;
                  })}
                </div>
                <footer>
                  <span>
                    {order.status === 'cancelled'
                      ? locale(
                          language,
                          'Отменён · деньги возвращены',
                          'Cancelled · refunded'
                        )
                      : locale(
                          language,
                          'Оплачено картой Pulse',
                          'Paid with Pulse card'
                        )}
                  </span>
                  <div>
                    <button type="button" onClick={() => reorder(order)}>
                      {locale(language, 'Повторить', 'Buy again')}
                    </button>
                    {order.status !== 'cancelled' && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(order.id)}
                      >
                        {locale(language, 'Отменить', 'Cancel')}
                      </button>
                    )}
                  </div>
                </footer>
              </article>
            ))}
          </div>
        ) : (
          <div className="shop-cart__empty">
            <BankGlyph name="contract" />
            <strong>
              {locale(language, 'Заказов пока нет', 'No orders yet')}
            </strong>
            <p>
              {locale(
                language,
                'Оформленный заказ появится здесь.',
                'Completed orders will appear here.'
              )}
            </p>
          </div>
        )}
      </aside>
    </div>
  );
};

export const ShopPage: React.FC<ShopPageProps> = (props) => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { eurBalance, addPayment, addCredit } = useBankLedger();
  const activeCollection =
    searchParams.get('view') === 'saved'
      ? 'saved'
      : searchParams.get('view') === 'orders'
        ? 'orders'
        : null;
  const migrateCart = (source: unknown): CartLine[] => {
    if (!Array.isArray(source)) return [];
    return source.flatMap((line) => {
      const candidate = line as Partial<CartLine> & { slug?: string };
      const savedProduct =
        candidate.product ?? getShopProduct(candidate.slug ?? '');
      const quantity = Number(candidate.quantity ?? 0);
      return savedProduct && quantity > 0
        ? [{ product: savedProduct, quantity }]
        : [];
    });
  };
  const [cart, setCart] = useVersionedState<CartLine[]>({
    key: 'pulse-shop-cart',
    version: 2,
    fallback: [],
    storage: window.sessionStorage,
    migrate: migrateCart,
    validate: (source): source is CartLine[] => Array.isArray(source),
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [saved, setSaved] = useVersionedState<string[]>({
    key: 'pulse-shop-saved',
    version: 2,
    fallback: [],
    migrate: (source) => (Array.isArray(source) ? source.map(String) : []),
    validate: (source): source is string[] => Array.isArray(source),
  });
  const [orders, setOrders] = useVersionedState<ShopOrder[]>({
    key: 'pulse-shop-orders',
    version: 2,
    fallback: [],
    migrate: (source) =>
      (Array.isArray(source) ? (source as ShopOrder[]) : []).map((order) => ({
        ...order,
        status: order.status ?? 'paid',
      })),
    validate: (source): source is ShopOrder[] => Array.isArray(source),
  });
  const product = slug ? getShopProduct(slug) : undefined;
  const add = (item: ShopProduct) => {
    setCart((current) =>
      current.some((line) => line.product.slug === item.slug)
        ? current.map((line) =>
            line.product.slug === item.slug
              ? { ...line, quantity: line.quantity + 1 }
              : line
          )
        : [...current, { product: item, quantity: 1 }]
    );
    setCartOpen(true);
  };
  const change = (productSlug: string, delta: number) =>
    setCart((current) =>
      current
        .map((line) =>
          line.product.slug === productSlug
            ? { ...line, quantity: line.quantity + delta }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  const toggleSaved = (productSlug: string) =>
    setSaved((current) =>
      current.includes(productSlug)
        ? current.filter((item) => item !== productSlug)
        : [...current, productSlug]
    );
  const checkout = () => {
    if (!cart.length) return;
    const total = cart.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0
    );
    const paid = addPayment({
      recipient: 'Pulse Shop',
      amount: total,
      categoryRu: 'Покупка в магазине Pulse',
      categoryEn: 'Pulse Shop purchase',
      type: 'card',
      service: 'shop',
      sourcePath: '/shop?view=orders',
    });
    if (!paid) {
      props.onNotice(
        locale(
          props.language,
          `Недостаточно средств. Доступно ${money(eurBalance)}`,
          `Insufficient funds. ${money(eurBalance)} available`
        )
      );
      return;
    }
    const order: ShopOrder = {
      id: `PS-${String(Date.now()).slice(-6)}`,
      date: new Intl.DateTimeFormat(props.language, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date()),
      total,
      lines: cart.map((line) => ({
        slug: line.product.slug,
        quantity: line.quantity,
      })),
      status: 'paid',
    };
    setOrders((current) => [order, ...current]);
    setCart([]);
    setCartOpen(false);
    navigate('/shop?view=orders');
    props.onNotice(locale(props.language, 'Заказ оформлен', 'Order placed'));
  };
  const closeCollection = () =>
    navigate(slug ? `/shop/product/${slug}` : '/shop');
  const cancelOrder = (orderId: string) => {
    const order = orders.find((item) => item.id === orderId);
    if (!order || order.status === 'cancelled') return;
    addCredit({
      sender: 'Pulse Shop',
      amount: order.total,
      categoryRu: `Возврат по заказу ${order.id}`,
      categoryEn: `Refund for order ${order.id}`,
      service: 'shop',
      sourcePath: '/shop?view=orders',
    });
    setOrders((current) =>
      current.map((item) =>
        item.id === orderId ? { ...item, status: 'cancelled' } : item
      )
    );
    props.onNotice(
      locale(
        props.language,
        'Заказ отменён, деньги возвращены',
        'Order cancelled and refunded'
      )
    );
  };
  const reorder = (order: ShopOrder) => {
    setCart(
      order.lines.flatMap((line) => {
        const item = getShopProduct(line.slug);
        return item ? [{ product: item, quantity: line.quantity }] : [];
      })
    );
    navigate('/shop');
    setCartOpen(true);
    props.onNotice(
      locale(
        props.language,
        'Товары добавлены в корзину',
        'Items added to cart'
      )
    );
  };
  return (
    <>
      {product ? (
        <ShopProductView
          {...props}
          product={product}
          onAdd={add}
          saved={saved.includes(product.slug)}
          onToggleSaved={() => toggleSaved(product.slug)}
        />
      ) : (
        <ShopCatalog
          {...props}
          onAdd={add}
          cartCount={cart.reduce((sum, line) => sum + line.quantity, 0)}
          openCart={() => setCartOpen(true)}
          saved={saved}
          toggleSaved={toggleSaved}
        />
      )}
      {cartOpen && (
        <CartDrawer
          language={props.language}
          cart={cart}
          close={() => setCartOpen(false)}
          change={change}
          checkout={checkout}
        />
      )}
      {activeCollection && (
        <ShopCollectionDrawer
          language={props.language}
          view={activeCollection}
          savedProducts={saved.flatMap((item) => {
            const savedProduct = getShopProduct(item);
            return savedProduct ? [savedProduct] : [];
          })}
          orders={orders}
          close={closeCollection}
          openProduct={(productSlug) =>
            navigate(`/shop/product/${productSlug}`)
          }
          add={add}
          cancelOrder={cancelOrder}
          reorder={reorder}
        />
      )}
    </>
  );
};

export default ShopPage;
