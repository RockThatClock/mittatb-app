import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function InfoIcon(props: SvgProps) {
  return (
    <Svg width={20} height={20} viewBox="0 0 20 20" fill="black" {...props}>
      <Path d="M10.8203 7.5V5.82031H9.17969V7.5H10.8203ZM10.8203 14.1797V9.17969H9.17969V14.1797H10.8203ZM4.10156 4.14062C5.74219 2.5 7.70833 1.67969 10 1.67969C12.2917 1.67969 14.2448 2.5 15.8594 4.14062C17.5 5.75521 18.3203 7.70833 18.3203 10C18.3203 12.2917 17.5 14.2578 15.8594 15.8984C14.2448 17.513 12.2917 18.3203 10 18.3203C7.70833 18.3203 5.74219 17.513 4.10156 15.8984C2.48698 14.2578 1.67969 12.2917 1.67969 10C1.67969 7.70833 2.48698 5.75521 4.10156 4.14062Z" />
    </Svg>
  );
}

export default InfoIcon;
