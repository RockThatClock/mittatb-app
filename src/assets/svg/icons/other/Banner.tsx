import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgBanner(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="black" viewBox="0 0 320 160" {...props}>
      <Path
        fill="#AAE6EC"
        d="M32.844 133.256C19.637 141.642 8.003 151.713 0 160v-43.102c5.11-4.048 10.24-7.714 15.373-10.979l.748-.494c7.565-5.151 15.675-9.446 24.79-13.128C68.2 81.27 99.68 77.919 133.004 74.374l.104-.01c6.83-.727 13.885-1.478 21.03-2.313 31.742-3.707 77.627-11.38 116-26.88l1.732-.9C294.848 33.457 313.03 19.756 320 0v54.158c-12.826 9.318-23.646 15.418-37.741 21.114-41.713 16.852-90.653 25.082-124.367 29.02-7.171.839-14.177 1.584-20.961 2.306l-.152.016-.072.008-.276.029c-31.016 3.3-60.307 6.416-83.397 15.749-6.983 2.82-13.126 6.068-18.782 9.928l-.21.141-1.198.787z"
      />
    </Svg>
  );
}

export default SvgBanner;
