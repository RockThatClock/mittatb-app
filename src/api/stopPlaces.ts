import {Coordinates, StopPlaceDetails} from '@entur/sdk';
import {AxiosRequestConfig} from 'axios';
import client from './client';

export async function getNearest(
  coordinates: Coordinates,
  distance: number,
  opts: AxiosRequestConfig,
): Promise<StopPlaceDetails[]> {
  let url = `bff/v1/stops/nearest?lat=${coordinates.latitude}&lon=${coordinates.longitude}&distance=${distance}`;

  const response = await client.get<StopPlaceDetails[]>(url, opts);
  return response.data ?? [];
}
