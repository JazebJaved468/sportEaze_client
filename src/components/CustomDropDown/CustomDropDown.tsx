import {
  DimensionValue,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import {appColors} from '../../constants/colors';
import {ArrowDownIcon, CircularCheckIcon} from '../../assets/icons';
import {fontBold, fontRegular} from '../../styles/fonts';
import {
  useInverseTextColor,
  useTextColor,
} from '../../utils/customHooks/colorHooks';
import CustomBottomSheet from '../CustomBottomSheet';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {PulseEffect} from '../PulseEffect';
import {ErrorMessage} from '../ErrorMessage';

export type DropDownItemType = {
  id: number;
  title: string;
  value: number;
};

type DropDownStyleProps = {
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  buttonWidth?: DimensionValue | number;
  buttonPaddingVertical?: number;
  buttonPaddingHorizontal?: number;
  buttonJustifyContent?: 'center' | 'space-between' | 'flex-start' | 'flex-end';
  buttonBorderRadius?: number;
  buttonGap?: number;
  sheetItemPaddingVertical?: number;
  sheetHeaderFontSize?: number;
  sheetItemFontSize?: number;
  sheetMarginHorizontal?: number;
  sheetMarginTop?: number;
  sheetGap?: number;
  buttonrightIconSize?: number;
  buttonTextFontSize?: number;
  buttonBorderWidth?: number;
  buttonBorderColor?: string;
};

type CustomDropDownProps = {
  buttonTitle: string;
  data: Array<DropDownItemType>;
  selectedItem: DropDownItemType | null;
  onItemSelect?: (item: DropDownItemType) => void;
  snapPoints?: Array<string>;
  sheetTitle?: string;
  style?: DropDownStyleProps;
  isValid?: boolean;
  errorMessage?: string;

  label?: string;
  customLabelStyles?: any;
};

// Default style values
const defaultStyles: DropDownStyleProps = {
  buttonBackgroundColor: appColors.warmRed,
  buttonTextColor: appColors.white,
  buttonTextFontSize: 14,
  buttonPaddingVertical: 8,
  buttonPaddingHorizontal: 16,
  buttonJustifyContent: 'center',
  buttonBorderRadius: 10,
  buttonGap: 8,
  sheetItemPaddingVertical: 20,
  sheetHeaderFontSize: 16,
  sheetItemFontSize: 16,
  sheetMarginHorizontal: 30,
  sheetMarginTop: 16,
  sheetGap: 20,
  buttonWidth: '100%',
  buttonrightIconSize: 10,
  buttonBorderWidth: 0,
  buttonBorderColor: appColors.black,
};

export const CustomDropDown: React.FC<CustomDropDownProps> = ({
  buttonTitle = 'DropDown',
  sheetTitle = 'Select an option',
  data = [],
  selectedItem,
  onItemSelect,
  snapPoints = ['50%'],
  style = {},
  errorMessage = '',
  isValid = true,
  label,
  customLabelStyles,
}) => {
  const styles: DropDownStyleProps = {...defaultStyles, ...style};

  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const inverseTextColor = useInverseTextColor();
  const textColor = useTextColor();

  const openBottomSheet = () => {
    if (bottomSheetRef.current) bottomSheetRef.current?.present();
  };

  const closeBottomSheet = () => {
    if (bottomSheetRef.current) bottomSheetRef.current?.dismiss();
  };

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
      <PulseEffect>
        <TouchableOpacity
          style={{
            borderWidth: styles.buttonBorderWidth,
            borderColor: !isValid ? appColors.error : styles.buttonBorderColor,
            backgroundColor: styles.buttonBackgroundColor,
            justifyContent: styles.buttonJustifyContent,
            borderRadius: styles.buttonBorderRadius,
            paddingHorizontal: styles.buttonPaddingHorizontal,
            paddingVertical: styles.buttonPaddingVertical,
            width: styles.buttonWidth,
            gap: styles.buttonGap,
            alignItems: 'center',
            flexDirection: 'row',
          }}
          onPress={() => openBottomSheet()}
          activeOpacity={0.6}>
          <Text
            style={fontRegular(
              styles.buttonTextFontSize,
              styles.buttonTextColor,
            )}>
            {selectedItem ? selectedItem.title : buttonTitle}
          </Text>
          <ArrowDownIcon
            width={styles.buttonrightIconSize}
            color={styles.buttonTextColor}
          />
        </TouchableOpacity>
      </PulseEffect>
      {!isValid ? <ErrorMessage message={errorMessage} /> : null}

      <CustomBottomSheet
        bottomSheetRef={bottomSheetRef}
        customSnapPoints={snapPoints}>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'red',
            // height: 300,
            // justifyContent: 'center',
            // alignItems: 'center',
            marginHorizontal: styles.sheetMarginHorizontal,
            marginTop: styles.sheetMarginTop,
            gap: styles.sheetGap,
          }}>
          <Text style={fontBold(16, textColor)}>{sheetTitle}</Text>

          <BottomSheetScrollView
            style={{flex: 1}}
            showsVerticalScrollIndicator={false}>
            {data.map(item => (
              <TouchableOpacity
                key={item.id}
                style={{
                  paddingVertical: styles.sheetItemPaddingVertical,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => {
                  onItemSelect?.(item);
                  closeBottomSheet();
                }}>
                <Text
                  key={item.id}
                  style={fontRegular(styles.sheetItemFontSize, textColor)}>
                  {item.title}
                </Text>
                {selectedItem && selectedItem.id === item.id ? (
                  <CircularCheckIcon
                    width={18}
                    height={18}
                    color={appColors.warmRed}
                  />
                ) : null}
              </TouchableOpacity>
            ))}
          </BottomSheetScrollView>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  innerWrapper: {},
});
