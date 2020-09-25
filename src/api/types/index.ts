import {Result} from '@badrap/result';
import {DataError} from './errors';
export {Result} from '@badrap/result';

export type Canceller = (message?: string) => void;
export type Requester<T> = {
  doRequest: () => Promise<Result<T, DataError>>;
  cancel: Canceller;
};

export type {DataError, ErrorMetadata, ErrorType} from './errors';

export {PaymentType} from './fareContracts';
export type {
  FareContract,
  ListTickets,
  Offer,
  OfferPrice,
  OfferSearchResponse,
  ReserveOffer,
  ReserveTicketResponse,
  UserType,
  VippsRedirectParams,
} from './fareContracts';
