import React from 'react';
import {
  AccessibilityProps,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import {Edit} from '../../assets/svg/icons/actions';
import {FavoriteIcon} from '../../favorites';
import {LocationFavorite} from '../../favorites/types';
import {StyleSheet} from '../../theme';
import {screenReaderPause} from '../accessible-text';
import ThemeText from '../text';
import ThemeIcon from '../theme-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

type BaseProps = {
  favorite: LocationFavorite;
  icon?: JSX.Element;
};
type WithOnPress = BaseProps & {
  onPress(favorite: LocationFavorite, event: GestureResponderEvent): void;
  accessibility?: AccessibilityProps;
};

export type FavoriteItemProps = SectionItem<BaseProps | WithOnPress>;
export default function FavoriteItem(props: FavoriteItemProps) {
  if (!withOnPress(props)) {
    return <FavoriteItemContent {...props} />;
  }
  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={props.favorite.location.label + screenReaderPause}
      accessibilityRole="button"
      onPress={(e) => props.onPress(props.favorite, e)}
      {...props.accessibility}
    >
      <FavoriteItemContent {...props} />
    </TouchableOpacity>
  );
}

function withOnPress(a: any): a is WithOnPress {
  return 'onPress' in a;
}

function FavoriteItemContent({favorite, icon, ...props}: BaseProps) {
  const {contentContainer, topContainer} = useSectionItem(props);
  const style = useSectionStyle();

  return (
    <View style={[style.baseItem, style.spaceBetween, topContainer]}>
      <View style={favoriteStyle.favorite__emoji}>
        <FavoriteIcon favorite={favorite} />
      </View>
      <View style={contentContainer}>
        <ThemeText>{favorite.name ?? favorite.location.name}</ThemeText>
      </View>
      {icon ?? <ThemeIcon svg={Edit} />}
    </View>
  );
}

const favoriteStyle = StyleSheet.create({
  favorite__emoji: {
    minWidth: 30,
  },
});