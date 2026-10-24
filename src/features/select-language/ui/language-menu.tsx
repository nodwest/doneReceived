import { LANGUAGES, setLanguage, useLanguage } from '@shared/i18n';
import { SelectMenu, type AnchorRect } from '@shared/ui';

const OPTIONS = LANGUAGES.map(({ code, label }) => ({ value: code, label }));

type LanguageMenuProps = {
  visible: boolean;
  /** Пункт Language, у которого раскрывается меню. */
  anchor: AnchorRect | null;
  onClose: () => void;
};

/** Выпадающий выбор языка: выбор сразу переключает интерфейс. */
export function LanguageMenu({ visible, anchor, onClose }: LanguageMenuProps) {
  const language = useLanguage();
  return (
    <SelectMenu
      visible={visible}
      anchor={anchor}
      options={OPTIONS}
      value={language}
      onSelect={setLanguage}
      onClose={onClose}
      width={180}
    />
  );
}
