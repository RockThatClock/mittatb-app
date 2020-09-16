import {useEffect} from 'react';
import {CancelToken, isCancel} from '../api/client';
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
    const source = CancelToken.source();
    async function textLookup() {
      if (!text) {
        dispatch({type: 'SET_LOCATIONS', locations: null});
      } else {
        try {
          dispatch({type: 'SET_IS_SEARCHING'});
          const response = await autocomplete(text, coords, {
            cancelToken: source.token,
          });
          source.token.throwIfRequested();
          dispatch({
            type: 'SET_LOCATIONS',
            locations: response?.data?.map(mapFeatureToLocation),
          });
        } catch (err) {
          if (!isCancel(err)) {
            console.warn(err);
            dispatch({type: 'SET_HAS_ERROR'});
          } else {
            dispatch({type: 'SET_LOCATIONS', locations: null});
          }
        }
      }
    }

    textLookup();
    return () => source.cancel('Cancelling previous autocomplete');
  }, [coords?.latitude, coords?.longitude, text]);

  return state;
}