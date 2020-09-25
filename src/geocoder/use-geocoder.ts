import {useEffect} from 'react';
import {Coordinates} from '../sdk';
import {autocomplete} from '../api';
import useGeocoderReducer, {GeocoderState} from './use-geocoder-reducer';
import {mapFeatureToLocation} from './utils';

export default function useGeocoder(
  text: string | null,
  coords: Coordinates | null,
): GeocoderState {
  const [state, dispatch] = useGeocoderReducer();

  useEffect(() => {
    if (!text) {
      dispatch({type: 'SET_LOCATIONS', locations: null});
    } else {
      const {doRequest, cancel} = autocomplete(text, coords);

      async function textLookup() {
        dispatch({type: 'SET_IS_SEARCHING'});

        const result = await doRequest();

        if (result.isOk) {
          const locations = result.value.map(mapFeatureToLocation);

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

      textLookup();
      return () => cancel('Cancelling previous autocomplete');
    }
  }, [coords?.latitude, coords?.longitude, text]);

  return state;
}
