import {View, ViewStyle} from 'react-native';
import React from 'react';
import {StyleSheet} from '../theme';
import HeaderButton, {IconButton} from './HeaderButton';
import ThemeText from '../components/text';

export type ScreenHeaderProps = {
  leftButton?: IconButton;
  rightButton?: IconButton;
  title: React.ReactNode;
  style?: ViewStyle;
};

const ScreenHeader: React.FC<ScreenHeaderProps> = ({
  leftButton,
  rightButton,
  title,
  style,
}) => {
  const css = useHeaderStyle();

  const leftIcon = leftButton ? <HeaderButton {...leftButton} /> : <View />;
  const rightIcon = rightButton ? <HeaderButton {...rightButton} /> : <View />;

  return (
    <View style={[css.container, style]}>
      <View accessible={true} accessibilityRole="header">
        <ThemeText type="paragraphHeadline">{title}</ThemeText>
      </View>
      <View style={css.iconContainerLeft}>{leftIcon}</View>
      <View style={css.iconContainerRight}>{rightIcon}</View>
    </View>
  );
};
export default ScreenHeader;
const useHeaderStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacings.medium,
  },
  iconContainerLeft: {
    position: 'absolute',
    left: theme.spacings.medium,
  },
  iconContainerRight: {
    position: 'absolute',
    right: theme.spacings.medium,
  },
}));
