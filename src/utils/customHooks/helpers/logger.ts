import {isPending, isFulfilled, isRejected} from '@reduxjs/toolkit';

const showApiPendingStatusLogs = true;
const showApiFulfilledStatusLogs = false;

export const apiStatusLogger = store => next => action => {
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
  }
  return next(action);
};
