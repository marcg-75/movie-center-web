import { SelectableModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

export const useRolesQuery = <T>(select: (data: SelectableModel[]) => T) => {
  const client = getBackendClient();

  return useQuery(
    ['roles'],
    async () => {
      return await client.get<SelectableModel[]>(`${PATH_PREFIX}/roles`);
    },
    {
      select,
      staleTime: convertToMilliseconds(1, 'days'),
    }
  );
};
