import * as React from 'react';
import {StyleSheet} from '../../theme';
import {Portal} from 'react-native-portalize';
import {Modalize} from 'react-native-modalize';
import {View, Text, TouchableOpacity} from 'react-native';
import {useState, useRef, useEffect} from 'react';
import DatePicker from 'react-native-date-picker';
import Button from '../../components/button';
import CloseModalCrossIcon from '../../navigation/svg/CloseModalCrossIcon';
import SearchButton from '../../components/search-button';
import {formatToLongDateTime} from '../../utils/date';
import nb from 'date-fns/locale/nb';
import insets from '../../utils/insets';
import {Language} from '../../localization/LanguageContext';
import {dateTypes, travelTimes, timeButton, timeModal} from './messages';
import {useIntl, FormattedMessage} from 'react-intl';

type DateTypesWithoutNow = 'departure' | 'arrival';
type DateTypes = DateTypesWithoutNow | 'now';
export type DateOutput =
  | {
      date: Date;
      type: DateTypesWithoutNow;
    }
  | {
      type: 'now';
    };

type DateInputProps = {
  onDateSelected(value: DateOutput): void;
  value?: DateOutput;
};
const now = (): DateOutput => ({
  type: 'now',
});

function dateTypeToText(type: DateTypes): string {
  switch (type) {
    case 'arrival':
      return Language.formatMessage(dateTypes.arrival);
    case 'departure':
      return Language.formatMessage(dateTypes.departure);
    case 'now':
    default:
      return Language.formatMessage(dateTypes.now);
  }
}

function dateToText(date: DateOutput): string {
  if (date.type === 'now') {
    return Language.formatMessage(travelTimes.departureNow);
  }

  if (date.type === 'arrival') {
    return Language.formatMessage(travelTimes.arrivalAt, {
      time: formatToLongDateTime(date.date, nb),
    });
  }

  return Language.formatMessage(travelTimes.departureAt, {
    time: formatToLongDateTime(date.date, nb),
  });
}

const DateTypeButton: React.FC<{
  type: DateTypes;
  selected: DateTypes;
  onPress(type: DateTypes): void;
}> = ({type, selected, onPress}) => {
  const style = useStyle();
  const isSelected = type === selected;

  return (
    <View
      style={[
        style.dateTypeButton,
        isSelected ? style.dateTypeButtonSelected : undefined,
      ]}
    >
      <TouchableOpacity
        onPress={() => onPress(type)}
        hitSlop={insets.symmetric(12, 8)}
      >
        <Text style={style.dateTypeButtonText}>{dateTypeToText(type)}</Text>
      </TouchableOpacity>
    </View>
  );
};

const DateInput: React.FC<DateInputProps> = ({onDateSelected, value}) => {
  const style = useStyle();
  const valueOrDefault = value ?? now();
  const [dateObjectInternal, setDateObjectInternal] = useState<DateOutput>(
    valueOrDefault,
  );
  useEffect(() => {
    if (!value) {
      setDateObjectInternal(now());
    } else {
      setDateObjectInternal(value);
    }
  }, [value]);

  const modalizeRef = useRef<Modalize>(null);

  const onOpen = () => {
    modalizeRef.current?.open();
  };
  const onClose = () => {
    modalizeRef.current?.close();
  };

  const onChange = (date: Date) => {
    if (dateObjectInternal.type === 'now') {
      setDateObjectInternal({
        date,
        type: 'departure',
      });
    } else {
      setDateObjectInternal({
        date,
        type: dateObjectInternal.type,
      });
    }
  };

  const setNow = () => {
    setDateObjectInternal(now());
  };

  const setType = (type: DateTypesWithoutNow) => {
    setDateObjectInternal({
      date: dateOrDefault(dateObjectInternal),
      type,
    });
  };

  const onSave = () => {
    onDateSelected(dateObjectInternal);
    onClose();
  };

  const {formatMessage} = useIntl();

  return (
    <>
      <SearchButton
        title={formatMessage(timeButton.prefix)}
        placeholder={dateToText(valueOrDefault)}
        onPress={onOpen}
      />

      <Portal>
        <Modalize
          ref={modalizeRef}
          adjustToContentHeight={true}
          tapGestureEnabled={false}
        >
          <View style={style.container}>
            <View style={style.header}>
              <View style={style.headerTextContainer}>
                <Text style={style.headerText}>
                  <FormattedMessage {...timeModal.title} />
                </Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <CloseModalCrossIcon width={20} height={20} />
              </TouchableOpacity>
            </View>

            <View style={style.options}>
              <DateTypeButton
                onPress={setNow}
                type="now"
                selected={dateObjectInternal.type}
              />
              <DateTypeButton
                onPress={setType}
                type="departure"
                selected={dateObjectInternal.type}
              />
              <DateTypeButton
                onPress={setType}
                type="arrival"
                selected={dateObjectInternal.type}
              />
            </View>

            <View style={style.dateContainer}>
              <DatePicker
                date={dateOrDefault(dateObjectInternal)}
                onDateChange={onChange}
                locale="nb"
              />
            </View>

            <Button onPress={onSave} text={formatMessage(timeModal.button)} />
          </View>
        </Modalize>
      </Portal>
    </>
  );
};
const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    padding: 12,
  },
  dateContainer: {
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    borderBottomColor: theme.background.level1,
    borderBottomWidth: 1,
    paddingBottom: 12,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 12,
  },
  headerTextContainer: {
    flex: 1,
    marginLeft: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
  },
  dateTypeButton: {
    paddingBottom: 4,
    marginHorizontal: 6,
  },
  dateTypeButtonText: {
    fontWeight: '600',
  },
  dateTypeButtonSelected: {
    borderBottomColor: theme.background.accent,
    borderBottomWidth: 2,
  },
}));

function dateOrDefault(dateObject: DateOutput) {
  if (dateObject.type === 'now') {
    return new Date();
  }
  return dateObject.date;
}

export default DateInput;
