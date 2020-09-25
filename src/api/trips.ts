import {TripPattern} from '../sdk';
import {Location} from '../favorites/types';
import setupRequester from './requester';

export function search(
  from: Location,
  to: Location,
  searchDate?: Date,
  arriveBy: boolean = false,
) {
  const url = 'bff/v1/journey/trip';
  return setupRequester((client, opts) =>
    client.post<TripPattern[]>(
      url,
      {
        from: {
          place: from.id,
          name: from.name,
          coordinates: from.coordinates,
        },
        to: {
          place: to.id,
          name: to.name,
          coordinates: to.coordinates,
        },
        searchDate,
        arriveBy,
      },
      opts,
    ),
  );
}

export function getSingleTripPattern(tripPatternId: string) {
  const url = `bff/v1/journey/single-trip?id=${tripPatternId}`;
  return setupRequester((client, opts) => client.get<TripPattern>(url, opts));
}
