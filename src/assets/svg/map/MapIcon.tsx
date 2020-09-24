import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgMapIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <Path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M10 2C12.0514 2 13.7421 3.54427 13.9731 5.53373L17.6286 4.07153C17.9367 3.94829 18.2859 3.98591 18.5606 4.17194C18.8354 4.35797 19 4.66818 19 5V15C19 15.4089 18.751 15.7766 18.3714 15.9285L13.3714 17.9285C13.1518 18.0163 12.9082 18.0235 12.6838 17.9487L7.03128 16.0645L2.37139 17.9285C2.0633 18.0517 1.71414 18.0141 1.43937 17.8281C1.1646 17.642 1 17.3318 1 17V7C1 6.5911 1.24895 6.22339 1.62861 6.07153L6.45795 4.13979C7.1275 2.86752 8.46244 2 10 2ZM9.38445 11.7881C9.18369 11.6313 9.18551 11.6326 9.21103 11.6515C9.2315 11.6666 9.26721 11.693 9.22597 11.6582C9.1333 11.58 9.00419 11.4676 8.85077 11.3251C8.54519 11.0414 8.13659 10.632 7.72563 10.1291C6.93183 9.15756 6 7.68067 6 6C6 5.78946 6.01627 5.58272 6.04761 5.38096L2 7V17L7 15L13 17L18 15V5L13.9589 6.61645C13.7706 8.03987 12.9695 9.27826 12.2744 10.1291C11.8634 10.632 11.4548 11.0414 11.1492 11.3251C10.9958 11.4676 10.8667 11.58 10.774 11.6582C10.7328 11.693 10.7685 11.6666 10.789 11.6515C10.8145 11.6326 10.8163 11.6313 10.6155 11.7881C10.2538 12.0706 9.74619 12.0706 9.38445 11.7881ZM13 6C13 8.65685 10 11 10 11C10 11 7 8.65685 7 6C7 4.34315 8.34315 3 10 3C11.6569 3 13 4.34315 13 6Z"
        fill="white"
      />
      <Path
        d="M12.8711 6.97765C12.2969 9.20603 10 11 10 11C10 11 7 8.65685 7 6C7 5.66837 7.05381 5.3493 7.15318 5.05106C7.55025 3.85927 8.67478 3 10 3C11.6569 3 13 4.34315 13 6C13 6.3255 12.955 6.6463 12.8759 6.95865C12.8743 6.96499 12.8727 6.97132 12.8711 6.97765Z"
        fill="black"
      />
      <Path
        d="M9.38445 11.7881C9.18369 11.6313 9.18551 11.6326 9.21103 11.6515C9.2315 11.6666 9.26721 11.693 9.22597 11.6582C9.1333 11.58 9.00419 11.4676 8.85077 11.3251C8.54519 11.0414 8.13659 10.632 7.72563 10.1291C6.93183 9.15756 6 7.68067 6 6C6 5.78946 6.01627 5.58272 6.04761 5.38096L2 7V17L7 15L13 17L18 15V5L13.9589 6.61645C13.7706 8.03987 12.9695 9.27826 12.2744 10.1291C11.8634 10.632 11.4548 11.0414 11.1492 11.3251C10.9958 11.4676 10.8667 11.58 10.774 11.6582C10.7328 11.693 10.7684 11.6667 10.7889 11.6515C10.8144 11.6327 10.8163 11.6313 10.6155 11.7881C10.2538 12.0706 9.74619 12.0706 9.38445 11.7881Z"
        fill="black"
      />
    </Svg>
  );
}

export default SvgMapIcon;
