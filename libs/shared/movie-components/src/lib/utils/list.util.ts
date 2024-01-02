import { SortModel } from '@giron/shared-models';

const getQueryParamValue = (
  key: string,
  strQueryParams: string = ''
): string | undefined => {
  const parameters: Array<string> = strQueryParams
    .substring(1, strQueryParams.length - 1)
    .split('&');
  const param = parameters.find((item: string) => item.startsWith(key));

  return param ? param.split('=')[1] : undefined;
};

export const getDefaultSortModel = (
  sortByDefault: string,
  strQueryParams: string
): SortModel => {
  return SortModel.of(
    getQueryParamValue('sortBy', strQueryParams) || sortByDefault,
    getQueryParamValue('sortDirection', strQueryParams)
  );
};
