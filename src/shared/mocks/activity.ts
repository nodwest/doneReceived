const emma = require('./images/avatar-emma.jpg');
const liam = require('./images/avatar-liam.jpg');

export const recentActivityMock = [
  {
    id: 1,
    childName: 'Liam',
    avatar: liam,
    action: 'finished homework',
    timeAgo: '2 min ago',
    status: 'pending',
    reward: 10,
  },
  {
    id: 2,
    childName: 'Emma',
    avatar: emma,
    action: 'cleaned her room',
    timeAgo: '1 hr ago',
    status: 'approved',
    reward: 5,
  },
  {
    id: 3,
    childName: 'Liam',
    avatar: liam,
    action: 'walked the dog',
    timeAgo: 'Yesterday',
    status: 'approved',
    reward: 3,
  },
  {
    id: 4,
    childName: 'Emma',
    avatar: emma,
    action: 'watered the plants',
    timeAgo: '2 days ago',
    status: 'approved',
    reward: 2,
  },
] as const;
