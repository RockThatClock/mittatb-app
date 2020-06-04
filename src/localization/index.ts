// For Android until Hermes supports Intl
import 'intl';
import 'intl/locale-data/jsonp/en';
import 'intl/locale-data/jsonp/nb';

// Polyfills for react-intl
import {NumberFormat} from '@formatjs/intl-numberformat';
NumberFormat.__addLocaleData(
  require('@formatjs/intl-numberformat/dist/locale-data/nb.json'),
);
NumberFormat.__addLocaleData(
  require('@formatjs/intl-numberformat/dist/locale-data/en.json'),
);
import 'date-time-format-timezone';

if (!Intl.PluralRules) {
  require('@formatjs/intl-pluralrules/polyfill');
  require('@formatjs/intl-pluralrules/dist/locale-data/nb');
}
// @ts-ignore
if (!Intl.RelativeTimeFormat) {
  require('@formatjs/intl-relativetimeformat/polyfill');
  require('@formatjs/intl-relativetimeformat/dist/locale-data/nb'); // Add locale data for de
}

// @ts-ignore
if (!Intl.DisplayNames) {
  require('@formatjs/intl-displaynames/polyfill');
  require('@formatjs/intl-displaynames/dist/locale-data/nb'); // Add locale data for de
}
