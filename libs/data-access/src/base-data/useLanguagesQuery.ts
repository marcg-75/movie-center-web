import { LanguageModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

export const useLanguagesQuery = <T>(select: (data: LanguageModel[]) => T) => {
  const client = getBackendClient();

  return useQuery(
    ['languages'],
    async () => {
      return await client.get<LanguageModel[]>(`${PATH_PREFIX}/languages`);
    },
    {
      select,
      staleTime: convertToMilliseconds(1, 'days'),
    }
  );
};
