import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import {v4 as uuid} from 'uuid';
import {API_BASE_URL} from 'react-native-dotenv';
import {getAxiosErrorType, getAxiosErrorMetadata} from './utils';
import {InstallIdHeaderName, RequestIdHeaderName} from './headers';
import {Result} from '@badrap/result';
import {DataError, Requester} from './types';

const {CancelToken} = axios;

export async function doRequest<T>(requester: Requester<T>) {
  return await requester.doRequest();
}

export default function setupRequester<T>(
  inner: (
    client: AxiosInstance,
    defaultOpts: AxiosRequestConfig,
  ) => Promise<AxiosResponse<T>>,
): Requester<T> {
  const source = CancelToken.source();
  const opts: AxiosRequestConfig = {cancelToken: source.token};

  async function doRequest(): Promise<Result<T, DataError>> {
    try {
      const response = await inner(client, opts);

      source.token.throwIfRequested();

      return Result.ok<T, DataError>(response.data);
    } catch (err) {
      return Result.err<DataError>(err);
    }
  }

  return {doRequest, cancel: source.cancel};
}

const client = createClient(API_BASE_URL);

function createClient(baseUrl: string) {
  const client = axios.create({
    baseURL: baseUrl,
  });
  client.interceptors.request.use(requestHandler, undefined);
  client.interceptors.response.use(undefined, responseErrorHandler);
  return client;
}

let installIdHeaderValue: string | null = null;

export function configureInstallId(installId: string) {
  installIdHeaderValue = installId;
}

let errorMiddleware: ((error: DataError) => void) | undefined = undefined;

export function configureErrorMiddleware(callback: (error: DataError) => void) {
  errorMiddleware = callback;
}

function requestHandler(config: AxiosRequestConfig): AxiosRequestConfig {
  config.headers[InstallIdHeaderName] = installIdHeaderValue;
  config.headers[RequestIdHeaderName] = uuid();
  return config;
}

function responseErrorHandler(error: AxiosError & DataError) {
  error.errorType = getAxiosErrorType(error);
  error.metadata = getAxiosErrorMetadata(error);

  errorMiddleware?.(error);

  return Promise.reject(error);
}
