import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  content: {
    gap: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#8d90e7',
  },
  reward: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'space-between',
  },
  textDescription: {
    color: '#8d90e7',
  },
});
