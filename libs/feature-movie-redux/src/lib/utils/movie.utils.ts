import { BaseDataStateModel } from '@giron/data-access-redux';

export const checkIfBaseDataIsLoading = (
  baseData?: BaseDataStateModel
): boolean => {
  return (
    !!baseData?.genresLoading?.loading ||
    !!baseData?.formatsLoading?.loading ||
    !!baseData?.studiosLoading?.loading ||
    !!baseData?.rolesLoading?.loading
  );
};
