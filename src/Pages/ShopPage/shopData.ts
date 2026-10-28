import hero from '../../Assets/Shop/hero.webp';
import blue from '../../Assets/Shop/clour-01.webp';
import white from '../../Assets/Shop/clour-02.webp';
import black from '../../Assets/Shop/clour-03.webp';
import mint from '../../Assets/Shop/product-01.webp';
import navy from '../../Assets/Shop/product-02.webp';
import coral from '../../Assets/Shop/product-03.webp';
import feature from '../../Assets/Shop/feature.webp';
import caseKit from '../../Assets/Shop/boxing.webp';

export type ShopCategory = 'audio' | 'accessories';

export interface ShopProduct {
  slug: string;
  name: string;
  category: ShopCategory;
  price: number;
  cashback: number;
  image: string;
  gallery: string[];
  descriptionRu: string;
  descriptionEn: string;
  features: Array<[string, string, string]>;
}

export const shopProducts: ShopProduct[] = [
  {
    slug: 'studio-pro',
    name: 'Pulse Studio Pro',
    category: 'audio',
    price: 329,
    cashback: 16.45,
    image: hero,
    gallery: [hero, blue, white, black],
    descriptionRu: 'Полноразмерные беспроводные наушники с активным шумоподавлением и пространственным звуком.',
    descriptionEn: 'Over-ear wireless headphones with active noise cancellation and spatial audio.',
    features: [['32 h', 'автономность', 'battery life'], ['USB-C', 'быстрая зарядка', 'fast charging'], ['ANC', 'шумоподавление', 'noise cancelling']],
  },
  {
    slug: 'air-blue',
    name: 'Pulse Air Blue',
    category: 'audio',
    price: 189,
    cashback: 9.45,
    image: blue,
    gallery: [blue, white, black],
    descriptionRu: 'Лёгкая модель для города и ежедневных поездок.',
    descriptionEn: 'A lightweight model for the city and everyday travel.',
    features: [['24 h', 'автономность', 'battery life'], ['220 g', 'вес', 'weight'], ['AAC', 'кодек', 'codec']],
  },
  {
    slug: 'solo-mint',
    name: 'Pulse Solo Mint',
    category: 'audio',
    price: 149,
    cashback: 7.45,
    image: mint,
    gallery: [mint, navy, coral],
    descriptionRu: 'Компактные наушники с мягкой посадкой и складной конструкцией.',
    descriptionEn: 'Compact headphones with a soft fit and foldable design.',
    features: [['18 h', 'автономность', 'battery life'], ['Fold', 'складные', 'foldable'], ['BT 5.3', 'подключение', 'connection']],
  },
  {
    slug: 'solo-navy',
    name: 'Pulse Solo Navy',
    category: 'audio',
    price: 149,
    cashback: 7.45,
    image: navy,
    gallery: [navy, coral, mint],
    descriptionRu: 'Спокойный тёмно-синий вариант компактной городской модели.',
    descriptionEn: 'A calm navy edition of the compact city model.',
    features: [['18 h', 'автономность', 'battery life'], ['Fold', 'складные', 'foldable'], ['BT 5.3', 'подключение', 'connection']],
  },
  {
    slug: 'solo-coral',
    name: 'Pulse Solo Coral',
    category: 'audio',
    price: 149,
    cashback: 7.45,
    image: coral,
    gallery: [coral, mint, navy],
    descriptionRu: 'Яркий вариант для тех, кто воспринимает технику как часть образа.',
    descriptionEn: 'A vivid edition for people who treat technology as part of their look.',
    features: [['18 h', 'автономность', 'battery life'], ['Fold', 'складные', 'foldable'], ['BT 5.3', 'подключение', 'connection']],
  },
  {
    slug: 'travel-kit',
    name: 'Pulse Travel Audio Kit',
    category: 'accessories',
    price: 79,
    cashback: 3.95,
    image: caseKit,
    gallery: [caseKit, feature],
    descriptionRu: 'Жёсткий дорожный кейс, кабель USB-C и адаптер для поездок.',
    descriptionEn: 'A hard travel case, USB-C cable and travel adapter.',
    features: [['Case', 'жёсткий кейс', 'hard case'], ['USB-C', 'кабель', 'cable'], ['2 yr', 'гарантия', 'warranty']],
  },
];

export const getShopProduct = (slug: string) => shopProducts.find((product) => product.slug === slug);
