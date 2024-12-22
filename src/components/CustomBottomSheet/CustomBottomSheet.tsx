import {StyleSheet, View} from 'react-native';
import React, {ReactNode, RefObject, useCallback, useMemo} from 'react';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {BottomSheetDefaultBackdropProps} from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';
import {useColorModeValue} from 'native-base';
import {appColors} from '../../constants/colors';

type CustomBottomSheetProps = {
  children: ReactNode;
  bottomSheetRef: RefObject<BottomSheetModal>;
  customSnapPoints?: string[];
};

export const CustomBottomSheet: React.FC<CustomBottomSheetProps> = ({
  children,
  bottomSheetRef,
  customSnapPoints,
}) => {
  const snapPoints = useMemo(() => ['25%', '50%', '75%', '100%'], []);

  const bottomSheetContainerColor = useColorModeValue(
    appColors.white,
    appColors.black,
  );
  const renderBackdrop = useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const handleColor = useColorModeValue(appColors.black, appColors.white);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      snapPoints={customSnapPoints ?? snapPoints}
      index={0}
      enablePanDownToClose={true}
      handleIndicatorStyle={{
        backgroundColor: handleColor,
        width: 36,
        borderRadius: 100,
        // display: 'none',
      }}
      backdropComponent={renderBackdrop}
      backgroundComponent={({style}) => (
        <View
          style={[
            style,
            styles.bottomSheetContainer,
            {backgroundColor: bottomSheetContainerColor},
          ]}
        />
      )}>
      <BottomSheetView style={{flex: 1}}>{children}</BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheetContainer: {
    borderRadius: 24,
  },
});
