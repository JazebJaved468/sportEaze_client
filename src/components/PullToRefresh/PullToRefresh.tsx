import {RefreshControl, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {useInverseTextColor} from '../../utils/customHooks/colorHooks';
import {appColors} from '../../constants/colors';

type PullToRefreshProps = {
  onRefresh: () => Promise<void>;
};

const PullToRefresh = ({onRefresh, ...props}: PullToRefreshProps) => {
  const [refreshing, setRefreshing] = useState(false);

  //   const backgroundColor = usePageBackgroundColor();
  const backgroundColor = useInverseTextColor();

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setRefreshing(false);
  };
  return (
    <RefreshControl
      {...props}
      refreshing={refreshing}
      onRefresh={handleRefresh}
      colors={[appColors.warmRed]}
      progressBackgroundColor={backgroundColor}
    />
  );
};

export {PullToRefresh};

const styles = StyleSheet.create({});
