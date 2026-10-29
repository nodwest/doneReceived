export const childrenMock = [
  { id: 1, name: 'Emma', avatar: require('./images/avatar-emma.jpg') },
  { id: 2, name: 'Liam', avatar: require('./images/avatar-liam.jpg') },
];

/** Ребёнок, от лица которого смотрим приложение во временном режиме ребёнка. */
export const childAccountMock = {
  ...childrenMock[0],
  fullName: 'Emma Miller',
  email: 'emma.miller@mail.com',
};
