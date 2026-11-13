export const theme = {
  colors: {
    prime: '#F5F6FA',
    violet: '#6C5CE7',
    blue: '#4A90E2',
    yellow: '#FFB930',
    grey: '#8A8FA3',
    ink: '#1A1A2E',
    // Просмотр фото на весь экран: почти чёрный фон и полупрозрачные кнопки на нём.
    viewerBg: '#0B0C12',
    viewerChrome: 'rgba(255, 255, 255, 0.14)',
    // Затемнение вокруг круга при обрезке аватарки.
    viewerScrim: 'rgba(11, 12, 18, 0.62)',
    success: '#2ECC71',
    white: '#FFFFFF',
    line: '#ECEDF3',
    placeholder: '#CDD0DB',
    yellowSoft: '#FFF7E6',
    // Подсветка «на проверке»: плитка Tasks to Review и запись Pending review.
    reviewFrom: '#FFF3D1',
    reviewTo: '#FFE2C4',
    reviewAccent: '#E67E00',
    reviewChip: '#FFE9CC',
    reviewChipText: '#B8650A',
    reviewBorder: '#F8CC94',
    // Значок задания без фото в строке «на проверке»: спокойный янтарный.
    reviewIconSoft: '#E0A23A',
    // Подтверждённая запись активности.
    approvedFrom: '#E0F8E7',
    approvedTo: '#C5EFD5',
    approvedBorder: '#AFDDC0',
    // Значок «ребёнок дома» на карточке ребёнка.
    homeFrom: '#FFF4D6',
    homeTo: '#FFE3B3',
    homeBrown: '#B8791A',
    danger: '#ef4444',
    dangerFrom: '#FF7A7A',
    dangerForeground: '#ffffff',
    // Экран заданий: второстепенный текст, обводка аватара, чип Active, текст «на проверке».
    inkSoft: '#55586E',
    violetSoft: '#EEEBFF',
    violetChip: '#EFEDFC',
    reviewText: '#B26A00',
    // Заглушка фото-отчёта, когда ребёнок не приложил снимок.
    photoFrom: '#EFEAE0',
    photoTo: '#DCD3C8',
    // История операций: заработано (зелёный) и упущено (синий). Грани
    // 3D-столбиков: лицевая, боковая (тёмная) и верхняя (светлая).
    earned: '#2EB873',
    earnedDark: '#1A854F',
    earnedLight: '#80E0A8',
    earnedInk: '#0D6638',
    earnedLabel: '#084524',
    earnedSoft: 'rgba(46, 184, 115, 0.16)',
    rewardText: '#1F995C',
    rewardSoft: 'rgba(46, 184, 115, 0.14)',
    missed: '#61A3ED',
    missedDark: '#3875C2',
    missedLight: '#A3D1FA',
    missedInk: '#1F52A8',
    missedLabel: '#123380',
    missedSoft: 'rgba(97, 163, 237, 0.16)',
    // Будущие дни на графике: серый кубик-заглушка.
    future: '#E1E3EC',
    futureDark: '#CDD0DB',
    futureLight: '#EEEFF4',
    // Заглушка карты там, где карты нет (нативные платформы).
    mapPlaceholder: '#EFEAE0',
    // Роли в семье: родитель (тёмно-синий) и ребёнок (голубой) — иконки,
    // блоки кодов и карточки участников на вкладке Family.
    parentFrom: '#17215E',
    parentTo: '#4254AD',
    childFrom: '#4A9EF0',
    childTo: '#A8D9FF',
    // Экраны ребёнка: конец голубого градиента (шапка профиля, плитка
    // баланса, кнопка I did it!) и лёгкая голубая подложка (плитка
    // вишлиста, новое задание в ленте, чип Active).
    childDeep: '#1E5FB8',
    childTint: 'rgba(74, 158, 240, 0.16)',
    childTintLight: 'rgba(168, 217, 255, 0.09)',
    childTintBorder: 'rgba(74, 158, 240, 0.18)',
    childChip: 'rgba(74, 158, 240, 0.14)',
    // Вишлист: желание, которое уже можно купить (зелёное), наполняемое
    // (голубое) и ждущее очереди (индиго, как parentTo). readySoft /
    // readyText — и чип «1 ready to buy».
    // Деньги родителя: резерв за задания и свободные — шкала в форме задания
    // (на светлом) и в карточке баланса Wallet (на тёмном).
    fundsReserved: '#B9BDD3',
    fundsFree: '#22A06B',
    fundsReservedDark: 'rgba(255, 255, 255, 0.45)',
    fundsFreeDark: '#4ADE9A',
    fundsTrackDark: 'rgba(255, 255, 255, 0.14)',
    readySoft: '#E3F7EB',
    readyText: '#1E9A5C',
    readyBg: '#F1FBF5',
    readyBorder: 'rgba(46, 184, 115, 0.5)',
    readyIconBg: 'rgba(30, 154, 92, 0.14)',
    currentBg: '#F2F8FF',
    queueBg: '#ECEFF9',
    queueText: '#4254AD',
    queueBorder: 'rgba(66, 84, 173, 0.35)',
    queueSoft: 'rgba(66, 84, 173, 0.12)',
    queueIconBg: 'rgba(66, 84, 173, 0.14)',
    // Удаление: кнопка Delete у смахнутой строки и Delete wish в шторке.
    dangerAction: '#FF5A5F',
    dangerSoft: 'rgba(255, 90, 95, 0.1)',
    dangerText: '#E5484D',
    // Фон поля с ошибкой: код ребёнка истёк или неверен.
    dangerTint: '#FFF5F5',
    // Формы в шторках: подсказка в пустом поле, фон кнопки закрытия,
    // ручка перетаскивания строки.
    placeholderSoft: '#A9ADBD',
    closeBg: '#F1F2F7',
    dragHandle: '#B4B8C6',
    // Чеклист в форме задания: пунктир кнопки Add checklist, подложка
    // плюса, строка нового шага и его пунктирный квадратик, ручка шага.
    checklistBorder: '#D9D4FB',
    checklistPlusBg: '#EFEDFD',
    checklistDraftBg: '#F6F4FF',
    checklistHandle: '#C3C6D3',
    // Чеклист в карточке задания: рамка списка и черта между шагами.
    checklistLine: '#E4E7EF',
    // Комментарий ребёнка в карточке на проверке: тёплый пузырь.
    noteReviewBg: '#FFF6E8',
    // Вкладка Profile: почта в шапке и подложка иконок пунктов меню.
    heroSubtle: '#D9E0FF',
    violetIcon: '#EDE8FC',

    // Карточки заданий (v3): градиенты шапки — активное задание (голубой,
    // у родителя и ребёнка), на проверке (оранжевый); плашка награды, плитки
    // срока и выдачи, таймер (тёплый — меньше суток, холодный — дольше).
    heroChildFrom: '#5AAEF5',
    heroPaidFrom: '#3FCF86',
    heroWalletFrom: '#4F62BF',
    // Блок подробностей в карточке транзакции.
    detailsBg: '#F7F8FB',
    heroReviewFrom: '#FFD98C',
    heroReviewTo: '#FFB24A',
    heroReviewCaption: '#9A5200',
    reviewDot: '#F29A1F',
    rewardChipFrom: '#FFF8E1',
    rewardChipTo: '#FFEBB8',
    rewardChipBorder: '#FFD36B',
    dueTile: '#FFF7EA',
    dueInk: '#C76E00',
    givenTile: '#EEF5FE',
    timerWarm: '#FFF3DC',
    timerCool: '#E6F1FD',
    stepperBg: '#F5F3FF',
    dangerBorder: '#FFC9CA',
    // Задание вернули на переделку: коралловый — заметно, но не тревожно,
    // как красный.
    sentBack: '#C24A2A',
    sentBackIcon: '#F2643F',
    sentBackBg: '#FFF2EE',
    sentBackBorder: 'rgba(255, 122, 89, 0.3)',
    sentBackChip: '#FFE0D6',
    sentBackChipText: '#B8441F',
    dropZone: '#F4F9FF',
    galleryBorder: '#D6E6F8',
    cardBorder: '#E6E8F0',
    reviewRowFrom: '#FFFAF0',
    reviewRowTo: '#FFF1DC',
    childCount: '#DCEBFC',
    goalTrack: '#FFE08A',
    goalDot: '#FFC94D',

    background: '#0b1120',
    surface: '#111827',
    surfaceAlt: '#020617',

    text: '#e5e7eb',
    textMuted: '#9ca3af',
    border: '#1f2937',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    '2xl': 32,
  },
  radius: {
    sm: 4,
    md: 8,
    lg: 12,
    full: 999,
  },
  fonts: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
    extrabold: 'Inter_800ExtraBold',
  },
  fontSize: {
    xs: 12,
    inputName: 13,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    h1: 28,
  },
};
