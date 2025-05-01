import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {useGetAvailableSportsQuery} from '../../store/core/core.service';
import {appColors} from '../../constants/colors';
import {fontRegular} from '../../styles/fonts';
import {ErrorMessage} from '../ErrorMessage';
import {useContainerShadow} from '../../utils/customHooks/customHooks';
import {useCardColor} from '../../utils/customHooks/colorHooks';

type SportItem = {
  id: number;
  name: string;
};

type MultiItemSelectorProps = {
  onItemSelected: (items: number[]) => void;
  isValid?: boolean;
  errorMessage?: string;
  selectedItems: number[];
  data: Record<string, string>;
};

const MultiItemSelector: React.FC<MultiItemSelectorProps> = ({
  onItemSelected,
  errorMessage = '',
  isValid,
  selectedItems,
  data,
}) => {
  const {data: sports} = useGetAvailableSportsQuery();
  const containerShadow = useContainerShadow();
  const cardColor = useCardColor();

  const toggleItem = useCallback(
    (sportId: number) => {
      const newSelectedSports = selectedItems.includes(sportId)
        ? selectedItems.filter(id => id !== sportId)
        : [...selectedItems, sportId];

      onItemSelected(newSelectedSports);
    },
    [selectedItems, onItemSelected],
  );

  const renderSportItem = useCallback(
    ({item}: {item: SportItem}) => {
      const isSelected = selectedItems.includes(item.id);

      return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          onPress={() => toggleItem(item.id)}
          style={[
            styles.sportItem,
            containerShadow,

            {
              backgroundColor: isSelected ? appColors.warmRed : cardColor,

              // borderWidth: isSelected ? 0.5 : 0.5,
              // borderColor: isSelected
              //   ? appColors.warmRed
              //   : `${appColors.black}20`,
            },
          ]}>
          <Text
            style={[
              fontRegular(14),
              {color: isSelected ? appColors.white : `${appColors.black}90`},
            ]}>
            {item.name}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedItems, toggleItem],
  );

  return (
    <View>
      {data ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            flexWrap: 'wrap',
            rowGap: 12,
            columnGap: 8,
          }}>
          {Object.entries(data).map(([key, itemName]) => {
            return renderSportItem({item: {id: Number(key), name: itemName}});
          })}
        </View>
      ) : null}

      {!isValid ? (
        <View style={styles.errorText}>
          <ErrorMessage message={errorMessage} />
        </View>
      ) : null}
    </View>
  );
};

export default MultiItemSelector;

const styles = StyleSheet.create({
  errorText: {
    paddingVertical: 12,
  },
  sportItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
