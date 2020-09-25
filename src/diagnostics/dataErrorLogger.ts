import {DataError} from '../api/types';
import bugsnag from '@bugsnag/react-native';

export default function dataErrorLogger(error: DataError) {
  const {errorType, metadata: errorMetadata} = error;
  switch (errorType) {
    case 'normal':
      bugsnag.notify(error, (event) => {
        event.addMetadata('data', {
          ...errorMetadata,
        });
      });
      break;
    case 'unknown':
      bugsnag.notify(error);
      break;
    case 'network-error':
    case 'timeout':
      // This happens all the time in mobile apps,
      // so will be a lot of noise if we choose to report these
      console.warn(errorType, error);
      break;
    case 'cancel':
      // Not really an error if consumer
      // cancels request
      break;
  }

  return Promise.reject(error);
}
