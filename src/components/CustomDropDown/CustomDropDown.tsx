import {StyleSheet, Text, Touchable, View} from 'react-native';
import React, {Dispatch, useRef} from 'react';
import {Button} from 'native-base';
import {appColors} from '../../constants/colors';
import {ArrowDownIcon, CircularCheckIcon} from '../../assets/icons';
import {fontBold, fontRegular} from '../../styles/fonts';
import {
  useInverseTextColor,
  useTextColor,
} from '../../utils/customHooks/colorHooks';
import CustomBottomSheet from '../CustomBottomSheet';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {PulseEffect} from '../PulseEffect';
import {TouchableOpacity} from 'react-native-gesture-handler';

export type DropDownItemType = {
  id: number;
  title: string;
  value: number;
};

type CustomDropDownProps = {
  buttonTitle: string;
  data: Array<DropDownItemType>;
  selectedItem: DropDownItemType | null;
  onItemSelect?: (item: DropDownItemType) => void;
  snapPoints?: Array<string>;
  sheetTitle?: string;
};

export const CustomDropDown: React.FC<CustomDropDownProps> = ({
  buttonTitle = 'DropDown',
  sheetTitle = 'Select an option',
  data = [],
  selectedItem,
  onItemSelect,
  snapPoints = ['50%'],
}) => {
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
      <PulseEffect>
        <Button
          style={{height: 32}}
          onPress={() => bottomSheetRef.current?.present()}>
          <View style={styles.innerWrapper}>
            <Text style={fontRegular(14, appColors.white)}>
              {selectedItem ? selectedItem.title : buttonTitle}
            </Text>
            <ArrowDownIcon width={10} color={appColors.white} />
          </View>
        </Button>
      </PulseEffect>

      <CustomBottomSheet
        bottomSheetRef={bottomSheetRef}
        customSnapPoints={snapPoints}>
        <View
          style={{
            // flex: 1,
            // backgroundColor: 'red',
            // height: 300,
            // justifyContent: 'center',
            // alignItems: 'center',
            marginHorizontal: 30,
            marginTop: 16,
            gap: 20,
          }}>
          <Text style={fontBold(16, textColor)}>{sheetTitle}</Text>
          <View>
            {data.map(item => (
              <TouchableOpacity
                key={item.id}
                style={{
                  paddingVertical: 20,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
                onPress={() => {
                  onItemSelect?.(item);
                  closeBottomSheet();
                }}>
                <Text key={item.id} style={fontRegular(16, textColor)}>
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
          </View>
        </View>
      </CustomBottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  innerWrapper: {
    backgroundColor: appColors.warmRed,
    // paddingVertical: 8,
    paddingHorizontal: 16,
    // width: 86,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flexDirection: 'row',
  },
});
