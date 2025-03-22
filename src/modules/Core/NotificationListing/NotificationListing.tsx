import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PageContainer from '../../../components/PageContainer';
import GeneralHeader from '../../../components/GeneralHeader';
import {useAppSelector} from '../../../utils/customHooks/storeHooks';
import {LoginRequired} from '../../../components/LoginRequired';

const NotificationListing = () => {
  const {isLoggedIn} = useAppSelector(state => state.auth);
  return (
    <PageContainer>
      <GeneralHeader title='Notifications' showRightElement={false} />

      {isLoggedIn ? (
        <View>
          <Text>Notifications</Text>
        </View>
      ) : (
        <View style={{flex: 1, justifyContent: 'center', marginTop: -70}}>
          <LoginRequired
            message={'Login to access your personalized notifications'}
          />
        </View>
      )}
    </PageContainer>
  );
};

export default NotificationListing;

const styles = StyleSheet.create({});
