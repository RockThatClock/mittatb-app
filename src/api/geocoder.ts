import {Feature, Coordinates} from '../sdk';
import qs from 'query-string';
import {stringifyUrl} from './utils';
import setupRequester from './requester';

const TRONDHEIM_CENTRAL_STATION: Coordinates = {
  latitude: 63.43457,
  longitude: 10.39844,
};

export function autocomplete(
  text: string | null,
  coordinates: Coordinates | null,
) {
  const url = 'bff/v1/geocoder/features';
  const query = qs.stringify({
    query: text,
    lat: coordinates?.latitude ?? TRONDHEIM_CENTRAL_STATION.latitude,
    lon: coordinates?.longitude ?? TRONDHEIM_CENTRAL_STATION.longitude,
    limit: 10,
  });

  return setupRequester((client, opts) =>
    client.get<Feature[]>(stringifyUrl(url, query), opts),
  );
}

export function reverse(coordinates: Coordinates | null) {
  const url = 'bff/v1/geocoder/reverse';
  const query = qs.stringify({
    lat: coordinates?.latitude,
    lon: coordinates?.longitude,
  });

  return setupRequester((client, opts) =>
    client.get<Feature[]>(stringifyUrl(url, query), opts),
  );
}
