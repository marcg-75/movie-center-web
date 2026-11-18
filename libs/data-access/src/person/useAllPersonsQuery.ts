import { NameEntityModel } from '@giron/shared-models';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { useQuery } from '@tanstack/react-query';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

const PATH_PREFIX = 'person/all';

export const useAllPersonsQuery = (enabled: boolean) => {
  const client = getBackendClient();

  return useQuery<NameEntityModel[]>({
    queryKey: ['persons'],
    queryFn: async () => {
      return await client.get<NameEntityModel[]>(`${PATH_PREFIX}`);
    },
    staleTime: convertToMilliseconds(1, 'hours'),
    enabled,
  });
};
