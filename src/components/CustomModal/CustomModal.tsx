import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {
  usePageBackgroundColor,
  useTextColor,
} from '../../utils/customHooks/colorHooks';
import {customHeight, customWidth} from '../../styles/responsiveStyles';
import {useContainerShadow} from '../../utils/customHooks/customHooks';
import {CloseIcon} from 'native-base';
import {fontBold} from '../../styles/fonts';

type CustomModalProps = {
  modalVisible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  onCancel?: () => void;
  modalHeading?: string;
  children: React.ReactNode;
};

export const CustomModal: React.FC<CustomModalProps> = ({
  modalVisible,
  setModalVisible,
  onCancel,
  modalHeading,
  children,
}) => {
  const backdropColor = `${useTextColor()}50`;
  const backgroundColor = usePageBackgroundColor();
  const containerShadow = useContainerShadow(10);
  const textColor = useTextColor();

  const onCancelModal = () => {
    setModalVisible(!modalVisible);
    if (onCancel) {
      onCancel();
    }
  };
  return (
    <View>
      <Modal
        animationType='fade'
        transparent={true}
        visible={modalVisible}
        onRequestClose={onCancelModal}>
        <View
          style={[styles.modalBackground, {backgroundColor: backdropColor}]}>
          <View
            style={[
              styles.modalView,
              {backgroundColor: backgroundColor},
              containerShadow,
            ]}>
            <View style={styles.modalHeader}>
              <Text style={fontBold(16, textColor)}>{modalHeading}</Text>

              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={20}
                onPress={onCancelModal}>
                <CloseIcon size={customWidth(20)} color={textColor} />
              </TouchableOpacity>
            </View>

            <View>{children}</View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
  },
  modalView: {
    marginHorizontal: customWidth(16),
    borderRadius: 20,
    padding: customWidth(20),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: customHeight(20),
  },
});
