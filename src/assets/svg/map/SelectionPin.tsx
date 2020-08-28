import * as React from 'react';
import Svg, {Path, Circle, SvgProps} from 'react-native-svg';

function SvgSelectionPin(props: SvgProps) {
  return (
    <Svg width={40} height={60} fill="none" {...props}>
      <Path
        fill="#fff"
        d="M17.549 37.869a41.81 41.81 0 01-1.465-1.301 47.479 47.479 0 01-4.407-4.684C8.546 28.05 5 22.37 5 16 5 7.716 11.716 1 20 1c8.284 0 15 6.716 15 15 0 6.37-3.546 12.051-6.677 15.884a47.479 47.479 0 01-4.407 4.684c-.6.558-1.105.997-1.465 1.3-.36.305-2.451 1.939-2.451 1.939s-2.09-1.634-2.451-1.938z"
      />
      <Path
        fill="#71D6E0"
        fillRule="evenodd"
        d="M20 36s12-9.373 12-20c0-6.627-5.373-12-12-12S8 9.373 8 16c0 10.627 12 20 12 20z"
        clipRule="evenodd"
      />
      <Circle cx={20} cy={16} r={3} fill="#fff" />
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M14.343 50l-2.171 2.172a4 4 0 105.656 5.656L20 55.657l2.172 2.171a4 4 0 105.656-5.656L25.657 50l2.171-2.172a4 4 0 10-5.656-5.656L20 44.343l-2.172-2.171a4 4 0 00-5.656 0M14.343 50l-2.171-2.172a4 4 0 010-5.656"
        clipRule="evenodd"
      />
      <Path
        fill="#000"
        fillRule="evenodd"
        d="M14.293 45.707a1 1 0 011.414-1.414L20 48.586l4.293-4.293a1 1 0 011.414 1.414L21.414 50l4.293 4.293a1 1 0 01-1.414 1.414L20 51.414l-4.293 4.293a1 1 0 01-1.414-1.414L18.586 50l-4.293-4.293z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgSelectionPin;
