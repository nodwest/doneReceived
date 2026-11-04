/** Текущий пользователь — родитель, который вошёл в приложение. */
export const parentMock = {
  id: 101,
  name: 'Sarah',
  // Роль в семье (FamilyRole): от неё зависят вид приложения и возможности.
  role: 'parent' as const,
  fullName: 'Sarah Miller',
  email: 'sarah.miller@mail.com',
  avatar: require('./images/avatar-sarah.jpg'),
};

/** Настройки вошедшего родителя на вкладке Profile. */
export const profileSettingsMock = {
  notifications: true,
};

/** Второй родитель в семье. */
export const coParentMock = {
  id: 102,
  name: 'George',
  role: 'parent' as const,
  avatar: require('./images/avatar-george.png'),
};
