import {useScrollToTop} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {
  AccessibilityProps,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import useChatIcon from '../../chat/use-chat-icon';
import AnimatedScreenHeader from '../../ScreenHeader/animated-header';
import LogoOutline from '../../ScreenHeader/LogoOutline';
import {StyleSheet, useTheme} from '../../theme';
import throttle from '../../utils/throttle';
import {useLayout} from '../../utils/use-layout';
import ThemeIcon from '../theme-icon';

type Props = {
  header: React.ReactNode;
  onRefresh?(): void;
  headerHeight?: number;
  isRefreshing?: boolean;
  isFullHeight?: boolean;

  useScroll?: boolean;
  headerTitle: React.ReactNode;
  alternativeTitleComponent?: React.ReactNode;

  headerMargin?: number;

  logoClick?: {callback(): void} & AccessibilityProps;

  onEndReached?(e: NativeScrollEvent): void;
  onEndReachedThreshold?: number;
};

type Scrollable = {
  scrollTo(opts: {y: number}): void;
};

const SimpleDisappearingHeader: React.FC<Props> = ({
  header,
  children,
  isRefreshing = false,
  onRefresh,

  logoClick,

  headerTitle,
  alternativeTitleComponent,

  onEndReached,
  onEndReachedThreshold = 10,
}) => {
  const {
    contentHeight,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  } = useCalculateHeaderContentHeight();
  const contentHeightRef = React.useRef(contentHeight);
  const scrollableContentRef = React.useRef<ScrollView>(null);
  useScrollToTop(
    React.useRef<Scrollable>({
      scrollTo: () =>
        scrollableContentRef.current?.scrollTo({y: -contentHeightRef.current}),
    }),
  );

  useEffect(() => {
    contentHeightRef.current = contentHeight;
  }, [contentHeight]);

  const chatIcon = useChatIcon();
  const styles = useThemeStyles();
  const {theme} = useTheme();
  const scrollYRef = useRef(new Animated.Value(0)).current;
  const nullRef = useRef(new Animated.Value(0)).current;

  const headerTranslate = scrollYRef.interpolate({
    inputRange: [0, contentHeight],
    outputRange: [0, -contentHeight],
    extrapolate: 'clamp',
  });

  const {top} = useSafeAreaInsets();
  const screenTopStyle = useMemo(
    () => ({
      paddingTop: top,
    }),
    [top],
  );

  const endReachListener = useCallback(
    throttle((e: NativeScrollEvent) => {
      if (!onEndReached) return;
      if (!isRefreshing && hasReachedEnd(e, onEndReachedThreshold)) {
        onEndReached(e);
      }
    }, 400),
    [isRefreshing, onEndReached, onEndReachedThreshold],
  );

  const onScrolling = useCallback(
    (e: NativeScrollEvent) => {
      endReachListener(e);
    },
    [endReachListener],
  );

  return (
    <>
      <View style={[styles.topBorder, screenTopStyle]} />
      <View style={styles.screen}>
        <AnimatedScreenHeader
          onLayout={onScreenHeaderLayout}
          title={headerTitle}
          rightButton={chatIcon}
          alternativeTitleComponent={alternativeTitleComponent}
          scrollRef={isRefreshing ? nullRef : scrollYRef}
          leftButton={{
            onPress: logoClick?.callback,
            icon: <ThemeIcon svg={LogoOutline} />,
            ...logoClick,
          }}
        />

        <View style={styles.content}>
          <Animated.View
            style={[
              styles.header,
              {transform: [{translateY: headerTranslate}]},
            ]}
          >
            <View onLayout={onHeaderContentLayout}>{header}</View>
          </Animated.View>

          <Animated.ScrollView
            ref={scrollableContentRef}
            scrollEventThrottle={10}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                progressViewOffset={contentHeight}
                tintColor={theme.text.colors.primary}
              />
            }
            onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollYRef}}}],
              {
                useNativeDriver: true,
                listener: (e: NativeSyntheticEvent<NativeScrollEvent>) => {
                  onScrolling(e.nativeEvent);
                },
              },
            )}
            contentContainerStyle={{
              paddingTop: Platform.OS === 'ios' ? 0 : contentHeight,
            }}
            contentInset={{top: contentHeight}}
            contentOffset={{x: 0, y: -contentHeight}}
            automaticallyAdjustContentInsets={false}
          >
            {children}
          </Animated.ScrollView>
        </View>
      </View>
    </>
  );
};
export default SimpleDisappearingHeader;

const hasReachedEnd = (
  {layoutMeasurement, contentOffset, contentSize}: NativeScrollEvent,
  paddingThreshold: number,
) => {
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingThreshold
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  screen: {
    backgroundColor: theme.background.level1,
    flexGrow: 1,
  },
  topBorder: {
    backgroundColor: theme.background.header,
  },

  content: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 2,
    elevated: 1,
    backgroundColor: theme.background.header,
    justifyContent: 'space-between',
  },
  container: {
    backgroundColor: theme.background.level1,
    paddingBottom: 0,
    flexGrow: 1,
  },
}));

function useCalculateHeaderContentHeight() {
  const {onLayout: onScreenHeaderLayout} = useLayout();
  const {onLayout: onHeaderContentLayout, height: contentHeight} = useLayout();

  return {
    contentHeight,
    onScreenHeaderLayout,
    onHeaderContentLayout,
  };
}
