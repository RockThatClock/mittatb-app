import React from 'react';
import {Text, View} from 'react-native';
import {StyleSheet, Theme} from '../../../theme';

export type ListRenderItem<ItemT> = (item: ItemT) => React.ReactElement | null;

type EditableListGroupProps<ItemT> = {
  title: string;
  data?: ReadonlyArray<ItemT>;
  renderItem: ListRenderItem<ItemT>;
  keyExtractor?: (item: ItemT, index: number) => string;
  renderAddButtonComponent?: () => React.ReactElement | null;
};
export default function EditableListGroup<T>({
  data,
  title,
  renderItem,
  keyExtractor = (_: T, i: number) => String(i),
  renderAddButtonComponent,
}: EditableListGroupProps<T>): React.ReactElement<
  EditableListGroupProps<T>
> | null {
  const css = useProfileStyle();
  return (
    <View style={css.textGroup}>
      <View style={css.header}>
        <Text style={css.headerText}>{title}</Text>
        <View style={css.headerDecorator}></View>
      </View>
      {renderAddButtonComponent && renderAddButtonComponent()}
      <View style={css.listSection}>
        {!data?.length ? (
          <Text style={css.empty}>
            Du har ingen favorittsteder. Legg til en nå.
          </Text>
        ) : (
          data.map((item, index) => (
            <View key={keyExtractor(item, index)}>{renderItem(item)}</View>
          ))
        )}
      </View>
    </View>
  );
}
const useProfileStyle = StyleSheet.createThemeHook((theme: Theme) => ({
  textGroup: {
    padding: theme.sizes.pagePadding,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
  },
  headerDecorator: {
    borderBottomWidth: 1,
    borderBottomColor: theme.text.primary,
    flex: 1,
    marginBottom: 3,
  },
  headerText: {
    backgroundColor: theme.background.primary,
    paddingEnd: 10,
    fontSize: 12,
    lineHeight: 16,
  },
  listSection: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  empty: {
    fontSize: 16,
    marginTop: 20,
  },
}));