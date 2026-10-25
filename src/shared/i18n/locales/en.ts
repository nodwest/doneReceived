/**
 * Английский словарь — основной: по нему строится тип `Dictionary`, и в
 * русском словаре TypeScript требует те же ключи. Разделы — по экранам и
 * виджетам, `common` — общие слова. Множественное число — суффиксы `_one` /
 * `_other` (в русском ещё `_few` / `_many`), в `t()` ключ без суффикса и
 * `{ count }`.
 */
export const en = {
  common: {
    close: 'Close',
    back: 'Back',
    cancel: 'Cancel',
    done: 'Done',
    seeAll: 'See all',
    optional: '(optional)',
  },
  nav: {
    home: 'Home',
    tasks: 'Tasks',
    family: 'Family',
    wallet: 'Wallet',
    map: 'Map',
    profile: 'Profile',
  },
  time: {
    justNow: 'just now',
    minutesAgo: '{{count}} min ago',
    hoursAgo: '{{count}} h ago',
    daysAgo: '{{count}} d ago',
    today: 'Today',
    tomorrow: 'Tomorrow',
    yesterday: 'Yesterday',
    todayInPhrase: 'today',
    tomorrowInPhrase: 'tomorrow',
    yesterdayInPhrase: 'yesterday',
    countdownDays: '{{days}}d {{hours}}h',
    dayAndTime: '{{day}}, {{time}}',
  },
  copyableCode: {
    copied: 'Code copied',
    copy: 'Copy code {{code}}',
  },
  password: {
    show: 'Show password',
    hide: 'Hide password',
  },
  home: {
    greetingMorning: 'Good morning 👋',
    greetingAfternoon: 'Good afternoon 👋',
    greetingEvening: 'Good evening 👋',
    recentActivity: 'Recent Activity',
  },
  summary: {
    rewardsPaid: 'Rewards paid',
    balance: 'Balance',
    activeTasks: 'Active tasks',
    tasksToReview: 'Tasks to Review',
  },
  activity: {
    pending: 'Pending review',
    approved: 'Approved',
  },
  childCard: {
    activeTasks_one: 'active task',
    activeTasks_other: 'active tasks',
    tasksToReview_one: 'task to review',
    tasksToReview_other: 'tasks to review',
    activeTasksA11y: '{{name}}: {{count}} active tasks',
    tasksToReviewA11y: '{{name}}: {{count}} tasks to review',
  },
  member: {
    you: 'You',
    active_one: 'active',
    active_other: 'active',
    toReview: 'to review',
  },
  presence: {
    atHome: 'At home',
    away: 'Away',
    home: 'Home',
  },
  family: {
    title: 'Family',
    parents_one: '{{count}} parent',
    parents_other: '{{count}} parents',
    children_one: '{{count}} child',
    children_other: '{{count}} children',
    parentsSection: 'Parents',
    childrenSection: 'Children',
    addMember: 'Family member',
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
  memberProfile: {
    paid: 'Paid',
    notPaid: 'Not paid',
    recentRewards: 'Recent rewards',
    noRewards: 'No rewards yet',
    location: 'Location',
    openMap: 'Open map',
  },
  period: {
    label: 'Summary for',
    today: 'Today',
    week: 'Past week',
    month: 'Past month',
    year: 'Past year',
    all: 'All time',
  },
  map: {
    webOnly: 'The map is available in the web version',
  },
  wallet: {
    title: 'Operations history',
    all: 'All',
    earned: 'Earned',
    missed: 'Missed',
    noRewardsThisDay: 'No rewards this day',
  },
  tasks: {
    allTasks: 'All tasks',
    reviewTasks: 'Review Tasks',
    review: 'Review',
    active: 'Active',
    showAsList: 'Show as list',
    showAsCards: 'Show as cards',
    ownerTasks: "{{name}}'s tasks",
    emptyAll: 'No tasks yet',
    emptyReview: 'No tasks to review',
    ownerEmptyAll: '{{name}} has no tasks yet',
    ownerEmptyReview: '{{name}} has no tasks to review',
    ownerNoActive: '{{name}} has no active tasks',
    cancelTask: 'Cancel task',
    edit: 'Edit',
    approvedToast: 'Task approved',
    rejectedToast: 'Task rejected',
    cancelledToast: 'Task cancelled',
    doneAgo: 'Done {{ago}}',
  },
  taskCard: {
    endsIn: 'Ends in',
    created: 'Created {{day}} · {{time}}',
    status: 'Status',
    due: 'Due',
    noDeadline: 'No deadline',
    stub: 'Placeholder. We will come up with this feature later',
    markedDone: 'Marked done',
    markedDoneAgo: 'Marked done · {{ago}}',
    photoReport: 'Photo report',
    reward: 'Reward',
    penalty: 'Penalty',
    titlePlaceholder: 'Task title',
    descriptionPlaceholder: 'Task description',
  },
  createTask: {
    createTitle: 'Create Task',
    editTitle: 'Edit Task',
    createdToast: 'Task created',
    updatedToast: 'Task updated',
    create: 'Create Task',
    save: 'Save changes',
    taskTitle: 'Task Title',
    taskTitlePlaceholder: 'Clean your room',
    description: 'Description',
    descriptionPlaceholder:
      'Make the bed, put toys away, and vacuum the floor.',
    assignTo: 'Assign to',
    reward: 'Reward Amount',
    timeToComplete: 'Time to complete',
    expires: 'Task expires:',
    changeDeadline: 'Change deadline',
    deadlineError: 'Pick a time at least 1 minute from now',
    deadline: {
      none: 'No deadline',
      in1h: '1 hour',
      in2h: '2 hours',
      today: 'Today',
      tomorrow: 'Tomorrow',
      custom: 'Custom',
    },
  },
  reviewTask: {
    reject: 'Reject',
    approve: 'Approve',
    title: 'Reject task',
    subtitle:
      'Tell {{name}} what to fix. {{name}} will see your reason and can try again.',
    comment: 'Add a comment',
    commentPlaceholder:
      'Show what needs to be fixed, for example "the bed is not made".',
    reasons: {
      'not-done-properly': 'Not done properly',
      'not-finished': 'Not finished',
      other: 'Other',
    },
  },
  auth: {
    email: 'Email',
    password: 'Password',
    fullName: 'Full Name',
    loginTitle: 'Welcome back!',
    loginSubtitle:
      'Log in to keep turning everyday chores into fun rewards for the whole family.',
    logIn: 'Log In',
    noAccount: "Don't have an account yet?",
    signUp: 'Sign up',
    registrationTitle: 'Welcome to Kids Tasks',
    registrationSubtitle:
      'Turn everyday chores into fun rewards for the whole family.',
    createAccount: 'Create Account',
    haveAccount: 'Already have an account?',
  },
  roleSelect: {
    title: "Who's joining?",
    subtitle: 'Are you signing up as a parent or as a child?',
    parent: 'Parent',
    parentDescription:
      'You can create tasks for your children and set up rewards.',
    kid: 'Kid',
    kidDescription: "You can complete your parents' tasks and earn rewards.",
    continue: 'Continue',
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

/** Формы множественного числа, которых нет в английском. */
type ExtraPluralForms = { [key: `${string}_${'few' | 'many'}`]: string };

/** Форма словаря: те же ключи, любые строки, плюс русские формы числа. */
type DeepStrings<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStrings<T[K]>;
} & ExtraPluralForms;

export type Dictionary = DeepStrings<typeof en>;
