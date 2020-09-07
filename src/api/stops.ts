import {Coordinates, StopPlace as SdkStopPlace} from '../sdk';
import client from './client';
import {build} from 'search-params';

export type StopPlace = {
  latitude?: number;
  longitude?: number;
} & SdkStopPlace;

type NearestQuery = {
  lat: number;
  lon: number;
  distance?: number;
};

export async function nearestStopPlaces(coords: Coordinates, distance: number) {
  const query: NearestQuery = {
    lat: coords.latitude,
    lon: coords.longitude,
    distance,
  };
  const params = build(query);
  const url = `/bff/v1/stops/nearest?${params}`;

  return await client.get<StopPlace[]>(url);
}
