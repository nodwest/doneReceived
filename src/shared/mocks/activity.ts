const emma = require('./images/avatar-emma.jpg');
const liam = require('./images/avatar-liam.jpg');

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

// Время считается от момента загрузки, чтобы «2 min ago» было правдой.
const ago = (ms: number) => new Date(Date.now() - ms).toISOString();

export const recentActivityMock = [
  {
    id: 1,
    childName: 'Liam',
    avatar: liam,
    action: 'finished homework',
    at: ago(2 * MINUTE),
    status: 'pending',
    reward: 10,
  },
  {
    id: 2,
    childName: 'Emma',
    avatar: emma,
    action: 'cleaned her room',
    at: ago(HOUR),
    status: 'approved',
    reward: 5,
  },
  {
    id: 3,
    childName: 'Liam',
    avatar: liam,
    action: 'walked the dog',
    at: ago(DAY),
    status: 'approved',
    reward: 3,
  },
  {
    id: 4,
    childName: 'Emma',
    avatar: emma,
    action: 'watered the plants',
    at: ago(2 * DAY),
    status: 'approved',
    reward: 2,
  },
] as const;
