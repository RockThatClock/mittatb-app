import axios, {AxiosError} from 'axios';
import {RequestIdHeaderName} from './headers';
import {ErrorMetadata, ErrorType} from './types';

export const getAxiosErrorType = (error: AxiosError): ErrorType => {
  if (error) {
    if (axios.isCancel(error)) {
      return 'cancel';
    }
    if (error.response) {
      return 'normal';
    } else {
      if (error.code === 'ECONNABORTED') {
        return 'timeout';
      } else {
        return 'network-error';
      }
    }
  }

  return 'unknown';
};

export const getAxiosErrorMetadata = (error: AxiosError): ErrorMetadata => ({
  requestId: error?.config?.headers[RequestIdHeaderName],
  requestCode: error?.code,
  requestUrl: error?.config?.url,
  requestMessage: error?.message,
  responseStatus: error?.response?.status,
  responseStatusText: error?.response?.statusText,
  responseData: JSON.stringify(error?.response?.data || 'No response data'),
});

export const stringifyUrl = (url: string, query: string) => `${url}?${query}`;
