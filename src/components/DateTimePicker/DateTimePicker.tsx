import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {CalenderIcon} from '../../assets/icons';

import Picker from 'react-native-date-picker';
import {useTextColor} from '../../utils/customHooks/colorHooks';
import {appColors} from '../../constants/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {format} from 'date-fns';
import {fontBold} from '../../styles/fonts';

type DateTimePickerProps = {
  label?: string;
  customLabelStyles?: any;
  isValid?: boolean;
  errorMessage?: string;
  onSelectDate: (date: string) => void;
  mode?: 'date' | 'time' | 'datetime';
  value?: string;
  placeholder?: string;
};

const DateTimePicker = ({
  label,
  customLabelStyles,
  isValid = true,
  errorMessage,
  onSelectDate,
  mode = 'date',
  value,
  placeholder = 'Select',
}: DateTimePickerProps) => {
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);

  const textColor = useTextColor();

  return (
    <View>
      {label ? (
        <Text
          style={[
            fontBold(14, textColor),
            {
              marginBottom: 8,
            },
            customLabelStyles,
          ]}>
          {label}
        </Text>
      ) : null}
      <TouchableOpacity onPress={() => setOpen(true)} activeOpacity={0.8}>
        <View
          style={{
            width: '100%',

            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: !isValid ? appColors.error : appColors.gray,
            borderRadius: 12,
            paddingVertical: 10,
            paddingHorizontal: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text style={{color: textColor}}>
            {value ? format(value, 'dd MMM, yyyy') : placeholder}
          </Text>
          <CalenderIcon width={28} height={28} color={textColor} />

          <Picker
            modal
            open={open}
            date={date}
            onConfirm={date => {
              setOpen(false);
              setDate(date);
              onSelectDate(date.toISOString());
            }}
            onCancel={() => {
              setOpen(false);
            }}
            mode='date'
            maximumDate={new Date()}
            minimumDate={new Date(1920, 0, 1)}
          />
        </View>
      </TouchableOpacity>

      {!isValid ? (
        <Text
          style={{paddingVertical: 4, fontSize: 10, color: appColors.error}}>
          {errorMessage}
        </Text>
      ) : null}
    </View>
  );
};

export default DateTimePicker;

const styles = StyleSheet.create({});
