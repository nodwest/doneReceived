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
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#93c5fd',
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
  title: {
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
    color: '#0A0A0A',
  },
  description: {
    fontSize: 14,
    lineHeight: 14,
    fontWeight: '500',
    color: '#9CA3AF',
  },
  textDescription: {
    color: '#8d90e7',
  },
});
