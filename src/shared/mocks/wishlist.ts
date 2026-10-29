import { childrenMock } from './children';

const [emma] = childrenMock;

const DAY = 24 * 60 * 60 * 1000;
// Время считается от момента загрузки, чтобы «Added 3 days ago» было правдой.
const daysAgo = (days: number) =>
  new Date(Date.now() - days * DAY).toISOString();

/**
 * Вишлисты детей в порядке приоритета (у Liam пока пусто): баланс наполняет
 * желания сверху вниз. С балансом $42 у Emma Movie night ($15) уже можно
 * купить, LEGO наполняется остатком ($27 из $45), остальные ждут.
 */
export const wishesMock = [
  {
    id: 1,
    childId: emma.id,
    title: 'Movie night',
    price: 15,
    description: 'Popcorn and a new cartoon with the whole family 🍿',
    link: '',
    photos: [],
    createdAt: daysAgo(9),
  },
  {
    id: 2,
    childId: emma.id,
    title: 'LEGO City set',
    price: 45,
    description: 'The big one with the police station and the helicopter 🚁',
    link: 'lego.com/city-police-station',
    photos: [],
    createdAt: daysAgo(6),
  },
  {
    id: 3,
    childId: emma.id,
    title: 'New bike',
    price: 200,
    description:
      'The blue one with gears, size 24". Like Jake has! I want to ride it to school every day 🙏',
    link: 'bikeshop.com/kids-bike-24',
    photos: [
      require('./images/wish-bike.jpg'),
      require('./images/wish-bike-2.jpg'),
      require('./images/wish-bike-3.jpg'),
    ],
    createdAt: daysAgo(3),
  },
  {
    id: 4,
    childId: emma.id,
    title: 'Headphones',
    price: 60,
    description: '',
    link: '',
    photos: [],
    createdAt: daysAgo(1),
  },
];
