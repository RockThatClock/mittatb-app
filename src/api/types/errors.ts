export interface DataError extends Error {
  errorType: ErrorType;
  metadata: ErrorMetadata;
}

export type ErrorType =
  | 'unknown'
  | 'normal'
  | 'network-error'
  | 'timeout'
  | 'cancel';

export interface ErrorMetadata {
  responseStatus?: number;
  responseStatusText?: string;
  responseData?: string;
  requestUrl?: string;
  requestMessage?: string;
  requestCode?: string;
  requestId?: string;
}
