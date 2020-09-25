import React, {
  useContext,
  createContext,
  useCallback,
  useState,
  useEffect,
} from 'react';
import {FareContract} from '../../api/types';
import usePollableResource from '../../utils/use-pollable-resource';
import {doRequest, listFareContracts} from '../../api';
import {getCustomerId} from '../../utils/customerId';

type TicketState = {
  paymentFailedReason?: PaymentFailedReason;
  paymentFailedForReason: (reason?: PaymentFailedReason) => void;
  fareContracts: FareContract[] | undefined;
  isRefreshingTickets: boolean;
  refreshTickets: () => void;
  activatePollingForNewTickets: () => void;
};

export enum PaymentFailedReason {
  UserCancelled = 'Betaling avbrutt',
  CaptureFailed = 'Betaling avvist av kortutsteder',
  Unknown = 'Vi kunne ikke behandle betalingen. Vi er på saken!',
}

const TicketContext = createContext<TicketState | undefined>(undefined);

const TicketContextProvider: React.FC = ({children}) => {
  const [poll, setPoll] = useState(false);
  const [paymentFailedReason, setPaymentFailedReason] = useState<
    PaymentFailedReason
  >();

  const getFareContracts = useCallback(async function () {
    const customerId = await getCustomerId();
    const result = await doRequest(listFareContracts(customerId));
    if (result.isOk) {
      return result.value.fare_contracts;
    } else {
      console.warn(result.error);
    }
  }, []);

  const [
    fareContracts,
    refreshTickets,
    isRefreshingTickets,
  ] = usePollableResource(getFareContracts, {
    initialValue: [],
    pollingTimeInSeconds: 1,
    disabled: !poll,
  });

  useEffect(() => setPoll(false), [fareContracts?.length]);

  return (
    <TicketContext.Provider
      value={{
        paymentFailedReason: paymentFailedReason,
        paymentFailedForReason: (reason?: PaymentFailedReason) =>
          setPaymentFailedReason(reason),
        fareContracts,
        refreshTickets,
        isRefreshingTickets,
        activatePollingForNewTickets: () => setPoll(true),
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export function useTicketState() {
  const context = useContext(TicketContext);
  if (context === undefined) {
    throw new Error(
      'useTicketState must be used within a TicketContextProvider',
    );
  }
  return context;
}

export default TicketContextProvider;
