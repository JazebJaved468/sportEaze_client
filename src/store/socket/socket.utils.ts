import {coreApi} from '../core/core.service';
import {store} from '../store';
import {ConnectionRequestReceived} from './socket.type';

const dispatch = store.dispatch;

export const onConnectionRequestReceived = (
  data: ConnectionRequestReceived,
) => {
  dispatch(coreApi.util.invalidateTags(['PendingConnections']));
};
