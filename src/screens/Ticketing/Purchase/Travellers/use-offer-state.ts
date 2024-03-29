import {CancelToken} from 'axios';
import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {CancelToken as CancelTokenStatic, searchOffers} from '../../../../api';
import {Offer, OfferPrice, ReserveOffer} from '../../../../api/fareContracts';
import {ErrorType, getAxiosErrorType} from '../../../../api/utils';
import {UserProfileWithCount} from './use-user-count-state';
import {
  PreassignedFareProduct,
  TariffZone,
} from '../../../../reference-data/types';

type OfferErrorContext = 'failed_offer_search' | 'failed_reservation';

export type OfferError = {
  context: OfferErrorContext;
  type: ErrorType;
};

type OfferState = {
  offerSearchTime?: number;
  isSearchingOffer: boolean;
  totalPrice: number;
  offers: ReserveOffer[];
  error?: OfferError;
};

type OfferReducerAction =
  | {type: 'SEARCHING_OFFER'}
  | {type: 'SET_OFFER'; offers: Offer[]}
  | {type: 'CLEAR_OFFER'}
  | {type: 'SET_ERROR'; error: OfferError};

type OfferReducer = (
  prevState: OfferState,
  action: OfferReducerAction,
) => OfferState;

const getCurrencyAsFloat = (prices: OfferPrice[], currency: string) =>
  prices.find((p) => p.currency === currency)?.amount_float ?? 0;

const calculateTotalPrice = (
  travellers: UserProfileWithCount[],
  offers: Offer[],
) =>
  travellers.reduce((total, traveller) => {
    const maybeOffer = offers.find(
      (o) => o.traveller_id === traveller.userTypeString,
    );
    const price = maybeOffer
      ? getCurrencyAsFloat(maybeOffer.prices, 'NOK') * traveller.count
      : 0;
    return total + price;
  }, 0);

const mapToReserveOffers = (
  travellers: UserProfileWithCount[],
  offers: Offer[],
): ReserveOffer[] =>
  travellers
    .map((traveller) => ({
      count: traveller.count,
      offer_id: offers.find((o) => o.traveller_id === traveller.userTypeString)
        ?.offer_id,
    }))
    .filter(
      (countAndOffer): countAndOffer is ReserveOffer =>
        countAndOffer.offer_id != null,
    );

const getOfferReducer = (travellers: UserProfileWithCount[]): OfferReducer => (
  prevState,
  action,
): OfferState => {
  switch (action.type) {
    case 'SEARCHING_OFFER':
      return {
        ...prevState,
        isSearchingOffer: true,
      };
    case 'CLEAR_OFFER':
      return {
        ...prevState,
        offerSearchTime: undefined,
        isSearchingOffer: false,
        totalPrice: 0,
        error: undefined,
        offers: [],
      };
    case 'SET_OFFER':
      return {
        ...prevState,
        offerSearchTime: Date.now(),
        isSearchingOffer: false,
        totalPrice: calculateTotalPrice(travellers, action.offers),
        offers: mapToReserveOffers(travellers, action.offers),
        error: undefined,
      };
    case 'SET_ERROR': {
      return {
        ...prevState,
        error: action.error,
      };
    }
  }
};

const initialState: OfferState = {
  isSearchingOffer: false,
  offerSearchTime: undefined,
  totalPrice: 0,
  error: undefined,
  offers: [],
};

export default function useOfferState(
  preassignedFareProduct: PreassignedFareProduct,
  fromTariffZone: TariffZone,
  toTariffZone: TariffZone,
  userProfilesWithCount: UserProfileWithCount[],
) {
  const offerReducer = getOfferReducer(userProfilesWithCount);
  const [state, dispatch] = useReducer(offerReducer, initialState);
  const zones = useMemo(
    () => [...new Set([fromTariffZone.id, toTariffZone.id])],
    [fromTariffZone, toTariffZone],
  );

  const updateOffer = useCallback(
    async function (cancelToken?: CancelToken) {
      const offerTravellers = userProfilesWithCount
        .filter((t) => t.count)
        .map((t) => ({
          id: t.userTypeString,
          user_type: t.userTypeString,
          count: t.count,
        }));

      if (!offerTravellers.length) {
        dispatch({type: 'CLEAR_OFFER'});
      } else {
        try {
          dispatch({type: 'SEARCHING_OFFER'});
          const response = await searchOffers(
            {
              zones,
              travellers: offerTravellers,
              products: [preassignedFareProduct.id],
            },
            {cancelToken, retry: true},
          );

          cancelToken?.throwIfRequested();

          dispatch({type: 'SET_OFFER', offers: response});
        } catch (err) {
          console.warn(err);

          const errorType = getAxiosErrorType(err);
          if (errorType !== 'cancel') {
            dispatch({
              type: 'SET_ERROR',
              error: {
                context: 'failed_offer_search',
                type: errorType,
              },
            });
          }
        }
      }
    },
    [dispatch, userProfilesWithCount, preassignedFareProduct, zones],
  );

  useEffect(() => {
    const source = CancelTokenStatic.source();
    updateOffer(source.token);
    return () => source.cancel('Cancelling previous offer search');
  }, [updateOffer, userProfilesWithCount, preassignedFareProduct]);

  const refreshOffer = useCallback(
    async function () {
      await updateOffer(undefined);
    },
    [updateOffer],
  );

  return {
    ...state,
    refreshOffer,
  };
}
