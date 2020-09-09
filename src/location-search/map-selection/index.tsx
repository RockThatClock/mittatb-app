import {RouteProp} from '@react-navigation/native';
import React, {useState, useRef, useMemo, useEffect} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';

import MapboxGL, {RegionPayload} from '@react-native-mapbox-gl/maps';
import {useReverseGeocoder} from '../useGeocoder';
import colors from '../../theme/colors';
import {
  LocationSearchNavigationProp,
  LocationSearchStackParams,
  LocationWithSearchMetadata,
} from '../';
import insets from '../../utils/insets';
import MapControls from './MapControls';
import {useGeolocationState} from '../../GeolocationContext';
import LocationBar from './LocationBar';
import {ArrowLeft} from '../../assets/svg/icons/navigation';
import {SelectionPin} from '../../assets/svg/map';
import {StyleSheet} from '../../theme';
import shadows from './shadows';
import {Coordinates} from '@entur/sdk';
import {NearestStopPlace, nearestStopPlaces} from '../../api/stops';
import {Feature} from 'geojson';

const busIcon = require('../../assets/images/bus.png');
const bus2Icon = require('../../assets/images/bus2.png');

function mapStopPlaceToFeature(stopPlace: NearestStopPlace): Feature {
  return {
    type: 'Feature',
    id: stopPlace.id,
    properties: {
      icon: ['atbBus'],
      label: stopPlace.name,
    },
    geometry: {
      type: 'Point',
      coordinates: [stopPlace.longitude ?? 0, stopPlace.latitude ?? 0],
    },
  };
}

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  coordinates: {
    longitude: number;
    latitude: number;
    zoomLevel: number;
  };
};

export type Props = {
  navigation: LocationSearchNavigationProp;
  route: RouteProp<LocationSearchStackParams, 'MapSelection'>;
};

type RegionEvent = {
  isChanging: boolean;
  region?: GeoJSON.Feature<GeoJSON.Point, RegionPayload>;
};

const MapSelection: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, coordinates},
  },
}) => {
  const [regionEvent, setRegionEvent] = useState<RegionEvent>();
  const [stopPlaceFeatures, setStopPlaceFeatures] = useState<Feature[]>();

  const centeredCoordinates = useMemo<
    (Coordinates & {zoomLevel: number}) | null
  >(
    () =>
      (regionEvent?.region?.geometry && {
        latitude: regionEvent.region.geometry.coordinates[1],
        longitude: regionEvent.region.geometry.coordinates[0],
        zoomLevel: regionEvent.region.properties.zoomLevel,
      }) ??
      null,
    [
      regionEvent?.region?.geometry?.coordinates[0],
      regionEvent?.region?.geometry?.coordinates[1],
      regionEvent?.region?.properties.zoomLevel,
    ],
  );

  useEffect(() => {
    run();

    async function run() {
      if (!centeredCoordinates) return;
      if (centeredCoordinates.zoomLevel >= 14) {
        try {
          const stopPlaces = await nearestStopPlaces(centeredCoordinates, 500);

          setStopPlaceFeatures(stopPlaces.data.map(mapStopPlaceToFeature));
        } catch (err) {
          console.warn(err);
        }
      }
    }
  }, [centeredCoordinates]);

  const locations = useReverseGeocoder(centeredCoordinates);

  const {location: geolocation} = useGeolocationState();

  const onSelect = (location: LocationWithSearchMetadata) => {
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: location,
    });
  };

  const location = locations?.[0];

  const mapCameraRef = useRef<MapboxGL.Camera>(null);
  const mapViewRef = useRef<MapboxGL.MapView>(null);

  async function zoomIn() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) + 1, 200);
  }

  async function zoomOut() {
    const currentZoom = await mapViewRef.current?.getZoom();
    mapCameraRef.current?.zoomTo((currentZoom ?? 10) - 1, 200);
  }

  async function flyToCurrentLocation() {
    geolocation &&
      mapCameraRef.current?.flyTo(
        [geolocation?.coords.longitude, geolocation?.coords.latitude],
        750,
      );
  }

  const flyToFeature = (feature: Feature) => {
    if (feature && feature.geometry.type === 'Point') {
      mapCameraRef.current?.flyTo(feature.geometry.coordinates, 300);
    }
  };

  return (
    <View style={styles.container}>
      <MapboxGL.MapView
        ref={mapViewRef}
        style={{
          flex: 1,
        }}
        onRegionDidChange={(region) =>
          setRegionEvent({isChanging: false, region})
        }
        onRegionWillChange={() =>
          setRegionEvent({isChanging: true, region: regionEvent?.region})
        }
        onPress={flyToFeature}
      >
        <MapboxGL.Camera
          ref={mapCameraRef}
          zoomLevel={coordinates.zoomLevel}
          centerCoordinate={[coordinates.longitude, coordinates.latitude]}
          animationMode="moveTo"
        />
        <MapboxGL.UserLocation showsUserHeadingIndicator />
        <MapboxGL.Images images={{atbBus: busIcon, atbBus2: bus2Icon}} />
        <MapboxGL.ShapeSource
          id="bus"
          shape={{
            type: 'FeatureCollection',
            features: stopPlaceFeatures ?? [],
          }}
        >
          <MapboxGL.SymbolLayer
            minZoomLevel={14}
            id="bus"
            style={{
              iconImage: 'atbBus',
              iconSize: 0.6,
              textField: '{label}',
              textOffset: [0, 1.5],
              textSize: 12,
            }}
          />
        </MapboxGL.ShapeSource>
      </MapboxGL.MapView>
      <View style={styles.backArrowContainer}>
        <BackArrow onBack={() => navigation.goBack()} />
      </View>
      <View style={styles.controlsContainer}>
        <MapControls
          flyToCurrentLocation={flyToCurrentLocation}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
        />
      </View>
      <View style={styles.pinContainer} pointerEvents="none">
        <View style={styles.pin}>
          <SelectionPin width={40} height={60} />
        </View>
      </View>
      <View style={styles.locationContainer}>
        <LocationBar
          location={location}
          onSelect={onSelect}
          isSearching={!!regionEvent?.isChanging}
        />
      </View>
    </View>
  );
};

const BackArrow: React.FC<{onBack(): void}> = ({onBack}) => {
  return (
    <TouchableOpacity onPress={onBack} hitSlop={insets.symmetric(12, 20)}>
      <View style={styles.backArrow}>
        <ArrowLeft fill={colors.general.white} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  pinContainer: {
    position: 'absolute',
    top: '50%',
    right: '50%',
  },
  pin: {position: 'absolute', top: -50, right: -20, ...shadows},
  backArrowContainer: {position: 'absolute', top: 80, left: 20},
  controlsContainer: {position: 'absolute', top: 80, right: 20},
  locationContainer: {
    position: 'absolute',
    bottom: 80,
    paddingHorizontal: 12,
    width: '100%',
  },
  backArrow: {
    backgroundColor: colors.primary.gray,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    width: 36,
    height: 28,
    ...shadows,
  },
});

export default MapSelection;
