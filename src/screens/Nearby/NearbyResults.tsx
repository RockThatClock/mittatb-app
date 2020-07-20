import React from 'react';
import {
  RefreshControl,
  Text,
  View,
  StyleProp,
  ViewStyle,
  TextStyle,
  ImageStyle,
} from 'react-native';
import {FlatList, TouchableOpacity} from 'react-native-gesture-handler';
import TransportationIcon from '../../components/transportation-icon';
import {EstimatedCall, DeparturesWithStop, StopPlaceDetails} from '../../sdk';
import {StyleSheet} from '../../theme';
import {formatToClock} from '../../utils/date';
import {getLineNameFromEstimatedCall} from '../../utils/transportation-names';
import {useNavigation} from '@react-navigation/native';
import {NearbyScreenNavigationProp} from '.';
import {useGeolocationState} from '../../GeolocationContext';
import haversine from 'haversine-distance';
import {Location} from '../../favorites/types';
import PressableVenue from '../../components/pressable-venue';

type NearbyResultsProps = {
  departures: DeparturesWithStop[] | null;
  onRefresh?(): void;
  isRefreshing?: boolean;
};

const NearbyResults: React.FC<NearbyResultsProps> = ({
  departures,
  onRefresh,
  isRefreshing = false,
}) => {
  const styles = useResultsStyle();
  const navigation = useNavigation<NearbyScreenNavigationProp>();
  const onPress = (departure: EstimatedCall) => {
    const {publicCode, name} = getLineNameFromEstimatedCall(departure);
    navigation.navigate('DepartureDetailsModal', {
      title: publicCode ? `${publicCode} ${name}` : name,
      serviceJourneyId: departure.serviceJourney.id,
      fromQuayId: departure.quay?.id,
    });
  };
  const onHeaderPress = async (location: Location) => {
    navigation.navigate('Nearest', {
      location: {
        ...location,
        resultType: 'search',
      },
    });
  };

  if (departures !== null && Object.keys(departures).length == 0) {
    return (
      <View style={[styles.container, styles.noDepartures]}>
        <Text>Fant ingen avganger i nærheten</Text>
      </View>
    );
  }

  if (departures === null) {
    return null;
  }

  return (
    <FlatList
      style={styles.container}
      data={departures}
      renderItem={({item}) => (
        <StopDepartures
          departures={item}
          onPress={onPress}
          onHeaderPress={onHeaderPress}
        />
      )}
      keyExtractor={(departure) => departure.stop.id}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    />
  );
};
const useResultsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: theme.sizes.pagePadding,
  },
  noDepartures: {
    alignItems: 'center',
  },
}));

export default NearbyResults;

type StopDeparturesProps = {
  departures: DeparturesWithStop;
  onPress?(departure: EstimatedCall): void;
  onHeaderPress?(departure: Location): void;
};
const StopDepartures: React.FC<StopDeparturesProps> = ({
  departures,
  onPress,
  onHeaderPress,
}) => {
  const styles = useResultItemStyles();

  if (!Object.keys(departures.quays).length) {
    return null;
  }

  return (
    <View style={styles.item}>
      <ItemHeader stop={departures.stop} onPress={onHeaderPress} />

      <View>
        <LastElement last={styles.stopContainer__withoutBorder}>
          {Object.values(departures.quays).map((quay) => (
            <View key={quay.quay.id} style={styles.stopContainer}>
              <View style={styles.platformHeader}>
                <Text>Plattform {quay.quay.publicCode}</Text>
              </View>
              <LastElement last={styles.itemContainer__withoutBorder}>
                {quay.departures.map((departure) => (
                  <NearbyResultItem
                    departure={departure}
                    onPress={onPress}
                    key={departure.serviceJourney.id}
                  />
                ))}
              </LastElement>
            </View>
          ))}
        </LastElement>
      </View>
    </View>
  );
};

const ItemHeader: React.FC<{
  stop: StopPlaceDetails;
  onPress?(stop: Location): void;
}> = ({stop, onPress}) => {
  const {location} = useGeolocationState();
  const styles = useResultItemStyles();
  const coords = {
    latitude: stop.latitude,
    longitude: stop.longitude,
  };

  return (
    <PressableVenue onPress={onPress} coordinates={coords}>
      <View style={styles.resultHeader}>
        <Text>{stop.name}</Text>
        <Text>
          {location ? humanizeDistance(haversine(location.coords, stop)) : ''}
        </Text>
      </View>
    </PressableVenue>
  );
};

type NearbyResultItemProps = {
  departure: EstimatedCall;
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
  onPress?(departure: EstimatedCall): void;
};
const NearbyResultItem: React.FC<NearbyResultItemProps> = ({
  departure,
  onPress,
  style,
}) => {
  const styles = useResultItemStyles();
  const {publicCode, name} = getLineNameFromEstimatedCall(departure);
  return (
    <TouchableOpacity
      style={[styles.itemContainer, style]}
      onPress={() => onPress?.(departure)}
    >
      <Text style={styles.time}>
        {formatToClock(departure.expectedDepartureTime)}
      </Text>
      <TransportationIcon
        mode={departure.serviceJourney.journeyPattern?.line.transportMode}
        publicCode={departure.serviceJourney.journeyPattern?.line.publicCode}
      />
      <View style={styles.textWrapper}>
        <Text style={styles.textContent} numberOfLines={1}>
          {publicCode && (
            <Text style={{fontWeight: 'bold'}}>{publicCode} </Text>
          )}
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const useResultItemStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingBottom: 12,
    marginBottom: 12,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  itemContainer__withoutBorder: {
    marginBottom: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  item: {
    padding: 12,
    backgroundColor: theme.background.level0,
    borderRadius: 8,
    marginBottom: 12,
  },
  platformHeader: {
    marginBottom: 12,
    color: theme.text.faded,
    fontSize: 12,
  },
  time: {
    width: 50,
    fontSize: 16,
    color: theme.text.primary,
    paddingVertical: 4,
    fontVariant: ['tabular-nums'],
  },
  textContent: {
    flex: 1,
    fontSize: 16,
  },
  textWrapper: {
    flex: 1,
    color: theme.text.primary,
    marginLeft: 10,
    paddingVertical: 4,
  },
  label: {
    fontSize: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 9,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },

  stopContainer__withoutBorder: {
    marginBottom: 0,
  },
  stopContainer: {
    marginVertical: 20,
  },
}));

type LastElementProps = {
  last?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};
const LastElement: React.FC<LastElementProps> = ({children, last}) => {
  const num = React.Children.count(children) - 1;
  if (num === 0 && children) {
    return <>{children}</>;
  }
  return (
    <>
      {React.Children.map(children, (child, i) => {
        if (React.isValidElement(child) && i == num) {
          let previous: StyleProp<ViewStyle | TextStyle | ImageStyle> = [];
          if (hasStyle(child)) {
            previous = Array.isArray(child.style) ? child.style : [child.style];
          }
          return React.cloneElement(child, {
            style: previous.concat(last),
          });
        } else {
          return child;
        }
      })}
    </>
  );
};

type WithStyle = {
  style?: StyleProp<ViewStyle | TextStyle | ImageStyle>;
};
function hasStyle(a: any): a is Required<WithStyle> {
  return 'style' in a;
}

function humanizeDistance(distanceInMeters: number): string {
  if (distanceInMeters >= 1000) {
    return Math.round(distanceInMeters / 1000) + ' km';
  }
  return Math.ceil(distanceInMeters) + 'm';
}
