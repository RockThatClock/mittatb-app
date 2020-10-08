import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import Dash from 'react-native-dash';
import {formatToClock, missingRealtimePrefix} from '../../../utils/date';
import {Dot} from '../../../assets/svg/icons/other';
import LocationRow from '../LocationRow';
import {LegDetailProps, DetailScreenNavigationProp} from '.';
import {useNavigation} from '@react-navigation/native';
import TransportationIcon from '../../../components/transportation-icon';
import {
  getLineName,
  getQuayNameFromStartLeg,
  getQuayNameFromStopLeg,
} from '../../../utils/transportation-names';
import {getAimedTimeIfLargeDifference} from '../utils';
import WaitRow from './WaitRow';
import transportationColor from '../../../utils/transportation-color';
import SituationRow from '../SituationRow';
import colors from '../../../theme/colors';

const TransportDetail: React.FC<LegDetailProps> = ({
  leg,
  nextLeg,
  isIntermediateTravelLeg,
  onCalculateTime,
  showFrom,
  parentSituations = [],
}) => {
  const navigation = useNavigation<DetailScreenNavigationProp>();
  const showWaitTime = isIntermediateTravelLeg && Boolean(nextLeg);
  const {fill} = transportationColor(leg.mode, leg.line?.publicCode);

  const timeString = (time: string) => {
    if (!leg.realtime) {
      return missingRealtimePrefix + formatToClock(time);
    }
    return formatToClock(time);
  };

  return (
    <View style={{marginTop: -6}}>
      <TouchableOpacity
        style={{overflow: 'visible'}}
        onPress={() =>
          navigation.navigate('DepartureDetails', {
            title: getLineName(leg),
            serviceJourneyId: leg.serviceJourney.id,
            fromQuayId: leg.fromPlace.quay?.id,
            toQuayId: leg.toPlace.quay?.id,
            isBack: true,
          })
        }
      >
        <View style={styles.dashContainer}>
          <Dash
            dashGap={0}
            dashThickness={8}
            dashLength={8}
            dashColor={fill}
            style={styles.dash}
          />
        </View>
        {showFrom && (
          <LocationRow
            icon={
              <TransportationIcon
                mode={leg.mode}
                publicCode={leg.line?.publicCode}
              />
            }
            label={getQuayNameFromStartLeg(leg)}
            time={timeString(leg.expectedStartTime)}
            aimedTime={
              leg.realtime
                ? getAimedTimeIfLargeDifference(leg.fromEstimatedCall)
                : undefined
            }
            timeStyle={{fontWeight: 'bold', fontSize: 16}}
            textStyle={styles.textStyle}
            dashThroughIcon={true}
          />
        )}
        <Text style={styles.lineName}>{getLineName(leg)}</Text>

        <SituationRow
          situations={leg.situations}
          parentSituations={parentSituations}
        />

        <LocationRow
          icon={<Dot fill={fill} />}
          label={getQuayNameFromStopLeg(leg)}
          time={timeString(leg.expectedEndTime)}
          aimedTime={
            leg.realtime
              ? getAimedTimeIfLargeDifference(leg.toEstimatedCall)
              : undefined
          }
          textStyle={styles.textStyle}
          dashThroughIcon={true}
        />
      </TouchableOpacity>
      {showWaitTime && (
        <View style={styles.waitDashContainer}>
          <Dash
            dashGap={4}
            dashLength={4}
            dashThickness={4}
            dashCount={3}
            dashColor={colors.general.gray200}
            style={styles.waitDash}
          />
          <View style={styles.waitContainer}>
            <WaitRow
              onCalculateTime={onCalculateTime}
              currentLeg={leg}
              nextLeg={nextLeg!}
            />
          </View>
          <Dash
            dashGap={4}
            dashLength={4}
            dashThickness={4}
            dashCount={3}
            dashColor={colors.general.gray200}
            style={styles.waitDash}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textStyle: {fontSize: 14, lineHeight: 20},
  lineName: {
    marginLeft: 120,
    fontSize: 16,
    fontWeight: '600',
    marginVertical: 12,
  },
  dashContainer: {
    marginLeft: 95,
    position: 'absolute',
    height: '100%',
    paddingVertical: 12,
  },
  dash: {
    flexDirection: 'column',
    height: '100%',
  },
  waitDashContainer: {
    marginLeft: 90,
  },
  waitContainer: {
    marginBottom: 5,
  },
  waitDash: {
    flexDirection: 'column',
    padding: 0,
    marginLeft: 7,
    marginBottom: 1,
  },
});

export default TransportDetail;
