import React from 'react';
import {
  AccessibilityProps,
  GestureResponderEvent,
  TouchableOpacity,
  View,
} from 'react-native';
import {Edit} from '../../assets/svg/icons/actions';
import {FavoriteIcon} from '../../favorites';
import {StoredLocationFavorite} from '../../favorites/types';
import {StyleSheet} from '../../theme';
import {screenReaderPause} from '../accessible-text';
import ThemeText from '../text';
import ThemeIcon from '../theme-icon';
import {SectionItem, useSectionItem, useSectionStyle} from './section-utils';

type BaseProps = {
  favorite: StoredLocationFavorite;
  icon?: JSX.Element;
};
type WithOnPress = BaseProps & {
  onPress(favorite: StoredLocationFavorite, event: GestureResponderEvent): void;
  accessibility?: AccessibilityProps;
};

export type FavoriteItemProps = SectionItem<BaseProps | WithOnPress>;
export default function FavoriteItem(props: FavoriteItemProps) {
  if (!withOnPress(props)) {
    return <FavoriteItemContent {...props} />;
  }
  const favorite = props.favorite;
  const a11yLabel =
    favorite.name && favorite.name !== favorite.location.name
      ? `${favorite.name}, ${favorite.location.name}`
      : favorite.location.name;
  return (
    <TouchableOpacity
      accessible
      accessibilityLabel={a11yLabel + screenReaderPause}
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
    <View style={[style.spaceBetween, topContainer]}>
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
