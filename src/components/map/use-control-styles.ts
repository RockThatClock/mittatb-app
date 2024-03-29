import {useMemo} from 'react';
import {ViewStyle} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useTheme} from '../../theme';

export function useControlPositionsStyle() {
  const {top, bottom} = useSafeAreaInsets();
  const {theme} = useTheme();

  return useMemo<{[key: string]: ViewStyle}>(
    () => ({
      backArrowContainer: {
        position: 'absolute',
        top: top + theme.spacings.medium,
        left: theme.spacings.medium,
      },
      positionArrowContainer: {
        position: 'absolute',
        top: top + theme.spacings.medium,
        right: theme.spacings.medium,
      },
      controlsContainer: {
        position: 'absolute',
        bottom: bottom + theme.spacings.medium,
        right: theme.spacings.medium,
      },
      locationContainer: {
        position: 'absolute',
        top: top + theme.spacings.medium + 28 + theme.spacings.medium,
        paddingHorizontal: theme.spacings.medium,
        width: '100%',
      },
    }),
    [bottom, top],
  );
}
