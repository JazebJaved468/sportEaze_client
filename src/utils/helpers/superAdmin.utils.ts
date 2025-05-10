import {store} from '../../store/store';
import {superAdminApi} from '../../store/superAdmin/superAdmin.service';

const dispatch = store.dispatch;

export const onPatronVerification = (
  patronId: string,
  status: number,
  adminComment: string,
) => {
  dispatch(
    superAdminApi.util.updateQueryData(
      'getPatronRequests',
      undefined,
      draft => {
        const index = draft.findIndex(item => item.id === patronId);
        if (index !== -1 && draft[index].patron) {
          draft[index].patron.status = status;
          draft[index].patron.adminReviewComment = adminComment;
        }
      },
    ),
  );
};
