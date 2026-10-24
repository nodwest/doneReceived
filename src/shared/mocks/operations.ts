import { childrenMock } from './children';
import { coParentMock, parentMock } from './parent';

const [emma, liam] = childrenMock;

// [дней назад, время, ребёнок, вид, сумма, задача]. earned — награда
// начислена, missed — задача не выполнена в срок и награда упущена.
// Сегодня и четыре дня до него повторяют столбики из макета.
const rows = [
  [0, '18:12', emma, 'earned', 4, 'Clean your room'],
  [0, '16:40', liam, 'earned', 3, 'Walk the dog'],
  [0, '11:05', emma, 'earned', 2, 'Water the plants'],
  [0, '09:20', liam, 'earned', 1, 'Take out the trash'],
  [0, '08:30', liam, 'missed', 5, 'Finish homework'],

  [1, '19:30', liam, 'earned', 3, 'Feed the cat'],
  [1, '08:15', emma, 'earned', 2, 'Make the bed'],
  [1, '20:00', liam, 'missed', 6, 'Finish homework'],
  [1, '17:00', emma, 'missed', 4, 'Practice piano'],

  [2, '20:10', liam, 'earned', 5, 'Wash the dishes'],
  [2, '18:45', emma, 'earned', 4, 'Read a book'],
  [2, '10:30', emma, 'earned', 3, 'Tidy the toys'],

  [3, '17:20', emma, 'earned', 5, 'Clean your room'],
  [3, '15:05', liam, 'earned', 3, 'Walk the dog'],
  [3, '21:00', liam, 'missed', 4, 'Take out the trash'],

  [4, '16:15', emma, 'earned', 3, 'Practice piano'],
  [4, '12:40', liam, 'earned', 4, 'Help with groceries'],
  [4, '08:05', liam, 'earned', 2, 'Make the bed'],
  [4, '19:00', emma, 'missed', 3, 'Water the plants'],

  [5, '18:30', emma, 'earned', 5, 'Finish homework'],
  [5, '07:50', liam, 'earned', 2, 'Feed the cat'],
  [5, '21:00', liam, 'missed', 5, 'Wash the dishes'],

  [6, '08:20', emma, 'earned', 3, 'Make the bed'],
  [6, '20:00', emma, 'missed', 4, 'Read a book'],
  [6, '18:00', liam, 'missed', 5, 'Clean your room'],

  [7, '19:10', liam, 'earned', 3, 'Take out the trash'],
  [7, '16:00', emma, 'earned', 3, 'Walk the dog'],
  [7, '20:00', liam, 'missed', 6, 'Finish homework'],

  [8, '17:45', liam, 'earned', 5, 'Clean your room'],
  [8, '11:30', emma, 'earned', 6, 'Help with groceries'],
  [8, '09:10', emma, 'earned', 4, 'Water the plants'],
  [8, '08:00', liam, 'missed', 3, 'Feed the cat'],

  [9, '18:00', liam, 'earned', 4, 'Tidy the toys'],
  [9, '09:00', emma, 'missed', 2, 'Make the bed'],

  [10, '20:30', liam, 'earned', 3, 'Wash the dishes'],
  [10, '19:20', emma, 'earned', 3, 'Read a book'],

  [11, '07:40', emma, 'earned', 2, 'Feed the cat'],
  [11, '17:00', liam, 'missed', 4, 'Practice piano'],

  [12, '18:10', liam, 'earned', 5, 'Finish homework'],
  [12, '15:30', emma, 'earned', 3, 'Walk the dog'],
  [12, '09:00', liam, 'missed', 1, 'Make the bed'],

  [13, '16:50', emma, 'earned', 5, 'Clean your room'],
  [13, '21:00', liam, 'missed', 3, 'Take out the trash'],
] as const;

/**
 * История операций за две недели; даты считаются от сегодняшнего дня.
 * parentId — кто из родителей создал задачу: каждая третья — George.
 */
export const operationsMock = rows.map(
  ([daysAgo, time, child, kind, amount, title], index) => ({
    id: index + 1,
    parentId: index % 3 === 2 ? coParentMock.id : parentMock.id,
    daysAgo,
    time,
    child,
    kind,
    amount,
    title,
  }),
);
