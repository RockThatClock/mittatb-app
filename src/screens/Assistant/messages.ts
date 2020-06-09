import {defineMessages} from 'react-intl';

export const dateTypes = defineMessages({
  arrival: 'Ankomst',
  departure: 'Avreise',
  now: 'Nå',
});

export const travelTimes = defineMessages({
  departureNow: 'Avreise nå',
  arrivalAt: 'Ankomst {time}',
  departureAt: 'Avreise {time}',
});

export const timeButton = defineMessages({
  prefix: 'Når',
});

export const timeModal = defineMessages({
  title: 'Velg tidspunkt',
  button: 'Søk etter reiser',
});

export const noTravelsFound = defineMessages({
  info: `Vi fant dessverre ingen reiseruter som passer til ditt søk.\nVennligst prøv et annet avreisested eller destinasjon.`,
});
