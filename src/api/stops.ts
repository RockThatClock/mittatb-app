import {TransportMode, TransportSubmode} from '@entur/sdk';
import {Coordinates} from '../sdk';
import client from './client';
import {build} from 'search-params';

export type NearestStopPlace = {
  id: string;
  latitude?: number;
  longitude?: number;
  name: string;
  quays?: Array<NearestQuay>;
};

type NearestQuay = {
  id: string;
  name: string;
  longitude?: number;
  latitude?: number;
  stopPlace?: NearestQuayStopPlace;
};

type NearestQuayStopPlace = {
  transportMode?: TransportMode;
  transportSubmode?: TransportSubmode;
  id: string;
  latitude?: number;
  longitude?: number;
  name: string;
};

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

  return await client.get<NearestStopPlace[]>(url);
}
