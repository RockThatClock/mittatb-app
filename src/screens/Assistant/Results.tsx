import React from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import {TripPattern} from '../../sdk';
import {StyleSheet, Theme, useTheme} from '../../theme';
import ResultItem from './ResultItem';
import {AssistantScreenNavigationProp} from './';
import ViewPager from '@react-native-community/viewpager';
import {TouchableOpacity} from 'react-native-gesture-handler';
import useViewPagerIndexController from './useViewPagerIndexController';
import LeftArrow from './svg/LeftArrow';
import RightArrow from './svg/RightArrow';
import InfoIcon from '../../assets/svg/InfoIcon';
import hexToRgba from 'hex-to-rgba';
import colors from '../../theme/colors';

type Props = {
  tripPatterns: TripPattern[] | null;
  isSearching: boolean;
  navigation: AssistantScreenNavigationProp;
  onDetailsPressed(tripPattern: TripPattern): void;
};

export type ResultTabParams = {
  [key: string]: {tripPattern: TripPattern};
};

const Results: React.FC<Props> = ({
  tripPatterns,
  isSearching,
  onDetailsPressed,
}) => {
  const {theme} = useTheme();
  const styles = useThemeStyles(theme);
  const arrowFill = useArrowFill(theme);

  const {
    viewPagerRef,
    nextPage,
    previousPage,
    onPageSelected,
    disablePaging,
    isFirstPage,
    isLastPage,
  } = useViewPagerIndexController(0, tripPatterns?.length ?? 0);

  if (isSearching) {
    return (
      <ActivityIndicator animating={true} size="large" style={styles.spinner} />
    );
  }

  if (!tripPatterns) {
    return null;
  }

  if (!tripPatterns.length) {
    return (
      <View style={styles.container}>
        <View style={styles.infoBox}>
          <View style={styles.infoBoxIcon}>
            <InfoIcon />
          </View>
          <Text style={styles.infoBoxText}>
            Vi fant dessverre ingen reiseruter som passer til ditt søk. {'\n'}
            Vennligst prøv et annet avreisested eller destinasjon.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.detailContainer}>
        <View style={[styles.buttonContainer, {left: 10}]}>
          <TouchableOpacity
            style={styles.button}
            onPress={previousPage}
            hitSlop={{bottom: 8, top: 8, right: 8, left: 8}}
            disabled={isFirstPage}
          >
            <LeftArrow
              fill={isFirstPage ? arrowFill.disabled : arrowFill.enabled}
            />
          </TouchableOpacity>
        </View>

        <ViewPager
          ref={viewPagerRef}
          style={styles.viewPager}
          initialPage={0}
          onPageScrollStateChanged={ev => {
            switch (ev.nativeEvent.pageScrollState) {
              case 'dragging':
                disablePaging(true);
                break;
              case 'idle':
                disablePaging(false);
            }
          }}
          onPageSelected={({nativeEvent}) => {
            onPageSelected(nativeEvent.position);
          }}
        >
          {tripPatterns.map((tripPattern, i) => (
            <View key={i}>
              <ResultItem
                tripPattern={tripPattern}
                onDetailsPressed={onDetailsPressed}
              />
            </View>
          ))}
        </ViewPager>
        <View style={[styles.buttonContainer, {right: 10}]}>
          <TouchableOpacity
            style={styles.button}
            onPress={nextPage}
            hitSlop={{bottom: 8, top: 8, right: 8, left: 8}}
            disabled={isLastPage}
          >
            <RightArrow
              fill={isLastPage ? arrowFill.disabled : arrowFill.enabled}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Results;

const useArrowFill = (theme: Theme) => ({
  enabled: theme.text.primary,
  disabled: hexToRgba(theme.text.primary, 0.2),
});

const useThemeStyles = StyleSheet.createTheme(theme => ({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBox: {
    backgroundColor: colors.secondary.cyan,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: 327,
    paddingVertical: 8,
    paddingRight: 12,
  },
  infoBoxIcon: {padding: 12},
  infoBoxText: {fontSize: 16, flex: 1, flexWrap: 'wrap'},
  spinner: {height: 280},
  detailContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    zIndex: 1,
    position: 'absolute',
  },
  button: {
    zIndex: 1,
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewPager: {height: 280, width: '100%'},
  timeText: {
    fontSize: 28,
    color: theme.text.primary,
  },
  locationText: {
    fontSize: 12,
    color: theme.text.primary,
    marginTop: 8,
  },
}));