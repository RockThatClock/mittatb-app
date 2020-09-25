import {
  DeparturesMetadata,
  DeparturesWithStop,
  DeparturesRealtimeData,
  PaginationInput,
} from '../sdk';
import {Location} from '../favorites/types';
import {AxiosRequestConfig} from 'axios';
import {build} from 'search-params';
import {flatMap} from '../utils/array';
import setupRequester from './requester';
export type DeparturesInputQuery = {
  numberOfDepartures: number; // Number of departures to fetch per quay.
  startTime: Date;
};
export type DepartureQuery = Partial<PaginationInput> & DeparturesInputQuery;

export function getDepartures(location: Location, query: DepartureQuery) {
  const {numberOfDepartures, pageOffset = 0, pageSize = 2} = query;
  const startTime = query.startTime.toISOString();
  let url = `bff/v1/departures-from-location-paging?limit=${numberOfDepartures}&pageSize=${pageSize}&pageOffset=${pageOffset}&startTime=${startTime}`;
  return setupRequester((client, opts) =>
    client.post<DeparturesMetadata>(url, location, opts),
  );
}

export function getRealtimeDeparture(
  stops: DeparturesWithStop[],
  query: DeparturesInputQuery,
) {
  const quayIds = flatMap(stops, (s) => Object.keys(s.quays));
  const startTime = query.startTime.toISOString();

  const params = build({
    quayIds,
    startTime,
    limit: query.numberOfDepartures,
  });

  let url = `bff/v1/departures-realtime?${params}`;

  return setupRequester((client, opts) =>
    client.get<DeparturesRealtimeData>(url, opts),
  );
}
