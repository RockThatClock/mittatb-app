import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import colors from '../../theme/colors';
import {Add, Remove} from '../../assets/svg/icons/actions';
import {StyleSheet} from '../../theme';
import shadows from './shadows';

export type Props = {
  zoomIn(): void;
  zoomOut(): void;
};

const MapControls: React.FC<Props> = ({zoomIn, zoomOut}) => {
  return (
    <View>
      <View style={styles.zoomContainer}>
        <TouchableOpacity
          onPress={zoomIn}
          accessibilityLabel="Zoom inn"
          accessibilityRole="button"
        >
          <View style={styles.zoomInButton}>
            <Add />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={zoomOut}
          accessibilityLabel="Zoom ut"
          accessibilityRole="button"
        >
          <View style={styles.zoomOutButton}>
            <Remove />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  zoomContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    ...shadows,
  },
  zoomInButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomOutButton: {
    width: 36,
    height: 36,
    borderTopColor: colors.general.gray200,
    borderTopWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default MapControls;