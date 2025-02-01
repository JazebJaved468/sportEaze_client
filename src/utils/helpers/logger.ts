import {isPending, isFulfilled, isRejected} from '@reduxjs/toolkit';
import {Toast} from 'native-base';
import {updateToast} from '../../store/core/core.slice';

const showApiPendingStatusLogs = true;
const showApiFulfilledStatusLogs = false;

export const apiStatusLogger = store => next => action => {
  const dispatch = store.dispatch;
  if (showApiPendingStatusLogs && isPending(action)) {
    console.log(
      `PENDING ----> ENDPOINT = ${action.meta.arg.endpointName} | PAYLOAD = ${JSON.stringify(action.payload)} | TYPE = ${action.type} | STATUS = ${action.meta.requestStatus} | REMAINING = ${action}`,
    );
  } else if (showApiFulfilledStatusLogs && isFulfilled(action)) {
    console.log(
      `FULFILLED ----> ENDPOINT = ${action.meta.arg.endpointName} | PAYLOAD = ${JSON.stringify(action.payload)} | TYPE = ${action.type} | STATUS = ${action.meta.requestStatus} | REMAINING = ${action}`,
    );
  } else if (isRejected(action)) {
    console.log(
      `REJECTED ----> ENDPOINT = ${action.meta.arg.endpointName} | PAYLOAD = ${JSON.stringify(action.payload)} | ERROR = ${action.error} | TYPE = ${action.type} | STATUS = ${action.meta.requestStatus} | REMAINING = ${action}`,
    );

    const error = action?.payload?.data?.message;
    dispatch(
      updateToast({
        isVisible: true,
        message: error,
      }),
    );
  }
  return next(action);
};
