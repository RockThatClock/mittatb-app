import setupRequester from './requester';
import {
  FareContract,
  ListTickets,
  Offer,
  PaymentType,
  ReserveOffer,
  ReserveTicketResponse,
  UserType,
} from './types';

export function list(customerId: string) {
  const url = 'ticket/v1/ticket/' + customerId;

  return setupRequester((client, opts) => client.get<ListTickets>(url, opts));
}

export function search(
  zones: string[],
  userTypes: {id: string; user_type: UserType}[],
  products: string[],
) {
  const body = {
    zones,
    travellers: userTypes.map(({id, user_type}) => ({
      id,
      user_type,
      count: 1,
    })),
    products,
  };

  const url = 'ticket/v1/search';
  return setupRequester((client, opts) =>
    client.post<Offer[]>(url, body, opts),
  );
}

interface SendReceiptResponse {
  reference: string;
}

export function sendReceipt(fc: FareContract, email: string) {
  const url = 'ticket/v1/receipt';
  return setupRequester((client, opts) =>
    client.post<SendReceiptResponse>(
      url,
      {
        order_id: fc.order_id,
        order_version: parseInt(fc.order_version, 10),
        email_address: email,
      },
      opts,
    ),
  );
}

export function reserve(
  customer_id: string,
  offers: ReserveOffer[],
  paymentType: PaymentType,
) {
  const url = 'ticket/v1/reserve';
  return setupRequester((client, opts) =>
    client.post<ReserveTicketResponse>(
      url,
      {
        payment_type: paymentType,
        payment_redirect_url:
          paymentType == PaymentType.Vipps
            ? 'atb://payment?transaction_id={transaction_id}&payment_id={payment_id}'
            : undefined,
        customer_id,
        offers,
      },
      opts,
    ),
  );
}

export function capture(payment_id: number, transaction_id: number) {
  const url = 'ticket/v1/capture';
  return setupRequester((client, opts) =>
    client.put(
      url,
      {
        //@ts-ignore
        payment_id: parseInt(payment_id, 10),
        //@ts-ignore
        transaction_id: parseInt(transaction_id, 10),
      },
      opts,
    ),
  );
}
