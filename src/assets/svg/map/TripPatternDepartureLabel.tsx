import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';

function SvgTripPatternDepartureLabel(props: SvgProps) {
  return (
    <Svg width={36} height={20} fill="none" viewBox="0 0 36 20" {...props}>
      <Path
        fill="#37424A"
        d="M0 4a4 4 0 014-4h28a4 4 0 014 4v12a4 4 0 01-4 4H4a4 4 0 01-4-4V4z"
      />
      <Path
        fill="#fff"
        d="M4.717 11.791c.111 1.459 1.347 2.408 3.14 2.408 1.934 0 3.159-.99 3.159-2.543 0-1.242-.704-1.922-2.455-2.361l-.885-.234c-1.166-.3-1.63-.68-1.63-1.342 0-.856.745-1.418 1.87-1.418 1.055 0 1.77.515 1.916 1.383h1.06c-.087-1.366-1.306-2.338-2.94-2.338-1.788 0-2.99.972-2.99 2.408 0 1.201.663 1.892 2.192 2.28l1.084.28c1.166.293 1.694.75 1.694 1.471 0 .838-.838 1.453-1.975 1.453-1.201 0-2.045-.562-2.174-1.447H4.717zm8.35-5.742v1.635h-1.02v.843h1.02v3.832c0 1.207.52 1.688 1.822 1.688.199 0 .392-.024.591-.059v-.85a4.275 4.275 0 01-.468.024c-.657 0-.938-.316-.938-1.06V8.527h1.406v-.843h-1.406V6.049h-1.008zm5.695 8.062c.843 0 1.535-.369 1.945-1.043h.094V14h.96V9.676c0-1.313-.86-2.104-2.402-2.104-1.347 0-2.343.668-2.478 1.682h1.02c.14-.498.667-.785 1.423-.785.944 0 1.43.427 1.43 1.207v.574l-1.822.111c-1.471.088-2.303.739-2.303 1.87 0 1.154.908 1.88 2.133 1.88zm.187-.884c-.732 0-1.277-.375-1.277-1.02 0-.633.422-.967 1.383-1.031l1.699-.111v.58c0 .902-.768 1.582-1.805 1.582zm4.676.773h1.008v-3.914c0-.89.697-1.535 1.658-1.535.2 0 .563.035.645.058V7.602a4.327 4.327 0 00-.504-.03c-.838 0-1.565.434-1.752 1.05h-.094v-.938h-.961V14zm5.344-7.951v1.635h-1.02v.843h1.02v3.832c0 1.207.521 1.688 1.822 1.688.2 0 .393-.024.592-.059v-.85a4.275 4.275 0 01-.469.024c-.656 0-.937-.316-.937-1.06V8.527h1.406v-.843h-1.406V6.049h-1.008z"
      />
    </Svg>
  );
}

export default SvgTripPatternDepartureLabel;
