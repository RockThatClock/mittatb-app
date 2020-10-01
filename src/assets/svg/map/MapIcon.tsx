import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgMapIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <Path
        fill="#000"
        d="M12.871 6.978C12.297 9.206 10 11 10 11S7 8.657 7 6a2.997 2.997 0 013-3 3 3 0 013 3 3.902 3.902 0 01-.129.978z"
      />
      <Path
        fill="#000"
        d="M9.384 11.788l-.173-.136c.02.015.056.041.015.006a12.115 12.115 0 01-1.5-1.53C6.932 9.16 6 7.682 6 6.001c0-.21.016-.417.048-.619L2 7v10l5-2 6 2 5-2V5l-4.041 1.616c-.188 1.424-.99 2.662-1.685 3.513a12.117 12.117 0 01-1.5 1.53c-.041.034-.006.008.015-.008.025-.018.027-.02-.173.137a1 1 0 01-1.232 0z"
      />
      <Path
        fill="#fff"
        fillRule="evenodd"
        d="M10 2a4 4 0 013.973 3.534l3.656-1.462A1 1 0 0119 5v10a1 1 0 01-.629.928l-5 2a1 1 0 01-.687.02L7.03 16.065l-4.66 1.864A1 1 0 011 17V7a1 1 0 01.629-.928L6.458 4.14A4 4 0 0110 2zm-.616 9.788l-.173-.136c.02.015.056.041.015.006a12.115 12.115 0 01-1.5-1.53C6.932 9.16 6 7.682 6 6.001c0-.21.016-.417.048-.619L2 7v10l5-2 6 2 5-2V5l-4.041 1.616c-.188 1.424-.99 2.662-1.685 3.513a12.117 12.117 0 01-1.5 1.53c-.041.034-.005.008.015-.008.026-.018.027-.02-.173.137a1 1 0 01-1.232 0zM13 6c0 2.657-3 5-3 5S7 8.657 7 6a3 3 0 016 0z"
        clipRule="evenodd"
      />
    </Svg>
  );
}

export default SvgMapIcon;