import React from 'react';
import {View, TouchableOpacity, Text, AccessibilityProps} from 'react-native';
import {Leg, TripPattern} from '../../sdk';
import {StyleSheet} from '../../theme';
import {
  secondsToDuration,
  secondsToDurationShort,
  secondsBetween,
  secondsToMinutesShort,
  formatToClockOrRelativeMinutes,
  missingRealtimePrefix,
  formatToClock,
} from '../../utils/date';
import TransportationIcon from '../../components/transportation-icon';
import insets from '../../utils/insets';
import {WalkingPerson} from '../../assets/svg/icons/transportation';
import {DestinationFlag} from '../../assets/svg/icons/places';
import {LegMode} from '@entur/sdk';
import {Duration} from '../../assets/svg/icons/transportation';
import AccessibleText, {
  screenReaderPause,
} from '../../components/accessible-text';
import {SituationWarningIcon} from '../../situations';
import {flatMap} from '../../utils/array';
import {getTranslatedModeName} from '../../utils/transportation-names';
import ThemeText from '../../components/text';
import ThemeIcon from '../../components/theme-icon';
import {
  AssistantTexts,
  TranslateFunction,
  dictionary,
  useTranslation,
} from '../../translations/';

type ResultItemProps = {
  tripPattern: TripPattern;
  onDetailsPressed(): void;
};

function legWithQuay(leg: Leg) {
  if (leg.fromEstimatedCall?.quay) {
    return true;
  }
  // Manually find name of from place based on mode as in some cases
  // (from adresses that are also quays) you won't have quay information in from place.
  const modesWithoutQuay: LegMode[] = [LegMode.BICYCLE, LegMode.FOOT];
  return !modesWithoutQuay.includes(leg.mode);
}

function getFromLeg(legs: Leg[]) {
  const found = legs.find(legWithQuay);
  const fromQuay = (found?.fromEstimatedCall ?? found?.fromPlace)?.quay;
  if (!fromQuay) {
    return legs[0].fromPlace.name ?? 'ukjent holdeplass';
  }
  const publicCodeOutput = fromQuay.publicCode ? ' ' + fromQuay.publicCode : '';
  return fromQuay.name + publicCodeOutput;
}
const ResultItemHeader: React.FC<{
  tripPattern: TripPattern;
}> = ({tripPattern}) => {
  const quayName = getFromLeg(tripPattern.legs);
  const styles = useThemeStyles();
  const durationText = secondsToDurationShort(tripPattern.duration);
  const {t} = useTranslation();

  const quayLeg = tripPattern.legs.find(legWithQuay);
  const timePrefix =
    !!quayLeg && !quayLeg.realtime ? missingRealtimePrefix : '';
  const quayStartTime =
    quayLeg?.expectedStartTime ?? tripPattern.legs[0].expectedStartTime;
  const wordSpacing = ' ';
  return (
    <View style={styles.resultHeader}>
      <ThemeText style={styles.resultHeaderLabel}>
        Fra{wordSpacing}
        {quayName}
        {wordSpacing}
        {timePrefix}
        {formatToClockOrRelativeMinutes(quayStartTime)}
      </ThemeText>
      <View style={styles.durationContainer}>
        <AccessibleText
          prefix={t(AssistantTexts.results.resultItem.details.totalDuration)}
        >
          {durationText}
        </AccessibleText>
      </View>

      <SituationWarningIcon
        situations={flatMap(tripPattern.legs, (leg) => leg.situations)}
        accessibilityLabel={t(
          AssistantTexts.results.resultItem.hasSituationsTip,
        )}
        style={styles.warningIcon}
      />
    </View>
  );
};

const ResultItem: React.FC<ResultItemProps & AccessibilityProps> = ({
  tripPattern,
  onDetailsPressed,
  ...props
}) => {
  const styles = useThemeStyles();
  const {t} = useTranslation();

  if (!tripPattern?.legs?.length) return null;

  return (
    <TouchableOpacity
      style={{paddingVertical: 4}}
      onPress={onDetailsPressed}
      hitSlop={insets.symmetric(8, 16)}
      accessibilityHint={t(AssistantTexts.results.resultItem.a11yHint)}
      accessibilityValue={{text: screenReaderSummary(tripPattern, t)}}
      {...props}
    >
      <View style={styles.result}>
        <ResultItemHeader tripPattern={tripPattern} />

        <View style={styles.detailsContainer}>
          {tripPattern.legs.map(function (leg, i) {
            if (leg.mode === 'foot') {
              return (
                <FootLeg
                  key={leg.fromPlace.latitude}
                  leg={leg}
                  nextLeg={tripPattern.legs[i + 1]}
                />
              );
            }
            return <TransportationLeg key={leg.serviceJourney.id} leg={leg} />;
          })}
          <DestinationLeg tripPattern={tripPattern} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  result: {
    padding: 12,
    backgroundColor: theme.background.level0,
    borderRadius: theme.border.radius.regular,
  },
  time: {
    fontSize: 32,
    color: theme.text.colors.primary,
    marginVertical: 8,
  },
  detailsContainer: {
    flexDirection: 'column',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
  },
  resultHeaderLabel: {
    flex: 7,
  },
  durationContainer: {
    flex: 2,
    alignItems: 'flex-end',
  },
  warningIcon: {
    marginLeft: theme.spacings.small,
  },
}));

const MINIMUM_WAIT_IN_SECONDS = 30;

const FootLeg = ({leg, nextLeg}: {leg: Leg; nextLeg?: Leg}) => {
  const styles = useLegStyles();
  const showWaitTime = Boolean(nextLeg);
  const {t} = useTranslation();
  const waitTimeInSeconds = !nextLeg
    ? 0
    : secondsBetween(leg.expectedEndTime, nextLeg?.expectedStartTime);
  const isWalkTimeOfSignificance = leg.duration > MINIMUM_WAIT_IN_SECONDS;
  const isWaitTimeOfSignificance =
    showWaitTime && waitTimeInSeconds > MINIMUM_WAIT_IN_SECONDS;

  if (!isWalkTimeOfSignificance && !isWaitTimeOfSignificance) {
    return null;
  }

  if (!isWalkTimeOfSignificance && isWaitTimeOfSignificance) {
    return (
      <View style={styles.legContainer}>
        <WaitRow time={waitTimeInSeconds} />
      </View>
    );
  }

  const walkTime = secondsToDuration(leg.duration ?? 0);
  const text = !isWaitTimeOfSignificance
    ? t(AssistantTexts.results.resultItem.footLeg.walkLabel(walkTime))
    : t(
        AssistantTexts.results.resultItem.footLeg.walkandWaitLabel(
          walkTime,
          secondsToDuration(waitTimeInSeconds),
        ),
      );

  return (
    <View style={styles.legContainer}>
      <ThemeText
        type="label"
        color="faded"
        style={[styles.textDeprioritized, styles.time]}
      >
        {formatToClockOrRelativeMinutes(leg.expectedStartTime)}
      </ThemeText>
      <View style={styles.iconContainer}>
        <ThemeIcon svg={WalkingPerson} opacity={0.6} />
      </View>
      <ThemeText
        type="lead"
        color="faded"
        style={[styles.textContent, styles.textDeprioritized]}
      >
        {text}
      </ThemeText>
    </View>
  );
};

function WaitRow({time}: {time: number}) {
  const styles = useLegStyles();
  const {t} = useTranslation();
  const waitTime = `${secondsToMinutesShort(time)}`;
  return (
    <View style={styles.legContainer}>
      <ThemeText style={[styles.textDeprioritized, styles.time]}>
        {waitTime}
      </ThemeText>
      <View style={styles.iconContainer}>
        <ThemeIcon svg={Duration} opacity={0.6} />
      </View>
      <ThemeText style={[styles.textContent, styles.textDeprioritized]}>
        {t(AssistantTexts.results.resultItem.waitRow.label)}
      </ThemeText>
    </View>
  );
}

const useLegStyles = StyleSheet.createThemeHook((theme) => ({
  legContainer: {
    flexDirection: 'row',
    paddingVertical: 4,
    alignItems: 'center',
  },
  time: {
    minWidth: 50,
    fontVariant: ['tabular-nums'],
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    flexWrap: 'wrap',
  },
  textDeprioritized: {
    ...theme.text.lead,
    fontWeight: 'normal',
    color: theme.text.colors.faded,
  },
  textBold: {
    fontWeight: 'bold',
  },
}));

const TransportationLeg = ({leg}: {leg: Leg}) => {
  const styles = useLegStyles();
  return (
    <View style={styles.legContainer}>
      <ThemeText type="body" style={styles.time}>
        {formatToClockOrRelativeMinutes(leg.expectedStartTime)}
      </ThemeText>
      <View style={styles.iconContainer}>
        <TransportationIcon
          mode={leg.mode}
          subMode={leg.line?.transportSubmode}
        />
      </View>
      <ThemeText type="body" style={styles.textContent}>
        <LineDisplayName leg={leg} />
      </ThemeText>
    </View>
  );
};

const DestinationLeg = ({tripPattern}: {tripPattern: TripPattern}) => {
  const styles = useLegStyles();
  const lastLeg = tripPattern.legs[tripPattern.legs.length - 1];
  if (!lastLeg) return null;

  return (
    <View style={styles.legContainer}>
      <ThemeText style={[styles.time, styles.textDeprioritized]}>
        {formatToClockOrRelativeMinutes(lastLeg.expectedEndTime)}
      </ThemeText>
      <View accessibilityLabel="Destinasjon" style={styles.iconContainer}>
        <ThemeIcon svg={DestinationFlag} opacity={0.6} />
      </View>
      <ThemeText
        style={[styles.textContent, styles.textDeprioritized]}
        numberOfLines={1}
      >
        {lastLeg.toPlace.name}
      </ThemeText>
    </View>
  );
};

function LineDisplayName({leg}: {leg: Leg}) {
  const name =
    leg.fromEstimatedCall?.destinationDisplay?.frontText ?? leg.line?.name;
  return (
    <ThemeText>
      <Text style={{marginRight: 12, fontWeight: 'bold'}}>
        {leg.line?.publicCode}
      </Text>{' '}
      <ThemeText numberOfLines={1}>{name}</ThemeText>
    </ThemeText>
  );
}

const screenReaderSummary = (
  tripPattern: TripPattern,
  t: TranslateFunction,
) => {
  const hasSituations = flatMap(tripPattern.legs, (leg) => leg.situations)
    .length;

  const nonFootLegs = tripPattern.legs.filter((l) => l.mode !== 'foot') ?? [];
  const startLeg = !nonFootLegs.length ? tripPattern.legs[0] : nonFootLegs[0];
  const screenreaderText = AssistantTexts.results.resultItem.journeySummary;

  return `
  ${
    hasSituations
      ? `${t(screenreaderText.situationsWarning)} ${screenReaderPause} `
      : ''
  }
  ${t(
    screenreaderText.time(
      formatToClock(tripPattern.startTime),
      formatToClock(tripPattern.endTime),
    ),
  )} ${screenReaderPause}
     ${t(
       screenreaderText.duration(secondsToDuration(tripPattern.duration)),
     )} ${screenReaderPause}
    ${
      !nonFootLegs.length
        ? t(screenreaderText.legsDescription.footLegsOnly)
        : nonFootLegs.length === 1
        ? t(screenreaderText.legsDescription.noSwitching)
        : nonFootLegs.length === 2
        ? t(screenreaderText.legsDescription.oneSwitch)
        : t(screenreaderText.legsDescription.someSwitches(nonFootLegs.length))
    }. ${screenReaderPause}
    ${nonFootLegs
      ?.map((l) => {
        return `${t(getTranslatedModeName(l.mode))} ${
          l.line
            ? t(screenreaderText.prefixedLineNumber(l.line.publicCode))
            : ''
        }`;
      })
      .join(', ')} ${screenReaderPause}
      ${t(
        screenreaderText.totalWalkDistance(tripPattern.walkDistance.toFixed(0)),
      )}  ${screenReaderPause}
      ${t(
        screenreaderText.departureInfo(
          startLeg.fromPlace?.name ?? '',
          formatToClock(startLeg.expectedStartTime),
        ),
      )} ${screenReaderPause}

  `;
};

export default ResultItem;
