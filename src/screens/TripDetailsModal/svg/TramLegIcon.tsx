import * as React from 'react';
import {Path, Color} from 'react-native-svg';
import LegTransportMethodIcon, {
  LegTransportMethodIconProps,
} from './LegTransportMethodIcon';

type TramLegIconProps = LegTransportMethodIconProps & {iconColor?: Color};

function TramLegIcon(props: TramLegIconProps) {
  const {iconColor = '#000000'} = props;
  return (
    <LegTransportMethodIcon {...props}>
      <Path
        fill={iconColor}
        translate="2"
        d="M14.566 15.445c.211.211.48.317.809.317.328 0 .598-.106.809-.317.21-.234.316-.504.316-.808 0-.305-.105-.563-.316-.774a1.04 1.04 0 00-.809-.351 1.04 1.04 0 00-.809.351c-.21.211-.316.469-.316.774 0 .304.105.574.316.808zm-1.828-4.957H16.5V7.5h-3.762v2.988zm-1.476 0V7.5H7.5v2.988h3.762zm-3.446 4.957c.211.211.48.317.809.317.328 0 .598-.106.809-.317.21-.234.316-.504.316-.808 0-.305-.105-.563-.316-.774a1.04 1.04 0 00-.809-.351 1.04 1.04 0 00-.809.351c-.21.211-.316.469-.316.774 0 .304.105.574.316.808zM12 4.512c1.945 0 3.434.199 4.465.597 1.031.399 1.547 1.196 1.547 2.391v7.137a2.54 2.54 0 01-.774 1.863 2.602 2.602 0 01-1.863.738l1.125 1.125v.387h-1.512l-1.476-1.512h-2.848L9.188 18.75H7.5v-.387l1.125-1.125a2.602 2.602 0 01-1.863-.738 2.54 2.54 0 01-.774-1.863V7.5c0-.633.164-1.16.492-1.582.329-.422.797-.727 1.407-.914a10.993 10.993 0 011.863-.387c.633-.07 1.383-.105 2.25-.105z"
      />
    </LegTransportMethodIcon>
  );
}

export default TramLegIcon;
