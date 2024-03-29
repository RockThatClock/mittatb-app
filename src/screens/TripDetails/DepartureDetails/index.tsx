import {LegMode, TransportSubmode, TransportMode} from '../../../sdk';
import {RouteProp, useIsFocused} from '@react-navigation/native';
import React, {useCallback, useState} from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {DetailsModalNavigationProp, DetailsStackParams} from '..';
import {getDepartures} from '../../../api/serviceJourney';
import {Close} from '../../../assets/svg/icons/actions';
import {
  ArrowLeft,
  Expand,
  ExpandLess,
} from '../../../assets/svg/icons/navigation';
import ScreenHeader from '../../../ScreenHeader';
import {EstimatedCall, Situation} from '../../../sdk';
import SituationMessages from '../../../situations';
import {StyleSheet} from '../../../theme';
import {
  defaultFill,
  transportationColor,
} from '../../../utils/transportation-color';
import {getQuayName} from '../../../utils/transportation-names';
import usePollableResource from '../../../utils/use-pollable-resource';
import SituationRow from '../SituationRow';
import ThemeIcon from '../../../components/theme-icon';
import ThemeText from '../../../components/text';
import {parseISO} from 'date-fns';
import {useTranslation, DepartureDetailsTexts} from '../../../translations';
import TripRow from '../components/TripRow';
import Time from '../components/Time';
import TripLegDecoration from '../components/TripLegDecoration';
import {SafeAreaView} from 'react-native-safe-area-context';
import ScreenReaderAnnouncement from '../../../components/screen-reader-announcement';

export type DepartureDetailsRouteParams = {
  title: string;
  serviceJourneyId: string;
  date: string;
  fromQuayId?: string;
  toQuayId?: string;
  isBack?: boolean;
};

export type DetailScreenRouteProp = RouteProp<
  DetailsStackParams,
  'DepartureDetails'
>;

type Props = {
  route: DetailScreenRouteProp;
  navigation: DetailsModalNavigationProp;
};

export default function DepartureDetails({navigation, route}: Props) {
  const {
    title,
    serviceJourneyId,
    date,
    fromQuayId,
    toQuayId,
    isBack = false,
  } = route.params;
  const styles = useStopsStyle();
  const {t} = useTranslation();

  const isFocused = useIsFocused();
  const [
    {callGroups, mode, subMode, situations: parentSituations},
    ,
    isLoading,
  ] = useDepartureData(
    serviceJourneyId,
    date,
    fromQuayId,
    toQuayId,
    30,
    !isFocused,
  );

  const content = isLoading ? (
    <View>
      <ActivityIndicator
        color={defaultFill}
        style={styles.spinner}
        animating={true}
        size="large"
      />
      <ScreenReaderAnnouncement
        message={t(DepartureDetailsTexts.messages.loading)}
      />
    </View>
  ) : (
    <ScrollView style={styles.scrollView}>
      <SituationMessages
        situations={parentSituations}
        containerStyle={styles.situationsContainer}
      />
      <View style={styles.allGroups}>
        {mapGroup(callGroups, (name, group) => (
          <CallGroup
            key={group[0]?.quay?.id ?? name}
            calls={group}
            type={name}
            mode={mode}
            subMode={subMode}
            parentSituations={parentSituations}
          />
        ))}
      </View>
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        leftButton={{
          onPress: () => navigation.goBack(),
          icon: <ThemeIcon svg={isBack ? ArrowLeft : Close} />,
          accessible: true,
          accessibilityRole: 'button',
          accessibilityLabel: t(
            DepartureDetailsTexts.header.leftIcon.a11yLabel,
          ),
        }}
        title={title}
      />
      {content}
    </SafeAreaView>
  );
}
function mapGroup<T>(
  groups: CallListGroup,
  map: (group: keyof CallListGroup, calls: EstimatedCall[]) => T,
) {
  return Object.entries(groups).map(([name, group]) =>
    map(name as keyof CallListGroup, group),
  );
}

type CallGroupProps = {
  calls: EstimatedCall[];
  type: keyof CallListGroup;
  mode?: TransportMode;
  subMode?: TransportSubmode;
  parentSituations: Situation[];
};
function CallGroup({
  type,
  calls,
  mode,
  subMode,
  parentSituations,
}: CallGroupProps) {
  const isOnRoute = type === 'trip';
  const isBefore = type === 'passed';
  const showCollapsable = isBefore && calls.length > 1;
  const isStartPlace = (i: number) => isOnRoute && i === 0;
  const {t} = useTranslation();
  const [collapsed, setCollapsed] = useState(isBefore);
  const styles = useStopsStyle();
  if (!calls?.length) {
    return null;
  }

  const items = collapsed ? [calls[0]] : calls;
  const collapseButton = showCollapsable ? (
    <CollapseButtonRow
      key={`collapse-button-${type}`}
      collapsed={collapsed}
      setCollapsed={setCollapsed}
      label={t(DepartureDetailsTexts.collapse.label(calls.length - 1))}
    />
  ) : null;

  return (
    <>
      {items.map((call, i) => {
        const isStart = isStartPlace(i) || i === 0;
        const isEnd = i === items.length - 1 && !collapsed;
        const isBetween = !isStart && !isEnd;
        return (
          <View
            key={call.quay?.id + call.serviceJourney.id}
            style={[styles.place, isStart && styles.startPlace]}
          >
            <TripLegDecoration
              hasStart={isStart}
              hasCenter={isBetween}
              hasEnd={isEnd}
              color={
                type === 'passed' || type === 'after'
                  ? defaultFill
                  : transportationColor(mode, subMode)
              }
            ></TripLegDecoration>
            <TripRow
              rowLabel={
                <Time
                  aimedTime={call.aimedDepartureTime}
                  expectedTime={call.expectedDepartureTime}
                  missingRealTime={!call.realtime && isStartPlace(i)}
                ></Time>
              }
              alignChildren={
                isStart ? 'flex-start' : isEnd ? 'flex-end' : 'center'
              }
              style={[styles.row, isBetween && styles.middleRow]}
            >
              <ThemeText>{getQuayName(call.quay)} </ThemeText>
            </TripRow>

            {type !== 'passed' && (
              <SituationRow
                situations={call.situations}
                parentSituations={parentSituations}
              />
            )}
            {i === 0 && collapseButton}
          </View>
        );
      })}
    </>
  );
}

type CollapseButtonRowProps = {
  label: string;
  collapsed: boolean;
  setCollapsed(collapsed: boolean): void;
};
function CollapseButtonRow({
  label,
  collapsed,
  setCollapsed,
}: CollapseButtonRowProps) {
  const styles = useCollapseButtonStyle();
  const text = (
    <ThemeText color="faded" style={styles.text}>
      {label}
    </ThemeText>
  );
  const child = collapsed ? (
    <>
      {text}
      <ThemeIcon svg={Expand} />
    </>
  ) : (
    <>
      {text}
      <ThemeIcon svg={ExpandLess} />
    </>
  );
  return (
    <TouchableOpacity
      accessibilityRole="button"
      onPress={() => setCollapsed(!collapsed)}
    >
      <View style={styles.container}>{child}</View>
    </TouchableOpacity>
  );
}
const useCollapseButtonStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flexDirection: 'row',
    paddingBottom: theme.spacings.medium,
    marginLeft:
      theme.tripLegDetail.labelWidth +
      theme.tripLegDetail.decorationContainerWidth,
  },
  text: {
    marginRight: theme.spacings.xSmall,
  },
}));

const useStopsStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.background.level0,
  },
  startPlace: {
    marginTop: theme.spacings.large,
  },
  place: {
    marginBottom: -theme.tripLegDetail.decorationLineWidth,
  },
  endPlace: {
    marginBottom: theme.spacings.large,
  },
  row: {
    paddingVertical: theme.spacings.small,
  },
  middleRow: {
    minHeight: 60,
  },
  situationsContainer: {
    marginBottom: theme.spacings.small,
  },
  allGroups: {
    backgroundColor: theme.background.level0,
    marginBottom: theme.spacings.xLarge,
  },
  spinner: {height: 280},
  scrollView: {
    flex: 1,
    padding: theme.spacings.medium,
  },
}));

type DepartureData = {
  callGroups: CallListGroup;
  mode?: TransportMode;
  subMode?: TransportSubmode;
  situations: Situation[];
};

type CallListGroup = {
  passed: EstimatedCall[];
  trip: EstimatedCall[];
  after: EstimatedCall[];
};

function useDepartureData(
  serviceJourneyId: string,
  date: string,
  fromQuayId?: string,
  toQuayId?: string,
  pollingTimeInSeconds: number = 0,
  disabled?: boolean,
): [DepartureData, () => void, boolean, Error?] {
  const getService = useCallback(
    async function getServiceJourneyDepartures(): Promise<DepartureData> {
      const deps = await getDepartures(serviceJourneyId, parseISO(date));
      const callGroups = groupAllCallsByQuaysInLeg(deps, fromQuayId, toQuayId);
      const line = callGroups.trip[0]?.serviceJourney?.journeyPattern?.line;
      const parentSituation = callGroups.trip[0]?.situations;

      return {
        mode: line?.transportMode,
        subMode: line?.transportSubmode,
        callGroups,
        situations: parentSituation,
      };
    },
    [serviceJourneyId, fromQuayId, toQuayId],
  );

  return usePollableResource<DepartureData>(getService, {
    initialValue: {
      callGroups: {
        passed: [],
        trip: [],
        after: [],
      },
      situations: [],
    },
    pollingTimeInSeconds,
    disabled,
  });
}

const onType = (
  obj: CallListGroup,
  key: keyof CallListGroup,
  call: EstimatedCall,
): CallListGroup => ({
  ...obj,
  [key]: obj[key].concat(call),
});
function groupAllCallsByQuaysInLeg(
  calls: EstimatedCall[],
  fromQuayId?: string,
  toQuayId?: string,
): CallListGroup {
  let isAfterStart = false;
  let isAfterStop = false;

  if (!fromQuayId && !toQuayId) {
    return {
      passed: [],
      trip: calls,
      after: [],
    };
  }

  return calls.reduce(
    (obj, call) => {
      // We are at start quay, update flag
      if (call.quay?.id === fromQuayId) {
        isAfterStart = true;
      }

      if (!isAfterStart && !isAfterStop) {
        // is the first group
        obj = onType(obj, 'passed', call);
      } else if (isAfterStart && !isAfterStop) {
        // is the current route (between start/stop)
        obj = onType(obj, 'trip', call);
      } else {
        // is quays after stop
        obj = onType(obj, 'after', call);
      }

      // We are at stop, update flag
      if (call.quay?.id === toQuayId) {
        isAfterStop = true;
      }

      return obj;
    },
    {
      passed: [],
      trip: [],
      after: [],
    } as CallListGroup,
  );
}
