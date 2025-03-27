import {DropDownItemType} from '../../components/CustomDropDown/CustomDropDown';

export const convertObjectIntoDropDownItemsArrayFormat = (
  data: Record<string, string>,
): DropDownItemType[] => {
  return Object.entries(data).map(([key, value]) => ({
    id: Number(key),
    title: value,
    value: Number(key),
  }));
};
