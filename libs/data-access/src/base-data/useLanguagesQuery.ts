import { LanguageModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

export const useLanguagesQuery = () => {
  const client = getBackendClient();

  return useQuery<LanguageModel[]>({
    queryKey: ['languages'],
    queryFn: async () => {
      return await client.get<LanguageModel[]>(`${PATH_PREFIX}/languages`);
    },
    staleTime: convertToMilliseconds(1, 'days'),
  });
};
