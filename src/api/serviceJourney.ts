import {EstimatedCall} from '../sdk';
import setupRequester from './requester';

type ServiceJourneDepartures = {
  value: EstimatedCall[];
};

export function getDepartures(id: string, date?: Date) {
  let url = `bff/v1/servicejourney/${encodeURIComponent(id)}/departures`;
  if (date) {
    url = url + `?date=${date.toISOString()}`;
  }
  return setupRequester((client, opts) =>
    client.get<ServiceJourneDepartures>(url, opts),
  );
}
