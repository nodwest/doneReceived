/** Текущий пользователь — родитель, который вошёл в приложение. */
export const parentMock = {
  id: 101,
  name: 'Sarah',
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
  avatar: require('./images/avatar-george.png'),
};
