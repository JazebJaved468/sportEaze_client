import {patronApi} from '../../store/patron/patron.service';
import {store} from '../../store/store';

const dispatch = store.dispatch;

export const updateEndorsementListings = () => {
  dispatch(
    patronApi.util.invalidateTags(['PlayerEndorsements', 'MentorEndorsements']),
  );
};
