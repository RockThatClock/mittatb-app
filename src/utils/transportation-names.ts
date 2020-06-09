import {Leg, EstimatedCall, Quay} from '../sdk';
import {Language} from '../localization/LanguageContext';
import {defineMessages} from 'react-intl';

const messages = defineMessages({unknown: 'Ukjent'});

export function getLineName(leg: Leg) {
  return leg.line
    ? leg.line.publicCode +
        ' ' +
        leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line.name
    : Language.formatMessage(messages.unknown);
}

export function getLineNameFromEstimatedCall(call: EstimatedCall) {
  const suffix =
    call.destinationDisplay?.frontText ??
    call.serviceJourney.journeyPattern?.line.name;

  const publicCode = call.serviceJourney.journeyPattern?.line.publicCode;

  if (!publicCode && !suffix) {
    return Language.formatMessage(messages.unknown);
  }
  if (!publicCode) {
    return suffix;
  }
  return `${publicCode} ${suffix}`;
}

export function getQuayName(quay?: Quay, defaultName?: string) {
  if (!quay) return defaultName ?? Language.formatMessage(messages.unknown);
  if (!quay.publicCode) return quay.name;
  return `${quay.name} ${quay.publicCode}`;
}
