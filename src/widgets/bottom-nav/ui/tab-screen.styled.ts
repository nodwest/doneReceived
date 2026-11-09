import { StyleSheet } from 'react-native';
import { theme } from '@shared/theme';

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: theme.colors.prime,
  },
  container: {
    flex: 1,
    minHeight: 0,
    width: '100%',
    maxWidth: 480,
    alignSelf: 'center',
  },
  containerWide: {
    maxWidth: '100%',
  },
  // minHeight 0: в вебе иначе блок растёт под содержимое, и экраны с
  // карточками во всю высоту уезжали бы за край.
  content: {
    flex: 1,
    minHeight: 0,
  },
});
