import { BaseDataStateModel } from '../../actions/models/base-data-state.model';

export const checkIfBaseDataIsLoading = (baseData?: BaseDataStateModel): boolean => {
    return !!baseData?.genresLoading?.loading ||
        !!baseData?.formatsLoading?.loading ||
        !!baseData?.studiosLoading?.loading ||
        !!baseData?.rolesLoading?.loading;
};
