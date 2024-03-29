import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgChevronLeft(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 40 40" {...props}>
      <Path
        fillRule="evenodd"
        d="M14.586 18.586l8-8 2.828 2.828L18.828 20l6.586 6.586-2.828 2.828-8-8a2 2 0 010-2.828z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgChevronLeft;
