export enum PaymentType {
  CreditCard = 1,
  Vipps,
}

export type UserType = 'ADULT';

export type OfferPrice = {
  amount: string | null;
  amount_float: number | null;
  currency: string;
  vat_group?: string;
  tax_amount?: string;
};

export type Offer = {
  offer_id: string;
  traveller_id: string;
  prices: OfferPrice[];
};

export type OfferSearchResponse = Offer[];

export type FareContract = {
  order_id: string;
  order_version: string;
  product_name: string;
  duration: number;
  usage_valid_from: number;
  usage_valid_to: number;
  user_profiles: string[];
};

export type ListTickets = {
  fare_contracts: FareContract[];
};

export type ReserveOffer = {
  offer_id: string;
  count: number;
};

export type ReserveTicketResponse = {
  payment_id: number;
  transaction_id: number;
  url: string;
};

export type VippsRedirectParams = {
  payment_id: string;
  transaction_id: string;
  status: string;
};
