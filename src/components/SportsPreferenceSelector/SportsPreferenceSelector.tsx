import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback} from 'react';
import {useGetAvailableSportsQuery} from '../../store/core/core.service';
import {appColors} from '../../constants/colors';
import {fontRegular} from '../../styles/fonts';

type SportItem = {
  id: number;
  name: string;
};

type SportsPreferenceSelectorProps = {
  onSportsSelected: (sports: number[]) => void;
  isValid?: boolean;
  errorMessage?: string;
  selectedSports: number[];
};

const SportsPreferenceSelector: React.FC<SportsPreferenceSelectorProps> = ({
  onSportsSelected,
  errorMessage,
  isValid,
  selectedSports,
}) => {
  const {data: sports} = useGetAvailableSportsQuery();

  const toggleSport = useCallback(
    (sportId: number) => {
      const newSelectedSports = selectedSports.includes(sportId)
        ? selectedSports.filter(id => id !== sportId)
        : [...selectedSports, sportId];

      onSportsSelected(newSelectedSports);
    },
    [selectedSports, onSportsSelected],
  );

  const renderSportItem = useCallback(
    ({item}: {item: SportItem}) => {
      const isSelected = selectedSports.includes(item.id);

      return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          onPress={() => toggleSport(item.id)}
          style={[
            styles.sportItem,
            {
              backgroundColor: isSelected
                ? appColors.warmRed
                : appColors.whisperGray,
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
    [selectedSports, toggleSport],
  );

  return (
    <View>
      {sports ? (
        <View
          style={{
            flexDirection: 'row',
            flex: 1,
            flexWrap: 'wrap',
            rowGap: 12,
            columnGap: 8,
          }}>
          {Object.entries(sports).map(([key, sport]) => {
            return renderSportItem({item: {id: Number(key), name: sport}});
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

export default SportsPreferenceSelector;

const styles = StyleSheet.create({
  errorText: {
    paddingVertical: 20,
  },
  sportItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
});
