import {SafeAreaView} from 'react-native-safe-area-context';
import {View, Text} from 'react-native';
import React from 'react';
import {StyleSheet, Theme} from '../../theme';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
import LogoOutline from '../../assets/svg/LogoOutline';
import {createStackNavigator} from '@react-navigation/stack';
import {useAppState} from '../../AppContext';
import EditIcon from '../../assets/svg/EditIcon';
import EditableListGroup from './EditableListGroup';
import MapPointIcon from '../../assets/svg/MapPointIcon';
import {Location} from '../../favorites/types';

export type PlannerStackParams = {
  Profile: undefined;
};

const Stack = createStackNavigator<PlannerStackParams>();

export default function ProfileScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}

type FavoriteItem = {
  location: Location;
  emoji?: string;
  name?: string;
};

function Profile() {
  const css = useProfileStyle();
  const {userLocations} = useAppState();
  const items = userLocations ?? [];

  return (
    <SafeAreaView style={css.container}>
      <Header>Mitt AtB</Header>

      <ScrollView>
        <EditableListGroup
          title="Mine favorittsteder"
          data={items}
          renderItem={item => <Item item={item} />}
          keyExtractor={item => item.location.id}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    backgroundColor: theme.background.primary,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  text: {
    color: theme.text.primary,
  },
}));

type ItemProps = {
  item: FavoriteItem;
  onEdit?(): void;
};
const Item: React.FC<ItemProps> = ({item, onEdit}) => {
  const css = useItemStyle();

  return (
    <View style={css.item}>
      {item.emoji ? <Text>{item.emoji}</Text> : <MapPointIcon />}
      <Text style={css.text}>{item.name ?? item.location.name}</Text>
      {onEdit && (
        <TouchableOpacity onPress={() => console.log('Hello, bollo')}>
          <EditIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};
const useItemStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  item: {
    flexDirection: 'row',
    padding: 12,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    marginStart: 10,
    marginEnd: 10,
    fontSize: 16,
    fontWeight: '600',
  },
}));

const Header: React.FC = ({children}) => {
  const css = useHeaderStyle();
  return (
    <View style={css.container}>
      <LogoOutline />
      <View style={css.textContainer}>
        <Text style={css.text}>{children}</Text>
      </View>
    </View>
  );
};
const useHeaderStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  container: {
    flexDirection: 'row',
    padding: theme.sizes.pagePadding,
  },
  textContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 20,
  },
  text: {
    color: theme.text.primary,
    fontSize: 16,
    fontWeight: '600',
  },
}));