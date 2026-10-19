export const recentActivityMock = [
  {
    id: 1,
    childName: 'Liam',
    avatarColor: '#4A90E2',
    action: 'finished homework',
    timeAgo: '2 min ago',
    status: 'pending',
    reward: 10,
  },
  {
    id: 2,
    childName: 'Emma',
    avatarColor: '#6C5CE7',
    action: 'cleaned her room',
    timeAgo: '1 hr ago',
    status: 'approved',
    reward: 5,
  },
  {
    id: 3,
    childName: 'Liam',
    avatarColor: '#4A90E2',
    action: 'walked the dog',
    timeAgo: 'Yesterday',
    status: 'approved',
    reward: 3,
  },
] as const;
