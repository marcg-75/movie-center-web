import { NameEntityModel } from '@giron/shared-models';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { useQuery } from '@tanstack/react-query';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

const PATH_PREFIX = 'person/all';

export const useAllPersonsQuery = <T>(
  select: (data: NameEntityModel[]) => T,
  enabled: boolean
) => {
  const client = getBackendClient();

  return useQuery(
    ['persons'],
    async () => {
      return await client.get<NameEntityModel[]>(`${PATH_PREFIX}`);
    },
    {
      select,
      staleTime: convertToMilliseconds(1, 'hours'),
      enabled,
    }
  );
};
