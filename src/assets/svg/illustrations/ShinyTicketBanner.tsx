import * as React from 'react';
import Svg, {Path, Rect, SvgProps} from 'react-native-svg';

function SvgShinyTicketBanner(props: SvgProps) {
  return (
    <Svg width={320} height={160} fill="none" viewBox="0 0 320 160" {...props}>
      <Path
        fill="#AAE6EC"
        d="M32.844 133.25C19.637 141.635 8.02 151.714.017 160L0 116.892c5.11-4.048 10.24-7.714 15.373-10.978l.748-.495c7.565-5.15 15.675-9.445 24.79-13.127C68.2 81.266 99.68 77.915 133.004 74.371l.104-.011c6.83-.727 13.885-1.477 21.03-2.313 31.742-3.707 77.627-11.378 116-26.879l1.732-.9C294.848 33.457 313.03 19.756 320 0v54.156c-12.826 9.316-23.646 15.417-37.741 21.112-41.713 16.852-90.653 25.081-124.367 29.019-7.171.839-14.177 1.584-20.961 2.306l-.152.016-.072.007-.276.03c-31.016 3.299-60.307 6.416-83.397 15.748-6.983 2.82-13.126 6.067-18.782 9.927l-.21.142-1.198.787z"
      />
      <Path
        fill="#EBECED"
        fillRule="evenodd"
        d="M152.956 28.53a6 6 0 01-11.592-3.107l-34.773-9.317c-6.401-1.716-12.981 2.083-14.697 8.485L73.26 94.138c-1.715 6.401 2.084 12.981 8.486 14.697l34.853 9.339a5.998 5.998 0 017.527-5.23 6 6 0 013.904 8.293l85.081 22.797c6.402 1.715 12.982-2.084 14.697-8.485l18.635-69.547c1.716-6.401-2.083-12.981-8.485-14.697L152.956 28.53zM140.69 51.123a6 6 0 103.105-11.591 6 6 0 00-3.105 11.591zm2.43 14.11a6 6 0 11-11.591-3.105 6 6 0 0111.591 3.105zM130.854 87.83a6 6 0 103.106-11.593 6 6 0 00-3.106 11.593zm2.431 14.11a6 6 0 11-11.589-3.108 6 6 0 0111.589 3.108z"
        clipRule="evenodd"
      />
      <Rect
        width={76}
        height={8}
        x={158.34}
        y={54.82}
        fill="#E1E3E4"
        rx={4}
        transform="rotate(15 158.335 54.817)"
      />
      <Rect
        width={76}
        height={8}
        x={153.16}
        y={74.14}
        fill="#E1E3E4"
        rx={4}
        transform="rotate(15 153.159 74.136)"
      />
      <Rect
        width={76}
        height={8}
        x={147.98}
        y={93.45}
        fill="#E1E3E4"
        rx={4}
        transform="rotate(15 147.982 93.454)"
      />
      <Path fill="#fff" d="M88 0l-4 32h8L88 0z" />
      <Path fill="#fff" d="M120 32l-32-4v8l32-4z" />
      <Path fill="#fff" d="M88 64l4-32h-8l4 32z" />
      <Path fill="#fff" d="M56 32l32 4v-8l-32 4zm168 92l-2 16h4l-2-16z" />
      <Path fill="#fff" d="M240 140l-16-2v4l16-2z" />
      <Path fill="#fff" d="M224 156l2-16h-4l2 16z" />
      <Path fill="#fff" d="M208 140l16 2v-4l-16 2z" />
    </Svg>
  );
}

export default SvgShinyTicketBanner;
