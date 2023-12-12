export interface LoadingState {
    loading: boolean;
    loaded: boolean;
    error?: string | Error;
    errors?: string[] | Error[];
}

export const initialLoadingState: LoadingState = {
    loading: false,
    loaded: false,
};

export const loadingLoadingState: LoadingState = {
    loading: true,
    loaded: false,
};

export const successLoadingState: LoadingState = {
  loading: false,
  loaded: true,
};

export const getFailedLoadingState = (error?: string | Error, errors?: string[] | Error[]): LoadingState => ({
    ...initialLoadingState,
    error,
    errors,
});
