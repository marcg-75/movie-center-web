import { IMovie, SelectableModel } from '@giron/shared-models';
import { format } from 'date-fns';

const DATE_FORMAT = 'yyyy-MM-dd';

export const transformToInnerModel = (movieItem: IMovie): IMovie => {
  const { runtime } = movieItem;
  const { movieFormatInfo, moviePersonalInfo } = movieItem;

  const releaseDate: Date | undefined = movieItem.releaseDate
    ? new Date(movieItem.releaseDate)
    : undefined;
  const obtainDate: Date | undefined = moviePersonalInfo.obtainDate
    ? new Date(moviePersonalInfo.obtainDate)
    : undefined;

  return {
    ...movieItem,
    runtime: runtime ? '2020-01-01T' + runtime.substring(0, 5) : undefined,
    releaseDate: releaseDate ? format(releaseDate, DATE_FORMAT) : undefined,
    movieFormatInfo: {
      ...movieFormatInfo,
      format: movieFormatInfo.format
        ? movieFormatInfo.format
        : ({} as SelectableModel),
    },
    moviePersonalInfo: {
      ...moviePersonalInfo,
      obtainDate: obtainDate ? format(obtainDate, DATE_FORMAT) : undefined,
    },
  };
};

export const removeUndefinedValuesFromObject = <T>(obj: T) => {
  if (!obj) {
    return;
  }
  // @ts-ignore
  Object.keys(obj).forEach((key) => obj[key] === undefined && delete obj[key]);
};
