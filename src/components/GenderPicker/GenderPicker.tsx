import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {ReactNode, useState} from 'react';
import {FemaleIcon, MaleIcon} from '../../assets/icons';
import {useTextColor} from '../../utils/customHooks/colorHooks';
import {id} from 'date-fns/locale';
import {FlatList} from 'native-base';
import {appColors} from '../../constants/colors';
import {GENDER} from '../../constants/enums';

type GenderPickerProps = {
  selectedGender: number | undefined;
  setSelectedGender: (gender: number) => void;
  isValid?: boolean;
  errorMessage?: string;
  label?: string;
  customLabelStyles?: any;
};

const GenderPicker = ({
  isValid = true,
  selectedGender,
  setSelectedGender,
  errorMessage,
  label,
  customLabelStyles,
}: GenderPickerProps) => {
  const textColor = useTextColor();

  return (
    <View style={{}}>
      {label ? (
        <Text
          style={[
            {
              fontSize: 14,
              color: !isValid ? appColors.error : textColor,
              marginBottom: 8,
              fontWeight: 'bold',
            },
            customLabelStyles,
          ]}>
          {label}
        </Text>
      ) : null}

      <View style={styles.genderContainer}>
        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.genderButton,
            ,
            {
              borderColor: !isValid
                ? appColors.error
                : selectedGender === GENDER.MALE
                  ? appColors.masculineBlue
                  : textColor,
            },
          ]}
          onPress={() => setSelectedGender(GENDER.MALE)}>
          <MaleIcon
            width={40}
            height={40}
            color={
              selectedGender === GENDER.MALE
                ? appColors.masculineBlue
                : textColor
            }
          />
          <Text
            style={{
              color:
                selectedGender === GENDER.MALE
                  ? appColors.masculineBlue
                  : textColor,
            }}>
            Male
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.5}
          style={[
            styles.genderButton,
            ,
            {
              borderColor: !isValid
                ? appColors.error
                : selectedGender === GENDER.FEMALE
                  ? appColors.femininePink
                  : textColor,
            },
          ]}
          onPress={() => setSelectedGender(GENDER.FEMALE)}>
          <FemaleIcon
            width={40}
            height={40}
            color={
              selectedGender === GENDER.FEMALE
                ? appColors.femininePink
                : textColor
            }
          />
          <Text
            style={{
              color:
                selectedGender === GENDER.FEMALE
                  ? appColors.femininePink
                  : textColor,
            }}>
            Female
          </Text>
        </TouchableOpacity>
      </View>

      {!isValid ? (
        <Text
          style={{paddingVertical: 4, fontSize: 10, color: appColors.error}}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

export default GenderPicker;

const styles = StyleSheet.create({
  genderContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  genderButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    gap: 6,
  },
});
