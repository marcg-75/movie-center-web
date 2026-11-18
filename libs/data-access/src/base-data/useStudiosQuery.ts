import { NameEntityModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

export const useStudiosQuery = () => {
  const client = getBackendClient();

  return useQuery<NameEntityModel[]>({
    queryKey: ['studios'],
    queryFn: async () => {
      return await client.get<NameEntityModel[]>(`${PATH_PREFIX}/studios`);
    },
    staleTime: convertToMilliseconds(1, 'days'),
  });
};
