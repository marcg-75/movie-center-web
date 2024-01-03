import { SelectableModel } from '@giron/shared-models';
import { useQuery } from '@tanstack/react-query';
import { getBackendClient } from '@giron/shared-data-access-api-client';
import { PATH_PREFIX } from './constants';

export const useGenresQuery = <T>(select: (data: SelectableModel[]) => T) => {
  const client = getBackendClient();

  return useQuery(
    ['genres'],
    async () => {
      return await client.get<SelectableModel[]>(`${PATH_PREFIX}/genres`);
    },
    {
      select,
    }
  );
};
