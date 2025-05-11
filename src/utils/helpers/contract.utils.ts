import {ContractStatus} from '../../constants/enums';
import {patronApi} from '../../store/patron/patron.service';
import {store} from '../../store/store';
import {Contract} from '../../types/patron/patron.type';

const dispatch = store.dispatch;
export const onContractCreated = () => {
  dispatch(patronApi.util.invalidateTags(['ContractsByUserId']));
};

export const onContractAccepted = (contractId: string) => {
  dispatch(
    patronApi.util.updateQueryData('getContractById', {contractId}, draft => {
      draft.status = ContractStatus.IN_PROGRESS;
    }),
  );
  dispatch(patronApi.util.invalidateTags(['ContractsByUserId']));
};

export const onContractUpdated = (
  contractId: string,
  contractData: Contract,
) => {
  dispatch(
    patronApi.util.updateQueryData('getContractById', {contractId}, draft => {
      draft = contractData;
      return draft;
    }),
  );
  dispatch(patronApi.util.invalidateTags(['ContractsByUserId']));
};

export const onContractNotificationReceived = () => {
  dispatch(patronApi.util.invalidateTags(['ContractsByUserId']));
  dispatch(patronApi.util.invalidateTags(['ContractById']));
};

export const divideAmountIntoThreeMilestones = (
  n: number,
): [number, number, number] => {
  n = Number(n);

  if (n <= 0) return [0, 0, 0];

  const base = Math.floor(n / 3);
  const remainder = n % 3;

  const parts = [base, base, base];

  // Distribute the remainder
  for (let i = 0; i < remainder; i++) {
    parts[i]++;
  }

  return parts as [number, number, number];
};
