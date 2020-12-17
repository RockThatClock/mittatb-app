import {useEffect, useReducer} from 'react';
import {Coordinates, Quay} from '@entur/sdk';
import haversine from 'haversine-distance';
import {CancelToken, getNearestStopPlaces} from '../../api';
import {flatMap} from '../../utils/array';

export type NearestQuay = Quay & {distanceInMeters: number};

export type NearestQuaysState = {
  quays?: NearestQuay[];
  isSearching: boolean;
};

type NearestQuayReducerAction =
  | {
      quays: NearestQuay[] | undefined;
      type: 'SET_QUAYS';
    }
  | {
      type: 'SET_IS_SEARCHING';
    };

type NearestQuayReducer = (
  prevState: NearestQuaysState,
  action: NearestQuayReducerAction,
) => NearestQuaysState;

export const nearestQuayReducer: NearestQuayReducer = (
  prevState,
  action,
): NearestQuaysState => {
  switch (action.type) {
    case 'SET_QUAYS':
      return {
        quays: action.quays,
        isSearching: false,
      };
    case 'SET_IS_SEARCHING':
      return {
        ...prevState,
        isSearching: true,
      };
  }
};

const initialState: NearestQuaysState = {
  quays: undefined,
  isSearching: false,
};

export default function useNearestQuays(
  coords: Coordinates | undefined,
  distance: number,
): NearestQuaysState & {nearestQuay?: NearestQuay} {
  const [state, dispatch] = useReducer(nearestQuayReducer, initialState);

  useEffect(() => {
    const source = CancelToken.source();
    async function reverseCoordLookup() {
      if (coords && distance) {
        try {
          dispatch({type: 'SET_IS_SEARCHING'});
          const stopPlaces = await getNearestStopPlaces(coords, distance, {
            cancelToken: source.token,
          });
          source.token.throwIfRequested();

          if (stopPlaces) {
            const nearestQuays = flatMap(stopPlaces, (sp) => sp.quays ?? [])
              .filter((q) => !!q.stopPlace.latitude && !!q.stopPlace.longitude)
              .map<NearestQuay>((q) => ({
                ...q,
                distanceInMeters: haversine(
                  {
                    longitude: q.stopPlace.longitude!,
                    latitude: q.stopPlace.latitude!,
                  },
                  coords,
                ),
              }))
              .sort(
                (
                  {distanceInMeters: distanceA},
                  {distanceInMeters: distanceB},
                ) => distanceA - distanceB,
              );

            dispatch({
              type: 'SET_QUAYS',
              quays: nearestQuays,
            });
          }
        } catch (err) {
          console.warn('Nearest stop place request failed', err);
        }
      } else {
        dispatch({type: 'SET_QUAYS', quays: undefined});
      }
    }

    reverseCoordLookup();
    return () => source.cancel('Cancelling previous reverse');
  }, [coords?.latitude, coords?.longitude, distance]);

  return {
    ...state,
    nearestQuay: state.quays?.[0],
  };
}
