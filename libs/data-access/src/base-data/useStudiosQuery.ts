import { NameEntityModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';
import { convertToMilliseconds } from '@giron/shared-util-helpers';

export const useStudiosQuery = <T>(select: (data: NameEntityModel[]) => T) => {
  const client = getBackendClient();

  return useQuery(
    ['studios'],
    async () => {
      return await client.get<NameEntityModel[]>(`${PATH_PREFIX}/studios`);
    },
    {
      select,
      staleTime: convertToMilliseconds(1, 'days'),
    }
  );
};
