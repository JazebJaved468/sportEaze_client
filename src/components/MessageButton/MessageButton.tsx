import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Button} from 'native-base';
import {MessageIcon} from '../../assets/icons';
import {appColors} from '../../constants/colors';
import {ChatScreenPage} from '../../modules/Core/Chat/ChatScreen';
import {updateToast} from '../../store/core/core.slice';
import {fontRegular} from '../../styles/fonts';
import {useAppNavigation} from '../../utils/customHooks/navigator';
import {
  useAppDispatch,
  useAppSelector,
} from '../../utils/customHooks/storeHooks';
import {PulseEffect} from '../PulseEffect';

export const MessageButton = ({
  receiverId,
}: {
  receiverId: string | undefined;
}) => {
  const navigation = useAppNavigation();
  const dispatch = useAppDispatch();

  const {user, isLoggedIn, userType} = useAppSelector(state => state.auth);
  const sendMessage = () => {
    if (!isLoggedIn) {
      dispatch(
        updateToast({
          isVisible: true,
          message: 'Please login to perform this action',
        }),
      );
      return;
    }
    if (receiverId) {
      navigation.navigate(ChatScreenPage, {receiverId});
    }
  };

  return (
    <PulseEffect>
      <Button
        style={{
          height: 38,
          marginBottom: 26,
        }}
        onPress={sendMessage}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <MessageIcon width={18} height={18} color={appColors.white} />
          <Text style={[fontRegular(14, appColors.white)]}>Message</Text>
        </View>
      </Button>
    </PulseEffect>
  );
};

const styles = StyleSheet.create({});
