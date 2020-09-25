import {useEffect} from 'react';
import {Coordinates} from '../sdk';
import {reverse} from '../api';
import {mapFeatureToLocation} from './utils';
import useGeocoderReducer, {GeocoderState} from './use-geocoder-reducer';

export default function useReverseGeocoder(
  coords: Coordinates | null,
): GeocoderState {
  const [state, dispatch] = useGeocoderReducer();

  useEffect(() => {
    if (!coords) {
      dispatch({type: 'SET_LOCATIONS', locations: null});
    } else {
      const {doRequest, cancel} = reverse(coords);

      async function reverseCoordLookup() {
        dispatch({type: 'SET_IS_SEARCHING'});

        const result = await doRequest();

        if (result.isOk) {
          const locations = result.unwrap().map(mapFeatureToLocation);

          dispatch({
            type: 'SET_LOCATIONS',
            locations,
          });
        } else {
          if (result.error.errorType === 'cancel') {
            dispatch({type: 'SET_LOCATIONS', locations: null});
          } else {
            console.warn(result.error);
            dispatch({type: 'SET_HAS_ERROR'});
          }
        }
      }

      reverseCoordLookup();
      return () => cancel('Cancelling previous reverse');
    }
  }, [coords?.latitude, coords?.longitude]);

  return state;
}
