import { childrenMock } from './children';
import { coParentMock, parentMock } from './parent';

const [emma, liam] = childrenMock;
// Кто из родителей создал задачу.
const sarah = parentMock.id;
const george = coParentMock.id;

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Даты считаются от момента загрузки, чтобы таймеры на экране заданий шли вживую.
const now = Date.now();
const at = (offsetMs: number) => new Date(now + offsetMs).toISOString();

/**
 * Задания семьи: 6 активных и 3 на проверке (у Emma — 3 активных и 2 на
 * проверке, как на её главной). Награды целые: форма редактирования
 * принимает только их.
 */
export const tasksMock = [
  {
    id: 1,
    createdBy: sarah,
    title: 'Clean your room',
    description:
      'Make the bed, put toys away, and vacuum the floor. Wipe the desk, sort the books by size, and take the laundry basket to the hallway.',
    reward: 5,
    status: 'active',
    assignee: emma,
    createdAt: at(-3 * HOUR),
    expiresAt: at(2 * HOUR + 14 * MINUTE + 36_000),
    doneAt: null,
    photo: null,
  },
  {
    id: 2,
    createdBy: sarah,
    title: 'Finish homework',
    description:
      'Finish the math workbook, pages 12 to 14. Check every answer twice, then read one chapter of your book and tell me what it was about.',
    reward: 10,
    status: 'active',
    assignee: liam,
    createdAt: at(-DAY),
    expiresAt: at(45 * MINUTE + 10_000),
    doneAt: null,
    photo: null,
  },
  {
    id: 3,
    createdBy: george,
    title: 'Make the bed',
    description:
      'Straighten the sheets and fold the blanket, then arrange the pillows neatly.',
    reward: 2,
    status: 'active',
    assignee: liam,
    createdAt: at(-2 * HOUR),
    expiresAt: at(5 * HOUR + 30 * MINUTE),
    doneAt: null,
    photo: null,
  },
  {
    id: 4,
    createdBy: george,
    title: 'Walk the dog',
    description:
      'Take Max for a 20 minute walk around the block and do not forget a bag.',
    reward: 3,
    status: 'active',
    assignee: emma,
    createdAt: at(-5 * HOUR),
    expiresAt: at(DAY + 4 * HOUR),
    doneAt: null,
    photo: null,
  },
  {
    id: 5,
    createdBy: sarah,
    title: 'Practice piano',
    description: 'Play the new piece three times from start to finish.',
    reward: 4,
    status: 'active',
    assignee: emma,
    createdAt: at(-26 * HOUR),
    expiresAt: at(3 * HOUR),
    doneAt: null,
    photo: null,
  },
  {
    id: 6,
    createdBy: sarah,
    title: 'Feed the cat',
    description: 'Fill the bowl with dry food and change the water.',
    reward: 1,
    status: 'active',
    assignee: liam,
    createdAt: at(-HOUR),
    expiresAt: null,
    doneAt: null,
    photo: null,
  },
  {
    id: 7,
    createdBy: sarah,
    title: 'Tidy the bedroom',
    description:
      'Make the bed, put toys away, and vacuum the floor. Wipe the desk and sort the books by size.',
    reward: 5,
    status: 'review',
    assignee: emma,
    createdAt: at(-4 * HOUR),
    expiresAt: at(4 * HOUR),
    doneAt: at(-5 * MINUTE),
    photo: require('./images/photo-report-room.jpg'),
  },
  {
    id: 8,
    createdBy: george,
    title: 'Take out the trash',
    description:
      'Empty all the bins in the house and take the bags to the container in the yard.',
    reward: 2,
    status: 'review',
    assignee: liam,
    createdAt: at(-6 * HOUR),
    expiresAt: null,
    doneAt: at(-2 * HOUR),
    photo: null,
  },
  {
    id: 9,
    createdBy: george,
    title: 'Water the plants',
    description: 'Water the plants on the balcony.',
    reward: 2,
    status: 'review',
    assignee: emma,
    createdAt: at(-5 * HOUR),
    expiresAt: null,
    doneAt: at(-2 * HOUR),
    photo: null,
  },
] as const;
