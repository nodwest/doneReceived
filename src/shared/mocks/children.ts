// role — роль в семье (FamilyRole): от неё зависят вид приложения и что
// человеку можно делать.
export const childrenMock = [
  {
    id: 1,
    name: 'Emma',
    role: 'child' as const,
    avatar: require('./images/avatar-emma.jpg'),
  },
  {
    id: 2,
    name: 'Liam',
    role: 'child' as const,
    avatar: require('./images/avatar-liam.jpg'),
  },
];

/** Ребёнок, от лица которого смотрим приложение во временном режиме ребёнка. */
export const childAccountMock = {
  ...childrenMock[0],
  fullName: 'Emma Miller',
  email: 'emma.miller@mail.com',
};
