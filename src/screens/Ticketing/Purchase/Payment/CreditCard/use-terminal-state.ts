import {useRef, useCallback, useEffect, useReducer} from 'react';
import {
  WebViewError,
  WebViewErrorEvent,
  WebViewNavigation,
  WebViewNavigationEvent,
} from 'react-native-webview/lib/WebViewTypes';
import {reserveOffers} from '../../../../../api';
import {
  ReserveOffer,
  TicketReservation,
} from '../../../../../api/fareContracts';
import {ErrorType, getAxiosErrorType} from '../../../../../api/utils';
import {parse as parseURL} from 'search-params';
import {AxiosError} from 'axios';

const possibleResponseCodes = ['Cancel', 'OK'] as const;
type NetsResponseCode = typeof possibleResponseCodes[number];

const isNetsResponseCode = (code: any): code is NetsResponseCode =>
  possibleResponseCodes.includes(code);

export type LoadingState =
  | 'reserving-offer'
  | 'loading-terminal'
  | 'processing-payment';

export type ErrorContext = 'reservation' | 'terminal-loading' | 'capture';

type TerminalReducerState = {
  loadingState?: LoadingState;
  reservation?: TicketReservation;
  paymentResponseCode?: NetsResponseCode;
  error?: {context: ErrorContext; type: ErrorType};
};

type TerminalReducerAction =
  | {type: 'RESTART_TERMINAL'}
  | {type: 'OFFER_RESERVED'; reservation: TicketReservation}
  | {type: 'TERMINAL_LOADED'}
  | {type: 'SET_NETS_RESPONSE_CODE'; responseCode: NetsResponseCode}
  | {type: 'SET_ERROR'; errorType: ErrorType; errorContext: ErrorContext};

type TerminalReducer = (
  prevState: TerminalReducerState,
  action: TerminalReducerAction,
) => TerminalReducerState;

const terminalReducer: TerminalReducer = (prevState, action) => {
  switch (action.type) {
    case 'RESTART_TERMINAL': {
      return initialState;
    }
    case 'OFFER_RESERVED': {
      return {
        ...prevState,
        paymentResponseCode: undefined,
        reservation: action.reservation,
        loadingState: 'loading-terminal',
      };
    }
    case 'TERMINAL_LOADED': {
      return {
        ...prevState,
        loadingState: undefined,
      };
    }
    case 'SET_NETS_RESPONSE_CODE': {
      return {
        ...prevState,
        loadingState: 'processing-payment',
        paymentResponseCode: action.responseCode,
      };
    }
    case 'SET_ERROR': {
      return {
        ...prevState,
        loadingState: undefined,
        error: {context: action.errorContext, type: action.errorType},
      };
    }
  }
};

const initialState: TerminalReducerState = {
  loadingState: 'reserving-offer',
};

export default function useTerminalState(
  offers: ReserveOffer[],
  cancelTerminal: () => void,
  activatePolling: (
    reservation: TicketReservation,
    offers: ReserveOffer[],
  ) => void,
) {
  const [
    {paymentResponseCode, reservation, loadingState, error},
    dispatch,
  ] = useReducer(terminalReducer, initialState);

  const handleAxiosError = useCallback(
    function (err: AxiosError, errorContext: ErrorContext) {
      const errorType = getAxiosErrorType(err);

      if (errorType !== 'cancel') {
        dispatch({
          type: 'SET_ERROR',
          errorType: errorType,
          errorContext,
        });
      }
    },
    [dispatch],
  );

  const reserveOffer = useCallback(
    async function () {
      try {
        const response = await reserveOffers(offers, 'creditcard', {
          retry: true,
        });

        dispatch({type: 'OFFER_RESERVED', reservation: response});
      } catch (err) {
        console.warn(err);
        handleAxiosError(err, 'reservation');
      }
    },
    [offers, dispatch, handleAxiosError],
  );

  useEffect(() => {
    if (loadingState === 'reserving-offer') reserveOffer();
  }, [reserveOffer, loadingState]);

  const loadingRef = useRef<boolean>(true);

  const onWebViewLoadEnd = ({
    nativeEvent,
  }: WebViewNavigationEvent | WebViewErrorEvent) => {
    const {url} = nativeEvent;

    // load events might be called several times
    // for each type of resource, html, assets, etc
    // so we have a "loading guard" here
    if (loadingRef.current) {
      loadingRef.current = false;
      if (isWebViewError(nativeEvent)) {
        dispatch({
          type: 'SET_ERROR',
          errorType: 'unknown',
          errorContext: 'terminal-loading',
        });
      } else {
        dispatch({type: 'TERMINAL_LOADED'});
      }
      // "payment redirect guard" here
    } else if (
      !paymentRedirectCompleteRef.current &&
      url.includes('/ticket/v1/payments/')
    ) {
      paymentRedirectCompleteRef.current = true;
      const params = parseURL(url);
      const responseCode = params['responseCode'];
      if (isNetsResponseCode(responseCode))
        dispatch({type: 'SET_NETS_RESPONSE_CODE', responseCode});
      else console.warn('No response code');
    }
  };

  const paymentRedirectCompleteRef = useRef<boolean>(false);

  useEffect(() => {
    switch (paymentResponseCode) {
      case 'OK':
        if (!reservation) return;

        activatePolling(reservation, offers);
        break;
      case 'Cancel':
        cancelTerminal();
        break;
    }
  }, [paymentResponseCode]);

  function restartTerminal() {
    loadingRef.current = true;
    paymentRedirectCompleteRef.current = false;
    dispatch({type: 'RESTART_TERMINAL'});
  }

  return {
    terminalUrl: reservation?.url,
    loadingState,
    onWebViewLoadEnd,
    error,
    restartTerminal,
  };
}

const isWebViewError = (
  nativeEvent: WebViewNavigation | WebViewError,
): nativeEvent is WebViewError => 'code' in nativeEvent;
