import colors from '../theme/colors';
import {LegMode, TransportMode, TransportSubmode} from '../sdk';

export const defaultFill = colors.primary.gray_300;

export function transportationColor(
  mode?: LegMode | TransportMode,
  subMode?: TransportSubmode,
): string {
  switch (mode) {
    case 'bus':
    case 'coach':
      if (subMode === 'localBus') {
        return colors.primary.green_500;
      }
      return colors.secondary.blue_500;
    case 'rail':
      return colors.secondary.red_500;
    case 'tram':
      return colors.primary.green_500;
    case 'water':
      return colors.text.white;
    case 'air':
      return colors.secondary.orange;
    default:
      return defaultFill;
  }
}
