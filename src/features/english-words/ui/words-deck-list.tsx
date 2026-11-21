import { memo, useCallback, useRef, useState } from 'react';
import { FlatList, Platform, Pressable, Text, View } from 'react-native';
import {
  SpeakButton,
  WORDS,
  WORDS_TOTAL,
  type Word,
  type WordsRange,
} from '@entities/word';
import { useTranslation } from '@shared/i18n';
import { WordViewer } from './word-viewer';
import { styles } from './words.styled';

/** Высота строки и промежуток под ней: у всех строк одинаковые. */
const ROW_HEIGHT = 60;
const ROW_GAP = 8;
const ITEM_HEIGHT = ROW_HEIGHT + ROW_GAP;

type WordsDeckListProps = {
  /** С какого слова открыть список: оно первое на экране. */
  start: number;
  /** Сегодняшние слова — выделены. */
  today: WordsRange | null;
};

const getItemLayout = (_: unknown, index: number) => ({
  length: ITEM_HEIGHT,
  offset: ITEM_HEIGHT * index,
  index,
});

/**
 * Весь словарь одним списком (виртуальным: на экране — только видимые
 * строки). Открывается на сегодняшних словах, вверх — до первого слова,
 * вниз — до последнего. Тап — карточка слова поверх списка; закрыли — список
 * стоит на слове, до которого долистали: оно первое сверху.
 */
export function WordsDeckList({ start, today }: WordsDeckListProps) {
  const listRef = useRef<FlatList<Word>>(null);
  const [open, setOpen] = useState<number | null>(null);
  // Последнее просмотренное слово обведено: видно, где остановились.
  const [selected, setSelected] = useState<number | null>(null);

  // Пока листают карточки, список под ними идёт следом: открытое слово —
  // первое сверху. Ставим точным смещением (строки одной высоты), а не
  // scrollToIndex: тот при листании назад оставлял слово внизу экрана.
  const toTop = useCallback((rank: number) => {
    listRef.current?.scrollToOffset({
      offset: (rank - 1) * ITEM_HEIGHT,
      animated: false,
    });
  }, []);
  const follow = useCallback(
    (rank: number) => {
      setSelected(rank);
      toTop(rank);
    },
    [toTop],
  );
  // В вебе модалка, закрываясь, возвращает фокус на строку, по которой
  // открыли, и браузер докручивает список к ней (при листании назад слово
  // оказывалось внизу). Поэтому фокус снимаем до открытия.
  const openWord = useCallback((rank: number) => {
    if (Platform.OS === 'web') {
      (document.activeElement as HTMLElement | null)?.blur();
    }
    setOpen(rank);
  }, []);
  // Закрыли — ещё раз на то же место и после того, как модалка ушла: список
  // уже там, ничего не прыгает.
  const close = useCallback(
    (rank: number) => {
      setOpen(null);
      toTop(rank);
      requestAnimationFrame(() => toTop(rank));
    },
    [toTop],
  );

  const renderItem = useCallback(
    ({ item }: { item: Word }) => (
      <DeckRow
        word={item}
        today={
          today !== null && item.rank >= today.from && item.rank <= today.to
        }
        selected={item.rank === selected}
        onOpen={openWord}
      />
    ),
    [today, selected, openWord],
  );

  return (
    <>
      <FlatList
        ref={listRef}
        style={styles.deckList}
        contentContainerStyle={styles.deckListBody}
        data={WORDS}
        keyExtractor={(word) => String(word.rank)}
        renderItem={renderItem}
        extraData={selected}
        getItemLayout={getItemLayout}
        initialScrollIndex={Math.min(Math.max(start - 1, 0), WORDS_TOTAL - 1)}
        initialNumToRender={14}
        maxToRenderPerBatch={20}
        windowSize={9}
        showsVerticalScrollIndicator={false}
      />
      <WordViewer rank={open} onChange={follow} onClose={close} />
    </>
  );
}

const DeckRow = memo(function DeckRow({
  word,
  today,
  selected,
  onOpen,
}: {
  word: Word;
  today: boolean;
  selected: boolean;
  onOpen: (rank: number) => void;
}) {
  const { t } = useTranslation();
  return (
    <View style={styles.deckItem}>
      {/* Нажимается текст, динамик — рядом, а не внутри: в вебе кнопка в
          кнопке недопустима. */}
      <View
        style={[
          styles.wordRow,
          styles.deckRow,
          today && styles.deckRowToday,
          selected && styles.deckRowSelected,
        ]}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('words.viewer.open', {
            word: word.word,
            translation: word.translation,
          })}
          onPress={() => onOpen(word.rank)}
          style={({ pressed }) => [
            styles.deckRowPress,
            pressed && styles.deckRowPressed,
          ]}
        >
          <Text style={[styles.wordRowRank, today && styles.deckRowTodayRank]}>
            {t('words.rank', { rank: word.rank })}
          </Text>
          <View style={styles.wordRowText}>
            <Text style={styles.wordRowWord} numberOfLines={1}>
              {word.word}
            </Text>
            <Text style={styles.wordRowTranslation} numberOfLines={1}>
              {word.translation}
            </Text>
          </View>
        </Pressable>
        <SpeakButton
          size="sm"
          text={word.word}
          accessibilityLabel={t('words.sayWord', { word: word.word })}
        />
      </View>
    </View>
  );
});
