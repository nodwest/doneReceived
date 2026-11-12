import { useRef, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { CHECKLIST_ITEM_MAX_LENGTH, CHECKLIST_MAX_ITEMS } from '@entities/task';
import { useTranslation } from '@shared/i18n';
import { theme } from '@shared/theme';
import { Label, SortableList } from '@shared/ui';
import { useCreateTaskStore } from '../model/create-task-store';
import {
  ChecklistHintIcon,
  ChecklistPlusIcon,
  StepHandleIcon,
  StepRemoveIcon,
} from './checklist-icons';
import { styles as formStyles } from './create-task-form.styled';
import { styles } from './checklist-field.styled';

type ChecklistFieldProps = {
  /** Имя выбранного ребёнка для подсказок; null — ребёнок не выбран. */
  childName: string | null;
  /** Шаг тянут за ручку: форма выключает прокрутку. */
  onDragActiveChange: (active: boolean) => void;
};

/**
 * Чеклист задания. Пока шагов нет — пунктирная кнопка Add checklist; после
 * неё — список шагов (правятся на месте, тянутся за ручку, убираются
 * крестиком) и строка нового шага: Enter добавляет шаг и сразу ждёт
 * следующий, Add step снова открывает её.
 */
export function ChecklistField({
  childName,
  onDragActiveChange,
}: ChecklistFieldProps) {
  const { t } = useTranslation();
  const steps = useCreateTaskStore((state) => state.checklist);
  const draft = useCreateTaskStore((state) => state.checklistDraft);
  const setDraft = useCreateTaskStore((state) => state.setChecklistDraft);
  const commitDraft = useCreateTaskStore((state) => state.commitChecklistDraft);
  const rename = useCreateTaskStore((state) => state.renameChecklistStep);
  const remove = useCreateTaskStore((state) => state.removeChecklistStep);
  const move = useCreateTaskStore((state) => state.moveChecklistStep);
  // Строка нового шага открыта: после Add checklist, Add step или Enter.
  const [drafting, setDrafting] = useState(false);
  const draftRef = useRef<TextInput>(null);

  const full = steps.length >= CHECKLIST_MAX_ITEMS;
  const named = childName !== null;

  if (steps.length === 0 && !drafting) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => setDrafting(true)}
        style={({ pressed }) => [styles.addButton, pressed && styles.pressed]}
      >
        <ChecklistPlusIcon size={28} />
        <View style={styles.addText}>
          <Text style={styles.addTitle} numberOfLines={1}>
            {t('createTask.checklist.add')}
          </Text>
          <Text style={styles.addSubtitle}>
            {named
              ? t('createTask.checklist.addHint', { name: childName })
              : t('createTask.checklist.addHintAnyone')}
          </Text>
        </View>
      </Pressable>
    );
  }

  // Enter: шаг добавлен — строка остаётся для следующего; пустая — закрыть.
  const submitDraft = () => {
    if (!commitDraft()) {
      setDrafting(false);
      draftRef.current?.blur();
    }
  };

  // Ушли из строки: набранное не теряем, пустая строка закрывается.
  const leaveDraft = () => {
    commitDraft();
    setDrafting(false);
  };

  // Строка уже открыта — фокус в неё, иначе она откроется с autoFocus.
  const openDraft = () => {
    setDrafting(true);
    draftRef.current?.focus();
  };

  return (
    <View style={styles.field}>
      <View style={styles.labelRow}>
        <View style={formStyles.labelRow}>
          <Label style={formStyles.label}>
            {t('createTask.checklist.title')}
          </Label>
          <Text style={formStyles.optional}>{t('common.optional')}</Text>
        </View>
        {steps.length > 0 && (
          <Text style={styles.count}>
            {t('createTask.checklist.steps', { count: steps.length })}
          </Text>
        )}
      </View>

      <View style={styles.editor}>
        <SortableList
          data={steps}
          keyExtractor={(step) => step.key}
          onReorder={move}
          onDragActiveChange={onDragActiveChange}
          renderItem={({ item, index, dragHandleProps, dragging }) => (
            <View style={[styles.step, dragging && styles.stepLifted]}>
              <View
                {...dragHandleProps}
                accessibilityLabel={t('createTask.checklist.dragHandle')}
                style={styles.handle}
              >
                <StepHandleIcon />
              </View>
              <View style={styles.checkbox} />
              <TextInput
                value={item.title}
                onChangeText={(title) => rename(item.key, title)}
                // Стёрли шаг целиком — он пропадает.
                onBlur={() => {
                  if (!item.title.trim()) remove(item.key);
                }}
                onSubmitEditing={openDraft}
                submitBehavior="blurAndSubmit"
                returnKeyType="next"
                maxLength={CHECKLIST_ITEM_MAX_LENGTH}
                accessibilityLabel={t('createTask.checklist.stepLabel', {
                  number: index + 1,
                })}
                style={styles.stepInput}
              />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={t('createTask.checklist.remove', {
                  title: item.title,
                })}
                hitSlop={12}
                onPress={() => remove(item.key)}
                style={({ pressed }) => pressed && styles.pressed}
              >
                <StepRemoveIcon />
              </Pressable>
            </View>
          )}
        />

        {drafting && !full && (
          <View style={[styles.step, styles.stepDraft]}>
            <View style={styles.handle} />
            <View style={[styles.checkbox, styles.checkboxDraft]} />
            <TextInput
              ref={draftRef}
              autoFocus
              value={draft}
              onChangeText={setDraft}
              onSubmitEditing={submitDraft}
              onBlur={leaveDraft}
              submitBehavior="submit"
              returnKeyType="next"
              maxLength={CHECKLIST_ITEM_MAX_LENGTH}
              placeholder={t('createTask.checklist.newStep')}
              placeholderTextColor={theme.colors.placeholder}
              accessibilityLabel={t('createTask.checklist.newStep')}
              style={styles.stepInput}
            />
            <Text style={styles.enterHint}>
              {t('createTask.checklist.enterHint')}
            </Text>
          </View>
        )}

        {!full && (
          <Pressable
            accessibilityRole="button"
            onPress={openDraft}
            style={({ pressed }) => [styles.addStep, pressed && styles.pressed]}
          >
            <ChecklistPlusIcon size={20} />
            <Text style={styles.addStepText}>
              {t('createTask.checklist.addStep')}
            </Text>
          </Pressable>
        )}
      </View>

      <View style={styles.hint}>
        <ChecklistHintIcon />
        <Text style={styles.hintText}>
          {named
            ? t('createTask.checklist.hint', { name: childName })
            : t('createTask.checklist.hintAnyone')}
        </Text>
      </View>
    </View>
  );
}
