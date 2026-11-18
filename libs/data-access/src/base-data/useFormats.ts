import { SelectableModel } from '@giron/shared-models';
import { useFormatsQuery } from './useFormatsQuery';

export const useFormats = (): {
  formats: SelectableModel[] | undefined;
  isFormatsLoading: boolean;
  error: Error | null;
} => {
  const { data, isFetching, error } = useFormatsQuery();
  return { formats: data, isFormatsLoading: isFetching, error };
};
