import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {Alert, LayoutAnimation} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ProfileStackParams} from '..';
import * as Sections from '../../../components/sections';
import {useFavorites} from '../../../favorites/FavoritesContext';
import {StoredFavoriteDeparture} from '../../../favorites/types';
import MessageBox from '../../../message-box';
import {RootStackParamList} from '../../../navigation';
import {StyleSheet, Theme} from '../../../theme';
import {FavoriteDeparturesTexts, useTranslation} from '../../../translations';
import BackHeader from '../BackHeader';

export type ProfileScreenNavigationProp = StackNavigationProp<
  ProfileStackParams,
  'FavoriteDepartures'
>;

type FavoriteDeparturesProps = {
  navigation: StackNavigationProp<RootStackParamList>;
};

export default function FavoriteDepartures({
  navigation,
}: FavoriteDeparturesProps) {
  const style = useProfileStyle();
  const {favoriteDepartures, removeFavoriteDeparture} = useFavorites();
  const {t} = useTranslation();

  const onDeletePress = (item: StoredFavoriteDeparture) => {
    Alert.alert(
      t(FavoriteDeparturesTexts.delete.label),
      t(FavoriteDeparturesTexts.delete.confirmWarning),
      [
        {
          text: t(FavoriteDeparturesTexts.delete.cancel),
          style: 'cancel',
        },
        {
          text: t(FavoriteDeparturesTexts.delete.delete),
          style: 'destructive',
          onPress: async () => {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut,
            );
            removeFavoriteDeparture(item.id);
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={style.container} edges={['right', 'top', 'left']}>
      <BackHeader title={t(FavoriteDeparturesTexts.header.title)} />

      <ScrollView>
        {!favoriteDepartures.length && (
          <MessageBox
            containerStyle={style.empty}
            message={t(FavoriteDeparturesTexts.noFavorites)}
            type="info"
          />
        )}

        <Sections.Section withTopPadding withPadding>
          {favoriteDepartures.map((favorite) => (
            <Sections.FavoriteDepartureItem
              key={favorite.id}
              favorite={favorite}
              accessibility={{
                accessibilityHint: t(
                  FavoriteDeparturesTexts.favoriteItemDelete.a11yHint,
                ),
              }}
              onPress={onDeletePress}
            />
          ))}
        </Sections.Section>
      </ScrollView>
    </SafeAreaView>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  empty: {
    margin: theme.spacings.medium,
  },
}));
