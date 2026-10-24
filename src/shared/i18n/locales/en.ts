/**
 * Английский словарь — основной: по нему строится тип `Dictionary`, и в
 * русском словаре TypeScript требует те же ключи. Разделы — по экранам и
 * виджетам, `common` — общие слова.
 */
export const en = {
  common: {
    close: 'Close',
  },
  copyableCode: {
    copied: 'Code copied',
    copy: 'Copy code {{code}}',
  },
  inviteCodes: {
    title: 'Add family member',
    hint: 'Share a code with the new member. They enter it when signing up — and join your family right away.',
    parent: {
      title: 'For a parent',
      hint: 'Can create tasks, approve them and pay rewards.',
    },
    child: {
      title: 'For a child',
      hint: 'Sees own tasks, marks them done and earns rewards.',
    },
  },
  profile: {
    title: 'Profile',
    editProfile: 'Edit profile',
    notifications: 'Notifications',
    familyCodes: 'Family codes',
    language: 'Language',
    help: 'Help & support',
    logOut: 'Log out',
  },
};

/** Форма словаря: те же ключи, любые строки. */
type DeepStrings<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]>;
};

export type Dictionary = DeepStrings<typeof en>;
